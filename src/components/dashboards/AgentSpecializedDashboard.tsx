import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  CreditCard,
  Calculator,
  Coins,
  Smartphone,
  Truck,
  Sparkles,
  ClipboardList,
  Plus,
  Receipt
} from 'lucide-react';
import { AgentCategory } from '../../types';

interface AgentSpecializedDashboardProps {
  onOpenNewOperation: () => void;
}

export const AgentSpecializedDashboard: React.FC<AgentSpecializedDashboardProps> = ({ onOpenNewOperation }) => {
  const { currentUser, operations, tasks } = useAuth();
  const category = currentUser.agentCategory || 'guichetier';

  const getCategoryInfo = (cat: AgentCategory) => {
    switch (cat) {
      case 'comptable':
        return {
          title: 'Poste Comptable',
          desc: 'Tenue de la comptabilité, saisie des écritures, rapports journaliers.',
          icon: Calculator,
          badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
        };
      case 'guichetier':
        return {
          title: 'Poste Guichet',
          desc: 'Opérations de dépôt, retrait et émission des reçus clients au guichet.',
          icon: CreditCard,
          badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        };
      case 'agent_de_change':
        return {
          title: 'Poste Change de Devises',
          desc: 'Achat et vente de devises étrangères (USD/CDF/EUR) au cours du jour.',
          icon: Coins,
          badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
        };
      case 'agent_operateur_mobile':
        return {
          title: 'Poste Opérateur Mobile Money',
          desc: 'Gestion des terminaux M-Pesa, Airtel Money et Orange Money.',
          icon: Smartphone,
          badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
        };
      case 'chauffeur':
        return {
          title: 'Services Logistique & Transport',
          desc: 'Missions de transport, approvisionnement et liaisons inter-agences.',
          icon: Truck,
          badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
        };
      case 'cleaner':
        return {
          title: 'Entretien & Hygiène',
          desc: 'Hygiène, entretien des locaux et assainissement des agences.',
          icon: Sparkles,
          badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
        };
      default:
        return {
          title: 'Poste Opérationnel',
          desc: 'Exécution des opérations assignées par le Chef d\'Agence.',
          icon: ClipboardList,
          badgeColor: 'text-slate-400 bg-slate-500/10 border-slate-500/20'
        };
    }
  };

  const info = getCategoryInfo(category);
  const Icon = info.icon;
  const myOperations = operations.filter(o => o.agentId === currentUser.id || !o.agentId);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Icon className="h-4 w-4" />
              Spécialisation Métier : {category.replace('_', ' ')}
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              {info.title} — {currentUser.prenom} {currentUser.nom}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              {info.desc} • Rôle RBAC officiel : <code>agent</code>
            </p>
          </div>
          {['guichetier', 'comptable', 'agent_de_change'].includes(category) && (
            <button
              onClick={onOpenNewOperation}
              className="flex items-center gap-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer shadow-lg shadow-blue-500/10"
            >
              <Plus className="h-4 w-4" />
              <span>Saisir une Opération</span>
            </button>
          )}
        </div>
      </div>

      {/* Operations Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="h-4 w-4 text-blue-400" />
            Opérations Déclarées à Mon Poste
          </h3>
          <span className="text-xs text-slate-400">{myOperations.length} enregistrées</span>
        </div>

        <div className="space-y-2">
          {myOperations.map(op => (
            <div key={op.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{op.clientNom || op.motif}</span>
                  <span className="font-mono text-blue-400">({op.reference})</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">{op.type.toUpperCase()} • Mode: {op.modeReglement} • {op.date}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-white text-sm">
                  {op.montant.toLocaleString()} {op.devise}
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">{op.statut}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
