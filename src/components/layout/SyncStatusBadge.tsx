import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  Database,
  CheckCircle2,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

export const SyncStatusBadge: React.FC = () => {
  const {
    isOnline,
    isSimulatedOffline,
    syncStatus,
    pendingSyncCount,
    lastSyncTime,
    syncError,
    triggerManualSync,
    toggleSimulatedOffline
  } = useAuth();

  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSyncClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsManualSyncing(true);
    try {
      await triggerManualSync();
    } finally {
      setIsManualSyncing(false);
    }
  };

  const handleToggleOffline = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSimulatedOffline();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
          !isOnline
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            : syncStatus === 'synchronisation' || isManualSyncing
            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            : pendingSyncCount > 0
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
        }`}
        title="Statut de connectivité et synchronisation Offline-First"
      >
        {/* Connection status icon */}
        {!isOnline ? (
          <WifiOff className="h-3.5 w-3.5 text-amber-400" />
        ) : syncStatus === 'synchronisation' || isManualSyncing ? (
          <RefreshCw className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
        ) : (
          <Wifi className="h-3.5 w-3.5 text-emerald-400" />
        )}

        {/* State text */}
        <span className="hidden sm:inline">
          {!isOnline
            ? isSimulatedOffline
              ? 'Hors ligne (Simulé)'
              : 'Hors ligne'
            : syncStatus === 'synchronisation' || isManualSyncing
            ? 'Synchronisation...'
            : 'En ligne (IndexedDB)'}
        </span>

        {/* Pending operations counter */}
        {pendingSyncCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
            {pendingSyncCount} en attente
          </span>
        )}

        <ChevronDown className="h-3 w-3 text-slate-400 opacity-60" />
      </button>

      {/* Popover details & Controls */}
      {showDetails && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-amber-400" />
              Moteur Offline-First Dexie
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              {isOnline ? 'Connecté au Cloud' : 'Mode Local Autonome'}
            </span>
          </div>

          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Stockage local :</span>
              <span className="font-semibold text-white">IndexedDB (DexieJS)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Opérations en attente :</span>
              <span className={`font-bold ${pendingSyncCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {pendingSyncCount} document(s)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Dernière synchronisation :</span>
              <span className="text-slate-300 font-mono text-[10px]">
                {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'En attente'}
              </span>
            </div>
            {syncError && (
              <div className="text-rose-400 text-[10px] bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                {syncError}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              onClick={handleSyncClick}
              disabled={!isOnline || isManualSyncing}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${isManualSyncing ? 'animate-spin' : ''}`} />
              <span>Forcer la synchronisation</span>
            </button>

            <button
              onClick={handleToggleOffline}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                isSimulatedOffline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              {isSimulatedOffline ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span>Rétablir Mode Normal En Ligne</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>Simuler Mode Hors Ligne</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
