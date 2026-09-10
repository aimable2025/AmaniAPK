import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Smartphone, Save } from 'lucide-react';

interface SmsRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmsRuleModal: React.FC<SmsRuleModalProps> = ({ isOpen, onClose }) => {
  const { addSmsRule } = useAuth();
  const [operateur, setOperateur] = useState<'M-PESA' | 'AIRTEL MONEY' | 'ORANGE MONEY'>('M-PESA');
  const [patternRegex, setPatternRegex] = useState('');
  const [variablesDetectees, setVariablesDetectees] = useState('montant, reference, expediteur');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSmsRule({
      operateur,
      patternRegex,
      variablesDetectees: variablesDetectees.split(',').map(v => v.trim()),
      actif: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Nouvelle Règle Regex SMS Passerelle</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Opérateur Télécom</label>
            <select
              value={operateur}
              onChange={e => setOperateur(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              <option value="M-PESA">Vodacom M-PESA</option>
              <option value="AIRTEL MONEY">Airtel Money RDC</option>
              <option value="ORANGE MONEY">Orange Money RDC</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Expression Régulière (Regex)</label>
            <textarea
              required
              rows={3}
              value={patternRegex}
              onChange={e => setPatternRegex(e.target.value)}
              placeholder="Ex: Reçu (?<montant>[0-9,.]+) (?<devise>USD|CDF) de (?<expediteur>[A-Z ]+) Ref:(?<reference>[A-Z0-9]+)"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Variables à Extraire (séparées par des virgules)</label>
            <input
              type="text"
              required
              value={variablesDetectees}
              onChange={e => setVariablesDetectees(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
            />
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
              className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold"
            >
              Enregistrer la Règle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
