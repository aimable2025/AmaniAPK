import React, { useState } from 'react';
import {
  X,
  Users,
  Shield,
  UserPlus,
  Trash2,
  Building2,
  Calendar,
  Lock,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { ChatConversation } from '../../types';
import { ChatPermissionService } from '../../services/chat/ChatPermissionService';

interface GroupInfoModalProps {
  conversation: ChatConversation;
  isOpen: boolean;
  onClose: () => void;
}

export const GroupInfoModal: React.FC<GroupInfoModalProps> = ({
  conversation,
  isOpen,
  onClose
}) => {
  const { currentUser, allUsers } = useAuth();
  const { addParticipant } = useChat();
  const [selectedNewUser, setSelectedNewUser] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const canManage = ChatPermissionService.canManageParticipants(currentUser, conversation);

  // List users currently participating
  const participantUsers = allUsers.filter(u => conversation.participants.includes(u.id));

  // Users eligible to be added (not already participant, active, not requérant)
  const eligibleToAdd = allUsers.filter(u => {
    if (conversation.participants.includes(u.id)) return false;
    if (u.statut !== 'actif') return false;
    if (u.role === 'requerant_membre') return false;

    if (conversation.type === 'agency' && conversation.agencyId) {
      if (!['directeur_general', 'directeur_adjoint', 'administrateur_systeme'].includes(currentUser.role)) {
        return u.agenceId === conversation.agencyId;
      }
    }
    return true;
  });

  const handleAddMember = async () => {
    if (!selectedNewUser) return;
    setIsAdding(true);
    try {
      await addParticipant(conversation.id, selectedNewUser);
      setSelectedNewUser('');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'ajout');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Informations du Canal
              </h3>
              <p className="text-[11px] text-slate-400">
                {conversation.type.toUpperCase()} • {conversation.participants.length} membres
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Channel Summary Card */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-bold text-slate-100 text-sm">{conversation.title}</div>
            {conversation.description && (
              <p className="text-slate-400 italic">{conversation.description}</p>
            )}

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>
                <span className="block text-slate-500">Créé par</span>
                <span className="font-semibold text-slate-200">{conversation.createdByName}</span>
              </div>
              <div>
                <span className="block text-slate-500">Date de création</span>
                <span className="font-semibold text-slate-200">
                  {new Date(conversation.createdAt).toLocaleDateString()}
                </span>
              </div>
              {conversation.agencyNom && (
                <div>
                  <span className="block text-slate-500">Agence rattachée</span>
                  <span className="font-semibold text-cyan-400">{conversation.agencyNom}</span>
                </div>
              )}
              {conversation.service && (
                <div>
                  <span className="block text-slate-500">Service</span>
                  <span className="font-semibold text-purple-400">{conversation.service.toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Add member (if allowed) */}
          {canManage && eligibleToAdd.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <label className="font-bold text-slate-300 block">
                Ajouter un collaborateur
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedNewUser}
                  onChange={e => setSelectedNewUser(e.target.value)}
                  className="flex-1 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Sélectionnez un employé...</option>
                  {eligibleToAdd.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.prenom} {u.nom} ({u.role.replace(/_/g, ' ')})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedNewUser || isAdding}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Members list */}
          <div>
            <div className="font-bold text-slate-300 mb-2 uppercase tracking-wider text-[10px]">
              Membres autorisés ({participantUsers.length})
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {participantUsers.map(user => {
                const isAdmin = conversation.admins.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800/80"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0">
                        {user.prenom[0]}
                        {user.nom[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-200 truncate flex items-center gap-1">
                          <span>{user.prenom} {user.nom}</span>
                          {isAdmin && (
                            <span title="Administrateur du groupe">
                              <Crown className="h-3 w-3 text-amber-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {user.role.replace(/_/g, ' ')} {user.agenceNom ? `• ${user.agenceNom}` : ''}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-900">
                      Actif
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
