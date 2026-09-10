import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  AgentCategory,
  Agence,
  FinancialOperation,
  SmsDetectionRule,
  SmsTransaction,
  EmployeePayroll,
  InternalAnnouncement,
  SecurityAuditLog,
  ConnectedDevice,
  AssignedTask,
  MembershipRequest,
  CommercialCommission,
  SyncStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_AGENCES,
  INITIAL_SMS_RULES,
  INITIAL_SMS_TRANSACTIONS,
  INITIAL_OPERATIONS,
  INITIAL_PAYROLL,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DEVICES,
  INITIAL_TASKS,
  INITIAL_MEMBERSHIP_REQUESTS,
  INITIAL_COMMISSIONS,
  PERMISSIONS_MATRIX
} from '../data/initialData';
import { localDb } from '../services/db';
import { syncService, SyncServiceState } from '../services/SyncService';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  agences: Agence[];
  smsRules: SmsDetectionRule[];
  smsTransactions: SmsTransaction[];
  operations: FinancialOperation[];
  commissions: CommercialCommission[];
  payroll: EmployeePayroll[];
  announcements: InternalAnnouncement[];
  auditLogs: SecurityAuditLog[];
  devices: ConnectedDevice[];
  tasks: AssignedTask[];
  membershipRequests: MembershipRequest[];

  // Offline-First & Sync state
  isOnline: boolean;
  isSimulatedOffline: boolean;
  syncStatus: SyncStatus;
  pendingSyncCount: number;
  lastSyncTime: Date | null;
  syncError: string | null;
  triggerManualSync: () => Promise<void>;
  toggleSimulatedOffline: () => boolean;

  // Commercial Commissions (Gouvernance DG)
  createCommission: (comm: Omit<CommercialCommission, 'id' | 'historiqueModifications'>, reason: string) => void;
  updateCommission: (id: string, updates: Partial<CommercialCommission>, reason: string) => void;
  toggleCommissionStatus: (id: string, newStatus: 'active' | 'suspendue' | 'expiree', reason: string) => void;

  // User Actions
  switchUser: (userId: string) => void;
  createUser: (userData: Partial<User>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  suspendUser: (id: string) => void;
  reactivateUser: (id: string) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string) => string;
  assignUserRole: (id: string, role: UserRole, category?: AgentCategory) => void;

  // Agence Actions
  createAgence: (data: Partial<Agence>) => void;
  updateAgence: (id: string, updates: Partial<Agence>) => void;
  toggleAgenceStatus: (id: string) => void;

  // Operations & Financials
  addOperation: (op: Omit<FinancialOperation, 'id' | 'reference' | 'date'>) => void;
  validateOperation: (id: string) => void;

  // SMS & Detection
  toggleSmsRule: (id: string) => void;
  addSmsRule: (rule: Omit<SmsDetectionRule, 'id'>) => void;
  reconcileSms: (smsId: string, operationId: string) => void;
  simulateIncomingSms: (operateur: 'Vodacom' | 'Airtel' | 'Orange', message: string, montant: number, devise: 'USD' | 'CDF') => void;

  // Payroll
  markPayrollPaid: (id: string) => void;

  // Announcements & Tasks
  broadcastAnnouncement: (ann: Omit<InternalAnnouncement, 'id' | 'date' | 'luPar'>) => void;
  updateTaskStatus: (taskId: string, statut: 'a_faire' | 'en_cours' | 'terminee') => void;
  addTask: (task: Omit<AssignedTask, 'id'>) => void;

  // Membership requests
  updateMembershipStatus: (id: string, status: 'en_analyse' | 'approuve' | 'rejete', comment?: string) => void;

  // Devices & Audit
  toggleDeviceAuthorization: (deviceId: string) => void;
  hasPermission: (permissionCode: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ets_amani_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('ets_amani_current_user_id') || 'usr-1'; // Default: Administrateur Système
  });

  const [agences, setAgences] = useState<Agence[]>(() => {
    const saved = localStorage.getItem('ets_amani_agences');
    return saved ? JSON.parse(saved) : INITIAL_AGENCES;
  });

  const [smsRules, setSmsRules] = useState<SmsDetectionRule[]>(() => {
    const saved = localStorage.getItem('ets_amani_sms_rules');
    return saved ? JSON.parse(saved) : INITIAL_SMS_RULES;
  });

  const [smsTransactions, setSmsTransactions] = useState<SmsTransaction[]>(() => {
    const saved = localStorage.getItem('ets_amani_sms_tx');
    return saved ? JSON.parse(saved) : INITIAL_SMS_TRANSACTIONS;
  });

  const [operations, setOperations] = useState<FinancialOperation[]>(() => {
    const saved = localStorage.getItem('ets_amani_operations');
    return saved ? JSON.parse(saved) : INITIAL_OPERATIONS;
  });

  const [commissions, setCommissions] = useState<CommercialCommission[]>(() => {
    const saved = localStorage.getItem('ets_amani_commissions');
    return saved ? JSON.parse(saved) : INITIAL_COMMISSIONS;
  });

  const [payroll, setPayroll] = useState<EmployeePayroll[]>(() => {
    const saved = localStorage.getItem('ets_amani_payroll');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [announcements, setAnnouncements] = useState<InternalAnnouncement[]>(() => {
    const saved = localStorage.getItem('ets_amani_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    const saved = localStorage.getItem('ets_amani_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [devices, setDevices] = useState<ConnectedDevice[]>(() => {
    const saved = localStorage.getItem('ets_amani_devices');
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [tasks, setTasks] = useState<AssignedTask[]>(() => {
    const saved = localStorage.getItem('ets_amani_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>(() => {
    const saved = localStorage.getItem('ets_amani_requests');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERSHIP_REQUESTS;
  });

  // Offline-First Sync Service State
  const [syncState, setSyncState] = useState<SyncServiceState>(syncService.getState());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Sync listener setup
  useEffect(() => {
    const updatePending = async () => {
      const count = await syncService.getPendingCount();
      setPendingSyncCount(count);
    };

    updatePending();
    const unsubscribe = syncService.subscribe(newState => {
      setSyncState(newState);
      updatePending();
    });

    const interval = setInterval(updatePending, 5000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Sync to localStorage and local Dexie
  useEffect(() => {
    localStorage.setItem('ets_amani_commissions', JSON.stringify(commissions));
    try {
      localDb.commissions.bulkPut(commissions);
    } catch {}
  }, [commissions]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ets_amani_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('ets_amani_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('ets_amani_agences', JSON.stringify(agences));
  }, [agences]);

  useEffect(() => {
    localStorage.setItem('ets_amani_sms_rules', JSON.stringify(smsRules));
  }, [smsRules]);

  useEffect(() => {
    localStorage.setItem('ets_amani_sms_tx', JSON.stringify(smsTransactions));
  }, [smsTransactions]);

  useEffect(() => {
    localStorage.setItem('ets_amani_operations', JSON.stringify(operations));
  }, [operations]);

  useEffect(() => {
    localStorage.setItem('ets_amani_payroll', JSON.stringify(payroll));
  }, [payroll]);

  useEffect(() => {
    localStorage.setItem('ets_amani_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('ets_amani_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('ets_amani_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('ets_amani_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ets_amani_requests', JSON.stringify(membershipRequests));
  }, [membershipRequests]);

  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0];

  const addAuditEntry = (
    action: string,
    details: string,
    gravite: 'info' | 'avertissement' | 'critique' = 'info',
    resource?: string,
    resourceId?: string,
    reason?: string
  ) => {
    const newLog: SecurityAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      horodatage: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'securite',
      utilisateur: `${currentUser.prenom} ${currentUser.nom} (${currentUser.role})`,
      role: currentUser.role,
      action,
      details,
      adresseIp: '197.234.218.44 (IndexedDB)',
      gravite,
      actorId: currentUser.id,
      actorRole: currentUser.role,
      resource,
      resourceId,
      agencyId: currentUser.agenceId,
      timestamp: Date.now(),
      reason
    };
    setAuditLogs(prev => [newLog, ...prev]);
    try {
      localDb.auditLogs.put(newLog);
      syncService.enqueue('audit_logs', newLog.id, 'create', newLog, currentUser.id, currentUser.role, currentUser.agenceId);
    } catch {}
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      addAuditEntry('Changement de session / Simulation', `Bascule vers l'utilisateur ${target.prenom} ${target.nom} (${target.role})`, 'info');
    }
  };

  const createUser = (userData: Partial<User>) => {
    const newId = `usr-${Date.now().toString().slice(-4)}`;
    const matricule = `AMN-${userData.role?.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newUser: User = {
      id: newId,
      matricule,
      nom: userData.nom || 'NOUVEAU',
      prenom: userData.prenom || 'Utilisateur',
      email: userData.email || `${newId}@ets-amani.cd`,
      telephone: userData.telephone || '+243 000 000 000',
      role: userData.role || 'agent',
      agentCategory: userData.agentCategory,
      agenceId: userData.agenceId,
      agenceNom: userData.agenceNom,
      statut: userData.statut || 'actif',
      dateCreation: new Date().toISOString().split('T')[0],
      derniereConnexion: 'Jamais connecté',
      notes: userData.notes || 'Compte créé par l\'Administrateur Système'
    };

    setAllUsers(prev => [newUser, ...prev]);
    addAuditEntry('Création utilisateur', `Création du compte ${newUser.prenom} ${newUser.nom} avec rôle ${newUser.role}`, 'info');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    addAuditEntry('Mise à jour utilisateur', `Modification du compte ID ${id}`, 'info');
  };

  const suspendUser = (id: string) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, statut: 'suspendu' } : u));
    addAuditEntry('Suspension utilisateur', `Suspension administrative de l'utilisateur ${id}`, 'avertissement');
  };

  const reactivateUser = (id: string) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, statut: 'actif' } : u));
    addAuditEntry('Réactivation utilisateur', `Réactivation du compte ${id}`, 'info');
  };

  const deleteUser = (id: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== id));
    addAuditEntry('Suppression utilisateur', `Suppression définitive du compte ID ${id}`, 'critique');
  };

  const resetUserPassword = (id: string): string => {
    const tempPass = `Amani@${Math.floor(1000 + Math.random() * 9000)}!`;
    addAuditEntry('Réinitialisation mot de passe', `Nouveau mot de passe temporaire généré pour l'utilisateur ID ${id}`, 'avertissement');
    return tempPass;
  };

  const assignUserRole = (id: string, role: UserRole, category?: AgentCategory) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          role,
          agentCategory: role === 'agent' ? category : undefined
        };
      }
      return u;
    }));
    addAuditEntry('Attribution rôle', `Attribution du rôle ${role}${category ? ` (${category})` : ''} à l'utilisateur ${id}`, 'avertissement');
  };

  const createAgence = (data: Partial<Agence>) => {
    const newId = `ag-${Date.now().toString().slice(-4)}`;
    const code = `AG-${(data.ville || 'GOM').slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newAgence: Agence = {
      id: newId,
      code,
      nom: data.nom || 'Nouvelle Agence',
      ville: data.ville || 'Goma',
      adresse: data.adresse || 'Adresse à préciser',
      telephone: data.telephone || '+243 000 000 000',
      chefAgenceId: data.chefAgenceId,
      chefAgenceNom: data.chefAgenceNom,
      statut: 'active',
      dateOuverture: new Date().toISOString().split('T')[0],
      nbEmployes: data.nbEmployes || 1,
      soldeCaisseCDF: data.soldeCaisseCDF || 5000000,
      soldeCaisseUSD: data.soldeCaisseUSD || 10000
    };
    setAgences(prev => [...prev, newAgence]);
    addAuditEntry('Création agence', `Ouverture de l'agence ${newAgence.nom} (${newAgence.code})`, 'info');
  };

  const updateAgence = (id: string, updates: Partial<Agence>) => {
    setAgences(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    addAuditEntry('Modification agence', `Mise à jour des informations agence ${id}`, 'info');
  };

  const toggleAgenceStatus = (id: string) => {
    setAgences(prev => prev.map(a => {
      if (a.id === id) {
        const next = a.statut === 'active' ? 'fermee' : 'active';
        return { ...a, statut: next };
      }
      return a;
    }));
    addAuditEntry('Statut agence', `Changement de statut agence ${id}`, 'avertissement');
  };

  const addOperation = (op: Omit<FinancialOperation, 'id' | 'reference' | 'date'>) => {
    const newOp: FinancialOperation = {
      ...op,
      id: `op-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      reference: `OP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setOperations(prev => [newOp, ...prev]);

    // Offline-First: Write immediately to IndexedDB (Dexie) and enqueue for cloud sync
    try {
      localDb.operations.put(newOp);
      syncService.enqueue('operations', newOp.id, 'create', newOp, currentUser.id, currentUser.role, op.agenceId);
    } catch {}

    // Update agency cash balance
    setAgences(prev => prev.map(a => {
      if (a.id === op.agenceId) {
        const deltaUSD = op.devise === 'USD' ? (op.type === 'depot' ? op.montant : -op.montant) : 0;
        const deltaCDF = op.devise === 'CDF' ? (op.type === 'depot' ? op.montant : -op.montant) : 0;
        const updatedAgency = {
          ...a,
          soldeCaisseUSD: Math.max(0, a.soldeCaisseUSD + deltaUSD),
          soldeCaisseCDF: Math.max(0, a.soldeCaisseCDF + deltaCDF)
        };
        try {
          localDb.agences.put(updatedAgency);
        } catch {}
        return updatedAgency;
      }
      return a;
    }));

    addAuditEntry(
      'Opération financière (Offline-First)',
      `Enregistrement ${newOp.type} de ${newOp.montant} ${newOp.devise} (${newOp.reference}) dans le stockage local`,
      'info',
      'operations',
      newOp.id
    );
  };

  const validateOperation = (id: string) => {
    setOperations(prev => prev.map(o => {
      if (o.id === id) {
        const updated = { ...o, statut: 'validee' as const };
        try {
          localDb.operations.put(updated);
          syncService.enqueue('operations', id, 'update', updated, currentUser.id, currentUser.role, o.agenceId);
        } catch {}
        return updated;
      }
      return o;
    }));
    addAuditEntry('Validation transaction', `Validation définitive de l'opération ${id}`, 'info', 'operations', id);
  };

  // DG Commercial Commission Management (Section 1 & 8)
  const createCommission = (
    comm: Omit<CommercialCommission, 'id' | 'historiqueModifications'>,
    reason: string
  ) => {
    const newComm: CommercialCommission = {
      ...comm,
      id: `comm-${Date.now()}`,
      historiqueModifications: [
        {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          auteurNom: `${currentUser.prenom} ${currentUser.nom}`,
          auteurRole: currentUser.role,
          champsModifies: `Création commission "${comm.titre}" : ${comm.tauxPourcentage}% (${comm.service})`,
          motif: reason || 'Définition de la grille commerciale DG'
        }
      ]
    };

    setCommissions(prev => [newComm, ...prev]);
    try {
      localDb.commissions.put(newComm);
      syncService.enqueue('commissions', newComm.id, 'create', newComm, currentUser.id, currentUser.role, comm.agenceId);
    } catch {}

    addAuditEntry(
      'COMMISSION_CREATE',
      `Création de la règle de commission "${newComm.titre}" : ${newComm.tauxPourcentage}%`,
      'info',
      'commissions',
      newComm.id,
      reason
    );
  };

  const updateCommission = (
    id: string,
    updates: Partial<CommercialCommission>,
    reason: string
  ) => {
    setCommissions(prev => prev.map(c => {
      if (c.id === id) {
        const hist = [
          {
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            auteurNom: `${currentUser.prenom} ${currentUser.nom}`,
            auteurRole: currentUser.role,
            champsModifies: Object.keys(updates).join(', '),
            motif: reason || 'Ajustement commercial DG'
          },
          ...c.historiqueModifications
        ];
        const updated = { ...c, ...updates, historiqueModifications: hist };
        try {
          localDb.commissions.put(updated);
          syncService.enqueue('commissions', id, 'update', updated, currentUser.id, currentUser.role, c.agenceId);
        } catch {}
        return updated;
      }
      return c;
    }));

    addAuditEntry(
      'COMMISSION_UPDATE',
      `Mise à jour commission ${id} : ${Object.keys(updates).join(', ')}`,
      'info',
      'commissions',
      id,
      reason
    );
  };

  const toggleCommissionStatus = (
    id: string,
    newStatus: 'active' | 'suspendue' | 'expiree',
    reason: string
  ) => {
    updateCommission(id, { statut: newStatus }, reason);
  };

  const toggleSmsRule = (id: string) => {
    setSmsRules(prev => prev.map(r => r.id === id ? { ...r, actif: !r.actif } : r));
    addAuditEntry('Règle SMS Opérateur', `Modification de l'état de la règle ${id}`, 'info');
  };

  const addSmsRule = (rule: Omit<SmsDetectionRule, 'id'>) => {
    const newRule: SmsDetectionRule = {
      ...rule,
      id: `rule-${Date.now()}`
    };
    setSmsRules(prev => [...prev, newRule]);
    addAuditEntry('Nouvelle règle SMS', `Création règle détection ${rule.nomRegle} (${rule.operateur})`, 'info');
  };

  const reconcileSms = (smsId: string, operationId: string) => {
    setSmsTransactions(prev => prev.map(s => s.id === smsId ? { ...s, statut: 'rapproche', operationLieeId: operationId } : s));
    setOperations(prev => prev.map(o => o.id === operationId ? { ...o, smsRapprocheId: smsId } : o));
    addAuditEntry('Rapprochement SMS manuel', `Rapprochement du SMS ${smsId} avec la transaction ${operationId}`, 'info');
  };

  const simulateIncomingSms = (operateur: 'Vodacom' | 'Airtel' | 'Orange', message: string, montant: number, devise: 'USD' | 'CDF') => {
    const newId = `sms-${Date.now().toString().slice(-4)}`;
    const newTx: SmsTransaction = {
      id: newId,
      operateur,
      expediteur: operateur === 'Vodacom' ? 'M-PESA' : operateur === 'Airtel' ? 'AirtelMoney' : 'OrangeMoney',
      messageBrut: message,
      montant,
      devise,
      referenceTransaction: `TXN${Date.now().toString().slice(-6)}`,
      dateReception: new Date().toISOString().replace('T', ' ').slice(0, 19),
      statut: 'en_attente',
      simAttribuee: operateur === 'Vodacom' ? 'SIM 1' : operateur === 'Airtel' ? 'SIM 2' : 'SIM 3'
    };
    setSmsTransactions(prev => [newTx, ...prev]);
    addAuditEntry('Réception SMS simulée', `Nouveau SMS détecté ${newTx.referenceTransaction} : ${montant} ${devise}`, 'info');
  };

  const markPayrollPaid = (id: string) => {
    setPayroll(prev => prev.map(p => p.id === id ? { ...p, statut: 'paye', datePaiement: new Date().toISOString().split('T')[0] } : p));
    addAuditEntry('Paiement salaire', `Confirmation versement fiche de salaire ${id}`, 'info');
  };

  const broadcastAnnouncement = (ann: Omit<InternalAnnouncement, 'id' | 'date' | 'luPar'>) => {
    const newAnn: InternalAnnouncement = {
      ...ann,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      luPar: [currentUser.id]
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addAuditEntry('Diffusion communication', `Publication annonce: "${ann.titre}" par ${ann.auteurNom}`, 'info');
  };

  const updateTaskStatus = (taskId: string, statut: 'a_faire' | 'en_cours' | 'terminee') => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, statut } : t));
  };

  const addTask = (task: Omit<AssignedTask, 'id'>) => {
    const newTask: AssignedTask = {
      ...task,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateMembershipStatus = (id: string, status: 'en_analyse' | 'approuve' | 'rejete', comment?: string) => {
    setMembershipRequests(prev => prev.map(r => r.id === id ? { ...r, statut: status, commentaires: comment || r.commentaires } : r));
    addAuditEntry('Statut dossier membre', `Mise à jour du statut dossier ${id} -> ${status}`, 'info');
  };

  const toggleDeviceAuthorization = (deviceId: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        const next = !d.autorise;
        return {
          ...d,
          autorise: next,
          statut: next ? 'en_ligne' : 'suspect'
        };
      }
      return d;
    }));
    addAuditEntry('Sécurité terminal', `Modification d'autorisation de l'appareil ${deviceId}`, 'avertissement');
  };

  const hasPermission = (permissionCode: string): boolean => {
    const perm = PERMISSIONS_MATRIX.find(p => p.code === permissionCode);
    if (!perm) return false;
    return perm.rolesAutorises.includes(currentUser.role);
  };

  const triggerManualSync = async () => {
    await syncService.processQueue();
    const count = await syncService.getPendingCount();
    setPendingSyncCount(count);
  };

  const toggleSimulatedOffline = () => {
    const isSim = syncService.toggleSimulatedOffline();
    addAuditEntry(
      'CONNECTIVITE_MODE',
      `Mode réseau basculé : ${isSim ? 'HORS LIGNE (Simulé - Offline First actif)' : 'EN LIGNE (Synchronisation active)'}`,
      'info'
    );
    return isSim;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        agences,
        smsRules,
        smsTransactions,
        operations,
        commissions,
        payroll,
        announcements,
        auditLogs,
        devices,
        tasks,
        membershipRequests,

        // Offline-First & Sync state
        isOnline: syncState.effectiveOnline,
        isSimulatedOffline: syncState.isSimulatedOffline,
        syncStatus: syncState.status,
        pendingSyncCount,
        lastSyncTime: syncState.lastSyncedAt,
        syncError: syncState.lastError,
        triggerManualSync,
        toggleSimulatedOffline,

        // Commercial Commissions (Gouvernance DG)
        createCommission,
        updateCommission,
        toggleCommissionStatus,

        switchUser,
        createUser,
        updateUser,
        suspendUser,
        reactivateUser,
        deleteUser,
        resetUserPassword,
        assignUserRole,

        createAgence,
        updateAgence,
        toggleAgenceStatus,

        addOperation,
        validateOperation,

        toggleSmsRule,
        addSmsRule,
        reconcileSms,
        simulateIncomingSms,

        markPayrollPaid,
        broadcastAnnouncement,
        updateTaskStatus,
        addTask,
        updateMembershipStatus,
        toggleDeviceAuthorization,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
