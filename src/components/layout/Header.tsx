import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Building2,
  Bell,
  UserCheck,
  ChevronDown,
  RefreshCw,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Menu,
  MessageSquare
} from 'lucide-react';
import { UserRole, AgentCategory } from '../../types';
import { SyncStatusBadge } from './SyncStatusBadge';
import { ChatPermissionService } from '../../services/chat/ChatPermissionService';

interface HeaderProps {
  onOpenRoleSwitcher: () => void;
  onOpenNewOperation?: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRoleSwitcher,
  onOpenNewOperation,
  onToggleMobileSidebar,
  onOpenChat
}) => {
  const { currentUser, announcements, auditLogs, smsTransactions } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Role display label mapping (strictly adhering to required terminology)
  const getRoleBadge = (role: UserRole, cat?: AgentCategory) => {
    switch (role) {
      case 'administrateur_systeme':
        return { label: 'Administrateur Système', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      case 'directeur_general':
        return { label: 'Directeur Général', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'directeur_adjoint':
        return { label: 'Directeur Adjoint', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
      case 'chef_agence':
        return { label: 'Chef d\'Agence', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'assistant_administratif':
        return { label: 'Assistant Administratif', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'agent':
        if (cat === 'agent_polyvalent') {
          return { label: 'Agent Polyvalent (Métier)', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
        }
        return { label: `Agent (${cat ? cat.replace('_', ' ') : 'Standard'})`, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'membre':
        return { label: 'Membre Adhérent', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' };
      case 'requerant_membre':
        return { label: 'Requérant Membre', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      default:
        return { label: role, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    }
  };

  const badge = getRoleBadge(currentUser.role, currentUser.agentCategory);
  const pendingSmsCount = smsTransactions.filter(s => s.statut === 'en_attente').length;
  const recentAlerts = auditLogs.filter(l => l.gravite !== 'info').slice(0, 3);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Slogan */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-md font-bold text-lg tracking-wider">
            EA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-50 tracking-tight">Ets AMANI</span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-900 border border-slate-800 px-2.5 py-0.5 text-xs text-slate-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                RDC Sync
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-400 font-normal">
              « Ets AMANI — Ensemble, plus connectés, plus efficaces. »
            </p>
          </div>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Offline-First Synchronization Status Indicator */}
          <SyncStatusBadge />

          {/* Quick Operation Trigger (for Agents, Chef d'Agence, Polyvalent, Admins) */}
          {['agent', 'chef_agence', 'administrateur_systeme'].includes(currentUser.role) && onOpenNewOperation && (
            <button
              onClick={onOpenNewOperation}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Nouvelle Opération</span>
            </button>
          )}

          {/* Quick Role Switcher Button */}
          <button
            onClick={onOpenRoleSwitcher}
            className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 px-3 py-1.5 text-xs text-slate-200 transition-colors cursor-pointer"
            title="Tester un autre rôle"
          >
            <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline font-medium">Changer de rôle</span>
            <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${badge.color}`}>
              {badge.label}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Internal Chat Quick Shortcut */}
          {ChatPermissionService.canAccessChat(currentUser) && onOpenChat && (
            <button
              onClick={onOpenChat}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
              title="Ouvrir le Chat Interne"
              aria-label="Chat Interne"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          )}

          {/* Notifications & System alerts */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {pendingSmsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {pendingSmsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-amber-400" />
                    <h4 className="text-sm font-semibold text-white">Centre de Notifications</h4>
                  </div>
                  <span className="text-xs text-slate-400">{announcements.length} annonces</span>
                </div>

                <div className="mt-3 space-y-3 max-h-80 overflow-y-auto pr-1">
                  {pendingSmsCount > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>{pendingSmsCount} SMS en attente de rapprochement</span>
                      </div>
                      <p className="mt-1 text-slate-300 text-[11px]">
                        Transactions Mobile Money détectées nécessitant une confirmation d'agent.
                      </p>
                    </div>
                  )}

                  {recentAlerts.map(alert => (
                    <div key={alert.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1 text-rose-400 font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          {alert.action}
                        </span>
                        <span>{alert.horodatage.slice(11, 16)}</span>
                      </div>
                      <p className="mt-1 text-slate-200 text-[11px] line-clamp-2">{alert.details}</p>
                    </div>
                  ))}

                  {announcements.map(ann => (
                    <div key={ann.id} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="font-semibold text-slate-200">{ann.titre}</span>
                        <span className="text-[10px] text-amber-400">{ann.date}</span>
                      </div>
                      <p className="mt-1 text-slate-400 text-[11px] line-clamp-2">{ann.contenu}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Details */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-bold text-sm">
              {currentUser.prenom.charAt(0)}{currentUser.nom.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-100 flex items-center gap-1">
                {currentUser.prenom} {currentUser.nom}
              </div>
              <div className="text-[11px] text-slate-400">
                {currentUser.agenceNom || 'Administration Centrale'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
