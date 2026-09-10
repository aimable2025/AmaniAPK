import React from 'react';
import {
  User,
  Users,
  Building2,
  Briefcase,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { ChatConversation } from '../../types';

interface ConversationItemProps {
  conversation: ChatConversation;
  isSelected: boolean;
  onSelect: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect
}) => {
  // Determine icon & color theme based on conversation type
  const getTypeBadge = () => {
    switch (conversation.type) {
      case 'global':
        return {
          icon: Radio,
          label: 'Diffusion',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          iconBg: 'bg-amber-500/20 text-amber-400'
        };
      case 'agency':
        return {
          icon: Building2,
          label: conversation.agencyNom || 'Agence',
          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
          iconBg: 'bg-cyan-500/20 text-cyan-400'
        };
      case 'service':
        return {
          icon: Briefcase,
          label: conversation.service ? conversation.service.toUpperCase() : 'Service',
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          iconBg: 'bg-purple-500/20 text-purple-400'
        };
      case 'group':
        return {
          icon: Users,
          label: 'Groupe',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          iconBg: 'bg-emerald-500/20 text-emerald-400'
        };
      case 'private':
      default:
        return {
          icon: User,
          label: 'Privé',
          color: 'text-slate-400 bg-slate-800 border-slate-700',
          iconBg: 'bg-slate-800 text-slate-300'
        };
    }
  };

  const badge = getTypeBadge();
  const Icon = badge.icon;

  // Format date
  const formatTime = (iso?: string) => {
    if (!iso) return '';
    const date = new Date(iso);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  };

  const isUrgent = conversation.lastMessageContent?.toLowerCase().includes('urgent');

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-start gap-3 p-3.5 rounded-2xl transition-all text-left cursor-pointer border ${
        isSelected
          ? 'bg-slate-900 border-amber-500/50 shadow-md shadow-amber-500/5'
          : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
      }`}
    >
      {/* Icon Avatar */}
      <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold ${badge.iconBg}`}>
        <Icon className="h-5 w-5" />
        {isUrgent && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white animate-pulse">
            !
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h4 className="text-sm font-bold text-slate-100 truncate">
            {conversation.title}
          </h4>
          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
            {formatTime(conversation.lastMessageAt)}
          </span>
        </div>

        {/* Snippet / Last message */}
        <p className="text-xs text-slate-400 line-clamp-1 mb-1.5">
          {conversation.lastMessageSenderName && (
            <span className="text-slate-300 font-semibold mr-1">
              {conversation.lastMessageSenderName}:
            </span>
          )}
          {conversation.lastMessageContent || 'Aucun message pour le moment'}
        </p>

        {/* Tags row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badge.color}`}>
            {badge.label}
          </span>

          {conversation.unreadCount && conversation.unreadCount > 0 ? (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[11px] font-extrabold text-slate-950">
              {conversation.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
};
