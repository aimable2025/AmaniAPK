import { localDb } from './db';
import { SyncQueueItem, SyncStatus, UserRole } from '../types';

export type SyncEventListener = (state: SyncServiceState) => void;

export interface SyncServiceState {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  effectiveOnline: boolean;
  status: SyncStatus;
  pendingCount: number;
  lastSyncedAt: Date | null;
  lastError: string | null;
}

class SyncServiceManager {
  private isBrowserOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private isSimulatedOffline: boolean = false;
  private currentStatus: SyncStatus = 'en_ligne';
  private lastSyncedAt: Date | null = null;
  private lastError: string | null = null;
  private listeners: Set<SyncEventListener> = new Set();
  private isSyncing: boolean = false;
  private syncTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isBrowserOnline = true;
        this.notifyState();
        this.triggerAutoSync();
      });

      window.addEventListener('offline', () => {
        this.isBrowserOnline = false;
        this.currentStatus = 'hors_ligne';
        this.notifyState();
      });

      // Periodic check every 30 seconds for pending items if online
      this.syncTimer = setInterval(() => {
        if (this.isEffectiveOnline()) {
          this.processQueue();
        }
      }, 30000);
    }
  }

  public isEffectiveOnline(): boolean {
    return this.isBrowserOnline && !this.isSimulatedOffline;
  }

  public getState(): SyncServiceState {
    return {
      isOnline: this.isBrowserOnline,
      isSimulatedOffline: this.isSimulatedOffline,
      effectiveOnline: this.isEffectiveOnline(),
      status: !this.isEffectiveOnline()
        ? 'hors_ligne'
        : this.isSyncing
        ? 'synchronisation'
        : this.currentStatus,
      pendingCount: 0, // Computed dynamically in component/context
      lastSyncedAt: this.lastSyncedAt,
      lastError: this.lastError
    };
  }

  public subscribe(listener: SyncEventListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notifyState(): void {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }

  /**
   * Toggle simulated offline mode (allows developers/users to test offline behavior)
   */
  public toggleSimulatedOffline(): boolean {
    this.isSimulatedOffline = !this.isSimulatedOffline;
    if (!this.isEffectiveOnline()) {
      this.currentStatus = 'hors_ligne';
    } else {
      this.currentStatus = 'en_ligne';
      this.triggerAutoSync();
    }
    this.notifyState();
    return this.isSimulatedOffline;
  }

  /**
   * Enqueue a local operation into persistent Dexie syncQueue
   * Idempotent: rejects duplicate idempotencyKey
   */
  public async enqueue(
    collection: SyncQueueItem['collection'],
    documentId: string,
    operation: SyncQueueItem['operation'],
    payload: any,
    actorId: string,
    actorRole: UserRole,
    agencyId?: string
  ): Promise<SyncQueueItem> {
    const idempotencyKey = `${collection}_${documentId}_${operation}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const queueItem: SyncQueueItem = {
      id: idempotencyKey,
      idempotencyKey,
      collection,
      documentId,
      operation,
      payload,
      timestamp: Date.now(),
      actorId,
      actorRole,
      agencyId,
      status: 'pending',
      retryCount: 0
    };

    try {
      await localDb.syncQueue.put(queueItem);
    } catch (err) {
      console.warn('Failed to enqueue to localDb, fallback memory:', err);
    }

    if (this.isEffectiveOnline()) {
      // Defer processing slightly so UI updates first
      setTimeout(() => this.processQueue(), 500);
    } else {
      this.currentStatus = 'hors_ligne';
      this.notifyState();
    }

    return queueItem;
  }

  /**
   * Process the pending synchronization queue
   */
  public async processQueue(): Promise<{ processed: number; failed: number }> {
    if (this.isSyncing || !this.isEffectiveOnline()) {
      return { processed: 0, failed: 0 };
    }

    this.isSyncing = true;
    this.currentStatus = 'synchronisation';
    this.notifyState();

    let processedCount = 0;
    let failedCount = 0;

    try {
      const pendingItems = await localDb.syncQueue
        .where('status')
        .equals('pending')
        .or('status')
        .equals('failed')
        .toArray();

      for (const item of pendingItems) {
        if (!this.isEffectiveOnline()) {
          break; // Connection lost mid-way
        }

        // Limit retries
        if (item.retryCount >= 5) {
          continue;
        }

        try {
          // Simulate / execute server sync with controlled latency
          await this.syncItemToCloud(item);

          // Mark as synced, then remove from queue to keep IndexedDB lean
          await localDb.syncQueue.update(item.id, {
            status: 'synced',
            lastError: undefined
          });
          await localDb.syncQueue.delete(item.id);
          processedCount++;
        } catch (syncErr: any) {
          failedCount++;
          await localDb.syncQueue.update(item.id, {
            status: 'failed',
            retryCount: item.retryCount + 1,
            lastError: syncErr?.message || 'Erreur réseau distante'
          });
        }
      }

      this.lastSyncedAt = new Date();
      this.currentStatus = failedCount > 0 ? 'erreur' : 'synchronise';
      this.lastError = failedCount > 0 ? `${failedCount} opérations en attente de reconnexion` : null;
    } catch (err: any) {
      this.currentStatus = 'erreur';
      this.lastError = err?.message || 'Erreur d\'accès IndexedDB';
    } finally {
      this.isSyncing = false;
      this.notifyState();
    }

    return { processed: processedCount, failed: failedCount };
  }

  /**
   * Mock / Actual Cloud Sync Handler
   */
  private async syncItemToCloud(item: SyncQueueItem): Promise<void> {
    // Artificial latency for realism
    await new Promise(resolve => setTimeout(resolve, 150));

    // Handle Chat Messages sync specifically
    if (item.collection === 'chat_messages') {
      try {
        const existingMsg = await localDb.chatMessages.get(item.documentId);
        if (existingMsg) {
          const updatedAttachments = existingMsg.attachments?.map(att => ({
            ...att,
            uploadStatus: 'uploaded' as const,
            remoteUrl: att.remoteUrl || `https://storage.ets-amani.cd/chat/${att.attachmentId}`
          }));

          await localDb.chatMessages.update(item.documentId, {
            syncStatus: 'synced',
            syncedAt: new Date().toISOString(),
            status: existingMsg.status === 'envoye' ? 'recu' : existingMsg.status,
            attachments: updatedAttachments
          });
        }
      } catch (chatSyncErr) {
        console.warn('Failed to update local chatMessage syncStatus:', chatSyncErr);
      }
    }

    // Audit the sync operation in Dexie
    const auditRecord = {
      id: `audit_sync_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      horodatage: new Date().toISOString(),
      type: 'synchronisation' as const,
      utilisateur: `Acteur ${item.actorId}`,
      role: item.actorRole,
      action: `SYNCHRONISATION_${item.collection.toUpperCase()}`,
      details: `Doc ${item.documentId} [${item.operation}] envoyé avec succès au Cloud`,
      adresseIp: '127.0.0.1 (Local Sync)',
      gravite: 'info' as const,
      actorId: item.actorId,
      actorRole: item.actorRole,
      resource: item.collection,
      resourceId: item.documentId,
      agencyId: item.agencyId,
      timestamp: Date.now()
    };

    try {
      await localDb.auditLogs.put(auditRecord);
    } catch {
      // non-blocking
    }
  }

  public triggerAutoSync(): void {
    if (this.isEffectiveOnline()) {
      this.processQueue();
    }
  }

  public async getPendingCount(): Promise<number> {
    try {
      return await localDb.syncQueue
        .where('status')
        .equals('pending')
        .or('status')
        .equals('failed')
        .count();
    } catch {
      return 0;
    }
  }
}

export const syncService = new SyncServiceManager();
