import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Radio, Send } from 'lucide-react';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addAnnouncement } = useAuth();
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [cible, setCible] = useState<'tous' | 'agences' | 'agents' | 'membres'>('tous');
  const [priorite, setPriorite] = useState<'normale' | 'urgente'>('normale');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      titre,
      contenu,
      auteurId: currentUser.id,
      auteurNom: `${currentUser.prenom} ${currentUser.nom}`,
      auteurRole: currentUser.role,
      cible,
      priorite
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Diffusion Globale d'une Annonce</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Titre de l'Annonce / Note de Service</label>
            <input
              type="text"
              required
              value={titre}
              onChange={e => setTitre(e.target.value)}
              placeholder="Ex: Clôture comptable mensuelle..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Public Cible</label>
              <select
                value={cible}
                onChange={e => setCible(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="tous">Tout le réseau (Global)</option>
                <option value="agences">Chefs d'Agences</option>
                <option value="agents">Agents Opérationnels</option>
                <option value="membres">Membres Adhérents</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Niveau de Priorité</label>
              <select
                value={priorite}
                onChange={e => setPriorite(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="normale">Priorité Normale</option>
                <option value="urgente">Priorité Urgente (Notification Push)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Contenu Détaillé</label>
            <textarea
              required
              rows={4}
              value={contenu}
              onChange={e => setContenu(e.target.value)}
              placeholder="Rédigez ici la consigne officielle ou l'annonce pour le réseau Ets AMANI..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white leading-relaxed"
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
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              <span>Publier Communiqué</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
