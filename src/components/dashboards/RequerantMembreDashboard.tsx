import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UserPlus,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Upload
} from 'lucide-react';

export const RequerantMembreDashboard: React.FC = () => {
  const { currentUser, membershipRequests } = useAuth();

  const myRequest = membershipRequests.find(r => r.email === currentUser.email) || membershipRequests[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-slate-900 to-slate-900 border border-stone-600/30 p-5">
        <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider">
          <UserPlus className="h-4 w-4" />
          Portail Candidat — Ets AMANI
        </div>
        <h2 className="text-xl font-black text-white mt-1">
          Suivi de Ma Demande d'Adhésion
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Votre dossier d'adhésion en tant que membre est en cours de traitement par le secrétariat administratif.
        </p>
      </div>

      {/* Status Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400">Statut actuel du dossier :</span>
            <div className="text-lg font-bold text-white mt-0.5">
              {myRequest.statut === 'en_analyse' && 'En cours d\'instruction par l\'Assistant Administratif'}
              {myRequest.statut === 'en_attente_documents' && 'Documents complémentaires requis'}
              {myRequest.statut === 'approuve' && 'Dossier Approuvé — Prêt pour ouverture de compte'}
              {myRequest.statut === 'rejete' && 'Dossier Non Retenu'}
            </div>
          </div>
          <span className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold ${
            myRequest.statut === 'approuve'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : myRequest.statut === 'rejete'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {myRequest.statut}
          </span>
        </div>

        {myRequest.commentaires && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <strong className="text-amber-400">Message de l'administration : </strong>
            {myRequest.commentaires}
          </div>
        )}
      </div>

      {/* Documents verification */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-stone-400" />
          Pièces Justificatives Déposées
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {myRequest.documents.map((doc, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">{doc.nom}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                doc.statut === 'fourni'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-rose-500/10 text-rose-400'
              }`}>
                {doc.statut === 'fourni' ? 'Validé ✓' : 'À fournir'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
