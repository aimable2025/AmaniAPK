import React, { useState } from 'react';
import {
  X,
  Plus,
  User,
  Users,
  Building2,
  Briefcase,
  Radio,
  Check,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { ChatConversationType, User as UserType } from '../../types';
import { ChatPermissionService } from '../../services/chat/ChatPermissionService';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, allUsers, agences } = useAuth();
  const { createConversation } = useChat();

  const [type, setType] = useState<ChatConversationType>('private');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(currentUser?.agenceId || 'ag-1');
  const [selectedService, setSelectedService] = useState<string>('comptabilite');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Filter available target users:
  // Strictly exclude 'requerant_membre' and external clients
  const eligibleUsers = allUsers.filter(u => {
    if (u.id === currentUser.id) return false;
    if (u.statut !== 'actif') return false;
    if (u.role === 'requerant_membre') return false;

    // For agency chat, strictly filter to members of the selected agency (unless DG/Adjoint)
    if (type === 'agency') {
      if (['directeur_general', 'directeur_adjoint', 'administrateur_systeme'].includes(currentUser.role)) {
        return true;
      }
      return u.agenceId === selectedAgencyId;
    }

    return true;
  });

  const handleToggleUser = (userId: string) => {
    if (type === 'private') {
      setSelectedUserIds([userId]);
      const targetUser = allUsers.find(u => u.id === userId);
      if (targetUser) {
        setTitle(`${currentUser.prenom} ${currentUser.nom} ↔ ${targetUser.prenom} ${targetUser.nom}`);
      }
    } else {
      setSelectedUserIds(prev =>
        prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0 && type !== 'global') {
      alert('Veuillez sélectionner au moins un participant');
      return;
    }

    let finalTitle = title.trim();
    if (!finalTitle) {
      if (type === 'agency') {
        const ag = agences.find(a => a.id === selectedAgencyId);
        finalTitle = `Agence ${ag ? ag.nom : 'Locale'}`;
      } else if (type === 'service') {
        finalTitle = `Pôle ${selectedService.toUpperCase()}`;
      } else {
        finalTitle = 'Nouvelle conversation';
      }
    }

    setIsSubmitting(true);
    try {
      const targetAgency = agences.find(a => a.id === selectedAgencyId);

      await createConversation({
        type,
        title: finalTitle,
        description: description.trim(),
        participants: selectedUserIds,
        agencyId: type === 'agency' ? selectedAgencyId : undefined,
        agencyNom: type === 'agency' ? targetAgency?.nom : undefined,
        service: type === 'service' ? selectedService : undefined
      });

      onClose();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canCreateAgency = ChatPermissionService.canCreateConversation(currentUser, 'agency', selectedAgencyId);
  const canCreateService = ChatPermissionService.canCreateConversation(currentUser, 'service');
  const canCreateGlobal = ChatPermissionService.canCreateConversation(currentUser, 'global');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Nouvelle Conversation Sécurisée
              </h3>
              <p className="text-xs text-slate-400">
                Messagerie professionnelle Ets AMANI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Conversation Type Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Type de canal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('private');
                  setSelectedUserIds([]);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'private'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Privé (1 à 1)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('group')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  type === 'group'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Groupe</span>
              </button>

              {canCreateAgency && (
                <button
                  type="button"
                  onClick={() => setType('agency')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    type === 'agency'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  <span>Agence</span>
                </button>
              )}

              {canCreateService && (
                <button
                  type="button"
                  onClick={() => setType('service')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    type === 'service'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Service</span>
                </button>
              )}

              {canCreateGlobal && (
                <button
                  type="button"
                  onClick={() => setType('global')}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    type === 'global'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Radio className="h-4 w-4" />
                  <span>Diffusion DG</span>
                </button>
              )}
            </div>
          </div>

          {/* Title input (for group, agency, service, global) */}
          {type !== 'private' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Titre du canal
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Équipe Guichets et Change"
                required
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Agency selector if Agency type */}
          {type === 'agency' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sélectionnez l'agence
              </label>
              <select
                value={selectedAgencyId}
                onChange={e => setSelectedAgencyId(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {agences.map(ag => (
                  <option key={ag.id} value={ag.id}>
                    {ag.nom} ({ag.ville})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Service selector if Service type */}
          {type === 'service' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Département / Service
              </label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="comptabilite">Comptabilité Générale</option>
                <option value="caisse">Caisse Centrale</option>
                <option value="guichet">Opérations Guichet</option>
                <option value="change">Change Devises</option>
                <option value="mobile_money">Opérateurs Mobile Money (M-Pesa / Airtel)</option>
                <option value="administration">Administration Générale</option>
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description (optionnel)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Objectif ou cadre de ce canal de discussion..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Participants Selection */}
          {type !== 'global' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Sélectionner les participants ({selectedUserIds.length} sélectionné(s))
                </label>
                <span className="text-[11px] text-slate-500">
                  {type === 'private' ? 'Choisissez 1 interlocuteur' : 'Sélection multiple'}
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 border border-slate-800 rounded-xl p-2 bg-slate-950/60">
                {eligibleUsers.map(user => {
                  const isChecked = selectedUserIds.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleToggleUser(user.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isChecked
                          ? 'bg-amber-500/20 border border-amber-500/40 text-slate-100'
                          : 'hover:bg-slate-900 border border-transparent text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                          {user.prenom[0]}
                          {user.nom[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {user.prenom} {user.nom}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {user.role.replace(/_/g, ' ')} {user.agenceNom ? `• ${user.agenceNom}` : ''}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`h-5 w-5 rounded-lg border flex items-center justify-center ${
                          isChecked
                            ? 'bg-amber-500 border-amber-500 text-slate-950'
                            : 'border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || (selectedUserIds.length === 0 && type !== 'global')}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Création en cours...' : 'Créer le canal de communication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
