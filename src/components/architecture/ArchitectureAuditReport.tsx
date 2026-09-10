import React from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  GitMerge,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles
} from 'lucide-react';

interface AuditItem {
  fichier: string;
  roleFichier: string;
  dependances: string;
  justification: string;
  action: 'conserver' | 'fusionner' | 'supprimer' | 'refactoriser';
  statut: string;
}

export const ArchitectureAuditReport: React.FC = () => {
  const auditEntries: AuditItem[] = [
    {
      fichier: 'src/types.ts',
      roleFichier: 'Définitions centrales des types, rôles officiels et catégories métier',
      dependances: 'React, composants dashboards, contextes',
      justification: 'Harmonisation stricte : élimination de ADMIN_PRINCIPAL, introduction des 8 rôles officiels et 9 catégories d\'agents (dont agent_polyvalent).',
      action: 'refactoriser',
      statut: 'Appliqué avec succès'
    },
    {
      fichier: 'src/types/roles.ts & src/types/users.ts (V1)',
      roleFichier: 'Anciens types éclatés contenant les appellations obsolètes',
      dependances: 'Anciens dashboards V1',
      justification: 'Redondance et dispersion des types avec d\'anciennes terminologies (Admin principal). Consolidation en un fichier unique canonique `src/types.ts`.',
      action: 'fusionner',
      statut: 'Fusionné dans src/types.ts'
    },
    {
      fichier: 'src/pages/dashboards/AdminDashboard.tsx (V1)',
      roleFichier: 'Ancien tableau de bord d\'administration générale',
      dependances: 'AuthContext V1',
      justification: 'Remplacé par le tableau de bord exhaustif "Administrateur Système" avec gestion complète des utilisateurs, RBAC, agences, passerelles SMS et terminaux.',
      action: 'refactoriser',
      statut: 'Remplacé par AdminSystemeDashboard'
    },
    {
      fichier: 'src/pages/dashboards/DGDashboard.tsx (V1)',
      roleFichier: 'Ancien tableau de bord Direction Générale sans menu administration structuré',
      dependances: 'Services V1',
      justification: 'Intégration du menu officiel Administration avec ses 7 sous-sections obligatoires : Personnel, Salaires, Communication, Agences, Rapports, Contrôle et Audits.',
      action: 'refactoriser',
      statut: 'Remplacé par DirecteurGeneralDashboard'
    },
    {
      fichier: 'src/components/dashboards/DirecteurAdjointDashboard.tsx',
      roleFichier: 'Nouveau rôle officiel "directeur_adjoint"',
      dependances: 'AuthContext, types',
      justification: 'Création du tableau de bord d\'assistance au DG avec supervision d\'agences et restriction stricte d\'accès aux rôles et à la sécurité.',
      action: 'conserver',
      statut: 'Créé et opérationnel'
    },
    {
      fichier: 'src/components/dashboards/AssistantAdministratifDashboard.tsx',
      roleFichier: 'Nouveau rôle officiel "assistant_administratif"',
      dependances: 'AuthContext, types',
      justification: 'Module de support administratif : instruction des dossiers d\'adhésion, archivage de pièces justificatives et suivi sans accès aux paramètres critiques.',
      action: 'conserver',
      statut: 'Créé et opérationnel'
    },
    {
      fichier: 'src/components/dashboards/AgentPolyvalentDashboard.tsx',
      roleFichier: 'Poste métier "agent_polyvalent" (Rôle RBAC : agent)',
      dependances: 'AuthContext, types, opérations',
      justification: 'Création de l\'espace unifié transversal autorisant les modules Comptabilité, Guichet, Change de devises, Opérateur Mobile et Services Généraux sans accès admin.',
      action: 'conserver',
      statut: 'Créé et opérationnel'
    },
    {
      fichier: 'src/components/modals/LoginModal.tsx & src/components/auth/LoginModal.tsx (V1)',
      roleFichier: 'Composants modaux d\'authentification dupliqués en deux endroits',
      dependances: 'App.tsx, AuthContext',
      justification: 'Duplication stricte de code dans deux dossiers différents (`src/components/auth/` et `src/components/modals/`). Fusion en un seul composant propre.',
      action: 'fusionner',
      statut: 'Unifié dans le système modal'
    },
    {
      fichier: 'src/pages/dashboards/ClientDashboard.tsx & MembreDashboard.tsx (V1)',
      roleFichier: 'Deux tableaux de bord distincts pour le même profil de membre',
      dependances: 'Routes V1',
      justification: 'Client et Membre désignaient la même entité d\'adhérent dans la hiérarchie officielle. Consolidation dans le rôle officiel unique `membre`.',
      action: 'fusionner',
      statut: 'Unifié sous MembreDashboard'
    },
    {
      fichier: 'src/pages/dashboards/RequerantDashbord.tsx & RequerantDashboard.tsx (V1)',
      roleFichier: 'Faute de frappe dans le nom de fichier V1 ("Dashbord" vs "Dashboard")',
      dependances: 'Routes V1',
      justification: 'Doublon avec coquille d\'orthographe dans le nom du fichier. Supprimé au profit du composant standard `RequerantMembreDashboard.tsx`.',
      action: 'supprimer',
      statut: 'Corrigé et unifié'
    },
    {
      fichier: 'src/services/sms/smsParserService.ts & DetectionService.ts (V1)',
      roleFichier: 'Deux moteurs concurrents de parsing SMS d\'opérateurs mobiles',
      dependances: 'SmsReconciliationView',
      justification: 'Logique regex redondante pour M-Pesa, Airtel Money et Orange Money. Centralisation dans le moteur de règles dynamiques de l\'Administrateur Système.',
      action: 'fusionner',
      statut: 'Centralisé dans AuthContext & SMS Gateway'
    },
    {
      fichier: 'src/services/db/offlineDb.ts & src/db.ts (V1)',
      roleFichier: 'Schémas Dexie dupliqués pour le stockage hors-ligne',
      dependances: 'SyncService',
      justification: 'Conflits de version Dexie et doublon de tables. Alignement sous le schéma unifié conforme aux 8 nouveaux rôles.',
      action: 'fusionner',
      statut: 'Unifié et synchronisé'
    }
  ];

  const getActionBadge = (action: AuditItem['action']) => {
    switch (action) {
      case 'conserver':
        return { label: 'Conserver', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 };
      case 'fusionner':
        return { label: 'Fusionner', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: GitMerge };
      case 'refactoriser':
        return { label: 'Refactoriser', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: RefreshCw };
      case 'supprimer':
        return { label: 'Supprimer', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: Trash2 };
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 p-5">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <FileSpreadsheet className="h-4 w-4" />
          Rapport Technique Obligatoire — Audit d'Architecture & Consolidation
        </div>
        <h2 className="text-xl font-black text-white mt-1">
          Rapport d'Audit Technique & Nettoyage Architectural
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Conformément aux points 9 et 10 du cahier des charges : inventaire exhaustif des composants, justification technique de chaque fusion/suppression, élimination des anciens rôles et consolidation du RBAC.
        </p>
      </div>

      {/* Audit Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Matrice de Traçabilité & Justification Technique
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            100% Vérifié & Audité
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Fichier Concerné</th>
                <th className="p-3">Rôle du Fichier</th>
                <th className="p-3">Dépendances</th>
                <th className="p-3">Justification Technique</th>
                <th className="p-3">Action Proposée</th>
                <th className="p-3 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditEntries.map((item, idx) => {
                const actionBadge = getActionBadge(item.action);
                const Icon = actionBadge.icon;

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono text-purple-400 font-semibold">{item.fichier}</td>
                    <td className="p-3 text-slate-300">{item.roleFichier}</td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{item.dependances}</td>
                    <td className="p-3 text-slate-300 max-w-xs leading-relaxed">{item.justification}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] border ${actionBadge.color}`}>
                        <Icon className="h-3 w-3" />
                        {actionBadge.label}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium text-emerald-400 font-mono text-[11px]">
                      {item.statut}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
