import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Crown,
  Users,
  Wallet,
  Radio,
  Building2,
  FileText,
  ShieldCheck,
  ClipboardList,
  TrendingUp,
  CheckCircle2,
  Send,
  Download,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  CalendarCheck,
  Percent
} from 'lucide-react';
import { CommercialCommissionsModule } from './CommercialCommissionsModule';

interface DGDashboardProps {
  activeTab: string;
  onOpenBroadcastModal: () => void;
}

export const DirecteurGeneralDashboard: React.FC<DGDashboardProps> = ({ activeTab, onOpenBroadcastModal }) => {
  const {
    allUsers,
    agences,
    operations,
    payroll,
    announcements,
    auditLogs,
    markPayrollPaid
  } = useAuth();

  // Financial aggregates
  const totalVolumeUSD = operations
    .filter(o => o.devise === 'USD')
    .reduce((acc, o) => acc + o.montant, 0);

  const totalVolumeCDF = operations
    .filter(o => o.devise === 'CDF')
    .reduce((acc, o) => acc + o.montant, 0);

  const totalSalairesUSD = payroll.reduce((acc, p) => acc + p.netPayerUSD, 0);

  // Agency breakdown
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Crown className="h-4 w-4" />
              Direction Générale — Supervision Stratégique & Décisionnelle
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Tableau de Bord du Directeur Général
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Pilotage global multi-agences, gestion administrative (Personnel, Salaires, Communication, Contrôle & Audits) de Ets AMANI.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBroadcastModal}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <Radio className="h-4 w-4" />
              <span>Diffuser Annonce Globale</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Top Stats */}
      {(activeTab === 'dg_overview' || !activeTab) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Volume d'Affaires USD</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">${totalVolumeUSD.toLocaleString()}</div>
            <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>Opérations enregistrées</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Volume d'Affaires CDF</span>
              <Wallet className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-white">{totalVolumeCDF.toLocaleString()} CDF</div>
            <div className="mt-1 text-[11px] text-cyan-400">
              Flux cumulés multi-devises
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Masse Salariale Mensuelle</span>
              <Users className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">${totalSalairesUSD.toLocaleString()}</div>
            <div className="mt-1 text-[11px] text-amber-400">
              {payroll.filter(p => p.statut === 'paye').length} employés payés
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Réseau d'Agences</span>
              <Building2 className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">{agences.length}</div>
            <div className="mt-1 text-[11px] text-purple-400">
              Toutes les agences opérationnelles
            </div>
          </div>
        </div>
      )}

      {/* Menu Administration Section: COMMISSIONS & GRILLE TARIFAIRE (Gouvernance DG Exclusif) */}
      {(activeTab === 'dg_commissions' || activeTab === 'dg_overview') && (
        <CommercialCommissionsModule />
      )}

      {/* Menu Administration Section: PERSONNEL */}
      {(activeTab === 'dg_personnel' || activeTab === 'dg_overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                Administration : Personnel, Affectations & Organigramme
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Vue d'ensemble de l'effectif global, présences et affectations provinciales.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {allUsers.filter(u => u.role !== 'membre' && u.role !== 'requerant_membre').map(emp => (
              <div key={emp.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-sm text-white">{emp.prenom} {emp.nom}</span>
                    <div className="font-mono text-[11px] text-amber-400">{emp.matricule}</div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Présent
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Poste : <strong className="text-white capitalize">{emp.role.replace('_', ' ')}</strong>
                  {emp.agentCategory && <span className="text-purple-400 font-medium"> ({emp.agentCategory})</span>}
                </div>
                <div className="text-[11px] text-slate-400">
                  Affectation : <span className="text-slate-300">{emp.agenceNom || 'Direction Générale'}</span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                  Dernière activité : {emp.derniereConnexion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Administration Section: SALAIRES */}
      {(activeTab === 'dg_salaires' || activeTab === 'dg_overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="h-4 w-4 text-emerald-400" />
                Administration : Salaires, Fiches & Paiements
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Historique des fiches salariales, statistiques et validation des états de paie.
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              Total : ${totalSalairesUSD.toLocaleString()} USD
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Employé</th>
                  <th className="p-3">Poste & Agence</th>
                  <th className="p-3">Période</th>
                  <th className="p-3">Salaire de Base</th>
                  <th className="p-3">Primes</th>
                  <th className="p-3">Net à Payer</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payroll.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-800/30">
                    <td className="p-3">
                      <div className="font-bold text-white">{pay.userNom}</div>
                      <div className="font-mono text-[10px] text-slate-400">{pay.matricule}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-200">{pay.poste}</div>
                      <div className="text-[11px] text-slate-400">{pay.agenceNom}</div>
                    </td>
                    <td className="p-3 text-slate-300">{pay.mois}</td>
                    <td className="p-3 font-mono text-slate-300">${pay.salaireBaseUSD}</td>
                    <td className="p-3 font-mono text-emerald-400">+${pay.primesUSD}</td>
                    <td className="p-3 font-mono font-bold text-white">${pay.netPayerUSD}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {pay.statut}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {pay.statut !== 'paye' ? (
                        <button
                          onClick={() => markPayrollPaid(pay.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px]"
                        >
                          Valider Paiement
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">Payé le {pay.datePaiement}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Menu Administration Section: COMMUNICATION */}
      {(activeTab === 'dg_communication' || activeTab === 'dg_overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="h-4 w-4 text-cyan-400" />
                Administration : Communication Interne & Annonces
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Diffusion globale des consignes, messages d'information et notes de service.
              </p>
            </div>
            <button
              onClick={onOpenBroadcastModal}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 text-xs transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Publier Communiqué</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{ann.titre}</span>
                  <span className="text-[11px] font-mono text-amber-400">{ann.date}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.contenu}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>Auteur : <strong className="text-slate-200">{ann.auteurNom}</strong> ({ann.auteurRole})</span>
                  <span>Cible : <strong className="text-amber-400 uppercase">{ann.cible}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Administration Section: AGENCES */}
      {(activeTab === 'dg_agences' || activeTab === 'dg_overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-400" />
                Administration : Performances & Activités des Agences
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Supervision directe des 5 agences provinciales et encaissements enregistrés.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {agences.map(ag => (
              <div key={ag.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{ag.nom}</span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{ag.code}</span>
                </div>
                <div className="text-xs text-slate-400">Ville : {ag.ville} • {ag.nbEmployes} collaborateurs</div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Solde Caisse USD</span>
                    <div className="font-bold text-emerald-400">${ag.soldeCaisseUSD.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Solde Caisse CDF</span>
                    <div className="font-bold text-cyan-400">{ag.soldeCaisseCDF.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Chef : <strong className="text-slate-200">{ag.chefAgenceNom || 'Non assigné'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Administration Section: RAPPORTS & SYNTHÈSES */}
      {(activeTab === 'dg_rapports' || activeTab === 'dg_overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-400" />
                Administration : Rapports & Tableaux de Bord Globaux
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Synthèse opérationnelle consolidée prête pour la direction et les partenaires financiers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Ratio Encaissement / Décaissement</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">94.2%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Équilibre financier conforme aux normes de la BCC.</p>
            </div>
            <div>
              <span className="text-slate-400">Taux de Rapprochement SMS</span>
              <div className="text-lg font-bold text-purple-400 mt-1">98.5%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Concordance automatisée via les passerelles SIM.</p>
            </div>
            <div>
              <span className="text-slate-400">Croissance Mensuelle</span>
              <div className="text-lg font-bold text-amber-400 mt-1">+14.8%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Dynamisme des agences de Goma et Kinshasa.</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Administration Section: CONTRÔLE & AUDITS */}
      {(activeTab === 'dg_controle' || activeTab === 'dg_audits' || activeTab === 'dg_overview') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-rose-400" />
                Administration : Contrôle, Alertes & Supervision
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspection des anomalies et historique des événements de supervision.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{log.action}</span>
                    <span className="text-slate-500">• {log.utilisateur}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{log.details}</p>
                </div>
                <span className="font-mono text-[10px] text-slate-500">{log.horodatage}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
