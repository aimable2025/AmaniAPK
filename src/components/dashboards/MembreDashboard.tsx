import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UserCheck,
  Wallet,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const MembreDashboard: React.FC = () => {
  const { currentUser, operations, addOperation } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositMontant, setDepositMontant] = useState(50);
  const [depositDevise, setDepositDevise] = useState<'USD' | 'CDF'>('USD');
  const [depositMotif, setDepositMotif] = useState('Épargne personnelle');

  const myOperations = operations.filter(o => o.clientId === currentUser.id);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOperation({
      type: 'depot',
      montant: depositMontant,
      devise: depositDevise,
      agenceId: currentUser.agenceId || 'ag-1',
      agenceNom: currentUser.agenceNom || 'Siège Central Goma',
      agentId: 'usr-6',
      agentNom: 'Henri PALUKU (Polyvalent)',
      clientId: currentUser.id,
      clientNom: `${currentUser.prenom} ${currentUser.nom}`,
      statut: 'validee',
      modeReglement: 'm_pesa',
      motif: depositMotif
    });
    setShowDepositModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <UserCheck className="h-4 w-4" />
              Espace Membre Adhérent — Ets AMANI
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Bienvenue, {currentUser.prenom} {currentUser.nom}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Matricule Membre : <strong className="text-white font-mono">{currentUser.matricule}</strong> • Compte vérifié
            </p>
          </div>
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer shadow-lg shadow-teal-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Alimenter mon Compte</span>
          </button>
        </div>
      </div>

      {/* Account Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Solde Épargne USD</span>
          <div className="mt-2 text-3xl font-black text-emerald-400">$1,450.00</div>
          <div className="mt-1 text-xs text-slate-500">Disponible immédiatement au guichet ou mobile money</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Solde Épargne CDF</span>
          <div className="mt-2 text-3xl font-black text-cyan-400">920,000 CDF</div>
          <div className="mt-1 text-xs text-slate-500">Rémunéré à 4.5% l'an</div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="h-4 w-4 text-teal-400" />
            Historique de Mes Opérations
          </h3>
          <span className="text-xs text-slate-400">{myOperations.length} opérations enregistrées</span>
        </div>

        <div className="space-y-2">
          {myOperations.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              Aucune opération récente pour ce compte.
            </div>
          ) : (
            myOperations.map(op => (
              <div key={op.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{op.motif}</span>
                    <span className="font-mono text-[10px] text-teal-400">({op.reference})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {op.type.toUpperCase()} • Mode : {op.modeReglement.replace('_', ' ')} • {op.date}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-mono text-sm font-bold ${
                    op.type === 'depot' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {op.type === 'depot' ? '+' : '-'}{op.montant.toLocaleString()} {op.devise}
                  </span>
                  <div className="text-[10px] text-emerald-400 font-medium">Validé ✓</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Alimenter mon Compte d'Épargne</h3>
            <form onSubmit={handleDepositSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Montant</label>
                <input
                  type="number"
                  min="1"
                  value={depositMontant}
                  onChange={e => setDepositMontant(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Devise</label>
                <select
                  value={depositDevise}
                  onChange={e => setDepositDevise(e.target.value as 'USD' | 'CDF')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="CDF">CDF (Franc Congolais)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Motif</label>
                <input
                  type="text"
                  value={depositMotif}
                  onChange={e => setDepositMotif(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold"
                >
                  Confirmer le Dépôt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
