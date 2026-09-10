import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  ShieldCheck,
  Building2,
  Smartphone,
  Laptop,
  ClipboardList,
  Plus,
  Search,
  Filter,
  KeyRound,
  UserX,
  UserCheck,
  Trash2,
  Edit,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowUpDown,
  Lock,
  Radio,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import { User, UserRole, AgentCategory, Agence } from '../../types';
import { PERMISSIONS_MATRIX } from '../../data/initialData';
import { AdminOfflineSyncModule } from './AdminOfflineSyncModule';

interface AdminSystemeDashboardProps {
  activeTab: string;
  onOpenUserModal?: (user?: User) => void;
  onOpenAgencyModal?: (agency?: Agence) => void;
  onOpenSmsRuleModal?: () => void;
  onOpenCreateUser?: () => void;
  onOpenEditUser?: (user: User) => void;
  onOpenCreateAgency?: () => void;
  onOpenAddSmsRule?: () => void;
  onOpenAuditReport?: () => void;
}

export const AdminSystemeDashboard: React.FC<AdminSystemeDashboardProps> = ({
  activeTab,
  onOpenUserModal,
  onOpenAgencyModal,
  onOpenSmsRuleModal,
  onOpenCreateUser,
  onOpenEditUser,
  onOpenCreateAgency,
  onOpenAddSmsRule,
  onOpenAuditReport
}) => {
  const handleCreateUser = () => {
    if (onOpenCreateUser) onOpenCreateUser();
    else if (onOpenUserModal) onOpenUserModal();
  };

  const handleEditUser = (user: User) => {
    if (onOpenEditUser) onOpenEditUser(user);
    else if (onOpenUserModal) onOpenUserModal(user);
  };

  const handleCreateAgency = () => {
    if (onOpenCreateAgency) onOpenCreateAgency();
    else if (onOpenAgencyModal) onOpenAgencyModal();
  };

  const handleOpenSmsRule = () => {
    if (onOpenAddSmsRule) onOpenAddSmsRule();
    else if (onOpenSmsRuleModal) onOpenSmsRuleModal();
  };
  const {
    allUsers,
    agences,
    smsRules,
    smsTransactions,
    auditLogs,
    devices,
    suspendUser,
    reactivateUser,
    deleteUser,
    resetUserPassword,
    assignUserRole,
    toggleAgenceStatus,
    toggleSmsRule,
    toggleDeviceAuthorization,
    simulateIncomingSms
  } = useAuth();

  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [resetMessage, setResetMessage] = useState<{ userId: string; pass: string } | null>(null);

  // Filter users
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch =
      u.nom.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.prenom.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.matricule.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleResetPass = (user: User) => {
    const tempPass = resetUserPassword(user.id);
    setResetMessage({ userId: user.id, pass: tempPass });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              Console Haute Sécurité & Infrastructure
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Tableau de Bord — Administrateur Système
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Contrôle intégral des identités RBAC, hiérarchie officielle, agences provinciales, passerelles SMS et logs de sécurité Ets AMANI.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateUser}
              className="flex items-center gap-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer shadow-lg shadow-rose-500/10"
            >
              <Plus className="h-4 w-4" />
              <span>Créer Utilisateur</span>
            </button>
            <button
              onClick={handleCreateAgency}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium px-3.5 py-2 text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              <Building2 className="h-4 w-4" />
              <span>Nouvelle Agence</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      {(activeTab === 'overview' || activeTab === 'admin_overview' || !activeTab) && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Comptes Utilisateurs</span>
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">{allUsers.length}</div>
              <div className="mt-1 text-[11px] text-emerald-400">
                {allUsers.filter(u => u.statut === 'actif').length} actifs • {allUsers.filter(u => u.statut === 'suspendu').length} suspendus
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Agences Ouvertes</span>
                <Building2 className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">{agences.length}</div>
              <div className="mt-1 text-[11px] text-slate-400">
                Goma, Kinshasa, Bukavu, Lubumbashi, Beni
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Règles SMS Gateway</span>
                <Smartphone className="h-4 w-4 text-purple-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">{smsRules.length}</div>
              <div className="mt-1 text-[11px] text-purple-400">
                {smsRules.filter(r => r.actif).length} passerelles actives (Vodacom/Airtel/Orange)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Alertes de Sécurité</span>
                <AlertTriangle className="h-4 w-4 text-rose-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                {auditLogs.filter(l => l.gravite !== 'info').length}
              </div>
              <div className="mt-1 text-[11px] text-rose-400">
                Journaux vérifiés en temps réel
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab: Moteur Offline-First & Synchro Dexie / Firestore */}
      {(activeTab === 'admin_offline_sync' || activeTab === 'overview') && (
        <AdminOfflineSyncModule />
      )}

      {/* Tab: Users Management */}
      {(activeTab === 'users' || activeTab === 'overview' || !activeTab) && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-rose-400" />
                Gestion Complète des Utilisateurs & Rôles
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Création, suspension, réactivation, réinitialisation de mot de passe et attribution de rôle.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher nom, matricule..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
              >
                <option value="all">Tous les rôles</option>
                <option value="administrateur_systeme">Administrateur Système</option>
                <option value="directeur_general">Directeur Général</option>
                <option value="directeur_adjoint">Directeur Adjoint</option>
                <option value="chef_agence">Chef d'Agence</option>
                <option value="assistant_administratif">Assistant Administratif</option>
                <option value="agent">Agent</option>
                <option value="membre">Membre</option>
                <option value="requerant_membre">Requérant Membre</option>
              </select>
            </div>
          </div>

          {resetMessage && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
              <div>
                <span className="font-bold">Nouveau mot de passe temporaire généré : </span>
                <span className="font-mono bg-slate-950 px-2 py-1 rounded text-white font-bold">{resetMessage.pass}</span>
                <span className="ml-2 text-slate-400">(À transmettre de manière sécurisée à l'agent)</span>
              </div>
              <button
                onClick={() => setResetMessage(null)}
                className="text-slate-400 hover:text-white"
              >
                Fermer
              </button>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Matricule & Nom</th>
                  <th className="p-3">Rôle Officiel</th>
                  <th className="p-3">Catégorie Métier</th>
                  <th className="p-3">Agence</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Actions Système</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{user.prenom} {user.nom}</div>
                      <div className="font-mono text-[11px] text-slate-400">{user.matricule} • {user.email}</div>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-md font-semibold text-[11px] bg-slate-800 text-amber-400 border border-slate-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {user.agentCategory ? (
                        <span className={`inline-block px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                          user.agentCategory === 'agent_polyvalent'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold'
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}>
                          {user.agentCategory}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-300">
                      {user.agenceNom || 'Siège Central'}
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.statut === 'actif'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : user.statut === 'suspendu'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          user.statut === 'actif' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`} />
                        {user.statut}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleResetPass(user)}
                          title="Réinitialiser mot de passe"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          title="Modifier utilisateur"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        {user.statut === 'actif' ? (
                          <button
                            onClick={() => suspendUser(user.id)}
                            title="Suspendre"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          >
                            <UserX className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => reactivateUser(user.id)}
                            title="Réactiver"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {user.id !== 'usr-1' && (
                          <button
                            onClick={() => {
                              if (confirm(`Confirmer la suppression définitive de ${user.prenom} ${user.nom} ?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            title="Supprimer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Agences */}
      {(activeTab === 'agences' || activeTab === 'overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-400" />
                Gestion des Agences & Affectations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Réseau d'agences provinciales, soldes de caisse en USD/CDF et statut d'exploitation.
              </p>
            </div>
            <button
              onClick={() => onOpenAgencyModal()}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 text-xs transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Créer Agence</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agences.map(agence => (
              <div key={agence.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {agence.code}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1.5">{agence.nom}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{agence.adresse}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    agence.statut === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {agence.statut}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Caisse USD</span>
                    <div className="font-bold text-emerald-400">${agence.soldeCaisseUSD.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Caisse CDF</span>
                    <div className="font-bold text-cyan-400">{agence.soldeCaisseCDF.toLocaleString()} CDF</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>Chef: <strong className="text-slate-200">{agence.chefAgenceNom || 'Non assigné'}</strong></span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenAgencyModal(agence)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => toggleAgenceStatus(agence.id)}
                      className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px]"
                    >
                      {agence.statut === 'active' ? 'Fermer' : 'Rouvrir'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Permissions & RBAC Matrix */}
      {(activeTab === 'permissions' || activeTab === 'overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="h-4 w-4 text-cyan-400" />
                Matrice des Droits & Permissions RBAC
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Règles strictes de contrôle d'accès garantissant qu'aucun utilisateur ne contourne les barrières organisationnelles.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Module</th>
                  <th className="p-3">Code Permission</th>
                  <th className="p-3">Description Fonctionnelle</th>
                  <th className="p-3">Rôles RBAC Autorisés</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {PERMISSIONS_MATRIX.map(perm => (
                  <tr key={perm.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-slate-200">{perm.module}</td>
                    <td className="p-3 font-mono text-amber-400 text-[11px]">{perm.code}</td>
                    <td className="p-3 text-slate-400">{perm.description}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {perm.rolesAutorises.map(r => (
                          <span key={r} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: SMS Gateways & Detection Rules */}
      {(activeTab === 'sms_operators' || activeTab === 'overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-purple-400" />
                Passerelles SMS Opérateurs (M-Pesa, Airtel Money, Orange Money)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gestion des cartes SIM internes, détection par expressions régulières et rapprochement automatique.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  simulateIncomingSms(
                    'Vodacom',
                    `Trans. ID MP${Date.now().toString().slice(-6)} Vous avez recu 250.00 USD de KAMBALE Joseph.`,
                    250,
                    'USD'
                  );
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold cursor-pointer"
              >
                + Simuler SMS Entrant
              </button>
              <button
                onClick={handleOpenSmsRule}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Nouvelle Règle</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {smsRules.map(rule => (
              <div key={rule.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-400">{rule.operateur}</span>
                  <span className="text-[10px] font-mono text-slate-400">{rule.simSlot}</span>
                </div>
                <h4 className="text-sm font-semibold text-white">{rule.nomRegle}</h4>
                <div className="text-[11px] font-mono text-slate-400 space-y-1 pt-1">
                  <div>Expéditeur : <strong className="text-slate-200">{rule.expediteurOfficiel}</strong></div>
                  <div>Montant : <code className="text-amber-400">{rule.patternMontant}</code></div>
                  <div>Rapprochement auto : <strong className="text-emerald-400">{rule.autoRapprochement ? 'Activé' : 'Manuel'}</strong></div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] text-slate-400">État de la passerelle</span>
                  <button
                    onClick={() => toggleSmsRule(rule.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rule.actif ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {rule.actif ? 'Actif' : 'Désactivé'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time SMS Feed */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Derniers SMS Détectés & Statut de Rapprochement
            </h4>
            <div className="space-y-2">
              {smsTransactions.slice(0, 4).map(tx => (
                <div key={tx.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{tx.operateur}</span>
                      <span className="font-mono text-amber-400 font-bold">{tx.montant} {tx.devise}</span>
                      <span className="text-[11px] text-slate-500">({tx.simAttribuee})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{tx.messageBrut}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.statut === 'rapproche'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : tx.statut === 'anomalie'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {tx.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Devices & Sessions */}
      {(activeTab === 'devices' || activeTab === 'overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Laptop className="h-4 w-4 text-emerald-400" />
                Appareils Connectés & Contrôle des Sessions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Surveillance des terminaux autorisés, IP d'accès et détection d'appareils suspects.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {devices.map(dev => (
              <div key={dev.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{dev.appareil}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      dev.statut === 'en_ligne' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {dev.statut}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">{dev.userNom}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {dev.systeme} • {dev.navigateur} • IP: {dev.adresseIp}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Dernière synchronisation : {dev.derniereSynchro}
                  </div>
                </div>
                <button
                  onClick={() => toggleDeviceAuthorization(dev.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    dev.autorise
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  {dev.autorise ? 'Révoquer' : 'Autoriser'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Audit & Logs */}
      {(activeTab === 'audit_security' || activeTab === 'overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-rose-400" />
                Journaux d'Audit & Détection d'Anomalies
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Traçabilité immuable des modifications de privilèges, authentifications et transactions financières.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.gravite === 'critique'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : log.gravite === 'avertissement'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-200">{log.utilisateur}</span>
                    <span className="text-slate-500">• IP: {log.adresseIp}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{log.details}</p>
                </div>
                <span className="font-mono text-[10px] text-slate-500 shrink-0">{log.horodatage}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
