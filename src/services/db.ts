import Dexie, { type Table } from 'dexie';
import {
  User,
  Agence,
  FinancialOperation,
  SmsTransaction,
  SmsDetectionRule,
  CommercialCommission,
  EmployeePayroll,
  InternalAnnouncement,
  SecurityAuditLog,
  SyncQueueItem,
  ChatConversation,
  ChatMessage,
  ChatAttachment
} from '../types';

/**
 * Ets AMANI - Local Dexie IndexedDB Database
 * "Ets AMANI — Ensemble, plus connectés, plus efficaces."
 *
 * Offline-First Foundation:
 * Local IndexedDB acts as the primary data store.
 * Cloud (Firestore) handles sync, backup and centralization.
 */
export class AmaniDatabase extends Dexie {
  users!: Table<User, string>;
  agences!: Table<Agence, string>;
  operations!: Table<FinancialOperation, string>;
  smsTransactions!: Table<SmsTransaction, string>;
  smsRules!: Table<SmsDetectionRule, string>;
  commissions!: Table<CommercialCommission, string>;
  payroll!: Table<EmployeePayroll, string>;
  announcements!: Table<InternalAnnouncement, string>;
  auditLogs!: Table<SecurityAuditLog, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  chatConversations!: Table<ChatConversation, string>;
  chatMessages!: Table<ChatMessage, string>;
  chatAttachments!: Table<ChatAttachment, string>;

  constructor() {
    super('EtsAmaniOfflineDB');

    this.version(1).stores({
      users: '&id, email, telephone, role, agenceId, statut, matricule',
      agences: '&id, code, nom, statut',
      operations: '&id, reference, type, date, agenceId, agentId, statut',
      smsTransactions: '&id, referenceTransaction, operateur, statut',
      smsRules: '&id, operateur, actif',
      commissions: '&id, service, statut, zoneGeographique',
      payroll: '&id, userId, mois, statut',
      announcements: '&id, date, priorite, cible',
      auditLogs: '&id, horodatage, actorId, action, gravite',
      syncQueue: '&id, idempotencyKey, collection, documentId, status, timestamp'
    });

    // Version 2 adds Enterprise Internal Chat offline storage
    this.version(2).stores({
      users: '&id, email, telephone, role, agenceId, statut, matricule',
      agences: '&id, code, nom, statut',
      operations: '&id, reference, type, date, agenceId, agentId, statut',
      smsTransactions: '&id, referenceTransaction, operateur, statut',
      smsRules: '&id, operateur, actif',
      commissions: '&id, service, statut, zoneGeographique',
      payroll: '&id, userId, mois, statut',
      announcements: '&id, date, priorite, cible',
      auditLogs: '&id, horodatage, actorId, action, gravite',
      syncQueue: '&id, idempotencyKey, collection, documentId, status, timestamp',
      chatConversations: '&id, type, agencyId, service, updatedAt, lastMessageAt',
      chatMessages: '&id, conversationId, senderId, createdAt, status, syncStatus, priority',
      chatAttachments: '&id, attachmentId, uploadStatus'
    });
  }
}

export const localDb = new AmaniDatabase();

