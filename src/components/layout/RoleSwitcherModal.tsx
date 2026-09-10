import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Crown,
  Briefcase,
  Store,
  FileCheck2,
  Layers,
  Calculator,
  Coins,
  CreditCard,
  UserCheck,
  UserPlus,
  X,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { UserRole, AgentCategory } from '../../types';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { allUsers, currentUser, switchUser } = useAuth();

  if (!isOpen) return null;

  const roleDefinitions: {
    role: UserRole;
    category?: AgentCategory;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      role: 'administrateur_systeme',
      title: 'Administrateur Système',
      description: 'Gestion complète des utilisateurs, RBAC, agences, terminaux, gateways SMS et sécurité.',
      icon: ShieldAlert,
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-400'
    },
    {
      role: 'directeur_general',
      title: 'Directeur Général',
      description: 'Supervision globale de l\'entreprise, menu Administration orienté gestion (Personnel, Salaires, Agences).',
      icon: Crown,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400'
    },
    {
      role: 'directeur_adjoint',
      title: 'Directeur Adjoint',
      description: 'Assiste le DG, supervision des agences régionales, consultation des rapports globaux et statistiques.',
      icon: Briefcase,
      color: 'border-orange-500/40 bg-orange-500/10 text-orange-400'
    },
    {
      role: 'chef_agence',
      title: 'Chef d\'Agence',
      description: 'Supervision de l\'agence locale, validation des opérations, contrôle des caisses et clôtures journalières.',
      icon: Store,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
    },
    {
      role: 'assistant_administratif',
      title: 'Assistant Administratif',
      description: 'Support administratif, traitement des dossiers et demandes d\'adhésion, archivage de documents.',
      icon: FileCheck2,
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
    },
    {
      role: 'agent',
      category: 'agent_polyvalent',
      title: 'Agent Polyvalent (Spécialisation Métier)',
      description: 'Tableau de bord unifié : Comptabilité, Guichet, Change de devises, Opérateurs Mobile Money & Services Généraux.',
      icon: Layers,
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-400'
    },
    {
      role: 'agent',
      category: 'comptable',
      title: 'Agent Comptable',
      description: 'Tenue des comptes, écritures de dépenses et recettes, bilans financiers.',
      icon: Calculator,
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-400'
    },
    {
      role: 'agent',
      category: 'guichetier',
      title: 'Agent Guichetier',
      description: 'Encaissements et décaissements physiques au guichet de l\'agence.',
      icon: CreditCard,
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
    },
    {
      role: 'agent',
      category: 'agent_de_change',
      title: 'Agent de Change',
      description: 'Achat et vente manuelle de devises étrangères (USD, CDF, EUR) et suivi des cours.',
      icon: Coins,
      color: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
    },
    {
      role: 'membre',
      title: 'Membre Adhérent',
      description: 'Espace client : Consultation des comptes d\'épargne, crédits et historique des transactions.',
      icon: UserCheck,
      color: 'border-teal-500/40 bg-teal-500/10 text-teal-400'
    },
    {
      role: 'requerant_membre',
      title: 'Requérant Membre',
      description: 'Portail candidat : Dépôt et suivi du dossier d\'adhésion et conformité documentaire.',
      icon: UserPlus,
      color: 'border-stone-500/40 bg-stone-500/10 text-stone-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Sélecteur de Rôle & Profil Organisationnel</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Basculez instantanément entre les 8 rôles officiels de Ets AMANI pour tester l'architecture et les tableaux de bord.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          {roleDefinitions.map(def => {
            const matchedUser = allUsers.find(u => {
              if (def.category) {
                return u.role === def.role && u.agentCategory === def.category;
              }
              return u.role === def.role;
            });

            const isCurrent = matchedUser ? currentUser.id === matchedUser.id : false;
            const Icon = def.icon;

            return (
              <button
                key={`${def.role}-${def.category || 'all'}`}
                onClick={() => {
                  if (matchedUser) {
                    switchUser(matchedUser.id);
                    onClose();
                  }
                }}
                disabled={!matchedUser}
                className={`flex items-start gap-3.5 p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/5'
                    : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${def.color} shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-100">{def.title}</span>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Actif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{def.description}</p>
                  {matchedUser && (
                    <div className="mt-2 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span className="text-slate-300 font-semibold">{matchedUser.prenom} {matchedUser.nom}</span>
                      <span>•</span>
                      <span>{matchedUser.matricule}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
