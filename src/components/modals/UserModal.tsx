import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole, AgentCategory } from '../../types';
import { X, UserPlus, Save, ShieldAlert } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userToEdit }) => {
  const { agences, createUser, updateUser } = useAuth();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('+243 ');
  const [role, setRole] = useState<UserRole>('agent');
  const [agentCategory, setAgentCategory] = useState<AgentCategory>('agent_polyvalent');
  const [agenceId, setAgenceId] = useState('');
  const [statut, setStatut] = useState<'actif' | 'suspendu' | 'en_attente'>('actif');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setNom(userToEdit.nom);
      setPrenom(userToEdit.prenom);
      setEmail(userToEdit.email);
      setTelephone(userToEdit.telephone);
      setRole(userToEdit.role);
      setAgentCategory(userToEdit.agentCategory || 'agent_polyvalent');
      setAgenceId(userToEdit.agenceId || '');
      setStatut(userToEdit.statut as any || 'actif');
      setNotes(userToEdit.notes || '');
    } else {
      setNom('');
      setPrenom('');
      setEmail('');
      setTelephone('+243 ');
      setRole('agent');
      setAgentCategory('agent_polyvalent');
      setAgenceId(agences[0]?.id || '');
      setStatut('actif');
      setNotes('');
    }
  }, [userToEdit, agences]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAgence = agences.find(a => a.id === agenceId);

    const payload = {
      nom: nom.toUpperCase(),
      prenom,
      email,
      telephone,
      role,
      agentCategory: role === 'agent' ? agentCategory : undefined,
      agenceId: targetAgence?.id,
      agenceNom: targetAgence?.nom,
      statut,
      notes
    };

    if (userToEdit) {
      updateUser(userToEdit.id, payload);
    } else {
      createUser(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">
              {userToEdit ? 'Modifier Utilisateur' : 'Créer un Nouvel Utilisateur'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Prénom</label>
              <input
                type="text"
                required
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                placeholder="Ex: Henri"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Nom de famille</label>
              <input
                type="text"
                required
                value={nom}
                onChange={e => setNom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                placeholder="Ex: PALUKU"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Email Professionnel</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                placeholder="nom@ets-amani.cd"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Numéro de Téléphone</label>
              <input
                type="text"
                required
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                placeholder="+243 ..."
              />
            </div>
          </div>

          {/* Role Selection (Strictly the 8 official roles) */}
          <div>
            <label className="block text-slate-400 mb-1 font-bold text-amber-400">
              Rôle Officiel (Hiérarchie RBAC)
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium focus:outline-none focus:border-rose-500"
            >
              <option value="administrateur_systeme">Administrateur Système</option>
              <option value="directeur_general">Directeur Général</option>
              <option value="directeur_adjoint">Directeur Adjoint</option>
              <option value="chef_agence">Chef d'Agence</option>
              <option value="assistant_administratif">Assistant Administratif</option>
              <option value="agent">Agent</option>
              <option value="membre">Membre</option>
              <option value="requerant_membre">Requérant Membre</option>
            </select>
          </div>

          {/* Agent Category Selection (Only if role === 'agent') */}
          {role === 'agent' && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
              <label className="block text-purple-300 font-bold">
                Spécialisation Métier de l'Agent (agentCategory)
              </label>
              <p className="text-[11px] text-purple-400/80">
                Spécialisation opérationnelle n'altérant pas le rôle de sécurité RBAC (qui reste <code>agent</code>).
              </p>
              <select
                value={agentCategory}
                onChange={e => setAgentCategory(e.target.value as AgentCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-purple-500/40 text-white font-bold focus:outline-none focus:border-purple-400"
              >
                <option value="agent_polyvalent">agent_polyvalent (Compta, Guichet, Change, Mobile & Services)</option>
                <option value="comptable">comptable</option>
                <option value="guichetier">guichetier</option>
                <option value="agent_virtuel">agent_virtuel</option>
                <option value="agent_vodae">agent_vodae</option>
                <option value="agent_operateur_mobile">agent_operateur_mobile</option>
                <option value="agent_de_change">agent_de_change</option>
                <option value="chauffeur">chauffeur</option>
                <option value="cleaner">cleaner</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Agence d'Affectation</label>
              <select
                value={agenceId}
                onChange={e => setAgenceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="">Administration Centrale (Direction)</option>
                {agences.map(ag => (
                  <option key={ag.id} value={ag.id}>{ag.nom} ({ag.ville})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Statut du Compte</label>
              <select
                value={statut}
                onChange={e => setStatut(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="actif">Actif</option>
                <option value="suspendu">Suspendu</option>
                <option value="en_attente">En attente d'activation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Notes & Attributions</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500 text-xs"
              placeholder="Ex: Responsable des rapprochements d'écritures pour la zone Est..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-rose-500/10 flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>{userToEdit ? 'Enregistrer les Modifications' : 'Créer l\'Utilisateur'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
