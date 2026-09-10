import React, { useState, useRef } from 'react';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  AlertTriangle,
  X,
  FileText,
  CornerUpLeft
} from 'lucide-react';
import { ChatAttachment, ChatMessagePriority } from '../../types';

interface MessageComposerProps {
  onSendMessage: (params: {
    content: string;
    priority?: ChatMessagePriority;
    attachments?: ChatAttachment[];
    replyTo?: { messageId: string; senderName: string; content: string };
  }) => Promise<any>;
  replyTo?: { messageId: string; senderName: string; content: string } | null;
  onCancelReply?: () => void;
  canSendUrgent?: boolean;
  disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  replyTo,
  onCancelReply,
  canSendUrgent = true,
  disabled = false
}) => {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<ChatMessagePriority>('normal');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // File handling: converts to base64 DataURL for offline persistence in Dexie
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isImageOnly: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert('La taille maximale autorisée est de 10 Mo');
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newAttachment: ChatAttachment = {
        attachmentId: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        fileName: file.name,
        mimeType: file.type || (isImageOnly ? 'image/jpeg' : 'application/octet-stream'),
        size: file.size,
        localData: dataUrl,
        uploadStatus: 'pending'
      };

      setAttachments(prev => [...prev, newAttachment]);
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    };

    reader.onerror = () => {
      alert('Erreur lors de la lecture du fichier local');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.attachmentId !== id));
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (disabled || isUploading) return;
    if (!content.trim() && attachments.length === 0) return;

    await onSendMessage({
      content: content.trim(),
      priority,
      attachments: attachments.length > 0 ? attachments : undefined,
      replyTo: replyTo || undefined
    });

    // Reset composer state
    setContent('');
    setAttachments([]);
    setPriority('normal');
    if (onCancelReply) onCancelReply();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950 p-3 sm:p-4 transition-all">
      {/* Reply Banner */}
      {replyTo && (
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 mb-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <CornerUpLeft className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-amber-300 shrink-0">Réponse à {replyTo.senderName}:</span>
            <span className="truncate text-slate-400 italic">{replyTo.content}</span>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Annuler la réponse"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Attachments Preview Bar */}
      {attachments.length > 0 && (
        <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
          {attachments.map(att => {
            const isImage = att.mimeType.startsWith('image/');
            return (
              <div
                key={att.attachmentId}
                className="relative flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl shrink-0 max-w-[200px]"
              >
                {isImage && att.localData ? (
                  <img
                    src={att.localData}
                    alt={att.fileName}
                    className="h-9 w-9 rounded-lg object-cover bg-black/40"
                  />
                ) : (
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <FileText className="h-4 w-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">{att.fileName}</div>
                  <div className="text-[10px] text-slate-400">{(att.size / 1024).toFixed(0)} Ko</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(att.attachmentId)}
                  className="absolute -top-1.5 -right-1.5 p-1 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-full border border-slate-700 shadow transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Composer Toolbar & Priority */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          {/* File Picker */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={e => handleFileChange(e, false)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            title="Joindre un fichier (PDF, document, tableur)"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          {/* Image Picker */}
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            onChange={e => handleFileChange(e, true)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            title="Joindre une image / photo"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Priority Selector */}
        {canSendUrgent && (
          <button
            type="button"
            onClick={() => setPriority(prev => (prev === 'urgent' ? 'normal' : 'urgent'))}
            className={`min-h-[40px] px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              priority === 'urgent'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 animate-pulse'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{priority === 'urgent' ? 'Message Urgent Activé' : 'Priorité Normale'}</span>
          </button>
        )}
      </div>

      {/* Message Input & Send button */}
      <form onSubmit={handleSend} className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              disabled
                ? 'Canal en lecture seule ou archivé...'
                : priority === 'urgent'
                ? 'Rédigez votre message urgent pour l\'équipe...'
                : 'Écrire un message... (Entrée pour envoyer, Maj+Entrée nouvelle ligne)'
            }
            rows={2}
            className={`w-full resize-none rounded-2xl bg-slate-900 border px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              priority === 'urgent'
                ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={disabled || (!content.trim() && attachments.length === 0)}
          className={`min-h-[48px] min-w-[48px] flex items-center justify-center rounded-2xl font-bold transition-all shadow-md cursor-pointer ${
            content.trim() || attachments.length > 0
              ? priority === 'urgent'
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title="Envoyer le message"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
