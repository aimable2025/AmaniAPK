import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Receipt, Save, Sparkles } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, agences, addOperation } = useAuth();

  const [type, setType] = useState<'depot' | 'retrait' | 'change' | 'depense'>('depot');
  const [montant, setMontant] = useState(100);
  const [devise, setDevise] = useState<'USD' | 'CDF'>('USD');
  const [modeReglement, setModeReglement] = useState<'especes' | 'm_pesa' | 'airtel_money' | 'orange_money'>('especes');
  const [clientNom, setClientNom] = useState('');
  const [motif, setMotif] = useState('');
  const [agenceId, setAgenceId] = useState(currentUser.agenceId || agences[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentAgence = agences.find(a => a.id === agenceId) || agences[0];

    addOperation({
      type,
      montant,
      devise,
      tauxChange: type === 'change' ? 2850 : undefined,
      contreValeur: type === 'change' ? montant * 2850 : undefined,
      agenceId: currentAgence.id,
      agenceNom: currentAgence.nom,
      agentId: currentUser.id,
      agentNom: `${currentUser.prenom} ${currentUser.nom}${currentUser.agentCategory ? ` (${currentUser.agentCategory})` : ''}`,
      clientNom: clientNom || (type === 'depense' ? 'Service Interne' : 'Client Guichet'),
      statut: 'validee',
      modeReglement,
      motif: motif || (type === 'depot' ? 'Versement espèces guichet' : type === 'change' ? 'Change USD vers CDF' : 'Dépense opérationnelle')
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Saisie d'une Opération Financière</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Type d'Opération</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['depot', 'retrait', 'change', 'depense'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-1.5 rounded-lg font-bold text-center capitalize transition-colors cursor-pointer ${
                    type === t
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Montant</label>
              <input
                type="number"
                min="1"
                required
                value={montant}
                onChange={e => setMontant(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Devise</label>
              <select
                value={devise}
                onChange={e => setDevise(e.target.value as 'USD' | 'CDF')}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="USD">USD ($)</option>
                <option value="CDF">CDF (Franc Congolais)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Mode de Règlement</label>
            <select
              value={modeReglement}
              onChange={e => setModeReglement(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              <option value="especes">Espèces Caisse</option>
              <option value="m_pesa">Vodacom M-Pesa</option>
              <option value="airtel_money">Airtel Money</option>
              <option value="orange_money">Orange Money</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Nom du Client / Bénéficiaire</label>
            <input
              type="text"
              value={clientNom}
              onChange={e => setClientNom(e.target.value)}
              placeholder="Ex: David BARAKA"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Motif / Libellé de l'Opération</label>
            <input
              type="text"
              required
              value={motif}
              onChange={e => setMotif(e.target.value)}
              placeholder="Ex: Versement épargne au guichet"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Agence d'Imputation</label>
            <select
              value={agenceId}
              onChange={e => setAgenceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              {agences.map(ag => (
                <option key={ag.id} value={ag.id}>
                  {ag.nom} ({ag.ville})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
            >
              Enregistrer l'Opération
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
