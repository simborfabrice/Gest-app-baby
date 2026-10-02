import React, { useState } from 'react';
import { Contract } from '../types';
import { calculateEndContractIndemnity, brutToNet } from '../utils/idcc3239';
import { 
  FileSignature, 
  Printer, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  BadgePercent,
  Coins
} from 'lucide-react';

interface FinContratTabProps {
  contract: Contract;
}

export const FinContratTab: React.FC<FinContratTabProps> = ({ contract }) => {
  // Estimation de la durée et des salaires
  const [monthsOfSeniority, setMonthsOfSeniority] = useState<number>(14);
  const [totalGrossWages, setTotalGrossWages] = useState<number>(18500);
  const [remainingCpDays, setRemainingCpDays] = useState<number>(5);
  const [regularisationAmountNet, setRegularisationAmountNet] = useState<number>(
    contract.anneeType === 'incomplete' ? 142.50 : 0
  );
  const [reason, setReason] = useState<'retrait_enfant' | 'demission' | 'commun_accord'>('retrait_enfant');
  const [activeDoc, setActiveDoc] = useState<'recap' | 'certificat' | 'recu'>('recap');

  // Calcul conventionnel de l'indemnité de rupture IDCC 3239 (1/80ème brut)
  const isRetrait = reason === 'retrait_enfant' || reason === 'commun_accord';
  const indemnityCalc = isRetrait 
    ? calculateEndContractIndemnity(totalGrossWages, monthsOfSeniority)
    : { isEligible: false, amount: 0, explanation: 'Pas d’indemnité de rupture en cas de démission de l’assistante maternelle.' };

  // Calcul indemnité compensatrice de congés payés restants
  const cpDailyBrut = (contract.weeklyHours / 6) * contract.hourlyRateBrut;
  const indemnityCpBrut = Number((remainingCpDays * cpDailyBrut).toFixed(2));
  const indemnityCpNet = brutToNet(indemnityCpBrut, contract.isAlsaceMoselle);

  // Dernier salaire mensuel normal estimé
  const lastMonthSalaryNet = contract.hourlyRateNet * (contract.weeklyHours * (contract.anneeType === 'complete' ? 52 : contract.weeksPerYear) / 12);

  // Total Solde de tout compte Net
  const totalSoldeToutCompteNet = Number(
    (lastMonthSalaryNet + (indemnityCalc.isEligible ? indemnityCalc.amount : 0) + indemnityCpNet + regularisationAmountNet).toFixed(2)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Fin de Contrat & Solde de Tout Compte (CCN IDCC 3239)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Article 117 de la Convention Collective : indemnité légale de 1/80ème des salaires bruts dès 9 mois d'ancienneté.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Imprimer les documents
            </button>
          </div>
        </div>

        {/* Sub-tabs for documents */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveDoc('recap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeDoc === 'recap' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Calculateur & Détail
          </button>
          <button
            onClick={() => setActiveDoc('recu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeDoc === 'recu' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Reçu pour Solde de Tout Compte
          </button>
          <button
            onClick={() => setActiveDoc('certificat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeDoc === 'certificat' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Certificat de Travail Officiel
          </button>
        </div>
      </div>

      {activeDoc === 'recap' && (
        <div className="space-y-6">
          {/* Inputs Section */}
          <div className="theme-box p-6 border shadow-2xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Paramètres de Rupture du Contrat
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motif de la fin de contrat :</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="retrait_enfant">Retrait d'enfant par l'employeur</option>
                  <option value="commun_accord">Rupture d'un commun accord</option>
                  <option value="demission">Démission de l'assistante maternelle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ancienneté continue (en mois) :
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={monthsOfSeniority}
                  onChange={(e) => setMonthsOfSeniority(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {monthsOfSeniority >= 9 ? '✅ Éligible indemnité (≥ 9 mois)' : '❌ Non éligible (< 9 mois)'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cumul des salaires bruts perçus :
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="100"
                    value={totalGrossWages}
                    onChange={(e) => setTotalGrossWages(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-slate-500">€</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Hors indemnités d'entretien</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jours de CP acquis restants dus :
                </label>
                <input
                  type="number"
                  min="0"
                  max="35"
                  value={remainingCpDays}
                  onChange={(e) => setRemainingCpDays(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Indemnité compensatrice</span>
              </div>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Indemnité de Rupture */}
            <div className={`p-4 rounded-xl border ${indemnityCalc.isEligible ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-xs font-semibold text-slate-600 block flex items-center gap-1">
                <BadgePercent className="w-4 h-4 text-emerald-600" /> Indemnité de Rupture (1/80ème)
              </span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {indemnityCalc.amount.toFixed(2)} €
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {indemnityCalc.explanation}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                Non imposable & exonérée de cotisations
              </span>
            </div>

            {/* 2. Indemnité compensatrice de CP */}
            <div className="theme-box p-4 border shadow-2xs">
              <span className="text-xs font-semibold text-slate-600 block">Indemnité Compensatrice de CP</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {indemnityCpNet.toFixed(2)} € <span className="text-xs font-normal text-slate-500">Net</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Pour {remainingCpDays} jours ouvrables acquis et non pris ({indemnityCpBrut.toFixed(2)} € Brut)
              </p>
            </div>

            {/* 3. Régularisation finale */}
            <div className="theme-box p-4 border shadow-2xs">
              <span className="text-xs font-semibold text-slate-600 block">Régularisation Finale Année Incomplète</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {regularisationAmountNet.toFixed(2)} € <span className="text-xs font-normal text-slate-500">Net</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Article 110 IDCC 3239 (solde d'heures réelles d'accueil programmées)
              </p>
            </div>
          </div>

          {/* Grand Total Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                Total Solde de Tout Compte à Verser
              </span>
              <p className="text-xs text-slate-300 mt-1">
                Dernier mois habituel + Indemnité 1/80e + Congés payés restants + Régularisation
              </p>
            </div>

            <div className="text-right">
              <span className="text-3xl font-extrabold text-white">
                {totalSoldeToutCompteNet.toFixed(2)} €
              </span>
              <span className="block text-xs text-emerald-400">Net total payable par virement</span>
            </div>
          </div>
        </div>
      )}

      {/* Official Reçu pour solde de tout compte */}
      {activeDoc === 'recu' && (
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-8 max-w-3xl mx-auto printable-area text-slate-800 space-y-6">
          <div className="text-center border-b pb-4">
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
              Reçu pour Solde de Tout Compte
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Établi en double exemplaire conformément aux articles L. 1234-20 et D. 1234-7 du Code du travail et à l'IDCC 3239
            </p>
          </div>

          <div className="text-xs leading-relaxed space-y-4">
            <p>
              Je soussigné(e) <strong>{contract.assmatName}</strong>, demeurant au {contract.assmatAddress}, employé(e) en qualité d'assistant(e) maternel(le) agréé(e) par :
            </p>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <strong>{contract.parent1Name} {contract.parent2Name ? `& ${contract.parent2Name}` : ''}</strong><br />
              Demeurant au : {contract.parentAddress}<br />
              Pour l'accueil de l'enfant : <strong>{contract.childFirstName} {contract.childLastName}</strong>
            </div>

            <p>
              Reconnais avoir reçu ce jour la somme totale nette de : <strong className="text-sm font-bold text-rose-700">{totalSoldeToutCompteNet.toFixed(2)} €</strong> (par chèque ou virement bancaire), en règlement de tout compte pour les éléments suivants :
            </p>

            <table className="w-full text-left border border-slate-200 rounded">
              <thead className="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2">Désignation</th>
                  <th className="p-2 text-right">Montant Brut</th>
                  <th className="p-2 text-right">Montant Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="p-2 font-sans">Dernier salaire du mois de rupture</td>
                  <td className="p-2 text-right">-</td>
                  <td className="p-2 text-right">{lastMonthSalaryNet.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans">Indemnité légale de rupture (1/80ème brut - IDCC 3239)</td>
                  <td className="p-2 text-right">{indemnityCalc.amount.toFixed(2)} €</td>
                  <td className="p-2 text-right font-bold text-emerald-700">{indemnityCalc.amount.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans">Indemnité compensatrice de congés payés ({remainingCpDays} jours)</td>
                  <td className="p-2 text-right">{indemnityCpBrut.toFixed(2)} €</td>
                  <td className="p-2 text-right">{indemnityCpNet.toFixed(2)} €</td>
                </tr>
                {regularisationAmountNet > 0 && (
                  <tr>
                    <td className="p-2 font-sans">Régularisation de salaire en année incomplète</td>
                    <td className="p-2 text-right">-</td>
                    <td className="p-2 text-right">{regularisationAmountNet.toFixed(2)} €</td>
                  </tr>
                )}
                <tr className="bg-slate-100 font-bold font-sans">
                  <td className="p-2 uppercase">Total Net Versé</td>
                  <td className="p-2 text-right">-</td>
                  <td className="p-2 text-right text-rose-700 font-mono text-sm">{totalSoldeToutCompteNet.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>

            <p className="text-[11px] text-slate-500 italic">
              Ce reçu peut être dénoncé dans un délai de 6 mois à compter de sa signature, par lettre recommandée (article L. 1234-20 du Code du travail).
            </p>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div>
                <p className="font-semibold mb-12">Fait à ........................................, le ..................<br />Signature du Particulier Employeur :</p>
                <div className="border-b border-dashed border-slate-300 w-3/4"></div>
              </div>
              <div>
                <p className="font-semibold mb-2">Fait à ........................................, le ..................<br />Signature du Salarié (précédée de la mention manuscrite « pour solde de tout compte ») :</p>
                <div className="border-b border-dashed border-slate-300 w-3/4 mt-12"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Certificat de Travail */}
      {activeDoc === 'certificat' && (
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-8 max-w-3xl mx-auto printable-area text-slate-800 space-y-6">
          <div className="text-center border-b pb-4">
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
              Certificat de Travail
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Délivré en application de l'article L. 1234-19 du Code du travail et de la convention IDCC 3239
            </p>
          </div>

          <div className="text-xs leading-relaxed space-y-4">
            <p>
              Je soussigné(e) <strong>{contract.parent1Name} {contract.parent2Name ? `& ${contract.parent2Name}` : ''}</strong>, demeurant au {contract.parentAddress}, certifie par la présente avoir employé :
            </p>

            <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <p><strong>Nom et Prénom de la salariée :</strong> {contract.assmatName}</p>
              <p><strong>Adresse :</strong> {contract.assmatAddress}</p>
              <p><strong>Agrément :</strong> N° {contract.assmatAgrementNumber} délivré le {contract.assmatAgrementDate}</p>
            </div>

            <p>
              En qualité d'<strong>Assistant(e) Maternel(le) Agréé(e)</strong> pour l'accueil de l'enfant <strong>{contract.childFirstName} {contract.childLastName}</strong> :
            </p>

            <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-1">
              <p>• <strong>Du :</strong> {contract.startDate}</p>
              <p>• <strong>Au :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
              <p>• <strong>Emploi occupé :</strong> Assistant(e) maternel(le) à domicile (Code IDCC 3239)</p>
            </div>

            <p>
              Madame {contract.assmatName} quitte tout engagement avec notre foyer libre de tout engagement à la date susmentionnée.
            </p>

            <div className="pt-10">
              <p className="font-semibold mb-16">
                Fait pour servir et valoir ce que de droit.<br />
                Fait à ........................................, le {new Date().toLocaleDateString('fr-FR')}<br />
                Signature du Particulier Employeur :
              </p>
              <div className="border-b border-dashed border-slate-300 w-1/2"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
