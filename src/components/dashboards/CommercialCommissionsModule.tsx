import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CommercialCommission } from '../../types';
import {
  Percent,
  Plus,
  Shield,
  Tag,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  Info,
  Calendar,
  Building2,
  Lock,
  PauseCircle,
  PlayCircle
} from 'lucide-react';

export const CommercialCommissionsModule: React.FC = () => {
  const {
    commissions,
    createCommission,
    updateCommission,
    toggleCommissionStatus,
    agences,
    currentUser
  } = useAuth();

  const [isCreating, setIsCreating] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<CommercialCommission | null>(null);

  // Form states
  const [titre, setTitre] = useState('');
  const [service, setService] = useState<'transfert' | 'change' | 'mobile_money' | 'retrait' | 'depot'>('transfert');
  const [tauxPourcentage, setTauxPourcentage] = useState<number>(1.5);
  const [montantFixeUSD, setMontantFixeUSD] = useState<number>(0);
  const [montantFixeCDF, setMontantFixeCDF] = useState<number>(0);
  const [operateur, setOperateur] = useState<string>('Tous');
  const [zoneGeographique, setZoneGeographique] = useState<string>('National (RDC)');
  const [agenceId, setAgenceId] = useState<string>('');
  const [dateDebut, setDateDebut] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dateFin, setDateFin] = useState<string>('2025-12-31');
  const [estPromotion, setEstPromotion] = useState<boolean>(false);
  const [motif, setMotif] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Status toggle reason modal
  const [statusModalComm, setStatusModalComm] = useState<CommercialCommission | null>(null);
  const [statusReason, setStatusReason] = useState<string>('');

  const isDG = currentUser.role === 'directeur_general' || currentUser.role === 'directeur_adjoint';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim()) {
      setFormError('Le titre de la commission est obligatoire.');
      return;
    }
    if (!motif.trim()) {
      setFormError('Le motif stratégique / décisionnel est obligatoire pour toute nouvelle commission.');
      return;
    }

    const agenceFound = agences.find(a => a.id === agenceId);

    createCommission(
      {
        titre: titre.trim(),
        service,
        tauxPourcentage: Number(tauxPourcentage),
        montantFixeUSD: Number(montantFixeUSD) || 0,
        montantFixeCDF: Number(montantFixeCDF) || 0,
        operateur,
        zoneGeographique,
        agenceId: agenceId || undefined,
        agenceNom: agenceFound?.nom,
        pays: 'RDC',
        estPromotion,
        statut: 'active',
        dateDebut,
        dateFin,
        creeParId: currentUser.id,
        creeParNom: `${currentUser.prenom} ${currentUser.nom} (${currentUser.role})`
      },
      motif.trim()
    );

    // Reset
    setIsCreating(false);
    setTitre('');
    setMotif('');
    setTauxPourcentage(1.5);
    setMontantFixeUSD(0);
    setMontantFixeCDF(0);
    setFormError(null);
  };

  const handleToggleStatus = (comm: CommercialCommission) => {
    setStatusModalComm(comm);
    setStatusReason('');
  };

  const confirmToggleStatus = () => {
    if (!statusModalComm) return;
    if (!statusReason.trim()) {
      alert('Un motif est obligatoire pour suspendre ou réactiver une commission commerciale.');
      return;
    }

    const nextStatus = statusModalComm.statut === 'active' ? 'suspendue' : 'active';
    toggleCommissionStatus(statusModalComm.id, nextStatus, statusReason.trim());
    setStatusModalComm(null);
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-5">
      {/* Header & Governance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Grille Tarifaire & Commissions Commerciales
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Gouvernance Direction Générale
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Politique tarifaire souveraine de Ets AMANI. Définition des pourcentages, paliers fixes, dérogations régionales et promotions.
          </p>
        </div>

        {isDG ? (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Définir Nouvelle Commission</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>Modification réservée au DG</span>
          </div>
        )}
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Création d'une règle de commission
            </span>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Annuler
            </button>
          </div>

          {formError && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Intitulé de la commission</label>
              <input
                type="text"
                value={titre}
                onChange={e => setTitre(e.target.value)}
                placeholder="Ex: Transfert Inter-provinces Rapide"
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Service ciblé</label>
              <select
                value={service}
                onChange={e => setService(e.target.value as any)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="transfert">Transfert d'argent</option>
                <option value="change">Change de devises (USD/CDF)</option>
                <option value="mobile_money">Mobile Money (M-Pesa, Airtel, Orange)</option>
                <option value="depot">Dépôt guichet</option>
                <option value="retrait">Retrait guichet</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Opérateur</label>
              <select
                value={operateur}
                onChange={e => setOperateur(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Tous">Tous opérateurs</option>
                <option value="Vodacom">Vodacom (M-Pesa)</option>
                <option value="Airtel">Airtel Money</option>
                <option value="Orange">Orange Money</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Taux en pourcentage (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={tauxPourcentage}
                onChange={e => setTauxPourcentage(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Frais fixes additionnels (USD)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={montantFixeUSD}
                onChange={e => setMontantFixeUSD(parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Périmètre / Agence</label>
              <select
                value={agenceId}
                onChange={e => setAgenceId(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="">Réseau National (Toutes les agences)</option>
                {agences.map(a => (
                  <option key={a.id} value={a.id}>
                    Agence {a.nom} ({a.ville})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Date d'effet</label>
              <input
                type="date"
                value={dateDebut}
                onChange={e => setDateDebut(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Date de fin prévue</label>
              <input
                type="date"
                value={dateFin}
                onChange={e => setDateFin(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="checkPromo"
                checked={estPromotion}
                onChange={e => setEstPromotion(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
              />
              <label htmlFor="checkPromo" className="text-slate-300">
                Tarif Promotionnel / Offre spéciale
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 text-xs">
              Motif décisionnel DG (Obligatoire pour traçabilité d'audit)
            </label>
            <textarea
              rows={2}
              value={motif}
              onChange={e => setMotif(e.target.value)}
              placeholder="Ex: Décision de la direction pour capter les flux marchands de la zone Est..."
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Enregistrer & Publier Commission
            </button>
          </div>
        </form>
      )}

      {/* Grid of Active Commissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {commissions.map(comm => {
          const isActive = comm.statut === 'active';
          return (
            <div
              key={comm.id}
              className={`p-4 rounded-xl border transition-all ${
                isActive
                  ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-800/40 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-bold text-sm text-white">{comm.titre}</span>
                  <div className="text-[11px] text-amber-400 font-medium capitalize mt-0.5 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>{comm.service.replace('_', ' ')}</span>
                    {comm.estPromotion && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-300 font-bold">
                        PROMO
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {comm.statut}
                </span>
              </div>

              {/* Rate Big Display */}
              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 my-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-400">Taux appliqué :</span>
                  <div className="text-xl font-black text-amber-400">
                    {comm.tauxPourcentage}%
                    {comm.montantFixeUSD > 0 && (
                      <span className="text-xs text-slate-300 font-normal"> + ${comm.montantFixeUSD} USD</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 text-[11px] text-slate-400 mb-3">
                <div className="flex items-center justify-between">
                  <span>Périmètre :</span>
                  <span className="text-slate-200 font-medium">{comm.agenceNom || comm.zoneGeographique || 'National'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Opérateur :</span>
                  <span className="text-slate-200">{comm.operateur}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Période :</span>
                  <span className="font-mono text-[10px] text-slate-400">{comm.dateDebut} au {comm.dateFin}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => setSelectedHistory(comm)}
                  className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  <History className="h-3 w-3" />
                  <span>Historique ({comm.historiqueModifications.length})</span>
                </button>

                {isDG && (
                  <button
                    onClick={() => handleToggleStatus(comm)}
                    className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                      isActive
                        ? 'text-rose-400 hover:bg-rose-500/10'
                        : 'text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <PauseCircle className="h-3.5 w-3.5" />
                        <span>Suspendre</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>Réactiver</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* History Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <History className="h-4 w-4 text-cyan-400" />
                  Traçabilité des modifications
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedHistory.titre}</p>
              </div>
              <button
                onClick={() => setSelectedHistory(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedHistory.historiqueModifications.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="font-mono">{item.date}</span>
                    <span className="text-amber-400 font-medium">{item.auteurNom}</span>
                  </div>
                  <div className="text-slate-200 font-semibold">{item.champsModifies}</div>
                  <div className="text-slate-400 text-[11px] italic bg-slate-900/60 p-2 rounded border border-slate-800/40">
                    « {item.motif} »
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedHistory(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Confirmation Modal with required reason */}
      {statusModalComm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-400" />
              {statusModalComm.statut === 'active' ? 'Suspendre la commission' : 'Réactiver la commission'}
            </h4>
            <p className="text-xs text-slate-300">
              Veuillez saisir le motif décisionnel pour consigner cette opération dans le journal d'audit immuable :
            </p>

            <textarea
              rows={3}
              value={statusReason}
              onChange={e => setStatusReason(e.target.value)}
              placeholder="Motif de la suspension / réactivation..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStatusModalComm(null)}
                className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmToggleStatus}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Confirmer l'arbitrage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
