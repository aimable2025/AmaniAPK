import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  ChatConversation,
  ChatMessage,
  ChatAttachment,
  ChatMessagePriority,
  ChatConversationType
} from '../types';
import { chatService } from '../services/chat/ChatService';
import { syncService, SyncServiceState } from '../services/SyncService';

export type ChatFilterType = 'all' | 'unread' | 'urgent' | 'private' | 'group' | 'agency' | 'service';

interface ChatContextType {
  conversations: ChatConversation[];
  filteredConversations: ChatConversation[];
  selectedConversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  activeFilter: ChatFilterType;
  searchQuery: string;
  totalUnreadCount: number;
  pendingSyncCount: number;
  syncState: SyncServiceState;

  // Actions
  selectConversation: (conversationId: string | null) => void;
  sendMessage: (params: {
    content: string;
    priority?: ChatMessagePriority;
    attachments?: ChatAttachment[];
    replyTo?: { messageId: string; senderName: string; content: string };
  }) => Promise<ChatMessage | null>;
  createConversation: (params: {
    type: ChatConversationType;
    title: string;
    description?: string;
    participants: string[];
    agencyId?: string;
    agencyNom?: string;
    service?: string;
  }) => Promise<ChatConversation | null>;
  deleteMessage: (messageId: string, reason?: string) => Promise<void>;
  addParticipant: (conversationId: string, userId: string) => Promise<void>;
  setActiveFilter: (filter: ChatFilterType) => void;
  setSearchQuery: (query: string) => void;
  refresh: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<ChatFilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [syncState, setSyncState] = useState<SyncServiceState>(syncService.getState());

  // Subscribe to SyncService state
  useEffect(() => {
    const unsub = syncService.subscribe(state => {
      setSyncState(state);
    });
    return unsub;
  }, []);

  // Load conversations when currentUser changes
  const loadConversations = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const convs = await chatService.getConversationsForUser(currentUser);
      setConversations(convs);

      // If currently selected conversation is no longer accessible, reset selection
      if (selectedConversationId && !convs.some(c => c.id === selectedConversationId)) {
        setSelectedConversationId(convs.length > 0 ? convs[0].id : null);
      } else if (!selectedConversationId && convs.length > 0) {
        setSelectedConversationId(convs[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations in ChatProvider:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, selectedConversationId]);

  useEffect(() => {
    loadConversations();
  }, [currentUser]);

  // Load messages whenever selected conversation changes
  const loadMessages = useCallback(async (convId: string) => {
    try {
      const msgs = await chatService.getMessages(convId);
      setMessages(msgs);

      // Mark unread messages as read
      if (currentUser) {
        await chatService.markConversationAsRead(convId, currentUser.id);
      }
    } catch (err) {
      console.error('Failed to load messages for conversation:', convId, err);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedConversationId) {
      loadMessages(selectedConversationId);
    } else {
      setMessages([]);
    }
  }, [selectedConversationId, loadMessages]);

  // Track pending sync items
  useEffect(() => {
    const updatePending = async () => {
      const count = await syncService.getPendingCount();
      setPendingSyncCount(count);
    };
    updatePending();
    const interval = setInterval(updatePending, 4000);
    return () => clearInterval(interval);
  }, []);

  // Send message
  const sendMessage = async (params: {
    content: string;
    priority?: ChatMessagePriority;
    attachments?: ChatAttachment[];
    replyTo?: { messageId: string; senderName: string; content: string };
  }): Promise<ChatMessage | null> => {
    if (!selectedConversationId || !currentUser) return null;

    try {
      const newMsg = await chatService.sendMessage({
        conversationId: selectedConversationId,
        content: params.content,
        sender: currentUser,
        priority: params.priority,
        attachments: params.attachments,
        replyTo: params.replyTo
      });

      // Optimistic local state update
      setMessages(prev => [...prev, newMsg]);

      // Update conversations list metadata
      setConversations(prev =>
        prev.map(c =>
          c.id === selectedConversationId
            ? {
                ...c,
                lastMessageId: newMsg.id,
                lastMessageContent: newMsg.content || 'Pièce jointe',
                lastMessageAt: newMsg.createdAt,
                lastMessageSenderName: newMsg.senderName,
                updatedAt: newMsg.createdAt
              }
            : c
        )
      );

      return newMsg;
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'envoi du message');
      return null;
    }
  };

  // Create conversation
  const createConversation = async (params: {
    type: ChatConversationType;
    title: string;
    description?: string;
    participants: string[];
    agencyId?: string;
    agencyNom?: string;
    service?: string;
  }): Promise<ChatConversation | null> => {
    if (!currentUser) return null;

    try {
      const newConv = await chatService.createConversation({
        ...params,
        creator: currentUser
      });

      setConversations(prev => [newConv, ...prev]);
      setSelectedConversationId(newConv.id);
      return newConv;
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création de la conversation');
      return null;
    }
  };

  // Delete message
  const deleteMessage = async (messageId: string, reason?: string): Promise<void> => {
    if (!currentUser) return;
    try {
      await chatService.deleteMessage(messageId, currentUser, reason);
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? { ...m, isDeleted: true, content: 'Ce message a été supprimé.' }
            : m
        )
      );
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  // Add participant
  const addParticipant = async (conversationId: string, userId: string): Promise<void> => {
    if (!currentUser) return;
    try {
      await chatService.addParticipant(conversationId, userId, currentUser);
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? { ...c, participants: [...new Set([...c.participants, userId])] }
            : c
        )
      );
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'ajout du membre');
    }
  };

  // Calculate filtered conversations
  const filteredConversations = conversations.filter(conv => {
    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = conv.title.toLowerCase().includes(q);
      const matchDesc = conv.description?.toLowerCase().includes(q);
      const matchAgency = conv.agencyNom?.toLowerCase().includes(q);
      const matchLastMsg = conv.lastMessageContent?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAgency && !matchLastMsg) {
        return false;
      }
    }

    // 2. Tab Category Filter
    switch (activeFilter) {
      case 'private':
        return conv.type === 'private';
      case 'group':
        return conv.type === 'group';
      case 'agency':
        return conv.type === 'agency';
      case 'service':
        return conv.type === 'service';
      case 'unread':
        return (conv.unreadCount ?? 0) > 0;
      case 'urgent':
        // Show if last message or any message in it is urgent
        return conv.lastMessageContent?.toLowerCase().includes('urgent') || conv.type === 'global';
      case 'all':
      default:
        return true;
    }
  });

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  const totalUnreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        filteredConversations,
        selectedConversation,
        messages,
        isLoading,
        activeFilter,
        searchQuery,
        totalUnreadCount,
        pendingSyncCount,
        syncState,
        selectConversation: setSelectedConversationId,
        sendMessage,
        createConversation,
        deleteMessage,
        addParticipant,
        setActiveFilter,
        setSearchQuery,
        refresh: loadConversations
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
