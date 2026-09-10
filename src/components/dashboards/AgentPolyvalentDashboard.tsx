import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Layers,
  Wallet,
  CreditCard,
  Coins,
  Smartphone,
  ClipboardList,
  Plus,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { FinancialOperation, AssignedTask } from '../../types';

interface PolyvalentDashboardProps {
  subModule?: string;
  onOpenNewOperation: () => void;
}

export const AgentPolyvalentDashboard: React.FC<PolyvalentDashboardProps> = ({
  subModule = 'poly_unified',
  onOpenNewOperation
}) => {
  const {
    currentUser,
    operations,
    smsTransactions,
    tasks,
    updateTaskStatus,
    reconcileSms,
    addOperation
  } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(subModule || 'poly_unified');

  // Change currency calculator state
  const [calcMontantUSD, setCalcMontantUSD] = useState<number>(100);
  const tauxUSD_CDF = 2850;
  const contreValeurCDF = calcMontantUSD * tauxUSD_CDF;

  // Filter operations for polyvalent agent's agency or scope
  const agencyOperations = operations.filter(o => !currentUser.agenceId || o.agenceId === currentUser.agenceId);
  const depenses = agencyOperations.filter(o => o.type === 'depense');
  const recettes = agencyOperations.filter(o => o.type === 'depot');
  const changeOperations = agencyOperations.filter(o => o.type === 'change');

  // Total daily calculations
  const totalRecettesUSD = recettes.filter(o => o.devise === 'USD').reduce((a, b) => a + b.montant, 0);
  const totalDepensesUSD = depenses.filter(o => o.devise === 'USD').reduce((a, b) => a + b.montant, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              Espace de Travail Unifié — Spécialisation Métier
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Tableau de Bord — Agent Polyvalent
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Poste opérationnel transversal intégrant la comptabilité, le guichet d'agence, le change de devises, les opérateurs mobiles et les services généraux.
            </p>
          </div>
          <button
            onClick={onOpenNewOperation}
            className="flex items-center gap-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer shadow-lg shadow-purple-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Saisir une Opération</span>
          </button>
        </div>

        {/* Strict Functional Restriction Warning required by prompt */}
        <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-2.5 text-xs text-purple-300">
          <ShieldAlert className="h-4 w-4 shrink-0 text-purple-400" />
          <span>
            <strong>Règle de sécurité RBAC :</strong> Ce tableau de bord est un regroupement fonctionnel métier (Rôle RBAC : <code>agent</code>). Il ne permet pas de modifier les rôles, les permissions ni d'accéder aux comptes privés d'autres utilisateurs.
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'poly_unified', label: 'Vue d\'Ensemble Unifiée', icon: Layers },
          { id: 'poly_compta', label: 'Comptabilité & Suivi Financier', icon: Wallet },
          { id: 'poly_guichet', label: 'Guichet & Opérations', icon: CreditCard },
          { id: 'poly_change', label: 'Bureau de Change Devises', icon: Coins },
          { id: 'poly_mobile', label: 'Opérateurs Mobile & SMS', icon: Smartphone },
          { id: 'poly_services', label: 'Services Généraux & Missions', icon: ClipboardList }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODULE 1: VUE D'ENSEMBLE UNIFIÉE */}
      {(activeTab === 'poly_unified') && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Recettes du Jour</span>
                <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">${totalRecettesUSD.toLocaleString()}</div>
              <div className="mt-1 text-[11px] text-emerald-400">{recettes.length} dépôts encaissés</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Dépenses Validées</span>
                <ArrowUpRight className="h-4 w-4 text-rose-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">${totalDepensesUSD.toLocaleString()}</div>
              <div className="mt-1 text-[11px] text-slate-400">Charges & logistique locale</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Opérations de Change</span>
                <Coins className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">{changeOperations.length}</div>
              <div className="mt-1 text-[11px] text-amber-400">Taux officiel : 2,850 CDF / USD</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Rapprochements SMS</span>
                <Smartphone className="h-4 w-4 text-purple-400" />
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                {smsTransactions.filter(s => s.statut === 'rapproche').length}
              </div>
              <div className="mt-1 text-[11px] text-purple-400">
                {smsTransactions.filter(s => s.statut === 'en_attente').length} en attente
              </div>
            </div>
          </div>

          {/* Quick modules row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent agency operations */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-purple-400" />
                  Dernières Opérations Guichet
                </h3>
                <span className="text-xs text-slate-400">{agencyOperations.length} totales</span>
              </div>
              <div className="space-y-2">
                {agencyOperations.slice(0, 4).map(op => (
                  <div key={op.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{op.clientNom || op.motif}</span>
                        <span className="text-[10px] font-mono text-purple-400">{op.reference}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {op.type.toUpperCase()} • {op.modeReglement.replace('_', ' ')} • {op.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold ${
                        op.type === 'depot' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {op.type === 'depot' ? '+' : '-'}{op.montant.toLocaleString()} {op.devise}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General services tasks */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-purple-400" />
                  Missions de Terrain & Services Généraux
                </h3>
                <span className="text-xs text-slate-400">{tasks.length} missions</span>
              </div>
              <div className="space-y-2">
                {tasks.map(t => (
                  <div key={t.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{t.titre}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        const next = t.statut === 'terminee' ? 'a_faire' : 'terminee';
                        updateTaskStatus(t.id, next);
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                        t.statut === 'terminee'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {t.statut === 'terminee' ? 'Terminée' : 'Valider'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: COMPTABILITÉ */}
      {(activeTab === 'poly_compta') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wallet className="h-4 w-4 text-purple-400" />
                Module Comptabilité : Suivi Financier, Dépenses & Recettes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Balance des entrées et sorties de caisse sous la supervision de l'agent polyvalent.
              </p>
            </div>
            <button
              onClick={onOpenNewOperation}
              className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              + Enregistrer Dépense / Recette
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Total Recettes</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">${totalRecettesUSD.toLocaleString()} USD</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Total Dépenses</span>
              <div className="text-xl font-bold text-rose-400 mt-1">${totalDepensesUSD.toLocaleString()} USD</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Solde Net Journalier</span>
              <div className="text-xl font-bold text-purple-400 mt-1">${(totalRecettesUSD - totalDepensesUSD).toLocaleString()} USD</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Référence</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Motif & Détails</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Règlement</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {agencyOperations.map(op => (
                  <tr key={op.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono text-purple-400">{op.reference}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        op.type === 'depot'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : op.type === 'depense'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {op.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{op.motif}</td>
                    <td className="p-3 font-mono font-bold text-white">{op.montant.toLocaleString()} {op.devise}</td>
                    <td className="p-3 text-slate-400">{op.modeReglement.replace('_', ' ')}</td>
                    <td className="p-3 text-slate-500">{op.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 3: GUICHET */}
      {(activeTab === 'poly_guichet') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-purple-400" />
                Module Guichet : Opérations Validées & Suivi Clients
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Encaissements, décaissements et bordereaux remis aux clients au guichet.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {recettes.map(rec => (
              <div key={rec.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rec.clientNom}</span>
                    <span className="text-[10px] font-mono text-purple-400">({rec.reference})</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{rec.motif} • Mode: {rec.modeReglement}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-emerald-400">
                    +{rec.montant.toLocaleString()} {rec.devise}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{rec.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: CHANGE DE DEVISES */}
      {(activeTab === 'poly_change') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coins className="h-4 w-4 text-purple-400" />
                Module Change : Opérations de Change & Suivi Devises
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Achat et vente manuelle de devises avec application des taux de référence du jour.
              </p>
            </div>
            <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
              1 USD = 2,850 CDF • 1 EUR = 3,080 CDF
            </span>
          </div>

          {/* Currency Calculator */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Montant USD à changer</label>
              <input
                type="number"
                value={calcMontantUSD}
                onChange={e => setCalcMontantUSD(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Taux appliqué (BCC + Marge)</label>
              <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold">
                {tauxUSD_CDF} CDF / USD
              </div>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Contre-valeur à décaisser (CDF)</label>
              <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-sm">
                {contreValeurCDF.toLocaleString()} CDF
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Historique des Opérations de Change
            </h4>
            <div className="space-y-2">
              {changeOperations.map(chg => (
                <div key={chg.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{chg.clientNom}</div>
                    <div className="text-[11px] text-slate-400">Taux appliqué : {chg.tauxChange} CDF</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-emerald-400 font-bold">
                      {chg.montant} USD ➔ {chg.contreValeur?.toLocaleString()} CDF
                    </div>
                    <span className="text-[10px] text-slate-500">{chg.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: OPÉRATEUR MOBILE */}
      {(activeTab === 'poly_mobile') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-purple-400" />
                Module Opérateur Mobile : Rapports, SMS Détectés & Rapprochements
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Surveillance des passerelles M-Pesa, Airtel Money et Orange Money.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {smsTransactions.map(sms => (
              <div key={sms.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-purple-400">{sms.operateur}</span>
                    <span className="font-mono text-amber-400 font-bold">{sms.montant} {sms.devise}</span>
                    <span className="text-slate-500 text-[11px]">({sms.simAttribuee})</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    sms.statut === 'rapproche'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {sms.statut}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300">
                  {sms.messageBrut}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Reçu le : {sms.dateReception}</span>
                  {sms.statut === 'en_attente' && (
                    <button
                      onClick={() => {
                        reconcileSms(sms.id, 'op-01');
                      }}
                      className="px-2.5 py-1 rounded bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Rapprocher avec Transaction
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 6: SERVICES GÉNÉRAUX */}
      {(activeTab === 'poly_services') && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-purple-400" />
                Module Services Généraux : Tâches Diverses & Missions Attribuées
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Logistique locale, entretien, approvisionnement et suivi des missions terrain.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{task.titre}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priorite === 'haute' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      Priorité {task.priorite}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{task.description}</p>
                  <div className="text-[11px] text-slate-500">
                    Assigné à : <strong className="text-slate-300">{task.assigneA}</strong> • Échéance : {task.dateEcheance}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = task.statut === 'terminee' ? 'a_faire' : 'terminee';
                    updateTaskStatus(task.id, next);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    task.statut === 'terminee'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                  }`}
                >
                  {task.statut === 'terminee' ? 'Terminée ✓' : 'Marquer comme faite'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
