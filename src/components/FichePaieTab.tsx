import React from 'react';
import { Contract, MonthSummary } from '../types';
import { 
  Printer, 
  FileCheck2, 
  HelpCircle, 
  Download, 
  ShieldAlert, 
  Check, 
  Info,
  Calendar,
  CreditCard
} from 'lucide-react';

interface FichePaieTabProps {
  contract: Contract;
  summary: MonthSummary;
  onPrint: () => void;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const FichePaieTab: React.FC<FichePaieTabProps> = ({
  contract,
  summary,
  onPrint,
}) => {
  const monthLabel = `${MONTH_NAMES[summary.month]} ${summary.year}`;
  
  // Formatage monétaire
  const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  return (
    <div className="space-y-6">
      {/* Top Banner with Print action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-rose-100 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-rose-500" />
            Bulletin de Paie Mensuel Conforme IDCC 3239
          </h2>
          <p className="text-xs text-slate-500">
            Période : <span className="font-bold text-blue-900">{monthLabel}</span> • Enfant : <span className="font-bold text-rose-600">{contract.childFirstName} {contract.childLastName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrint}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-rose-500 hover:from-blue-700 hover:to-rose-600 transition-all shadow-sm shadow-rose-200/50"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer / Enregistrer en PDF
          </button>
        </div>
      </div>

      {/* Official Payslip Container */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8 max-w-4xl mx-auto printable-area text-slate-800 text-xs">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
                Bulletin de Paie
              </h1>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Assistant(e) Maternel(le) du Particulier Employeur
              </p>
              <p className="text-[11px] font-semibold text-rose-700 mt-1">
                Convention Collective Nationale IDCC 3239
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-slate-900 text-white font-bold text-xs uppercase px-3 py-1 rounded">
                Période : {monthLabel}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Paiement prévu au : dernier jour ouvré du mois
              </p>
            </div>
          </div>
        </div>

        {/* 2-Columns: Employer & Employee details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-200">
          {/* Employeur */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
              Particulier Employeur
            </h3>
            <p className="font-semibold text-slate-900">{contract.parent1Name} {contract.parent2Name ? `& ${contract.parent2Name}` : ''}</p>
            <p className="text-slate-600">{contract.parentAddress}</p>
            <p className="text-slate-600 mt-1">Tél : {contract.parentPhone}</p>
            <p className="text-slate-600">Email : {contract.parentEmail}</p>
            <p className="text-slate-500 text-[10px] mt-2 font-mono">
              Enfant accueilli : {contract.childFirstName} {contract.childLastName} (Né(e) le {contract.childBirthDate})
            </p>
          </div>

          {/* Salarié */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-200 pb-1">
              Salarié(e) - Assistant(e) Maternel(le)
            </h3>
            <p className="font-semibold text-slate-900">{contract.assmatName}</p>
            <p className="text-slate-600">{contract.assmatAddress}</p>
            <p className="text-slate-600 mt-1">N° Agrément : <span className="font-mono">{contract.assmatAgrementNumber}</span></p>
            <p className="text-slate-600">Date agrément : {contract.assmatAgrementDate}</p>
            <p className="text-slate-600">Tél : {contract.assmatPhone}</p>
            <p className="text-slate-500 text-[10px] mt-2">
              Régime : {contract.isAlsaceMoselle ? 'Alsace-Moselle' : 'Régime Général Métropole'}
            </p>
          </div>
        </div>

        {/* Contract specs summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-rose-50/50 p-3 rounded-lg border border-rose-200/60 mb-6 text-[11px]">
          <div>
            <span className="text-slate-500">Régime d'accueil :</span>
            <p className="font-bold text-slate-800">
              {contract.anneeType === 'complete' ? 'Année Complète (52 sem)' : `Année Incomplète (${contract.weeksPerYear} sem)`}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Horaire hebdomadaire :</span>
            <p className="font-bold text-slate-800">{contract.weeklyHours}h / semaine</p>
          </div>
          <div>
            <span className="text-slate-500">Taux horaire brut :</span>
            <p className="font-bold text-slate-800">{fmt(contract.hourlyRateBrut)}</p>
          </div>
          <div>
            <span className="text-slate-500">Taux horaire net :</span>
            <p className="font-bold text-rose-700">{fmt(contract.hourlyRateNet)}</p>
          </div>
        </div>

        {/* Payslip Items Table */}
        <div className="border border-slate-300 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Rubrique de Paie</th>
                <th className="py-2.5 px-3 text-right">Base / Nb Heures</th>
                <th className="py-2.5 px-3 text-right">Taux Brut</th>
                <th className="py-2.5 px-3 text-right">Montant Brut</th>
                <th className="py-2.5 px-3 text-right">Montant Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* 1. Salaire de base mensualisé */}
              <tr>
                <td className="py-2 px-3">
                  <span className="font-semibold">Salaire de base mensualisé</span>
                  <span className="block text-[10px] text-slate-500">
                    ({contract.weeklyHours}h × {contract.anneeType === 'complete' ? 52 : contract.weeksPerYear} sem / 12)
                  </span>
                </td>
                <td className="py-2 px-3 text-right font-mono">{summary.baseHours} h</td>
                <td className="py-2 px-3 text-right font-mono">{fmt(contract.hourlyRateBrut)}</td>
                <td className="py-2 px-3 text-right font-mono font-medium">{fmt(summary.baseSalaryBrut)}</td>
                <td className="py-2 px-3 text-right font-mono font-medium">{fmt(summary.baseSalaryNet)}</td>
              </tr>

              {/* 2. Heures complémentaires */}
              {summary.complementaryHours > 0 && (
                <tr className="bg-amber-50/40">
                  <td className="py-2 px-3">
                    <span className="font-semibold text-amber-900">Heures complémentaires (&lt; 45h/sem)</span>
                    <span className="block text-[10px] text-slate-500">Rémunérées au taux normal contractuel</span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono">{summary.complementaryHours} h</td>
                  <td className="py-2 px-3 text-right font-mono">{fmt(contract.hourlyRateBrut)}</td>
                  <td className="py-2 px-3 text-right font-mono font-medium">{fmt(summary.complementaryAmountBrut)}</td>
                  <td className="py-2 px-3 text-right font-mono font-medium">{fmt(summary.complementaryAmountNet)}</td>
                </tr>
              )}

              {/* 3. Heures supplémentaires majorées (> 45h) */}
              {summary.overtimeHours > 0 && (
                <tr className="bg-purple-50/40">
                  <td className="py-2 px-3">
                    <span className="font-semibold text-purple-900">
                      Heures supplémentaires majorées (&gt; 45h) (+{contract.overtimeRatePercentage}%)
                    </span>
                    <span className="block text-[10px] text-purple-700">
                      Exonérées d'impôt sur le revenu & allègement cotisations (Loi TEPA)
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono">{summary.overtimeHours} h</td>
                  <td className="py-2 px-3 text-right font-mono">
                    {fmt(contract.hourlyRateBrut * (1 + contract.overtimeRatePercentage / 100))}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-medium">{fmt(summary.overtimeAmountBrut)}</td>
                  <td className="py-2 px-3 text-right font-mono font-medium">{fmt(summary.overtimeAmountNet)}</td>
                </tr>
              )}

              {/* 4. Retenue sur salaire pour absence déductible (Cour de Cassation) */}
              {summary.absenceHoursDeducted > 0 && (
                <tr className="bg-rose-50/40">
                  <td className="py-2 px-3">
                    <span className="font-semibold text-rose-900">Retenue pour absence (Cour de Cassation)</span>
                    <span className="block text-[10px] text-rose-700">
                      Formule légale : {fmt(summary.baseSalaryBrut)} / {summary.potentialHoursInMonth}h pot. × {summary.absenceHoursDeducted}h abs.
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-rose-700">-{summary.absenceHoursDeducted} h</td>
                  <td className="py-2 px-3 text-right font-mono text-rose-700">
                    {fmt(summary.baseSalaryBrut / summary.potentialHoursInMonth)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-medium text-rose-700">-{fmt(summary.absenceDeductionBrut)}</td>
                  <td className="py-2 px-3 text-right font-mono font-medium text-rose-700">-{fmt(summary.absenceDeductionNet)}</td>
                </tr>
              )}

              {/* 5. Congés payés si applicable */}
              {summary.congesPayesAmountNet > 0 && (
                <tr className="bg-teal-50/40">
                  <td className="py-2 px-3">
                    <span className="font-semibold text-teal-900">Indemnité de Congés Payés</span>
                    <span className="block text-[10px] text-teal-700">{summary.congesPayesDaysCount} jours de CP</span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono">{summary.congesPayesDaysCount} j</td>
                  <td className="py-2 px-3 text-right font-mono">-</td>
                  <td className="py-2 px-3 text-right font-mono font-medium">-</td>
                  <td className="py-2 px-3 text-right font-mono font-medium">{fmt(summary.congesPayesAmountNet)}</td>
                </tr>
              )}

              {/* Total Salaire Brut / Net */}
              <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300">
                <td className="py-2.5 px-3 uppercase text-slate-900">Total Salaire</td>
                <td className="py-2.5 px-3 text-right font-mono">-</td>
                <td className="py-2.5 px-3 text-right font-mono">-</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900">{fmt(summary.totalBrut)} Brut</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-900">{fmt(summary.totalNetSalary)} Net</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Indemnités conventionnelles non soumises à cotisations */}
        <div className="border border-purple-200 bg-purple-50/30 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-xs uppercase tracking-wider text-purple-900 mb-3 flex items-center justify-between">
            <span>Indemnités Conventionnelles IDCC 3239 (Non soumises à cotisations)</span>
            <span className="text-purple-700 font-mono text-sm">{fmt(summary.totalIndemnites)}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px]">
            <div className="bg-white p-2.5 rounded border border-purple-100">
              <span className="text-slate-500 block">Indemnité d'entretien ({summary.presentDaysCount} j) :</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{fmt(summary.totalIndemniteEntretien)}</p>
              <p className="text-[10px] text-slate-400">Eau, électricité, matériel puériculture</p>
            </div>

            <div className="bg-white p-2.5 rounded border border-purple-100">
              <span className="text-slate-500 block">Indemnité de repas & goûters :</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{fmt(summary.totalIndemniteRepas + summary.totalIndemniteGouter)}</p>
              <p className="text-[10px] text-slate-400">Repas fournis par l'assmat</p>
            </div>

            <div className="bg-white p-2.5 rounded border border-purple-100">
              <span className="text-slate-500 block">Indemnités kilométriques :</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{fmt(summary.totalIndemniteKm)}</p>
              <p className="text-[10px] text-slate-400">Déplacements autorisés</p>
            </div>
          </div>
        </div>

        {/* Final Payment Box */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 text-white rounded-2xl p-6 mb-6 shadow-md shadow-blue-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-rose-300 font-bold flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-400" /> Net total à verser par le parent employeur
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Salaire Net ({fmt(summary.totalNetSalary)}) + Indemnités ({fmt(summary.totalIndemnites)})
              </p>
            </div>

            <div className="text-right">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {fmt(summary.totalNetToPay)}
              </span>
              <p className="text-[10px] text-emerald-400 mt-0.5">
                (Prise en charge partielle des cotisations par le CMG Pajemploi)
              </p>
            </div>
          </div>
        </div>

        {/* Signatures & Legal Notices */}
        <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 space-y-2">
          <div className="grid grid-cols-2 gap-6 pt-2 pb-6">
            <div>
              <p className="font-semibold text-slate-700 mb-8">Date et signature du Particulier Employeur :</p>
              <div className="border-b border-dashed border-slate-300 w-3/4"></div>
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-8">Date et signature de l'Assistant(e) Maternel(le) :</p>
              <div className="border-b border-dashed border-slate-300 w-3/4"></div>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 text-center">
            Bulletin établi conformément aux dispositions du Code du travail et de la Convention Collective Nationale de la branche du secteur des particuliers employeurs et de l'emploi à domicile (IDCC 3239). Ce bulletin doit être conservé sans limitation de durée (article L. 3243-4 du Code du travail).
          </p>
        </div>
      </div>
    </div>
  );
};
