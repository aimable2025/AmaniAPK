import React from 'react';
import {
  Check,
  CheckCheck,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Trash2,
  CornerUpLeft,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { ChatMessage, User } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
  currentUser: User;
  onReply?: (message: ChatMessage) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUser,
  onReply,
  onDelete
}) => {
  const isMe = message.senderId === currentUser.id;
  const isUrgent = message.priority === 'urgent';
  const isPending = message.syncStatus === 'pending' || message.syncStatus === 'syncing';

  // Format timestamp (e.g. 11:45)
  const timeFormatted = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`flex flex-col mb-4 ${isMe ? 'items-end' : 'items-start'}`}>
      {/* Sender Header if not me */}
      {!isMe && (
        <div className="flex items-center gap-2 mb-1 px-2">
          <span className="text-xs font-bold text-slate-200">{message.senderName}</span>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            {message.senderRole.replace(/_/g, ' ')}
          </span>
          {message.agencyNom && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <Building className="h-3 w-3" />
              {message.agencyNom}
            </span>
          )}
        </div>
      )}

      {/* Message Box */}
      <div
        className={`relative group max-w-[85%] sm:max-w-md md:max-w-lg rounded-2xl p-3.5 shadow-md transition-all ${
          isUrgent
            ? 'bg-rose-950/70 border-2 border-rose-500/60 text-slate-100 shadow-rose-900/20'
            : isMe
            ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-slate-950 font-medium'
            : 'bg-slate-900 border border-slate-800 text-slate-100'
        } ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'}`}
      >
        {/* Urgent Alert Banner */}
        {isUrgent && (
          <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-rose-500/30 text-rose-300 text-xs font-bold">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 animate-pulse" />
            <span>MESSAGE URGENT — ACTION REQUISE</span>
          </div>
        )}

        {/* Reply To Preview */}
        {message.replyToPreview && (
          <div
            className={`mb-2 p-2 rounded-lg text-xs border-l-4 ${
              isMe
                ? 'bg-amber-800/40 border-amber-950 text-slate-900'
                : 'bg-slate-950/60 border-amber-500 text-slate-300'
            }`}
          >
            <div className="font-bold text-[11px] text-amber-300 mb-0.5">
              Réponse à {message.replyToPreview.senderName}
            </div>
            <div className="line-clamp-1 italic text-slate-400">
              {message.replyToPreview.content}
            </div>
          </div>
        )}

        {/* Text Content */}
        {message.isDeleted ? (
          <p className="italic text-xs text-slate-400">Ce message a été supprimé.</p>
        ) : (
          <p className={`text-sm whitespace-pre-wrap leading-relaxed break-words ${isMe && !isUrgent ? 'text-slate-950 font-medium' : 'text-slate-100'}`}>
            {message.content}
          </p>
        )}

        {/* Attachments rendering */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2.5 space-y-2">
            {message.attachments.map(att => {
              const isImage = att.mimeType.startsWith('image/');
              return (
                <div
                  key={att.attachmentId}
                  className={`rounded-xl overflow-hidden border p-2 ${
                    isMe
                      ? 'bg-amber-800/30 border-amber-800/50'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  {isImage && (att.localData || att.remoteUrl) ? (
                    <div className="flex flex-col gap-1.5">
                      <img
                        src={att.localData || att.remoteUrl}
                        alt={att.fileName}
                        className="max-h-56 rounded-lg object-contain bg-black/20"
                        loading="lazy"
                      />
                      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                        <span className="truncate max-w-[180px]">{att.fileName}</span>
                        <span>{(att.size / 1024).toFixed(0)} Ko</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate text-slate-200">
                            {att.fileName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {(att.size / 1024).toFixed(1)} Ko • {att.uploadStatus === 'uploaded' ? 'Synchronisé' : 'Stocké localement'}
                          </div>
                        </div>
                      </div>
                      {att.localData || att.remoteUrl ? (
                        <a
                          href={att.localData || att.remoteUrl}
                          download={att.fileName}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Télécharger"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info (time, status) */}
        <div className={`flex items-center justify-end gap-1.5 mt-1.5 text-[10px] ${isMe && !isUrgent ? 'text-amber-950/80 font-semibold' : 'text-slate-400'}`}>
          <span>{timeFormatted}</span>

          {/* Sync & Read Status icons */}
          {isMe && (
            <div className="flex items-center gap-1">
              {isPending ? (
                <span title="En attente de synchronisation (Hors ligne)" className="flex items-center gap-0.5 text-amber-300 font-bold">
                  <Clock className="h-3 w-3 animate-spin" />
                  <span className="hidden sm:inline text-[9px]">Local</span>
                </span>
              ) : message.status === 'lu' ? (
                <span title="Lu" className="text-blue-400">
                  <CheckCheck className="h-3.5 w-3.5 font-bold" />
                </span>
              ) : message.status === 'recu' ? (
                <span title="Reçu / Distribué" className="text-slate-300">
                  <CheckCheck className="h-3.5 w-3.5" />
                </span>
              ) : (
                <span title="Envoyé" className="text-slate-300">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action buttons on hover/touch */}
        <div className={`absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-950/80 backdrop-blur px-1.5 py-0.5 rounded-lg shadow`}>
          {onReply && (
            <button
              onClick={() => onReply(message)}
              className="p-1 text-slate-300 hover:text-amber-400 rounded transition-colors"
              title="Répondre"
            >
              <CornerUpLeft className="h-3 w-3" />
            </button>
          )}
          {onDelete && isMe && !message.isDeleted && (
            <button
              onClick={() => onDelete(message.id)}
              className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
              title="Supprimer"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
