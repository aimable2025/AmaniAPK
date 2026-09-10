/**
 * Ets AMANI - Unified Type Definitions
 * "Ets AMANI — Ensemble, plus connectés, plus efficaces."
 */

export type UserRole =
  | 'administrateur_systeme'
  | 'directeur_general'
  | 'directeur_adjoint'
  | 'chef_agence'
  | 'assistant_administratif'
  | 'agent'
  | 'membre'
  | 'requerant_membre';

export type AgentCategory =
  | 'comptable'
  | 'guichetier'
  | 'agent_virtuel'
  | 'agent_vodae'
  | 'agent_operateur_mobile'
  | 'agent_de_change'
  | 'chauffeur'
  | 'cleaner'
  | 'agent_polyvalent';

export type UserStatus = 'actif' | 'suspendu' | 'en_attente' | 'inactif';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  agentCategory?: AgentCategory;
  agenceId?: string;
  agenceNom?: string;
  statut: UserStatus;
  avatarUrl?: string;
  dateCreation: string;
  derniereConnexion?: string;
  matricule: string;
  notes?: string;
}

export interface Agence {
  id: string;
  code: string;
  nom: string;
  ville: string;
  adresse: string;
  telephone: string;
  chefAgenceId?: string;
  chefAgenceNom?: string;
  statut: 'active' | 'fermee' | 'en_renovation';
  dateOuverture: string;
  nbEmployes: number;
  soldeCaisseCDF: number;
  soldeCaisseUSD: number;
}

export interface Permission {
  id: string;
  nom: string;
  code: string;
  module: string;
  description: string;
  rolesAutorises: UserRole[];
}

export interface ConnectedDevice {
  id: string;
  userId: string;
  userNom: string;
  appareil: string;
  systeme: string;
  navigateur: string;
  adresseIp: string;
  derniereSynchro: string;
  statut: 'en_ligne' | 'hors_ligne' | 'suspect';
  autorise: boolean;
  appVersion: string;
}

export interface SmsDetectionRule {
  id: string;
  operateur: 'Vodacom' | 'Airtel' | 'Orange' | 'Autre';
  nomRegle: string;
  simSlot: 'SIM 1' | 'SIM 2' | 'SIM 3';
  expediteurOfficiel: string;
  patternMontant: string;
  patternReference: string;
  patternExpediteur: string;
  autoRapprochement: boolean;
  actif: boolean;
}

export interface SmsTransaction {
  id: string;
  operateur: 'Vodacom' | 'Airtel' | 'Orange';
  expediteur: string;
  messageBrut: string;
  montant: number;
  devise: 'USD' | 'CDF';
  referenceTransaction: string;
  dateReception: string;
  statut: 'rapproche' | 'en_attente' | 'anomalie';
  operationLieeId?: string;
  simAttribuee: string;
}

export interface FinancialOperation {
  id: string;
  reference: string;
  type: 'depot' | 'retrait' | 'change' | 'transfert' | 'paiement_salaire' | 'depense';
  montant: number;
  devise: 'USD' | 'CDF';
  tauxChange?: number;
  contreValeur?: number;
  date: string;
  agenceId: string;
  agenceNom: string;
  agentId: string;
  agentNom: string;
  clientId?: string;
  clientNom?: string;
  membreId?: string;
  membreNom?: string;
  statut: 'validee' | 'en_attente' | 'rejetee';
  modeReglement: 'especes' | 'm_pesa' | 'airtel_money' | 'orange_money' | 'virement';
  motif: string;
  smsRapprocheId?: string;
}

export interface EmployeePayroll {
  id: string;
  userId: string;
  userNom: string;
  matricule: string;
  poste: string;
  agenceNom: string;
  mois: string;
  salaireBaseUSD: number;
  primesUSD: number;
  retenuesUSD: number;
  netPayerUSD: number;
  statut: 'paye' | 'valide' | 'brouillon';
  datePaiement?: string;
}

export interface InternalAnnouncement {
  id: string;
  titre: string;
  contenu: string;
  auteurNom: string;
  auteurRole: UserRole;
  date: string;
  priorite: 'normale' | 'urgente' | 'critique';
  cible: 'tous' | 'agents' | 'direction' | 'agences';
  luPar: string[];
}

export interface SecurityAuditLog {
  id: string;
  horodatage: string;
  type: 'connexion' | 'modification_role' | 'securite' | 'anomalie' | 'suppression' | 'rapprochement' | 'synchronisation' | 'commission' | 'salaire';
  utilisateur: string;
  role: UserRole;
  action: string;
  details: string;
  adresseIp: string;
  gravite: 'info' | 'avertissement' | 'critique';
  actorId?: string;
  actorRole?: UserRole;
  resource?: string;
  resourceId?: string;
  oldValue?: string;
  newValue?: string;
  timestamp?: number;
  agencyId?: string;
  reason?: string;
}

export interface AssignedTask {
  id: string;
  titre: string;
  description: string;
  assigneA: string;
  categorie: AgentCategory | 'generale';
  priorite: 'faible' | 'moyenne' | 'haute';
  statut: 'a_faire' | 'en_cours' | 'terminee';
  dateEcheance: string;
}

export interface CommercialCommission {
  id: string;
  titre: string;
  tauxPourcentage: number;
  montantFixeUSD?: number;
  montantFixeCDF?: number;
  service: 'transfert' | 'change' | 'depot_retrait' | 'mobile_money' | 'credit';
  operateur?: 'Vodacom' | 'Airtel' | 'Orange' | 'Tous';
  zoneGeographique: string;
  agenceId?: string;
  agenceNom?: string;
  pays: string;
  estPromotion: boolean;
  statut: 'active' | 'suspendue' | 'expiree';
  dateDebut: string;
  dateFin: string;
  creeParId: string;
  creeParNom: string;
  historiqueModifications: {
    date: string;
    auteurNom: string;
    auteurRole: UserRole;
    champsModifies: string;
    motif: string;
  }[];
}

export interface MembershipRequest {
  id: string;
  requerantNom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  typeMembreSouhaite: 'individuel' | 'entreprise' | 'cooperative';
  dateDemande: string;
  statut: 'en_attente_documents' | 'en_analyse' | 'approuve' | 'rejete';
  documents: { nom: string; statut: 'fourni' | 'manquant' }[];
  commentaires?: string;
}

/**
 * Offline-First & Sync Queue Types
 */
export type SyncStatus =
  | 'hors_ligne'
  | 'en_ligne'
  | 'synchronisation'
  | 'synchronise'
  | 'erreur';

export interface SyncQueueItem {
  id: string;
  idempotencyKey: string;
  collection: 'operations' | 'users' | 'agences' | 'commissions' | 'payroll' | 'announcements' | 'audit_logs' | 'chat_messages' | 'chat_conversations';
  documentId: string;
  operation: 'create' | 'update' | 'delete';
  payload: any;
  timestamp: number;
  actorId: string;
  actorRole: UserRole;
  agencyId?: string;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
  retryCount: number;
  lastError?: string;
}

export interface SyncConflictResolution {
  documentId: string;
  collection: string;
  clientTimestamp: number;
  serverTimestamp: number;
  strategy: 'last_write_wins' | 'server_priority' | 'audit_logged';
  resolvedAt: string;
}

/**
 * Enterprise Internal Chat Module Types
 * Ets AMANI - Offline-First Local-to-Cloud architecture
 */
export type ChatConversationType = 'private' | 'group' | 'agency' | 'service' | 'global';

export type ChatMessagePriority = 'normal' | 'urgent';

export type ChatMessageStatus = 'envoye' | 'recu' | 'lu';

export type ChatSyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export type ChatMessageType = 'text' | 'image' | 'file' | 'system';

export interface ChatAttachment {
  attachmentId: string;
  fileName: string;
  mimeType: string;
  size: number;
  localData?: string; // Base64/DataURL for immediate offline rendering
  remoteUrl?: string;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'failed';
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  agencyId?: string;
  agencyNom?: string;
  content: string;
  type: ChatMessageType;
  priority: ChatMessagePriority;
  createdAt: string; // ISO 8601
  updatedAt?: string;
  status: ChatMessageStatus;
  isDeleted?: boolean;
  replyToMessageId?: string;
  replyToPreview?: {
    senderName: string;
    content: string;
  };
  localId: string;
  syncStatus: ChatSyncStatus;
  syncedAt?: string;
  attachments?: ChatAttachment[];
  readBy?: { userId: string; readAt: string }[];
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  type: ChatConversationType;
  title: string;
  description?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  agencyId?: string;
  agencyNom?: string;
  service?: string; // 'comptabilite' | 'caisse' | 'guichet' | 'change' | 'mobile_money' | 'administration' | 'general'
  participants: string[]; // List of user IDs
  admins: string[]; // User IDs who can manage participants
  isArchived: boolean;
  isActive: boolean;
  lastMessageId?: string;
  lastMessageContent?: string;
  lastMessageAt?: string;
  lastMessageSenderName?: string;
  unreadCount?: number;
  metadata?: Record<string, any>;
}

