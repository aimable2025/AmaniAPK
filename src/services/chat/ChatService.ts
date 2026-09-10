import { localDb } from '../db';
import {
  User,
  ChatConversation,
  ChatMessage,
  ChatAttachment,
  ChatConversationType,
  ChatMessagePriority
} from '../../types';
import { INITIAL_CHAT_CONVERSATIONS, INITIAL_CHAT_MESSAGES } from '../../data/initialChatData';
import { ChatPermissionService } from './ChatPermissionService';
import { syncService } from '../SyncService';

class ChatServiceManager {
  private isInitialized = false;

  /**
   * Ensure initial seeds are loaded in local Dexie IndexedDB
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const convCount = await localDb.chatConversations.count();
      if (convCount === 0) {
        await localDb.chatConversations.bulkPut(INITIAL_CHAT_CONVERSATIONS);
      }

      const msgCount = await localDb.chatMessages.count();
      if (msgCount === 0) {
        await localDb.chatMessages.bulkPut(INITIAL_CHAT_MESSAGES);
      }

      this.isInitialized = true;
    } catch (err) {
      console.warn('Error initializing Chat IndexedDB:', err);
    }
  }

  /**
   * Get all conversations accessible to the specified user
   * Applies strict RBAC and agency isolation
   */
  public async getConversationsForUser(user: User): Promise<ChatConversation[]> {
    await this.initialize();

    try {
      const allConversations = await localDb.chatConversations.toArray();
      const allowed = allConversations.filter(c =>
        ChatPermissionService.canViewConversation(user, c)
      );

      // Sort by lastMessageAt descending
      return allowed.sort((a, b) => {
        const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return timeB - timeA;
      });
    } catch (err) {
      console.error('Failed to get conversations:', err);
      return [];
    }
  }

  /**
   * Get messages for a given conversation
   */
  public async getMessages(conversationId: string): Promise<ChatMessage[]> {
    await this.initialize();

    try {
      const messages = await localDb.chatMessages
        .where('conversationId')
        .equals(conversationId)
        .toArray();

      return messages.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } catch (err) {
      console.error('Failed to get messages:', err);
      return [];
    }
  }

  /**
   * Send a new message (Offline-First: saves locally, adds to sync queue)
   */
  public async sendMessage(params: {
    conversationId: string;
    content: string;
    sender: User;
    priority?: ChatMessagePriority;
    type?: 'text' | 'image' | 'file';
    attachments?: ChatAttachment[];
    replyTo?: { messageId: string; senderName: string; content: string };
  }): Promise<ChatMessage> {
    await this.initialize();

    const conv = await localDb.chatConversations.get(params.conversationId);
    if (!conv) {
      throw new Error('Conversation introuvable');
    }

    if (!ChatPermissionService.canSendMessage(params.sender, conv)) {
      throw new Error('Action non autorisée dans cette conversation');
    }

    const isUrgent = params.priority === 'urgent';
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const localId = `loc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    const isOnline = syncService.isEffectiveOnline();

    const newMessage: ChatMessage = {
      id: messageId,
      conversationId: params.conversationId,
      senderId: params.sender.id,
      senderName: `${params.sender.prenom} ${params.sender.nom}`,
      senderRole: params.sender.role,
      agencyId: params.sender.agenceId,
      agencyNom: params.sender.agenceNom,
      content: params.content.trim(),
      type: params.type || (params.attachments && params.attachments.length > 0 ? (params.attachments[0].mimeType.startsWith('image/') ? 'image' : 'file') : 'text'),
      priority: isUrgent ? 'urgent' : 'normal',
      createdAt: nowIso,
      status: 'envoye',
      localId,
      syncStatus: isOnline ? 'syncing' : 'pending',
      attachments: params.attachments,
      replyToMessageId: params.replyTo?.messageId,
      replyToPreview: params.replyTo ? {
        senderName: params.replyTo.senderName,
        content: params.replyTo.content
      } : undefined
    };

    // 1. Primary write to Dexie IndexedDB
    await localDb.chatMessages.put(newMessage);

    // 2. Update conversation last message metadata
    await localDb.chatConversations.update(params.conversationId, {
      lastMessageId: messageId,
      lastMessageContent: newMessage.content || (newMessage.attachments ? 'Pièce jointe' : ''),
      lastMessageAt: nowIso,
      lastMessageSenderName: newMessage.senderName,
      updatedAt: nowIso
    });

    // 3. Enqueue into persistent synchronization queue
    await syncService.enqueue(
      'chat_messages',
      messageId,
      'create',
      newMessage,
      params.sender.id,
      params.sender.role,
      params.sender.agenceId
    );

    // 4. Record security audit log
    const auditRecord = {
      id: `audit_chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      horodatage: nowIso,
      type: 'securite' as const,
      utilisateur: `${params.sender.prenom} ${params.sender.nom}`,
      role: params.sender.role,
      action: isUrgent ? 'CHAT_URGENT_SENT' : 'CHAT_MESSAGE_SENT',
      details: `Message ${messageId} envoyé dans la conversation [${conv.title}] (Priorité: ${newMessage.priority})`,
      adresseIp: '127.0.0.1 (Client Local)',
      gravite: isUrgent ? ('avertissement' as const) : ('info' as const),
      actorId: params.sender.id,
      actorRole: params.sender.role,
      resource: 'chatConversations',
      resourceId: conv.id,
      agencyId: params.sender.agenceId,
      timestamp: Date.now()
    };

    try {
      await localDb.auditLogs.put(auditRecord);
    } catch {
      // ignore
    }

    return newMessage;
  }

  /**
   * Mark all unread messages in conversation as read for current user
   */
  public async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      const unreadMessages = await localDb.chatMessages
        .where('conversationId')
        .equals(conversationId)
        .filter(m => m.senderId !== userId && m.status !== 'lu')
        .toArray();

      for (const msg of unreadMessages) {
        await localDb.chatMessages.update(msg.id, {
          status: 'lu'
        });
      }
    } catch (err) {
      console.warn('Error marking messages as read:', err);
    }
  }

  /**
   * Create a new conversation
   */
  public async createConversation(params: {
    type: ChatConversationType;
    title: string;
    description?: string;
    creator: User;
    participants: string[];
    agencyId?: string;
    agencyNom?: string;
    service?: string;
  }): Promise<ChatConversation> {
    await this.initialize();

    if (!ChatPermissionService.canCreateConversation(params.creator, params.type, params.agencyId)) {
      throw new Error('Permissions insuffisantes pour créer ce type de conversation');
    }

    // Ensure creator is in participants
    const participantsList = Array.from(new Set([...params.participants, params.creator.id]));

    const convId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    const newConversation: ChatConversation = {
      id: convId,
      type: params.type,
      title: params.title.trim(),
      description: params.description?.trim(),
      createdBy: params.creator.id,
      createdByName: `${params.creator.prenom} ${params.creator.nom}`,
      createdAt: nowIso,
      updatedAt: nowIso,
      agencyId: params.agencyId,
      agencyNom: params.agencyNom,
      service: params.service,
      participants: participantsList,
      admins: [params.creator.id],
      isArchived: false,
      isActive: true,
      unreadCount: 0
    };

    // Save locally to Dexie
    await localDb.chatConversations.put(newConversation);

    // Enqueue for sync
    await syncService.enqueue(
      'chat_conversations',
      convId,
      'create',
      newConversation,
      params.creator.id,
      params.creator.role,
      params.creator.agenceId
    );

    // Audit log
    await localDb.auditLogs.put({
      id: `audit_conv_create_${Date.now()}`,
      horodatage: nowIso,
      type: 'securite',
      utilisateur: `${params.creator.prenom} ${params.creator.nom}`,
      role: params.creator.role,
      action: 'CHAT_GROUP_CREATED',
      details: `Création du canal [${newConversation.title}] (${newConversation.type}) avec ${participantsList.length} participants`,
      adresseIp: '127.0.0.1 (Client Local)',
      gravite: 'info',
      actorId: params.creator.id,
      actorRole: params.creator.role,
      resource: 'chatConversations',
      resourceId: convId,
      agencyId: params.agencyId,
      timestamp: Date.now()
    });

    return newConversation;
  }

  /**
   * Add a participant to a group conversation
   */
  public async addParticipant(conversationId: string, newUserId: string, actor: User): Promise<void> {
    const conv = await localDb.chatConversations.get(conversationId);
    if (!conv) throw new Error('Conversation non trouvée');

    if (!ChatPermissionService.canManageParticipants(actor, conv)) {
      throw new Error('Permissions insuffisantes pour modifier les membres');
    }

    if (!conv.participants.includes(newUserId)) {
      const updatedParticipants = [...conv.participants, newUserId];
      await localDb.chatConversations.update(conversationId, {
        participants: updatedParticipants,
        updatedAt: new Date().toISOString()
      });

      await syncService.enqueue(
        'chat_conversations',
        conversationId,
        'update',
        { participants: updatedParticipants },
        actor.id,
        actor.role,
        actor.agenceId
      );

      await localDb.auditLogs.put({
        id: `audit_part_add_${Date.now()}`,
        horodatage: new Date().toISOString(),
        type: 'securite',
        utilisateur: `${actor.prenom} ${actor.nom}`,
        role: actor.role,
        action: 'CHAT_PARTICIPANT_ADDED',
        details: `Ajout de l'utilisateur ${newUserId} dans le canal [${conv.title}]`,
        adresseIp: '127.0.0.1',
        gravite: 'info',
        actorId: actor.id,
        actorRole: actor.role,
        resource: 'chatConversations',
        resourceId: conversationId,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Delete a message (soft delete with audit log)
   */
  public async deleteMessage(messageId: string, actor: User, reason?: string): Promise<void> {
    const msg = await localDb.chatMessages.get(messageId);
    if (!msg) throw new Error('Message introuvable');

    if (!ChatPermissionService.canDeleteMessage(actor, msg)) {
      throw new Error('Permissions insuffisantes pour supprimer ce message');
    }

    await localDb.chatMessages.update(messageId, {
      isDeleted: true,
      content: 'Ce message a été supprimé.'
    });

    await syncService.enqueue(
      'chat_messages',
      messageId,
      'update',
      { isDeleted: true, content: 'Ce message a été supprimé.' },
      actor.id,
      actor.role,
      actor.agenceId
    );

    await localDb.auditLogs.put({
      id: `audit_msg_del_${Date.now()}`,
      horodatage: new Date().toISOString(),
      type: 'suppression',
      utilisateur: `${actor.prenom} ${actor.nom}`,
      role: actor.role,
      action: 'CHAT_MESSAGE_DELETED',
      details: `Suppression du message ${messageId}. Motif: ${reason || 'Non spécifié'}`,
      adresseIp: '127.0.0.1',
      gravite: 'avertissement',
      actorId: actor.id,
      actorRole: actor.role,
      resource: 'chatMessages',
      resourceId: messageId,
      timestamp: Date.now()
    });
  }
}

export const chatService = new ChatServiceManager();
