import { User, ChatConversation, ChatMessage, ChatConversationType } from '../../types';

/**
 * Enterprise Internal Chat - Centralized RBAC & Agency Isolation Service
 * Ets AMANI - Security & Governance Rules
 */
export class ChatPermissionService {
  /**
   * Check if user is allowed to access the Internal Chat module at all
   */
  public static canAccessChat(user: User | null | undefined): boolean {
    if (!user) return false;
    if (user.statut !== 'actif') return false;

    // Rule: Clients are strictly external and must never access internal chats
    // Rule: Requerant membre is pending approval and cannot access internal workspace
    if (user.role === 'requerant_membre') return false;

    // Standard internal roles & validated members
    const allowedRoles = [
      'administrateur_systeme',
      'directeur_general',
      'directeur_adjoint',
      'chef_agence',
      'assistant_administratif',
      'agent',
      'membre'
    ];

    return allowedRoles.includes(user.role);
  }

  /**
   * Check if user can view/read a specific conversation
   * CRITICAL: Strict isolation - never use simply (user.agencyId === conv.agencyId)
   */
  public static canViewConversation(user: User, conv: ChatConversation): boolean {
    if (!this.canAccessChat(user)) return false;

    // 1. Private conversation: strictly restricted to participants
    if (conv.type === 'private') {
      return conv.participants.includes(user.id);
    }

    // 2. Global conversation: all internal staff members (excluding members if restricted)
    if (conv.type === 'global') {
      if (user.role === 'membre') {
        return conv.participants.includes(user.id);
      }
      return true;
    }

    // 3. Group conversation: must be an explicit participant
    if (conv.type === 'group') {
      return conv.participants.includes(user.id);
    }

    // 4. Agency conversation:
    // - User must be a participant
    // - OR if Director General / Adjoint inspecting operational agency
    // - BUT an agent/chef from Goma can NEVER read Beni!
    if (conv.type === 'agency') {
      if (conv.participants.includes(user.id)) {
        return true;
      }
      if (['directeur_general', 'directeur_adjoint'].includes(user.role)) {
        return true;
      }
      // Strict agency isolation check
      if (conv.agencyId && user.agenceId && conv.agencyId !== user.agenceId) {
        return false;
      }
      return false;
    }

    // 5. Service conversation:
    if (conv.type === 'service') {
      if (conv.participants.includes(user.id)) return true;
      if (['directeur_general', 'directeur_adjoint'].includes(user.role)) return true;
      // Polyvalent agents only if assigned
      return false;
    }

    return false;
  }

  /**
   * Check if user can send a message into a conversation
   */
  public static canSendMessage(user: User, conv: ChatConversation): boolean {
    if (!this.canViewConversation(user, conv)) return false;
    if (conv.isArchived || !conv.isActive) return false;

    // For global conversation, only direction and authorized managers can post
    if (conv.type === 'global') {
      return ['directeur_general', 'directeur_adjoint', 'administrateur_systeme'].includes(user.role);
    }

    return conv.participants.includes(user.id);
  }

  /**
   * Check if user can create a specific type of conversation
   */
  public static canCreateConversation(user: User, type: ChatConversationType, targetAgencyId?: string): boolean {
    if (!this.canAccessChat(user)) return false;

    switch (type) {
      case 'private':
      case 'group':
        // All internal staff can initiate private or group chats
        return user.role !== 'membre' && user.role !== 'requerant_membre';

      case 'agency':
        // DG and Adjoint can create for any agency
        if (['directeur_general', 'directeur_adjoint', 'administrateur_systeme'].includes(user.role)) {
          return true;
        }
        // Chef d'agence can ONLY create for their own agency
        if (user.role === 'chef_agence') {
          return !targetAgencyId || targetAgencyId === user.agenceId;
        }
        return false;

      case 'service':
        return ['directeur_general', 'directeur_adjoint', 'chef_agence', 'administrateur_systeme'].includes(user.role);

      case 'global':
        // Only Direction Générale / Adjointe
        return ['directeur_general', 'directeur_adjoint'].includes(user.role);

      default:
        return false;
    }
  }

  /**
   * Check if user can manage participants in a conversation
   */
  public static canManageParticipants(user: User, conv: ChatConversation): boolean {
    if (!this.canAccessChat(user)) return false;
    if (conv.admins.includes(user.id)) return true;
    if (user.role === 'directeur_general' && conv.type !== 'private') return true;
    if (user.role === 'chef_agence' && conv.type === 'agency' && conv.agencyId === user.agenceId) return true;
    return false;
  }

  /**
   * Check if user can delete a message
   */
  public static canDeleteMessage(user: User, message: ChatMessage): boolean {
    if (!this.canAccessChat(user)) return false;
    // Author can delete their own message
    if (message.senderId === user.id) return true;
    // Admins or DG can delete inappropriate messages with audit log
    if (['administrateur_systeme', 'directeur_general'].includes(user.role)) return true;
    return false;
  }

  /**
   * Check if user can send Urgent messages
   */
  public static canSendUrgentMessage(user: User): boolean {
    if (!this.canAccessChat(user)) return false;
    // Allowed for all staff members who need to report immediate operational incidents
    return user.role !== 'membre' && user.role !== 'requerant_membre';
  }
}
