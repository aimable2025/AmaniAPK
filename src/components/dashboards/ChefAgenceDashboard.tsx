import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Wallet,
  Receipt,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Coins
} from 'lucide-react';

interface ChefAgenceDashboardProps {
  onOpenNewOperation: () => void;
}

export const ChefAgenceDashboard: React.FC<ChefAgenceDashboardProps> = ({ onOpenNewOperation }) => {
  const { currentUser, agences, operations, allUsers, validateOperation } = useAuth();

  const agence = agences.find(a => a.id === currentUser.agenceId) || agences[0];
  const agencyOps = operations.filter(o => o.agenceId === agence.id);
  const agencyStaff = allUsers.filter(u => u.agenceId === agence.id);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Building2 className="h-4 w-4" />
              Direction d'Agence Locale — {agence.nom} ({agence.code})
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Tableau de Bord — Chef d'Agence
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Supervision directe de l'agence, clôture de caisse, validation des dépôts/retraits et coordination du personnel de guichet.
            </p>
          </div>
          <button
            onClick={onOpenNewOperation}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Opération de Caisse</span>
          </button>
        </div>
      </div>

      {/* Cashbox Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Solde Physique Caisse USD</span>
            <Wallet className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            ${agence.soldeCaisseUSD.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-400">Coffre fort vérifié</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Solde Physique Caisse CDF</span>
            <Coins className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-400">
            {agence.soldeCaisseCDF.toLocaleString()} CDF
          </div>
          <div className="mt-1 text-xs text-slate-400">Disponibilité liquidité</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Équipe Affectée</span>
            <Users className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{agencyStaff.length} agents</div>
          <div className="mt-1 text-xs text-amber-400">Guichet, Change, Polyvalent, Logistique</div>
        </div>
      </div>

      {/* Agency Operations & Approvals */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-emerald-400" />
              Opérations Récentes de l'Agence
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Contrôle journalier des transactions effectuées par les agents de l'agence.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {agencyOps.map(op => (
            <div key={op.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{op.clientNom || op.motif}</span>
                  <span className="font-mono text-emerald-400 font-bold">{op.reference}</span>
                  <span className="text-slate-500 text-[11px]">• Agent : {op.agentNom}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{op.type.toUpperCase()} • {op.modeReglement} • {op.date}</p>
              </div>
              <div className="text-right flex items-center gap-3">
                <div className="font-mono font-bold text-sm text-white">
                  {op.montant.toLocaleString()} {op.devise}
                </div>
                {op.statut === 'en_attente' ? (
                  <button
                    onClick={() => validateOperation(op.id)}
                    className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    Valider
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {op.statut}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
