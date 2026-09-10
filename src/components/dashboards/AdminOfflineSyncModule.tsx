import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../services/db';
import { SyncQueueItem } from '../../types';
import { syncService } from '../../services/SyncService';
import {
  Database,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Trash2,
  HardDrive,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AdminOfflineSyncModule: React.FC = () => {
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

  const [queueItems, setQueueItems] = useState<SyncQueueItem[]>([]);
  const [dbStats, setDbStats] = useState<{
    operations: number;
    users: number;
    agences: number;
    commissions: number;
    auditLogs: number;
    syncQueue: number;
  }>({
    operations: 0,
    users: 0,
    agences: 0,
    commissions: 0,
    auditLogs: 0,
    syncQueue: 0
  });
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    try {
      const [ops, usrs, ags, comms, logs, q] = await Promise.all([
        localDb.operations.count(),
        localDb.users.count(),
        localDb.agences.count(),
        localDb.commissions.count(),
        localDb.auditLogs.count(),
        localDb.syncQueue.count()
      ]);
      setDbStats({
        operations: ops,
        users: usrs,
        agences: ags,
        commissions: comms,
        auditLogs: logs,
        syncQueue: q
      });
      const pendingItems = await localDb.syncQueue.toArray();
      setQueueItems(pendingItems);
    } catch (err) {
      console.error('Erreur chargement stats Dexie:', err);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    setLoading(true);
    try {
      await triggerManualSync();
      await loadStats();
    } finally {
      setLoading(false);
    }
  };

  const handleClearSynced = async () => {
    await localDb.syncQueue.where('status').equals('synced').delete();
    await loadStats();
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Database className="h-4 w-4" />
              Infrastructure Technique — Moteur Offline-First Dexie & Synchronisation
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              Supervision de la Base Locale & File de Réplication
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Architecture Offline-First : Dexie/IndexedDB agit comme source primaire de travail. Les mutations sont empilées dans la file d'attente persistante et répliquées vers Firestore de manière idempotente.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={!isOnline || loading}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Dépiler la file (Sync)</span>
            </button>
            <button
              onClick={toggleSimulatedOffline}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-colors cursor-pointer ${
                isSimulatedOffline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isSimulatedOffline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span>{isSimulatedOffline ? 'Rétablir Réseau' : 'Simuler Hors Ligne'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Separation of Powers Reminder */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-white">
            Frontières d'Autorité & Responsabilités (DG vs Administrateur Système)
          </div>
          <p className="text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Gouvernance Technique :</strong> L'Administrateur Système supervise la disponibilité de la plateforme, la résilience locale IndexedDB, la file de synchronisation et les passerelles SMS.
            <br />
            <strong className="text-slate-200">Gouvernance Opérationnelle :</strong> Les règles de commissions commerciales, les taux de frais et les salaires sont la <span className="text-amber-400 font-semibold">prérogative exclusive du Directeur Général</span> et ne sont pas modifiables depuis cette console technique.
          </p>
        </div>
      </div>

      {/* IndexedDB Tables Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Opérations (Dexie)</span>
          <div className="text-xl font-bold text-white mt-1">{dbStats.operations}</div>
          <span className="text-[10px] text-emerald-400">Stockage local actif</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Utilisateurs RBAC</span>
          <div className="text-xl font-bold text-white mt-1">{dbStats.users}</div>
          <span className="text-[10px] text-blue-400">Cache local</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Agences locales</span>
          <div className="text-xl font-bold text-white mt-1">{dbStats.agences}</div>
          <span className="text-[10px] text-amber-400">Réseau national</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Commissions DG</span>
          <div className="text-xl font-bold text-white mt-1">{dbStats.commissions}</div>
          <span className="text-[10px] text-purple-400">Grille tarifaire</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Logs Audit</span>
          <div className="text-xl font-bold text-white mt-1">{dbStats.auditLogs}</div>
          <span className="text-[10px] text-rose-400">Append-only</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">File Réplication</span>
          <div className="text-xl font-bold text-cyan-400 mt-1">{dbStats.syncQueue}</div>
          <span className="text-[10px] text-cyan-400">{pendingSyncCount} en attente</span>
        </div>
      </div>

      {/* Sync Queue Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              File de Synchronisation Persistante (IndexedDB `syncQueue`)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Traçabilité des opérations créées hors ligne ou en attente d'envoi réseau.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearSynced}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              Nettoyer synchronisés
            </button>
          </div>
        </div>

        {queueItems.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800/80">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">File de synchronisation à jour</div>
            <p className="text-xs text-slate-400 mt-1">
              Toutes les données locales Dexie sont parfaitement réconciliées avec le serveur.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Idempotency Key</th>
                  <th className="p-3">Collection</th>
                  <th className="p-3">Opération</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Créé le</th>
                  <th className="p-3">Tentatives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {queueItems.map(item => (
                  <tr key={item.idempotencyKey} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono text-[11px] text-cyan-400">
                      {item.idempotencyKey.slice(0, 24)}...
                    </td>
                    <td className="p-3 text-slate-200 capitalize font-medium">{item.collection}</td>
                    <td className="p-3">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                        {item.operation}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'synced'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : item.status === 'failed'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[10px]">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-3 font-mono text-slate-400">{item.retryCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
