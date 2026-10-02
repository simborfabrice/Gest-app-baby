import React, { useState } from 'react';
import { Contract, AnnualRegularisationRecord } from '../types';
import { computeAnnualRegularisation, brutToNet } from '../utils/idcc3239';
import { 
  Scale, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Printer, 
  Info,
  CalendarDays,
  ShieldCheck
} from 'lucide-react';

interface RegularisationTabProps {
  contract: Contract;
}

const MONTH_LABELS = [
  'Septembre', 'Octobre', 'Novembre', 'Décembre',
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août'
];

export const RegularisationTab: React.FC<RegularisationTabProps> = ({ contract }) => {
  // Base mensualisée
  const baseWeeks = contract.anneeType === 'complete' ? 52 : contract.weeksPerYear;
  const baseMonthlyHours = Number(((contract.weeklyHours * baseWeeks) / 12).toFixed(2));
  const baseMonthlySalary = Number((baseMonthlyHours * contract.hourlyRateBrut).toFixed(2));

  // Simulation d'une année de contrat (12 mois)
  const [records, setRecords] = useState<AnnualRegularisationRecord[]>(() => {
    return MONTH_LABELS.map((label, idx) => {
      // Variations réalistes (vacances scolaires, mois à 4 ou 5 semaines)
      let plannedWeeks = 4;
      if (idx === 1 || idx === 6) plannedWeeks = 4.5;
      if (idx === 3 || idx === 7) plannedWeeks = 3; // Vacances Noël / Pâques
      if (idx === 10 || idx === 11) plannedWeeks = 2; // Vacances été

      // Heures réelles effectuées
      const realHoursWorked = Number((plannedWeeks * contract.weeklyHours).toFixed(2));
      const salaryDueReel = Number((realHoursWorked * contract.hourlyRateBrut).toFixed(2));
      const differenceHours = Number((realHoursWorked - baseMonthlyHours).toFixed(2));

      return {
        monthLabel: label,
        year: idx < 4 ? 2025 : 2026,
        month: idx,
        plannedWeeks,
        realHoursWorked,
        paidHoursMensualisation: baseMonthlyHours,
        differenceHours,
        salaryPaidMensualisation: baseMonthlySalary,
        salaryDueReel,
        balanceDue: Number((salaryDueReel - baseMonthlySalary).toFixed(2)),
      };
    });
  });

  const handleUpdateRecord = (idx: number, field: 'realHoursWorked' | 'plannedWeeks', val: number) => {
    setRecords(prev => {
      const copy = [...prev];
      const item = { ...copy[idx] };
      if (field === 'plannedWeeks') {
        item.plannedWeeks = val;
        item.realHoursWorked = Number((val * contract.weeklyHours).toFixed(2));
      } else {
        item.realHoursWorked = val;
      }
      item.salaryDueReel = Number((item.realHoursWorked * contract.hourlyRateBrut).toFixed(2));
      item.differenceHours = Number((item.realHoursWorked - item.paidHoursMensualisation).toFixed(2));
      item.balanceDue = Number((item.salaryDueReel - item.salaryPaidMensualisation).toFixed(2));
      copy[idx] = item;
      return copy;
    });
  };

  const results = computeAnnualRegularisation(records);
  const netDue = brutToNet(results.balanceAmountDueToAssmat, contract.isAlsaceMoselle);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="theme-box p-6 border shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Régularisation de Salaire en Année Incomplète (Article 110 IDCC 3239)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Contrat : <strong>{contract.childFirstName} {contract.childLastName}</strong> ({contract.weeksPerYear} semaines programmées/an)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Imprimer l'état de régularisation
            </button>
          </div>
        </div>
      </div>

      {/* Legal Explanatory Card */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-950 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="font-bold text-indigo-950">
            Principe légal de la Régularisation selon l'Article 110 de la CCN IDCC 3239 :
          </p>
          <p className="text-indigo-900">
            La régularisation doit être effectuée à chaque date anniversaire du contrat ou lors de la rupture définitive. Elle consiste à comparer le nombre d'heures réelles d'accueil programmées réalisées avec le nombre d'heures rémunérées par la mensualisation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
              <p className="font-bold text-emerald-800">Cas 1 : Heures réelles &gt; Heures rémunérées</p>
              <p className="text-[11px] text-slate-600">L'employeur doit verser la rémunération correspondant aux heures complémentaires non régularisées.</p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
              <p className="font-bold text-blue-800">Cas 2 : Heures réelles &lt; Heures rémunérées (Règle d'or)</p>
              <p className="text-[11px] text-slate-600">Le trop-perçu éventuel reste <strong>définitivement acquis</strong> à l'assistante maternelle. Aucune retenue sur salaire ni remboursement ne peut être exigé.</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="theme-box p-4 border shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Heures réellement travaillées</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{results.totalRealHours} h</p>
          <span className="text-[11px] text-slate-400">Accueil programmé cumulé</span>
        </div>

        <div className="theme-box p-4 border shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Heures payées (mensualisation)</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{results.totalPaidHours} h</p>
          <span className="text-[11px] text-slate-400">{baseMonthlyHours} h × 12 mois</span>
        </div>

        <div className="theme-box p-4 border shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Différence d'heures</span>
          <p className={`text-2xl font-bold mt-1 ${results.balanceHours >= 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
            {results.balanceHours >= 0 ? `+${results.balanceHours}` : results.balanceHours} h
          </p>
          <span className="text-[11px] text-slate-400">
            {results.balanceHours >= 0 ? 'Heures dues à la salariée' : 'Heures rémunérées en avance'}
          </span>
        </div>

        <div className={`p-4 rounded-xl border shadow-2xs ${
          results.balanceAmountDueToAssmat > 0 
            ? 'bg-emerald-50 border-emerald-300' 
            : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-xs font-semibold text-slate-700">Régularisation Dûe à l'Assmat</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {results.balanceAmountDueToAssmat.toFixed(2)} € <span className="text-xs font-normal text-slate-500">Brut</span>
          </p>
          <span className="text-xs font-bold text-emerald-800">
            ({netDue.toFixed(2)} € Net à verser)
          </span>
        </div>
      </div>

      {/* 12-Month Table */}
      <div className="theme-box border shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-600" />
            Tableau Mensuel Comparatif (Année de référence)
          </h3>
          <span className="text-[11px] text-slate-500">
            Taux horaire brut contractuel : {contract.hourlyRateBrut.toFixed(2)} €
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Mois</th>
                <th className="py-2.5 px-3 text-center">Semaines d'accueil</th>
                <th className="py-2.5 px-3 text-right">Heures Réelles</th>
                <th className="py-2.5 px-3 text-right">Heures Mensualisées</th>
                <th className="py-2.5 px-3 text-right">Écart Heures</th>
                <th className="py-2.5 px-3 text-right">Salaire Mensualisé</th>
                <th className="py-2.5 px-3 text-right">Salaire Réel Dû</th>
                <th className="py-2.5 px-3 text-right">Solde Mois</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {records.map((r, idx) => {
                const isPositive = r.balanceDue > 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">
                      {r.monthLabel} {r.year}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="5"
                        value={r.plannedWeeks}
                        onChange={(e) => handleUpdateRecord(idx, 'plannedWeeks', Number(e.target.value) || 0)}
                        className="w-16 px-1.5 py-0.5 text-center text-xs border border-slate-200 rounded font-sans"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {r.realHoursWorked} h
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      {r.paidHoursMensualisation} h
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${r.differenceHours >= 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {r.differenceHours >= 0 ? `+${r.differenceHours}` : r.differenceHours} h
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      {r.salaryPaidMensualisation.toFixed(2)} €
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-900 font-bold">
                      {r.salaryDueReel.toFixed(2)} €
                    </td>
                    <td className={`py-2.5 px-3 text-right font-bold ${isPositive ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {isPositive ? `+${r.balanceDue.toFixed(2)}` : r.balanceDue.toFixed(2)} €
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300 font-mono text-xs">
              <tr>
                <td className="py-3 px-3 uppercase font-sans">Totaux Année</td>
                <td className="py-3 px-3 text-center">-</td>
                <td className="py-3 px-3 text-right">{results.totalRealHours} h</td>
                <td className="py-3 px-3 text-right">{results.totalPaidHours} h</td>
                <td className="py-3 px-3 text-right">
                  {results.balanceHours >= 0 ? `+${results.balanceHours}` : results.balanceHours} h
                </td>
                <td className="py-3 px-3 text-right">{results.totalPaidSalary.toFixed(2)} €</td>
                <td className="py-3 px-3 text-right">{results.totalDueSalary.toFixed(2)} €</td>
                <td className="py-3 px-3 text-right text-emerald-700">
                  +{results.balanceAmountDueToAssmat.toFixed(2)} €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Statutory conclusion card */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-rose-300 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Conclusion de la Régularisation Annuelle
            </span>
            <p className="text-sm font-medium mt-1">
              {results.balanceAmountDueToAssmat > 0 ? (
                <>L'employeur doit verser une régularisation de <strong>{results.balanceAmountDueToAssmat.toFixed(2)} € Brut</strong> ({netDue.toFixed(2)} € Net) sur le prochain bulletin de paie.</>
              ) : (
                <>Les heures payées ont couvert ou dépassé les heures réelles. Conformément à la convention IDCC 3239, aucun remboursement n'est exigible de la salariée.</>
              )}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-3xl font-black text-emerald-400">
              {netDue.toFixed(2)} €
            </span>
            <span className="block text-xs text-slate-300">Net à verser</span>
          </div>
        </div>
      </div>
    </div>
  );
};
