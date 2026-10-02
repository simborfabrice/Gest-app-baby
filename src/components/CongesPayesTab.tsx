import React, { useState } from 'react';
import { Contract } from '../types';
import { brutToNet } from '../utils/idcc3239';
import { 
  Palmtree, 
  Calendar, 
  Calculator, 
  CheckCircle, 
  Baby, 
  ArrowRight, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';

interface CongesPayesTabProps {
  contract: Contract;
}

export const CongesPayesTab: React.FC<CongesPayesTabProps> = ({ contract }) => {
  // Période de référence active (ex: 1er Juin 2025 au 31 Mai 2026)
  const [weeksWorked, setWeeksWorked] = useState<number>(
    contract.anneeType === 'complete' ? 47 : Math.min(44, contract.weeksPerYear)
  );
  const [totalBrutPeriod, setTotalBrutPeriod] = useState<number>(
    Number(((contract.hourlyRateBrut * contract.weeklyHours * (contract.anneeType === 'complete' ? 52 : contract.weeksPerYear))).toFixed(2))
  );
  const [childrenUnder15, setChildrenUnder15] = useState<number>(contract.assmatChildrenUnder15 || 0);
  const [congesPris, setCongesPris] = useState<number>(18);

  // 1. Calcul des jours ouvrables acquis de base
  let rawAcquis = 0;
  if (contract.anneeType === 'complete') {
    rawAcquis = 30; // 5 semaines complètes
  } else {
    // Règle 2.5 jours ouvrables par période de 4 semaines (CCN IDCC 3239)
    rawAcquis = Math.ceil((weeksWorked / 4) * 2.5);
  }

  // 2. Jours supplémentaires pour enfants à charge de l'assmat (< 15 ans au 30 avril)
  // +2 jours par enfant si total < 30 jours ouvrables
  let bonusChildren = 0;
  if (rawAcquis < 30 && childrenUnder15 > 0) {
    const potentialBonus = childrenUnder15 * 2;
    bonusChildren = Math.min(potentialBonus, 30 - rawAcquis);
  }
  const totalJoursAcquis = Math.min(30, rawAcquis + bonusChildren);
  const soldeRestant = Math.max(0, totalJoursAcquis - congesPris);

  // 3. Comparatif des 2 méthodes de calcul (IDCC 3239)
  // Méthode 1 : 10% des salaires bruts perçus pendant l'année de référence (1er juin - 31 mai)
  const montantDixiemeBrut = Number((totalBrutPeriod * 0.10).toFixed(2));
  const montantDixiemeNet = brutToNet(montantDixiemeBrut, contract.isAlsaceMoselle);

  // Méthode 2 : Maintien de salaire
  // Rémunération qui aurait été perçue pendant les congés acquis
  // Jours ouvrables acquis convertis en heures : (totalJoursAcquis / 6) * heures hebdo
  const hoursMaintien = Number(((totalJoursAcquis / 6) * contract.weeklyHours).toFixed(2));
  const montantMaintienBrut = Number((hoursMaintien * contract.hourlyRateBrut).toFixed(2));
  const montantMaintienNet = brutToNet(montantMaintienBrut, contract.isAlsaceMoselle);

  // Méthode la plus avantageuse pour l'assmat (Obligation légale CCN IDCC 3239)
  const isMaintienAdvantageous = montantMaintienBrut >= montantDixiemeBrut;
  const montantRetenuBrut = Math.max(montantMaintienBrut, montantDixiemeBrut);
  const montantRetenuNet = Math.max(montantMaintienNet, montantDixiemeNet);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Palmtree className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Gestion des Congés Payés (CCN IDCC 3239)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Période de référence conventionnelle : <strong>1er Juin au 31 Mai</strong> • Régime : 
              <span className={`ml-1 font-semibold ${contract.anneeType === 'complete' ? 'text-blue-700' : 'text-purple-700'}`}>
                {contract.anneeType === 'complete' ? 'Année Complète (52 sem)' : `Année Incomplète (${contract.weeksPerYear} sem)`}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400">Solde de congés restant :</span>
              <p className="text-2xl font-black text-teal-700">{soldeRestant} <span className="text-xs font-semibold text-slate-500">jours ouvrables</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Info notice according to IDCC 3239 */}
      <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 text-xs text-teal-950 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            Principes d'indemnisation des congés selon la Convention Collective IDCC 3239 :
          </p>
          <p className="text-teal-900">
            • <strong>En année complète</strong> : Les congés payés sont déjà intégrés dans la mensualisation (52 semaines = 47 semaines d'accueil + 5 semaines de CP). Le salaire habituel est simplement maintenu lors de la prise des congés acquis.<br />
            • <strong>En année incomplète</strong> : Les congés payés ne sont PAS inclus dans la mensualisation. Ils sont calculés au 31 mai de chaque année selon le comparatif obligatoire (le montant le plus favorable entre le maintien de salaire et le 1/10ème).
          </p>
        </div>
      </div>

      {/* Acquisition Calculator Card */}
      <div className="theme-box border shadow-2xs p-6 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          1. Décompte des Droits à Congés Acquis au 31 Mai
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Semaines travaillées */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Semaines d'accueil travaillées dans l'année :
            </label>
            <input
              type="number"
              min="1"
              max="52"
              value={weeksWorked}
              onChange={(e) => setWeeksWorked(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Formule : ({weeksWorked} sem / 4) × 2,5 = {rawAcquis} jours
            </span>
          </div>

          {/* Enfants de moins de 15 ans */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Baby className="w-3.5 h-3.5 text-rose-500" />
              Enfants à charge de l'assmat (&lt; 15 ans) :
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={childrenUnder15}
              onChange={(e) => setChildrenUnder15(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Bonification conventionnelle : +{bonusChildren} jours ouvrables
            </span>
          </div>

          {/* Congés déjà pris */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jours ouvrables déjà posés / pris :
            </label>
            <input
              type="number"
              min="0"
              max="35"
              value={congesPris}
              onChange={(e) => setCongesPris(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Sur la période en cours
            </span>
          </div>
        </div>

        {/* Total Badge */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-base">
              {totalJoursAcquis}
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">Total des Jours Ouvrables Acquis : {totalJoursAcquis} jours</p>
              <p className="text-xs text-slate-500">
                ({rawAcquis} jours de base + {bonusChildren} jours enfants à charge • Plafonné à 30 jours max)
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Solde à prendre :</span>
            <span className="text-lg font-extrabold text-teal-800">{soldeRestant} jours restants</span>
          </div>
        </div>
      </div>

      {/* Comparison: Maintien de salaire VS 10% Dixième */}
      <div className="theme-box border shadow-2xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-purple-600" />
            2. Comparatif Légal Obligatoire : Maintien de Salaire VS Règle du 1/10ème
          </h3>
          <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded border border-rose-200">
            Montant le plus favorable requis
          </span>
        </div>

        {/* Parameter: Total gross wages during reference year */}
        <div className="max-w-md">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Total des salaires bruts perçus pendant la période (1er juin - 31 mai) :
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="10"
              value={totalBrutPeriod}
              onChange={(e) => setTotalBrutPeriod(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-sm font-bold text-slate-500">€ Brut</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Salaires bruts perçus hors indemnités d'entretien et de repas.
          </span>
        </div>

        {/* 2-Column Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: Maintien de salaire */}
          <div className={`p-5 rounded-xl border-2 transition-all relative ${
            isMaintienAdvantageous 
              ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
              : 'border-slate-200 bg-slate-50/50'
          }`}>
            {isMaintienAdvantageous && (
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-600 text-white shadow-xs">
                Méthode Retenue (Plus Favorable)
              </span>
            )}
            <h4 className="font-bold text-slate-900 text-sm mb-1">Méthode du Maintien de Salaire</h4>
            <p className="text-xs text-slate-500 mb-4">
              Rémunération comme si la salariée avait travaillé pendant ses congés.
            </p>

            <div className="space-y-2 text-xs text-slate-700 mb-4">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Jours ouvrables pris en compte :</span>
                <span className="font-semibold">{totalJoursAcquis} jours</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Volume d'heures équivalent :</span>
                <span className="font-semibold font-mono">{hoursMaintien} heures</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Montant Brut :</span>
                <span className="font-bold font-mono text-slate-900">{montantMaintienBrut.toFixed(2)} €</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-500 block">Indemnité Nette :</span>
              <span className="text-2xl font-black text-slate-900">{montantMaintienNet.toFixed(2)} € Net</span>
            </div>
          </div>

          {/* Option B: 1/10ème */}
          <div className={`p-5 rounded-xl border-2 transition-all relative ${
            !isMaintienAdvantageous 
              ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
              : 'border-slate-200 bg-slate-50/50'
          }`}>
            {!isMaintienAdvantageous && (
              <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-600 text-white shadow-xs">
                Méthode Retenue (Plus Favorable)
              </span>
            )}
            <h4 className="font-bold text-slate-900 text-sm mb-1">Méthode du 1/10ème (Dixième)</h4>
            <p className="text-xs text-slate-500 mb-4">
              10% de la rémunération brute totale perçue au cours de la période.
            </p>

            <div className="space-y-2 text-xs text-slate-700 mb-4">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Base brute de calcul :</span>
                <span className="font-semibold font-mono">{totalBrutPeriod.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Taux conventionnel :</span>
                <span className="font-semibold">10,00 %</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>Montant Brut :</span>
                <span className="font-bold font-mono text-slate-900">{montantDixiemeBrut.toFixed(2)} €</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-500 block">Indemnité Nette :</span>
              <span className="text-2xl font-black text-slate-900">{montantDixiemeNet.toFixed(2)} € Net</span>
            </div>
          </div>
        </div>

        {/* Verdict Box */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Montant Légalement Dû selon l'IDCC 3239
            </span>
            <p className="text-sm font-medium mt-1">
              Méthode retenue : <strong>{isMaintienAdvantageous ? 'Maintien de salaire' : 'Règle du 1/10ème'}</strong>
            </p>
            <p className="text-xs text-emerald-200 mt-0.5">
              Versement prévu : {contract.cpPaymentMethod === 'juin' ? 'En 1 seule fois sur la paie de Juin' : contract.cpPaymentMethod === 'prise_principale' ? 'Lors du congé principal d’été' : 'Au fur et à mesure de la prise'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-extrabold text-white">{montantRetenuNet.toFixed(2)} €</span>
            <span className="text-xs text-emerald-300 block">Net ({montantRetenuBrut.toFixed(2)} € Brut)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
