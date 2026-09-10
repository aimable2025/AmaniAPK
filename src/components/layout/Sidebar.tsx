import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  Smartphone,
  Laptop,
  ClipboardList,
  Crown,
  Briefcase,
  Layers,
  FileCheck2,
  Wallet,
  Receipt,
  UserCheck,
  UserPlus,
  Coins,
  CreditCard,
  FileText,
  Radio,
  FileSpreadsheet,
  Percent,
  Database,
  MessageSquare
} from 'lucide-react';
import { ChatPermissionService } from '../../services/chat/ChatPermissionService';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  currentTab?: string;
  onSelectTab?: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenRoleSwitcher?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
  onOpenRoleSwitcher
}) => {
  const { currentUser } = useAuth();
  const role = currentUser.role;

  const currentActiveTab = activeTab ?? currentTab ?? '';
  const handleSelectTab = (tabId: string) => {
    if (setActiveTab) setActiveTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  // Generate role-specific navigation menus
  const getNavItems = () => {
    switch (role) {
      case 'administrateur_systeme':
        return [
          { id: 'overview', label: 'Vue d\'ensemble Système', icon: LayoutDashboard },
          { id: 'admin_offline_sync', label: 'Moteur Offline & Synchro', icon: Database },
          { id: 'users', label: 'Gestion des Utilisateurs', icon: Users },
          { id: 'roles', label: 'Gestion des Rôles & Catégories', icon: ShieldCheck },
          { id: 'agences', label: 'Gestion des Agences', icon: Building2 },
          { id: 'permissions', label: 'Permissions & RBAC', icon: FileCheck2 },
          { id: 'devices', label: 'Appareils & Sessions', icon: Laptop },
          { id: 'sms_operators', label: 'SMS Opérateurs & SIMs', icon: Smartphone },
          { id: 'audit_security', label: 'Audit & Sécurité', icon: ClipboardList },
          { id: 'admin_audit_report', label: 'Rapport d\'Architecture', icon: FileSpreadsheet }
        ];

      case 'directeur_general':
        return [
          { id: 'dg_overview', label: 'Tableau de Bord Exécutif', icon: Crown },
          // Menu Administration required by prompt with its specific subsections
          { id: 'dg_commissions', label: 'Admin : Tarifs & Commissions', icon: Percent },
          { id: 'dg_personnel', label: 'Admin : Personnel & Organigramme', icon: Users },
          { id: 'dg_salaires', label: 'Admin : Salaires & Paie', icon: Wallet },
          { id: 'dg_communication', label: 'Admin : Communication & Diffusion', icon: Radio },
          { id: 'dg_agences', label: 'Admin : Supervision Agences', icon: Building2 },
          { id: 'dg_rapports', label: 'Admin : Rapports & Synthèses', icon: FileText },
          { id: 'dg_controle', label: 'Admin : Contrôle & Anomalies', icon: ShieldCheck },
          { id: 'dg_audits', label: 'Admin : Audits & Journaux', icon: ClipboardList }
        ];

      case 'directeur_adjoint':
        return [
          { id: 'da_overview', label: 'Supervision Opérationnelle', icon: Briefcase },
          { id: 'da_agences', label: 'Supervision des Agences', icon: Building2 },
          { id: 'da_rapports', label: 'Rapports Globaux & Statistiques', icon: FileText },
          { id: 'da_tasks', label: 'Tâches & Coordination', icon: ClipboardList }
        ];

      case 'assistant_administratif':
        return [
          { id: 'asst_overview', label: 'Espace Administratif', icon: FileCheck2 },
          { id: 'asst_dossiers', label: 'Dossiers & Demandes Membres', icon: UserPlus },
          { id: 'asst_documents', label: 'Archivage & Documents', icon: FileText },
          { id: 'asst_rapports', label: 'Rapports Administratifs', icon: ClipboardList }
        ];

      case 'chef_agence':
        return [
          { id: 'chef_overview', label: 'Gestion de l\'Agence', icon: Building2 },
          { id: 'chef_caisse', label: 'Suivi Caisse & Clôture', icon: Wallet },
          { id: 'chef_operations', label: 'Opérations Guichet', icon: Receipt },
          { id: 'chef_equipe', label: 'Équipe Locale', icon: Users }
        ];

      case 'agent':
        if (currentUser.agentCategory === 'agent_polyvalent') {
          return [
            { id: 'poly_unified', label: 'Espace Polyvalent Unifié', icon: Layers },
            { id: 'poly_compta', label: 'Module Comptabilité', icon: Wallet },
            { id: 'poly_guichet', label: 'Module Guichet', icon: CreditCard },
            { id: 'poly_change', label: 'Module Change Devises', icon: Coins },
            { id: 'poly_mobile', label: 'Module Opérateur Mobile', icon: Smartphone },
            { id: 'poly_services', label: 'Services Généraux & Tâches', icon: ClipboardList }
          ];
        } else {
          return [
            { id: 'agent_standard', label: 'Mon Poste Opérationnel', icon: Layers },
            { id: 'agent_operations', label: 'Saisie Opérations', icon: Receipt },
            { id: 'agent_tasks', label: 'Missions & Activités', icon: ClipboardList }
          ];
        }

      case 'membre':
        return [
          { id: 'membre_compte', label: 'Mes Comptes & Épargne', icon: UserCheck },
          { id: 'membre_operations', label: 'Historique des Opérations', icon: Receipt },
          { id: 'membre_demandes', label: 'Demandes de Crédit', icon: Wallet }
        ];

      case 'requerant_membre':
        return [
          { id: 'req_dossier', label: 'Mon Dossier d\'Adhésion', icon: UserPlus },
          { id: 'req_documents', label: 'Mes Pièces Justificatives', icon: FileText }
        ];

      default:
        return [{ id: 'overview', label: 'Tableau de bord', icon: LayoutDashboard }];
    }
  };

  const baseItems = getNavItems();
  const navItems = ChatPermissionService.canAccessChat(currentUser)
    ? [...baseItems, { id: 'chat_internal', label: 'Chat Interne', icon: MessageSquare }]
    : baseItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Aside Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-slate-800 bg-slate-950 md:bg-slate-950/60 p-4 transform transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Role Context Ribbon */}
        <div className="mb-5 p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Espace Connecté
            </span>
            {onOpenRoleSwitcher && (
              <button
                onClick={onOpenRoleSwitcher}
                className="text-[10px] text-amber-400 hover:underline font-semibold"
              >
                Changer
              </button>
            )}
          </div>
          <div className="mt-1 text-xs font-bold text-slate-100 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span className="capitalize">{currentUser.role.replace(/_/g, ' ')}</span>
          </div>
          {currentUser.agentCategory && (
            <div className="mt-1 inline-block text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
              {currentUser.agentCategory.replace(/_/g, ' ')}
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive =
              currentActiveTab === item.id ||
              (item.id === 'overview' && currentActiveTab === 'admin_overview');

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
