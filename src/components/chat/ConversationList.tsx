import React from 'react';
import {
  Search,
  Plus,
  Filter,
  MessageSquare,
  AlertTriangle,
  Clock,
  Radio,
  Building2,
  Users,
  Briefcase
} from 'lucide-react';
import { useChat, ChatFilterType } from '../../context/ChatContext';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  onOpenNewConversation: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  onOpenNewConversation
}) => {
  const {
    filteredConversations,
    selectedConversation,
    selectConversation,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    pendingSyncCount,
    syncState
  } = useChat();

  const filterTabs: { id: ChatFilterType; label: string; icon?: any }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'unread', label: 'Non lus' },
    { id: 'urgent', label: 'Urgents', icon: AlertTriangle },
    { id: 'private', label: 'Privés' },
    { id: 'group', label: 'Groupes', icon: Users },
    { id: 'agency', label: 'Agences', icon: Building2 },
    { id: 'service', label: 'Services', icon: Briefcase }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800">
      {/* Header with Title & Action */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-amber-500" />
            <span>Chat Interne</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Messagerie professionnelle sécurisée
          </p>
        </div>

        <button
          onClick={onOpenNewConversation}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/10 transition-all cursor-pointer"
          title="Créer une conversation"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nouveau</span>
        </button>
      </div>

      {/* Offline sync alert banner if pending items exist */}
      {(!syncState.effectiveOnline || pendingSyncCount > 0) && (
        <div
          className={`px-3 py-2 text-xs flex items-center justify-between border-b ${
            !syncState.effectiveOnline
              ? 'bg-rose-950/40 border-rose-900/40 text-rose-300'
              : 'bg-amber-950/30 border-amber-900/40 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>
              {!syncState.effectiveOnline
                ? 'Hors ligne — Messages enregistrés localement'
                : `${pendingSyncCount} message(s) en attente de synchronisation`}
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40">
            Dexie
          </span>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-3 border-b border-slate-800/80">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher conversation, service, mot-clé..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Filter Tabs Chips */}
      <div className="px-3 py-2 border-b border-slate-800/60 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {filterTabs.map(tab => {
          const isActive = activeFilter === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              {Icon && <Icon className="h-3 w-3" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conversation Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <MessageSquare className="h-8 w-8 text-slate-700 mb-2" />
            <p className="text-xs font-semibold text-slate-400">Aucune conversation trouvée</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Modifiez votre recherche ou démarrez un nouveau canal sécurisé.
            </p>
          </div>
        ) : (
          filteredConversations.map(conv => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={selectedConversation?.id === conv.id}
              onSelect={() => selectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
