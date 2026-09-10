import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Agence } from '../../types';
import { X, Building2, Save } from 'lucide-react';

interface AgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyToEdit?: Agence;
}

export const AgencyModal: React.FC<AgencyModalProps> = ({ isOpen, onClose, agencyToEdit }) => {
  const { allUsers, createAgence, updateAgence } = useAuth();

  const [nom, setNom] = useState('');
  const [ville, setVille] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('+243 ');
  const [chefAgenceId, setChefAgenceId] = useState('');
  const [soldeUSD, setSoldeUSD] = useState(10000);
  const [soldeCDF, setSoldeCDF] = useState(15000000);

  const potentialChefs = allUsers.filter(u => u.role === 'chef_agence' || u.role === 'administrateur_systeme' || u.role === 'directeur_general');

  useEffect(() => {
    if (agencyToEdit) {
      setNom(agencyToEdit.nom);
      setVille(agencyToEdit.ville);
      setAdresse(agencyToEdit.adresse);
      setTelephone(agencyToEdit.telephone);
      setChefAgenceId(agencyToEdit.chefAgenceId || '');
      setSoldeUSD(agencyToEdit.soldeCaisseUSD);
      setSoldeCDF(agencyToEdit.soldeCaisseCDF);
    } else {
      setNom('');
      setVille('Goma');
      setAdresse('');
      setTelephone('+243 ');
      setChefAgenceId('');
      setSoldeUSD(10000);
      setSoldeCDF(15000000);
    }
  }, [agencyToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chef = allUsers.find(u => u.id === chefAgenceId);

    const payload = {
      nom,
      ville,
      adresse,
      telephone,
      chefAgenceId: chef?.id,
      chefAgenceNom: chef ? `${chef.prenom} ${chef.nom}` : undefined,
      soldeCaisseUSD: soldeUSD,
      soldeCaisseCDF: soldeCDF
    };

    if (agencyToEdit) {
      updateAgence(agencyToEdit.id, payload);
    } else {
      createAgence(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              {agencyToEdit ? 'Modifier Agence' : 'Créer une Nouvelle Agence'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Nom de l'Agence</label>
            <input
              type="text"
              required
              value={nom}
              onChange={e => setNom(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              placeholder="Ex: Agence Uvira Port"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Ville</label>
              <input
                type="text"
                required
                value={ville}
                onChange={e => setVille(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                placeholder="Goma, Bukavu, Kinshasa..."
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Téléphone de Contact</label>
              <input
                type="text"
                required
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Adresse Physique</label>
            <input
              type="text"
              required
              value={adresse}
              onChange={e => setAdresse(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              placeholder="Avenue, Quartier, Numéro..."
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Chef d'Agence Affecté</label>
            <select
              value={chefAgenceId}
              onChange={e => setChefAgenceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              <option value="">Sélectionner un responsable...</option>
              {potentialChefs.map(u => (
                <option key={u.id} value={u.id}>
                  {u.prenom} {u.nom} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Solde Initial USD</label>
              <input
                type="number"
                value={soldeUSD}
                onChange={e => setSoldeUSD(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Solde Initial CDF</label>
              <input
                type="number"
                value={soldeCDF}
                onChange={e => setSoldeCDF(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
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
              {agencyToEdit ? 'Mettre à jour' : 'Enregistrer Agence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
