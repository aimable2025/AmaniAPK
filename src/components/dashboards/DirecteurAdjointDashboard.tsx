import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Building2,
  FileText,
  ClipboardList,
  TrendingUp,
  ShieldX,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';

interface DADashboardProps {
  activeTab: string;
}

export const DirecteurAdjointDashboard: React.FC<DADashboardProps> = ({ activeTab }) => {
  const { agences, operations, tasks, updateTaskStatus } = useAuth();

  const totalUSD = operations.filter(o => o.devise === 'USD').reduce((a, b) => a + b.montant, 0);
  const totalCDF = operations.filter(o => o.devise === 'CDF').reduce((a, b) => a + b.montant, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/20 p-5">
        <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
          <Briefcase className="h-4 w-4" />
          Direction Adjointe — Coordination Opérationnelle & Agences
        </div>
        <h2 className="text-xl font-black text-white mt-1">
          Tableau de Bord — Directeur Adjoint
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Assistance au Directeur Général, supervision opérationnelle des agences et contrôle des activités de terrain.
        </p>

        {/* Security boundary callout */}
        <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-2.5 text-xs text-orange-300">
          <ShieldX className="h-4 w-4 shrink-0 text-orange-400" />
          <span>
            <strong>Périmètre de sécurité strict :</strong> Le Directeur Adjoint supervise les agences et rapports, mais ne peut en aucun cas modifier les rôles système, ni les règles de sécurité RBAC.
          </span>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Réseau d'Agences Supervisées</span>
            <Building2 className="h-4 w-4 text-orange-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{agences.length} agences</div>
          <div className="mt-1 text-xs text-emerald-400">100% connectées au réseau central</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Flux Supervisés USD</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">${totalUSD.toLocaleString()}</div>
          <div className="mt-1 text-xs text-slate-400">Opérations vérifiées</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Flux Supervisés CDF</span>
            <FileText className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalCDF.toLocaleString()} CDF</div>
          <div className="mt-1 text-xs text-slate-400">Taux stable sur les agences</div>
        </div>
      </div>

      {/* Agencies supervision */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="h-4 w-4 text-orange-400" />
          Supervision des Agences Régionales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agences.map(ag => (
            <div key={ag.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{ag.nom}</span>
                <span className="font-mono text-orange-400 font-bold">{ag.code}</span>
              </div>
              <p className="text-slate-400">{ag.adresse}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between">
                <span className="text-slate-500">Caisse USD:</span>
                <strong className="text-emerald-400">${ag.soldeCaisseUSD.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chef d'agence:</span>
                <strong className="text-slate-200">{ag.chefAgenceNom}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coordination Tasks */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-orange-400" />
          Missions & Coordination Opérationnelle
        </h3>
        <div className="space-y-2">
          {tasks.map(t => (
            <div key={t.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">{t.titre}</span>
                <p className="text-slate-400 text-[11px] mt-0.5">{t.description}</p>
                <div className="mt-1 text-[10px] text-orange-400">Assigné à : {t.assigneA} • Échéance : {t.dateEcheance}</div>
              </div>
              <div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  t.statut === 'terminee'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : t.statut === 'en_cours'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {t.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
