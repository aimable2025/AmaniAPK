import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChatProvider, useChat } from '../../context/ChatContext';
import { ConversationList } from './ConversationList';
import { ChatConversation } from './ChatConversation';
import { NewConversationModal } from './NewConversationModal';
import { GroupInfoModal } from './GroupInfoModal';
import { OfflineTestBanner } from './OfflineTestBanner';
import { ChatPermissionService } from '../../services/chat/ChatPermissionService';
import { MessageSquare, ShieldAlert, Lock } from 'lucide-react';

const ChatViewContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { selectedConversation, selectConversation, isLoading } = useChat();

  const [isNewConvOpen, setIsNewConvOpen] = useState(false);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // When user selects a conversation on mobile, show chat view
  const handleSelectConversation = (id: string | null) => {
    selectConversation(id);
    if (id) {
      setShowMobileChat(true);
    }
  };

  const handleBackMobile = () => {
    setShowMobileChat(false);
  };

  if (!ChatPermissionService.canAccessChat(currentUser)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4 shadow-lg shadow-rose-950/20">
          <ShieldAlert className="h-10 w-10 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Accès Non Autorisé</h2>
        <p className="max-w-md text-sm text-slate-400">
          Le module de Chat Interne d'Ets AMANI est strictement réservé au personnel interne en exercice et aux membres autorisés. Votre compte actuel n'a pas les privilèges requis.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Offline Test & Status Banner */}
      <OfflineTestBanner />

      {/* Main Chat Layout */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left: Conversation List */}
        <div
          className={`w-full lg:w-96 lg:shrink-0 h-full ${
            showMobileChat ? 'hidden lg:block' : 'block'
          }`}
        >
          <ConversationList
            onOpenNewConversation={() => setIsNewConvOpen(true)}
          />
        </div>

        {/* Right: Active Conversation View */}
        <div
          className={`flex-1 h-full flex flex-col min-w-0 ${
            showMobileChat ? 'block' : 'hidden lg:flex'
          }`}
        >
          {selectedConversation ? (
            <ChatConversation
              conversation={selectedConversation}
              onBackMobile={handleBackMobile}
              onOpenGroupInfo={() => setIsGroupInfoOpen(true)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/60">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-4">
                <MessageSquare className="h-10 w-10" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-1">
                Sélectionnez une conversation
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Choisissez un canal dans la liste de gauche ou démarrez un nouvel échange confidentiel avec un collègue.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <NewConversationModal
        isOpen={isNewConvOpen}
        onClose={() => setIsNewConvOpen(false)}
      />

      {selectedConversation && (
        <GroupInfoModal
          conversation={selectedConversation}
          isOpen={isGroupInfoOpen}
          onClose={() => setIsGroupInfoOpen(false)}
        />
      )}
    </div>
  );
};

export const ChatView: React.FC = () => {
  return (
    <ChatProvider>
      <ChatViewContent />
    </ChatProvider>
  );
};
