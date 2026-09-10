import {
  User,
  Agence,
  ConnectedDevice,
  SmsDetectionRule,
  SmsTransaction,
  FinancialOperation,
  EmployeePayroll,
  InternalAnnouncement,
  SecurityAuditLog,
  AssignedTask,
  MembershipRequest,
  Permission,
  CommercialCommission
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    matricule: 'AMN-SYS-001',
    nom: 'KASEREKA',
    prenom: 'Alain',
    email: 'admin.systeme@ets-amani.cd',
    telephone: '+243 998 123 456',
    role: 'administrateur_systeme',
    statut: 'actif',
    dateCreation: '2025-01-10',
    derniereConnexion: 'Aujourd\'hui à 09:42',
    notes: 'Supervision technique, sécurité RBAC, SMS gateways et infrastructure.'
  },
  {
    id: 'usr-2',
    matricule: 'AMN-DIR-001',
    nom: 'AMANI',
    prenom: 'Justin',
    email: 'direction.generale@ets-amani.cd',
    telephone: '+243 812 345 678',
    role: 'directeur_general',
    statut: 'actif',
    dateCreation: '2025-01-05',
    derniereConnexion: 'Aujourd\'hui à 08:30',
    notes: 'Directeur Général — Vision stratégique, administration d\'entreprise, arbitrages globaux.'
  },
  {
    id: 'usr-3',
    matricule: 'AMN-DIR-002',
    nom: 'KABUO',
    prenom: 'Esperance',
    email: 'direction.adjointe@ets-amani.cd',
    telephone: '+243 970 888 999',
    role: 'directeur_adjoint',
    statut: 'actif',
    dateCreation: '2025-01-15',
    derniereConnexion: 'Aujourd\'hui à 10:15',
    notes: 'Assiste le DG, supervision des agences provinciales et rapports opérationnels.'
  },
  {
    id: 'usr-4',
    matricule: 'AMN-AG-GOM-01',
    nom: 'MUMBERE',
    prenom: 'Claude',
    email: 'chef.goma@ets-amani.cd',
    telephone: '+243 997 111 222',
    role: 'chef_agence',
    agenceId: 'ag-1',
    agenceNom: 'Siège Central Goma',
    statut: 'actif',
    dateCreation: '2025-02-01',
    derniereConnexion: 'Aujourd\'hui à 11:05',
    notes: 'Gestion des caisses et supervision des guichets de Goma.'
  },
  {
    id: 'usr-5',
    matricule: 'AMN-ADM-001',
    nom: 'BAHATI',
    prenom: 'Dorcas',
    email: 'assistant.admin@ets-amani.cd',
    telephone: '+243 854 443 322',
    role: 'assistant_administratif',
    statut: 'actif',
    dateCreation: '2025-02-10',
    derniereConnexion: 'Aujourd\'hui à 09:12',
    notes: 'Gestion des requêtes de membres, archivage de documents et courriers officiels.'
  },
  {
    id: 'usr-6',
    matricule: 'AMN-AGT-POL-01',
    nom: 'PALUKU',
    prenom: 'Henri',
    email: 'henri.polyvalent@ets-amani.cd',
    telephone: '+243 976 555 444',
    role: 'agent',
    agentCategory: 'agent_polyvalent',
    agenceId: 'ag-1',
    agenceNom: 'Siège Central Goma',
    statut: 'actif',
    dateCreation: '2025-02-15',
    derniereConnexion: 'Il y a 15 minutes',
    notes: 'Agent polyvalent avec accès transversal aux modules guichet, change, comptabilité, mobile et logistique.'
  },
  {
    id: 'usr-7',
    matricule: 'AMN-AGT-CPT-01',
    nom: 'MWAMINI',
    prenom: 'Francine',
    email: 'comptable@ets-amani.cd',
    telephone: '+243 821 777 888',
    role: 'agent',
    agentCategory: 'comptable',
    agenceId: 'ag-1',
    agenceNom: 'Siège Central Goma',
    statut: 'actif',
    dateCreation: '2025-02-20',
    derniereConnexion: 'Hier à 17:40',
    notes: 'Comptabilité générale, états financiers et clôture journalière.'
  },
  {
    id: 'usr-8',
    matricule: 'AMN-AGT-GCH-01',
    nom: 'KAMBALE',
    prenom: 'Moïse',
    email: 'guichet.goma@ets-amani.cd',
    telephone: '+243 993 666 777',
    role: 'agent',
    agentCategory: 'guichetier',
    agenceId: 'ag-1',
    agenceNom: 'Siège Central Goma',
    statut: 'actif',
    dateCreation: '2025-02-22',
    derniereConnexion: 'Aujourd\'hui à 11:30',
    notes: 'Encaissement et décaissement guichet physique.'
  },
  {
    id: 'usr-9',
    matricule: 'AMN-AGT-CHG-01',
    nom: 'KAVIRA',
    prenom: 'Solange',
    email: 'change@ets-amani.cd',
    telephone: '+243 819 000 111',
    role: 'agent',
    agentCategory: 'agent_de_change',
    agenceId: 'ag-1',
    agenceNom: 'Siège Central Goma',
    statut: 'actif',
    dateCreation: '2025-03-01',
    derniereConnexion: 'Aujourd\'hui à 10:45',
    notes: 'Opérations de change manuel USD / CDF / EUR.'
  },
  {
    id: 'usr-10',
    matricule: 'AMN-MEM-0042',
    nom: 'BARAKA',
    prenom: 'David',
    email: 'david.baraka@gmail.com',
    telephone: '+243 971 234 567',
    role: 'membre',
    statut: 'actif',
    dateCreation: '2025-02-05',
    derniereConnexion: 'Aujourd\'hui à 07:20',
    notes: 'Membre actif titulaire d\'un compte épargne et crédit commercial.'
  },
  {
    id: 'usr-11',
    matricule: 'AMN-REQ-0089',
    nom: 'NEEMA',
    prenom: 'Grace',
    email: 'grace.neema@outlook.fr',
    telephone: '+243 899 432 109',
    role: 'requerant_membre',
    statut: 'en_attente',
    dateCreation: '2025-03-08',
    derniereConnexion: 'Hier à 14:10',
    notes: 'Dossier d\'adhésion en cours de vérification des pièces d\'identité.'
  }
];

export const INITIAL_AGENCES: Agence[] = [
  {
    id: 'ag-1',
    code: 'AG-GOM-01',
    nom: 'Siège Central Goma',
    ville: 'Goma',
    adresse: '14, Boulevard Kanyamuhanga, Quartier Les Volcans',
    telephone: '+243 998 100 001',
    chefAgenceId: 'usr-4',
    chefAgenceNom: 'Claude MUMBERE',
    statut: 'active',
    dateOuverture: '2020-04-15',
    nbEmployes: 18,
    soldeCaisseCDF: 48500000,
    soldeCaisseUSD: 142500
  },
  {
    id: 'ag-2',
    code: 'AG-KIN-01',
    nom: 'Agence Kinshasa Gombe',
    ville: 'Kinshasa',
    adresse: 'Avenue du Port, Immeuble Horizon 3e étage',
    telephone: '+243 818 200 002',
    chefAgenceId: 'usr-chef-kin',
    chefAgenceNom: 'Michel ILUNGA',
    statut: 'active',
    dateOuverture: '2022-09-01',
    nbEmployes: 12,
    soldeCaisseCDF: 85200000,
    soldeCaisseUSD: 230000
  },
  {
    id: 'ag-3',
    code: 'AG-BUK-01',
    nom: 'Agence Bukavu Ibanda',
    ville: 'Bukavu',
    adresse: 'Avenue Patrice Lumumba, Rond-point ISP',
    telephone: '+243 978 300 003',
    chefAgenceId: 'usr-chef-buk',
    chefAgenceNom: 'Arlette CIZA',
    statut: 'active',
    dateOuverture: '2023-03-10',
    nbEmployes: 8,
    soldeCaisseCDF: 29400000,
    soldeCaisseUSD: 68900
  },
  {
    id: 'ag-4',
    code: 'AG-LUB-01',
    nom: 'Agence Lubumbashi Centre',
    ville: 'Lubumbashi',
    adresse: 'Croisement Chaussée L.D. Kabila & Avenue Kasa-Vubu',
    telephone: '+243 858 400 004',
    chefAgenceId: 'usr-chef-lub',
    chefAgenceNom: 'Patrick TSHIBANGU',
    statut: 'active',
    dateOuverture: '2024-01-20',
    nbEmployes: 9,
    soldeCaisseCDF: 62100000,
    soldeCaisseUSD: 115400
  },
  {
    id: 'ag-5',
    code: 'AG-BEN-01',
    nom: 'Agence Beni Mutinga',
    ville: 'Beni',
    adresse: 'Boulevard Nyamwisi, Quartier Commercial',
    telephone: '+243 990 500 005',
    chefAgenceId: 'usr-chef-ben',
    chefAgenceNom: 'Jonas KAKULE',
    statut: 'active',
    dateOuverture: '2024-07-15',
    nbEmployes: 5,
    soldeCaisseCDF: 17800000,
    soldeCaisseUSD: 41200
  }
];

export const INITIAL_SMS_RULES: SmsDetectionRule[] = [
  {
    id: 'rule-1',
    operateur: 'Vodacom',
    nomRegle: 'M-Pesa RDC Dépôt/Transfert Cash',
    simSlot: 'SIM 1',
    expediteurOfficiel: 'M-PESA',
    patternMontant: '(\\d+([.,]\\d+)?)\\s*(USD|CDF)',
    patternReference: '([A-Z0-9]{8,12})',
    patternExpediteur: 'de\\s+([A-Za-z\\s]+)',
    autoRapprochement: true,
    actif: true
  },
  {
    id: 'rule-2',
    operateur: 'Airtel',
    nomRegle: 'Airtel Money Réception & Transferts',
    simSlot: 'SIM 2',
    expediteurOfficiel: 'AirtelMoney',
    patternMontant: 'recu\\s+(\\d+([.,]\\d+)?)\\s*(USD|CDF)',
    patternReference: 'Txn\\s*Id:?\\s*([A-Z0-9]+)',
    patternExpediteur: 'provenant\\s+de\\s+([A-Za-z0-9\\s]+)',
    autoRapprochement: true,
    actif: true
  },
  {
    id: 'rule-3',
    operateur: 'Orange',
    nomRegle: 'Orange Money Dépôts Automatisés',
    simSlot: 'SIM 3',
    expediteurOfficiel: 'OrangeMoney',
    patternMontant: 'somme\\s+de\\s+(\\d+([.,]\\d+)?)\\s*(USD|CDF)',
    patternReference: 'Ref:?\\s*([A-Z0-9]+)',
    patternExpediteur: 'par\\s+([A-Za-z\\s]+)',
    autoRapprochement: true,
    actif: true
  }
];

export const INITIAL_SMS_TRANSACTIONS: SmsTransaction[] = [
  {
    id: 'sms-01',
    operateur: 'Vodacom',
    expediteur: 'M-PESA',
    messageBrut: 'Trans. ID MP250910.0911 Vous avez recu 450.00 USD de BARAKA David (+243971234567). Nouveau solde: 18,240.50 USD.',
    montant: 450,
    devise: 'USD',
    referenceTransaction: 'MP250910.0911',
    dateReception: '2026-09-10 09:11:22',
    statut: 'rapproche',
    operationLieeId: 'op-01',
    simAttribuee: 'SIM 1 (+243 810 001 001)'
  },
  {
    id: 'sms-02',
    operateur: 'Airtel',
    expediteur: 'AirtelMoney',
    messageBrut: 'Txn Id: AM778210 recu 280000 CDF provenant de KAHINDO Marie (+243991827364). Solde CDF: 14,890,000 CDF.',
    montant: 280000,
    devise: 'CDF',
    referenceTransaction: 'AM778210',
    dateReception: '2026-09-10 09:34:05',
    statut: 'rapproche',
    operationLieeId: 'op-02',
    simAttribuee: 'SIM 2 (+243 970 002 002)'
  },
  {
    id: 'sms-03',
    operateur: 'Vodacom',
    expediteur: 'M-PESA',
    messageBrut: 'Trans. ID MP250910.1045 Vous avez recu 1,200.00 USD de COOPAGRO RDC (+243818999888). Nouveau solde: 19,440.50 USD.',
    montant: 1200,
    devise: 'USD',
    referenceTransaction: 'MP250910.1045',
    dateReception: '2026-09-10 10:45:10',
    statut: 'en_attente',
    simAttribuee: 'SIM 1 (+243 810 001 001)'
  },
  {
    id: 'sms-04',
    operateur: 'Orange',
    expediteur: 'OrangeMoney',
    messageBrut: 'Ref: OM990145 somme de 750000 CDF versee par KAKULE Prince. Erreur hash validation terminal.',
    montant: 750000,
    devise: 'CDF',
    referenceTransaction: 'OM990145',
    dateReception: '2026-09-10 08:15:00',
    statut: 'anomalie',
    simAttribuee: 'SIM 3 (+243 890 003 003)'
  }
];

export const INITIAL_OPERATIONS: FinancialOperation[] = [
  {
    id: 'op-01',
    reference: 'OP-20260910-001',
    type: 'depot',
    montant: 450,
    devise: 'USD',
    date: '2026-09-10 09:12',
    agenceId: 'ag-1',
    agenceNom: 'Siège Central Goma',
    agentId: 'usr-6',
    agentNom: 'Henri PALUKU (Polyvalent)',
    clientId: 'usr-10',
    clientNom: 'David BARAKA',
    statut: 'validee',
    modeReglement: 'm_pesa',
    motif: 'Alimentation compte d\'épargne',
    smsRapprocheId: 'sms-01'
  },
  {
    id: 'op-02',
    reference: 'OP-20260910-002',
    type: 'depot',
    montant: 280000,
    devise: 'CDF',
    date: '2026-09-10 09:35',
    agenceId: 'ag-1',
    agenceNom: 'Siège Central Goma',
    agentId: 'usr-8',
    agentNom: 'Moïse KAMBALE (Guichet)',
    clientId: 'cli-02',
    clientNom: 'Marie KAHINDO',
    statut: 'validee',
    modeReglement: 'airtel_money',
    motif: 'Dépôt sécurisé guichet',
    smsRapprocheId: 'sms-02'
  },
  {
    id: 'op-03',
    reference: 'OP-20260910-003',
    type: 'change',
    montant: 500,
    devise: 'USD',
    tauxChange: 2850,
    contreValeur: 1425000,
    date: '2026-09-10 10:15',
    agenceId: 'ag-1',
    agenceNom: 'Siège Central Goma',
    agentId: 'usr-6',
    agentNom: 'Henri PALUKU (Polyvalent)',
    clientId: 'cli-03',
    clientNom: 'Salomon MUHINDO',
    statut: 'validee',
    modeReglement: 'especes',
    motif: 'Achat devises USD vers CDF'
  },
  {
    id: 'op-04',
    reference: 'OP-20260910-004',
    type: 'depense',
    montant: 180,
    devise: 'USD',
    date: '2026-09-10 10:30',
    agenceId: 'ag-1',
    agenceNom: 'Siège Central Goma',
    agentId: 'usr-7',
    agentNom: 'Francine MWAMINI (Comptable)',
    statut: 'validee',
    modeReglement: 'especes',
    motif: 'Carburant groupe électrogène & maintenance réseau fibre'
  },
  {
    id: 'op-05',
    reference: 'OP-20260910-005',
    type: 'retrait',
    montant: 300,
    devise: 'USD',
    date: '2026-09-10 11:00',
    agenceId: 'ag-1',
    agenceNom: 'Siège Central Goma',
    agentId: 'usr-8',
    agentNom: 'Moïse KAMBALE (Guichet)',
    clientId: 'usr-10',
    clientNom: 'David BARAKA',
    statut: 'validee',
    modeReglement: 'especes',
    motif: 'Retrait d\'épargne espèces au guichet'
  }
];

export const INITIAL_PAYROLL: EmployeePayroll[] = [
  {
    id: 'pay-01',
    userId: 'usr-4',
    userNom: 'Claude MUMBERE',
    matricule: 'AMN-AG-GOM-01',
    poste: 'Chef d\'Agence',
    agenceNom: 'Siège Central Goma',
    mois: 'Août 2026',
    salaireBaseUSD: 1200,
    primesUSD: 250,
    retenuesUSD: 60,
    netPayerUSD: 1390,
    statut: 'paye',
    datePaiement: '2026-08-30'
  },
  {
    id: 'pay-02',
    userId: 'usr-5',
    userNom: 'Dorcas BAHATI',
    matricule: 'AMN-ADM-001',
    poste: 'Assistant Administratif',
    agenceNom: 'Direction Générale',
    mois: 'Août 2026',
    salaireBaseUSD: 750,
    primesUSD: 100,
    retenuesUSD: 35,
    netPayerUSD: 815,
    statut: 'paye',
    datePaiement: '2026-08-30'
  },
  {
    id: 'pay-03',
    userId: 'usr-6',
    userNom: 'Henri PALUKU',
    matricule: 'AMN-AGT-POL-01',
    poste: 'Agent Polyvalent',
    agenceNom: 'Siège Central Goma',
    mois: 'Août 2026',
    salaireBaseUSD: 650,
    primesUSD: 150,
    retenuesUSD: 30,
    netPayerUSD: 770,
    statut: 'paye',
    datePaiement: '2026-08-30'
  },
  {
    id: 'pay-04',
    userId: 'usr-7',
    userNom: 'Francine MWAMINI',
    matricule: 'AMN-AGT-CPT-01',
    poste: 'Comptable',
    agenceNom: 'Siège Central Goma',
    mois: 'Août 2026',
    salaireBaseUSD: 850,
    primesUSD: 120,
    retenuesUSD: 40,
    netPayerUSD: 930,
    statut: 'paye',
    datePaiement: '2026-08-30'
  },
  {
    id: 'pay-05',
    userId: 'usr-8',
    userNom: 'Moïse KAMBALE',
    matricule: 'AMN-AGT-GCH-01',
    poste: 'Guichetier',
    agenceNom: 'Siège Central Goma',
    mois: 'Août 2026',
    salaireBaseUSD: 550,
    primesUSD: 80,
    retenuesUSD: 25,
    netPayerUSD: 605,
    statut: 'paye',
    datePaiement: '2026-08-30'
  }
];

export const INITIAL_ANNOUNCEMENTS: InternalAnnouncement[] = [
  {
    id: 'ann-1',
    titre: 'Mise à jour organisationnelle : Adoption des nouveaux rôles & modules 2026',
    contenu: 'Chers collaborateurs de Ets AMANI, nous officialisons le déploiement de la hiérarchie harmonisée, du rôle Directeur Adjoint, Assistant Administratif et de la catégorie Agent Polyvalent. Tous les services restent connectés et efficaces.',
    auteurNom: 'Justin AMANI',
    auteurRole: 'directeur_general',
    date: '2026-09-09',
    priorite: 'urgente',
    cible: 'tous',
    luPar: ['usr-1', 'usr-3', 'usr-4', 'usr-6']
  },
  {
    id: 'ann-2',
    titre: 'Consignes de clôture de caisse et réconciliation SMS Mobile Money',
    contenu: 'Rappel pour tous les chefs d\'agences et agents polyvalents : tout dépôt M-Pesa, Airtel Money ou Orange Money doit être rapproché avec le SMS opérateur avant validation définitive du solde de fermeture.',
    auteurNom: 'Alain KASEREKA',
    auteurRole: 'administrateur_systeme',
    date: '2026-09-08',
    priorite: 'normale',
    cible: 'agents',
    luPar: ['usr-4', 'usr-6', 'usr-8']
  }
];

export const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-01',
    horodatage: '2026-09-10 11:15:30',
    type: 'modification_role',
    utilisateur: 'Alain KASEREKA (Admin Système)',
    role: 'administrateur_systeme',
    action: 'Affectation catégorie métier',
    details: 'Attribution de la spécialisation "agent_polyvalent" à l\'agent Henri PALUKU (usr-6)',
    adresseIp: '197.234.218.44',
    gravite: 'info'
  },
  {
    id: 'log-02',
    horodatage: '2026-09-10 10:45:12',
    type: 'anomalie',
    utilisateur: 'Système SMS Gateway',
    role: 'administrateur_systeme',
    action: 'Détection anomalie Orange Money',
    details: 'Transaction OM990145 non réconciliée, montant 750,000 CDF en attente d\'attribution manuelle',
    adresseIp: '127.0.0.1 (Service interne)',
    gravite: 'avertissement'
  },
  {
    id: 'log-03',
    horodatage: '2026-09-10 09:42:01',
    type: 'connexion',
    utilisateur: 'Alain KASEREKA',
    role: 'administrateur_systeme',
    action: 'Connexion réussie console Admin Système',
    details: 'Authentification 2FA validée depuis Terminal Siège Goma',
    adresseIp: '197.234.218.44',
    gravite: 'info'
  },
  {
    id: 'log-04',
    horodatage: '2026-09-10 08:30:15',
    type: 'connexion',
    utilisateur: 'Justin AMANI',
    role: 'directeur_general',
    action: 'Ouverture session Direction Générale',
    details: 'Accès au tableau de bord exécutif et reporting multi-agences',
    adresseIp: '197.234.218.40',
    gravite: 'info'
  }
];

export const INITIAL_DEVICES: ConnectedDevice[] = [
  {
    id: 'dev-1',
    userId: 'usr-1',
    userNom: 'Alain KASEREKA',
    appareil: 'ThinkPad T14s Pro',
    systeme: 'Ubuntu Linux 24.04',
    navigateur: 'Chrome 128 Enterprise',
    adresseIp: '197.234.218.44',
    derniereSynchro: 'Il y a 2 min',
    statut: 'en_ligne',
    autorise: true,
    appVersion: 'v2.4.0-prod'
  },
  {
    id: 'dev-2',
    userId: 'usr-6',
    userNom: 'Henri PALUKU (Polyvalent)',
    appareil: 'Samsung Galaxy Tab Active 4 Pro',
    systeme: 'Android 14',
    navigateur: 'Amani Mobile Client / Web',
    adresseIp: '197.234.218.89',
    derniereSynchro: 'Il y a 10 min',
    statut: 'en_ligne',
    autorise: true,
    appVersion: 'v2.4.0-prod'
  },
  {
    id: 'dev-3',
    userId: 'usr-8',
    userNom: 'Moïse KAMBALE (Guichet)',
    appareil: 'Dell OptiPlex 7090 Terminal Guichet 1',
    systeme: 'Windows 11 Pro',
    navigateur: 'Edge 128',
    adresseIp: '192.168.10.15 (LAN)',
    derniereSynchro: 'Il y a 1 min',
    statut: 'en_ligne',
    autorise: true,
    appVersion: 'v2.4.0-prod'
  },
  {
    id: 'dev-4',
    userId: 'usr-unknown',
    userNom: 'Tentative inconnue',
    appareil: 'Infinix Hot 12',
    systeme: 'Android 12',
    navigateur: 'Opera Mini',
    adresseIp: '41.243.12.98 (Kinshasa)',
    derniereSynchro: 'Hier à 22:14',
    statut: 'suspect',
    autorise: false,
    appVersion: 'v1.8.0-obsolete'
  }
];

export const INITIAL_TASKS: AssignedTask[] = [
  {
    id: 'task-1',
    titre: 'Clôture comptable journalière Siège Goma',
    description: 'Vérifier la concordance entre le solde physique USD/CDF et les reçus de caisse.',
    assigneA: 'Henri PALUKU',
    categorie: 'agent_polyvalent',
    priorite: 'haute',
    statut: 'en_cours',
    dateEcheance: '2026-09-10'
  },
  {
    id: 'task-2',
    titre: 'Rapprochement des bordereaux Airtel Money',
    description: 'Identifier les 3 transactions entrantes signalées par SMS non rattachées aux fiches clients.',
    assigneA: 'Henri PALUKU',
    categorie: 'agent_polyvalent',
    priorite: 'moyenne',
    statut: 'a_faire',
    dateEcheance: '2026-09-11'
  },
  {
    id: 'task-3',
    titre: 'Maintenance groupe électrogène & logistique agence',
    description: 'Contrôle des niveaux d\'huile et approvisionnement 100L gasoil pour la réserve.',
    assigneA: 'Henri PALUKU',
    categorie: 'agent_polyvalent',
    priorite: 'moyenne',
    statut: 'terminee',
    dateEcheance: '2026-09-09'
  }
];

export const INITIAL_MEMBERSHIP_REQUESTS: MembershipRequest[] = [
  {
    id: 'req-01',
    requerantNom: 'NEEMA',
    prenom: 'Grace',
    email: 'grace.neema@outlook.fr',
    telephone: '+243 899 432 109',
    adresse: 'Beni, Q. Malepe Avenue du Marché n°4',
    typeMembreSouhaite: 'individuel',
    dateDemande: '2026-09-08',
    statut: 'en_analyse',
    documents: [
      { nom: 'Carte d\'électeur / Passeport', statut: 'fourni' },
      { nom: 'Attestation de résidence', statut: 'fourni' },
      { nom: 'Photo d\'identité récente', statut: 'fourni' },
      { nom: 'Justificatif d\'activité économique', statut: 'fourni' }
    ],
    commentaires: 'Dossier complet, en attente de validation finale par l\'Assistant Administratif.'
  },
  {
    id: 'req-02',
    requerantNom: 'KAVUGHO',
    prenom: 'Esther',
    email: 'esther.kav@yahoo.com',
    telephone: '+243 972 119 900',
    adresse: 'Goma, Q. Katindo Avenue de la Paix',
    typeMembreSouhaite: 'cooperative',
    dateDemande: '2026-09-09',
    statut: 'en_attente_documents',
    documents: [
      { nom: 'Statuts notariés coopérative', statut: 'fourni' },
      { nom: 'PV Assemblée Générale', statut: 'manquant' },
      { nom: 'Identité des mandataires', statut: 'fourni' }
    ],
    commentaires: 'Il manque le PV de la dernière AG avec signature des 3 mandataires autorisés.'
  }
];

export const PERMISSIONS_MATRIX: Permission[] = [
  {
    id: 'p-1',
    nom: 'Gestion des rôles et sécurité système',
    code: 'SYSTEM_ROLES_SECURITY',
    module: 'Sécurité & RBAC',
    description: 'Attribuer ou révoquer les 8 rôles officiels et modifier les règles de protection.',
    rolesAutorises: ['administrateur_systeme']
  },
  {
    id: 'p-2',
    nom: 'Configuration SMS Gateways & SIMs',
    code: 'SMS_GATEWAY_CONFIG',
    module: 'Opérateurs Mobile',
    description: 'Enregistrer des numéros de détection, cartes SIM internes et règles regex de détection.',
    rolesAutorises: ['administrateur_systeme']
  },
  {
    id: 'p-3',
    nom: 'Supervision Administration & Personnel DG',
    code: 'DG_ADMIN_PERSONNEL',
    module: 'Administration Générale',
    description: 'Organigramme, fiches de paie, suivi des salaires, annonces globales et audits d\'agences.',
    rolesAutorises: ['administrateur_systeme', 'directeur_general']
  },
  {
    id: 'p-4',
    nom: 'Supervision Opérationnelle & Rapports Globaux',
    code: 'EXECUTIVE_SUPERVISION',
    module: 'Direction Opérationnelle',
    description: 'Consulter les synthèses multi-agences, indicateurs financiers globaux et alertes.',
    rolesAutorises: ['administrateur_systeme', 'directeur_general', 'directeur_adjoint']
  },
  {
    id: 'p-5',
    nom: 'Traitement Dossiers & Requêtes Membres',
    code: 'ADMIN_DOSSIERS_MEMBRES',
    module: 'Secrétariat & Support',
    description: 'Vérification des pièces des requérants, transmission à la direction et attestations.',
    rolesAutorises: ['administrateur_systeme', 'directeur_general', 'assistant_administratif']
  },
  {
    id: 'p-6',
    nom: 'Validation Caisses & Clôtures d\'Agence',
    code: 'AGENCY_CASH_CLOSURE',
    module: 'Agence Locale',
    description: 'Valider les clôtures journalières, dépenses locales et approbations de caisse.',
    rolesAutorises: ['administrateur_systeme', 'chef_agence']
  },
  {
    id: 'p-7',
    nom: 'Exécution des Opérations Guichet / Change / Caisse',
    code: 'FINANCIAL_TRANSACTIONS',
    module: 'Opérations Financières',
    description: 'Saisie des dépôts, retraits, opérations de change de devises et réconciliations.',
    rolesAutorises: ['administrateur_systeme', 'chef_agence', 'agent']
  },
  {
    id: 'p-8',
    nom: 'Consultation Espace Personnel Membre',
    code: 'MEMBER_PORTAL',
    module: 'Espace Adhérent',
    description: 'Consulter ses soldes, relevés et introduire des demandes de crédit.',
    rolesAutorises: ['administrateur_systeme', 'membre']
  }
];

export const INITIAL_COMMISSIONS: CommercialCommission[] = [
  {
    id: 'comm-1',
    titre: 'Transfert Inter-Provinces National',
    tauxPourcentage: 1.5,
    montantFixeUSD: 0,
    montantFixeCDF: 0,
    service: 'transfert',
    operateur: 'Tous',
    zoneGeographique: 'National (RDC)',
    pays: 'RDC',
    estPromotion: false,
    statut: 'active',
    dateDebut: '2025-01-01',
    dateFin: '2025-12-31',
    creeParId: 'usr-2',
    creeParNom: 'Justin AMANI (DG)',
    historiqueModifications: [
      {
        date: '2025-01-01 08:00',
        auteurNom: 'Justin AMANI',
        auteurRole: 'directeur_general',
        champsModifies: 'Création initiale de la grille nationale 1.5%',
        motif: 'Alignement sur la stratégie tarifaire 2025'
      }
    ]
  },
  {
    id: 'comm-2',
    titre: 'Dépôt / Retrait Mobile Money (M-Pesa / Airtel)',
    tauxPourcentage: 1.0,
    montantFixeUSD: 0.5,
    service: 'mobile_money',
    operateur: 'Vodacom',
    zoneGeographique: 'Nord-Kivu & Sud-Kivu',
    agenceId: 'ag-goma-01',
    agenceNom: 'Agence Principale de Goma',
    pays: 'RDC',
    estPromotion: false,
    statut: 'active',
    dateDebut: '2025-02-01',
    dateFin: '2025-12-31',
    creeParId: 'usr-2',
    creeParNom: 'Justin AMANI (DG)',
    historiqueModifications: [
      {
        date: '2025-02-01 09:30',
        auteurNom: 'Justin AMANI',
        auteurRole: 'directeur_general',
        champsModifies: 'Taux 1% + 0.5 USD fixe',
        motif: 'Tarif négocié pour la zone est'
      }
    ]
  },
  {
    id: 'comm-3',
    titre: 'Change Préférentiel USD/CDF Grands Comptes',
    tauxPourcentage: 0.8,
    service: 'change',
    operateur: 'Tous',
    zoneGeographique: 'Kinshasa',
    agenceId: 'ag-kin-01',
    agenceNom: 'Agence Gombe - Kinshasa',
    pays: 'RDC',
    estPromotion: true,
    statut: 'active',
    dateDebut: '2025-03-01',
    dateFin: '2025-06-30',
    creeParId: 'usr-2',
    creeParNom: 'Justin AMANI (DG)',
    historiqueModifications: [
      {
        date: '2025-03-01 10:00',
        auteurNom: 'Justin AMANI',
        auteurRole: 'directeur_general',
        champsModifies: 'Promotion trimestrielle 0.8%',
        motif: 'Offre promotionnelle fidélisation entreprises'
      }
    ]
  }
];

