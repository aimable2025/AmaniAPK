import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Zap,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { syncService } from '../../services/SyncService';

export const OfflineTestBanner: React.FC = () => {
  const { syncState, pendingSyncCount, selectedConversation, sendMessage, refresh } = useChat();
  const { currentUser } = useAuth();
  const [isSimulating, setIsSimulating] = useState(false);

  const handleToggleOffline = () => {
    // Toggles the manual offline override in SyncService
    syncService.toggleSimulateOffline();
  };

  const handleTestOfflineSend = async () => {
    if (!selectedConversation || !currentUser) {
      alert('Veuillez d\'abord ouvrir une conversation.');
      return;
    }

    setIsSimulating(true);
    try {
      await sendMessage({
        content: `[TEST OFFLINE] Message test horodaté ${new Date().toLocaleTimeString()} - Sauvegardé en local dans Dexie.`,
        priority: 'normal'
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleForceSync = async () => {
    setIsSimulating(true);
    try {
      await syncService.processQueue();
      await refresh();
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Status indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {syncState.effectiveOnline ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <Wifi className="h-3.5 w-3.5" />
              <span>Connecté (Cloud Sync)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg animate-pulse">
              <WifiOff className="h-3.5 w-3.5" />
              <span>Mode Hors Ligne Actif</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Database className="h-3.5 w-3.5 text-amber-500" />
          <span>Base Locale Dexie :</span>
          <span className="font-mono text-slate-200">
            {pendingSyncCount === 0 ? 'À jour' : `${pendingSyncCount} en attente`}
          </span>
        </div>
      </div>

      {/* Interactive Testing Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleToggleOffline}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
            syncState.effectiveOnline
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
          title="Bascule de coupure réseau pour tester le comportement Offline-First"
        >
          {syncState.effectiveOnline ? (
            <>
              <WifiOff className="h-3.5 w-3.5" />
              <span>Couper Internet (Simu)</span>
            </>
          ) : (
            <>
              <Wifi className="h-3.5 w-3.5" />
              <span>Rétablir Internet</span>
            </>
          )}
        </button>

        <button
          onClick={handleTestOfflineSend}
          disabled={isSimulating || !selectedConversation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold transition-all disabled:opacity-50 cursor-pointer"
          title="Envoie un message de test immédiatement dans la base locale"
        >
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span>Test Envoi Local</span>
        </button>

        <button
          onClick={handleForceSync}
          disabled={isSimulating || !syncState.effectiveOnline || pendingSyncCount === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold transition-all disabled:opacity-50 cursor-pointer"
          title="Forcer la vidange de la file de synchronisation"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>Synchroniser File</span>
        </button>
      </div>
    </div>
  );
};
