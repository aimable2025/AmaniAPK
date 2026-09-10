import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Users,
  Info,
  Shield,
  Building2,
  Lock,
  Radio,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { ChatConversation as ChatConversationType, ChatMessage } from '../../types';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { ChatPermissionService } from '../../services/chat/ChatPermissionService';

interface ChatConversationProps {
  conversation: ChatConversationType;
  onBackMobile?: () => void;
  onOpenGroupInfo?: () => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  conversation,
  onBackMobile,
  onOpenGroupInfo
}) => {
  const { currentUser } = useAuth();
  const { messages, sendMessage, deleteMessage } = useChat();
  const [replyTo, setReplyTo] = useState<{ messageId: string; senderName: string; content: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReply = (message: ChatMessage) => {
    setReplyTo({
      messageId: message.id,
      senderName: message.senderName,
      content: message.content || (message.attachments ? 'Pièce jointe' : '')
    });
  };

  const canPost = ChatPermissionService.canSendMessage(currentUser, conversation);
  const canSendUrgent = ChatPermissionService.canSendUrgentMessage(currentUser);

  // Helper to group messages by date
  const renderMessagesWithDateDividers = () => {
    let lastDateStr = '';

    return messages.map(msg => {
      const msgDate = new Date(msg.createdAt).toLocaleDateString([], {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });

      const showDivider = msgDate !== lastDateStr;
      lastDateStr = msgDate;

      return (
        <React.Fragment key={msg.id}>
          {showDivider && (
            <div className="flex items-center justify-center my-4">
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full shadow-sm">
                {msgDate}
              </span>
            </div>
          )}
          <MessageBubble
            message={msg}
            currentUser={currentUser}
            onReply={canPost ? handleReply : undefined}
            onDelete={deleteMessage}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Top Conversation Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBackMobile && (
            <button
              onClick={onBackMobile}
              className="lg:hidden p-2 -ml-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Retour aux conversations"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-100 truncate">
                {conversation.title}
              </h3>
              {conversation.type === 'private' && (
                <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  <Lock className="h-3 w-3 text-amber-400" />
                  Privé
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              {conversation.agencyNom && (
                <span className="flex items-center gap-1 text-cyan-400">
                  <Building2 className="h-3 w-3" />
                  {conversation.agencyNom}
                </span>
              )}
              {conversation.service && (
                <span className="flex items-center gap-1 text-purple-400">
                  <Briefcase className="h-3 w-3" />
                  {conversation.service.toUpperCase()}
                </span>
              )}
              <span>• {conversation.participants.length} participant(s)</span>
            </div>
          </div>
        </div>

        {/* Right Details/Group Info button */}
        <button
          onClick={onOpenGroupInfo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        >
          <Users className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden sm:inline">Membres</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1">
        {/* Security & Confidentiality Notice */}
        <div className="max-w-md mx-auto mb-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center text-xs text-slate-400">
          <Shield className="h-4 w-4 text-amber-500 mx-auto mb-1" />
          <p className="font-semibold text-slate-300">Messagerie Interne Ets AMANI</p>
          <p className="text-[11px] mt-0.5 text-slate-500">
            Ce canal est protégé par chiffrement local et règles strictes d'isolation d'agence.
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 text-xs">
            <p className="font-semibold">Aucun message dans ce canal.</p>
            <p className="text-[11px] mt-1 text-slate-600">
              Commencez la discussion dès maintenant. Vos messages seront conservés hors ligne.
            </p>
          </div>
        ) : (
          renderMessagesWithDateDividers()
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer Footer */}
      <MessageComposer
        onSendMessage={sendMessage}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        canSendUrgent={canSendUrgent}
        disabled={!canPost}
      />
    </div>
  );
};
