import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  UserPlus,
  FileText,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  ShieldX,
  Search,
  Check
} from 'lucide-react';
import { MembershipRequest } from '../../types';

interface AssistantAdminDashboardProps {
  activeTab: string;
}

export const AssistantAdministratifDashboard: React.FC<AssistantAdminDashboardProps> = ({ activeTab }) => {
  const { membershipRequests, updateMembershipStatus, announcements } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [actionComment, setActionComment] = useState('');

  const filteredRequests = membershipRequests.filter(r =>
    filterStatus === 'all' ? true : r.statut === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/20 p-5">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <FileCheck2 className="h-4 w-4" />
          Secrétariat Général & Support Administratif
        </div>
        <h2 className="text-xl font-black text-white mt-1">
          Tableau de Bord — Assistant Administratif
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Gestion des dossiers d'adhésion, traitement des demandes de requérants membres, archivage de pièces et assistance à la direction.
        </p>

        {/* Security boundary callout */}
        <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2.5 text-xs text-cyan-300">
          <ShieldX className="h-4 w-4 shrink-0 text-cyan-400" />
          <span>
            <strong>Règles RBAC strictes :</strong> L'Assistant Administratif traite les dossiers et documents administratifs, mais ne peut modifier aucun paramètre système, ni rôle ou permission de sécurité.
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Dossiers d'Adhésion</span>
            <UserPlus className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{membershipRequests.length}</div>
          <div className="mt-1 text-xs text-cyan-400">Demandes enregistrées</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>En Cours d'Analyse</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {membershipRequests.filter(r => r.statut === 'en_analyse').length}
          </div>
          <div className="mt-1 text-xs text-amber-400">Pièces en vérification</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Approuvés & Transmis</span>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {membershipRequests.filter(r => r.statut === 'approuve').length}
          </div>
          <div className="mt-1 text-xs text-emerald-400">Prêts pour création de compte</div>
        </div>
      </div>

      {/* Membership Requests Management */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-cyan-400" />
              Traitement des Demandes d'Adhésion (Requérants Membres)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Examen des dossiers, vérification des pièces justificatives et transmission de conformité.
            </p>
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tous les états</option>
            <option value="en_analyse">En cours d'analyse</option>
            <option value="en_attente_documents">Documents manquants</option>
            <option value="approuve">Approuvé</option>
            <option value="rejete">Rejeté</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredRequests.map(req => (
            <div key={req.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{req.prenom} {req.requerantNom}</span>
                    <span className="font-mono text-xs text-cyan-400 font-medium">({req.typeMembreSouhaite})</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {req.email} • {req.telephone} • {req.adresse}
                  </div>
                </div>
                <span className={`self-start sm:self-center px-2.5 py-1 rounded-full text-xs font-bold ${
                  req.statut === 'approuve'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : req.statut === 'rejete'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {req.statut}
                </span>
              </div>

              {/* Documents Checklist */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pièces Justificatives Déposées :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                  {req.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-xs">
                      <span className="text-slate-300">{doc.nom}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        doc.statut === 'fourni' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}>
                        {doc.statut}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {req.commentaires && (
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <strong className="text-cyan-400">Observation administrative :</strong> {req.commentaires}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => {
                    updateMembershipStatus(req.id, 'en_attente_documents', 'Pièces complémentaires requises pour validation');
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                >
                  Demander Complément
                </button>
                <button
                  onClick={() => {
                    updateMembershipStatus(req.id, 'rejete', 'Critères d\'éligibilité non remplis');
                  }}
                  className="px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs cursor-pointer"
                >
                  Rejeter
                </button>
                <button
                  onClick={() => {
                    updateMembershipStatus(req.id, 'approuve', 'Dossier validé par l\'assistant administratif');
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Approuver le Dossier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
