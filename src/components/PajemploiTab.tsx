import React, { useState } from 'react';
import { Contract, MonthSummary } from '../types';
import { 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Send, 
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

interface PajemploiTabProps {
  contract: Contract;
  summary: MonthSummary;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const PajemploiTab: React.FC<PajemploiTabProps> = ({
  contract,
  summary,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const monthLabel = `${MONTH_NAMES[summary.month]} ${summary.year}`;
  const p = summary.pajemploi;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyAllSummary = () => {
    const text = `📋 RÉCAPITULATIF DÉCLARATION PAJEMPLOI (${monthLabel})
Enfant : ${contract.childFirstName} ${contract.childLastName}
Assistante maternelle : ${contract.assmatName}
---------------------------------------------
1. Heures normales : ${p.nbHeuresNormales} h
2. Jours d'activité : ${p.nbJoursActivite} j
3. Jours de congés payés : ${p.nbJoursCP} j
4. Heures complémentaires : ${p.nbHeuresComplementaires} h
5. Heures majorées (>45h) : ${p.nbHeuresMajorees} h
6. Salaire net total : ${p.salaireNetTotal.toFixed(2)} €
7. Indemnités d'entretien : ${p.indemnitesEntretien.toFixed(2)} €
8. Indemnités de repas : ${p.indemnitesRepas.toFixed(2)} €
9. Indemnités kilométriques : ${p.indemnitesKm.toFixed(2)} €
---------------------------------------------
TOTAL NET À VERSER : ${p.totalVerse.toFixed(2)} €
(Plafond CMG respecté : ${p.montantJournalierMoyen} € / j vs max ${p.seuilMaxCmg} € / j)`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-rose-950 text-white rounded-2xl p-6 shadow-md shadow-blue-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Pajemploi / Urssaf Officiel
              </span>
              <span className="text-xs text-rose-300 font-bold">• Gest'app Baby IDCC 3239</span>
            </div>
            <h2 className="text-xl font-black tracking-tight mt-1">
              Récapitulatif Exact de Déclaration Pajemploi
            </h2>
            <p className="text-xs text-blue-200 mt-1 max-w-2xl">
              Toutes les cases ci-dessous correspondent exactement au formulaire en ligne du site Pajemploi. Copiez les valeurs en 1 clic pour éviter toute erreur de calcul ou rejet de CMG.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={copyAllSummary}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white transition-all shadow-sm shadow-rose-900/40"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-white" />
                  Récapitulatif copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  Copier tout le récapitulatif
                </>
              )}
            </button>

            <a
              href="https://www.pajemploi.urssaf.fr"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold bg-blue-600/80 hover:bg-blue-600 text-white border border-blue-400/30 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Aller sur Pajemploi.fr
            </a>
          </div>
        </div>
      </div>

      {/* CMG Ceiling Alert Box */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        p.isCmgValide 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
          : 'bg-rose-50 border-rose-300 text-rose-900'
      }`}>
        {p.isCmgValide ? (
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        )}
        <div className="text-xs space-y-1">
          <p className="font-bold text-sm">
            {p.isCmgValide ? 'Contrôle Plafond CMG Pajemploi : CONFORME' : 'ATTENTION : Risque de dépassement du Plafond CMG'}
          </p>
          <p className={p.isCmgValide ? 'text-emerald-800' : 'text-rose-800'}>
            Le salaire net journalier moyen déclaré est de <strong>{p.montantJournalierMoyen.toFixed(2)} €</strong> par jour d'activité (seuil maximal légal autorisé de 5 SMIC horaire brut : <strong>{p.seuilMaxCmg.toFixed(2)} € net/jour</strong>).
          </p>
          <p className="text-[11px] opacity-80">
            {p.isCmgValide 
              ? '✅ Vos droits au Complément de libre choix du Mode de Garde (CMG) et la prise en charge des cotisations sociales par l\'Urssaf sont garantis à 100%.'
              : '⚠️ Le salaire journalier dépasse le plafond. Les parents risquent de devoir payer l\'intégralité des cotisations sans aide de la CAF. Réajustez le nombre de jours d\'activité si des heures complémentaires ont été effectuées.'}
          </p>
        </div>
      </div>

      {/* Mirror Grid matching Pajemploi */}
      <div className="theme-box border shadow-2xs overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            Cases du formulaire Pajemploi ({monthLabel})
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            {contract.childFirstName} {contract.childLastName}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {/* 1. Nombre d'heures normales */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span className="font-semibold text-slate-800 text-sm">Nombre d'heures normales</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-8">
                Formule Pajemploi : (Heures hebdo × Nb semaines) / 12 {summary.absenceHoursDeducted > 0 ? `déduction faite de ${summary.absenceHoursDeducted}h d'absence` : ''}.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="font-mono text-lg font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">
                {p.nbHeuresNormales} h
              </span>
              <button
                onClick={() => copyToClipboard(String(p.nbHeuresNormales), 'heuresNormales')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Copier la valeur"
              >
                {copiedKey === 'heuresNormales' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2. Nombre de jours d'activité */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span className="font-semibold text-slate-800 text-sm">Nombre de jours d'activité</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-8">
                Formule Pajemploi : (Jours d'accueil hebdo × Nb semaines) / 12 arrondi au supérieur. Sert au calcul du plafond CMG.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="font-mono text-lg font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">
                {p.nbJoursActivite} j
              </span>
              <button
                onClick={() => copyToClipboard(String(p.nbJoursActivite), 'joursActivite')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Copier la valeur"
              >
                {copiedKey === 'joursActivite' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. Nombre de jours de congés payés */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span className="font-semibold text-slate-800 text-sm">Nombre de jours de congés payés</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-8">
                En année complète, indiquez <strong>0</strong> (les CP sont déjà inclus dans les heures normales). En année incomplète, renseignez les jours indemnisés ce mois-ci.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="font-mono text-lg font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">
                {p.nbJoursCP} j
              </span>
              <button
                onClick={() => copyToClipboard(String(p.nbJoursCP), 'joursCP')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Copier la valeur"
              >
                {copiedKey === 'joursCP' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 4. Nombre d'heures complémentaires */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <span className="font-semibold text-slate-800 text-sm">Nombre d'heures complémentaires</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-8">
                Heures effectuées au-delà du volume contractuel mais inférieures ou égales à 45h/semaine.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className={`font-mono text-lg font-extrabold px-3 py-1 rounded-md ${
                p.nbHeuresComplementaires > 0 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-900'
              }`}>
                {p.nbHeuresComplementaires} h
              </span>
              <button
                onClick={() => copyToClipboard(String(p.nbHeuresComplementaires), 'heuresComp')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Copier la valeur"
              >
                {copiedKey === 'heuresComp' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 5. Nombre d'heures majorées (>45h) */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  5
                </span>
                <span className="font-semibold text-slate-800 text-sm">Nombre d'heures majorées (&gt; 45h/sem)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-8">
                Heures au-delà de 45h hebdomadaires (majoration contractuelle min 10% IDCC 3239). Exonérées d'impôt.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className={`font-mono text-lg font-extrabold px-3 py-1 rounded-md ${
                p.nbHeuresMajorees > 0 ? 'bg-purple-100 text-purple-900' : 'bg-slate-100 text-slate-900'
              }`}>
                {p.nbHeuresMajorees} h
              </span>
              <button
                onClick={() => copyToClipboard(String(p.nbHeuresMajorees), 'heuresMajorees')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Copier la valeur"
              >
                {copiedKey === 'heuresMajorees' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 6. Salaire net total */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors bg-blue-50/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  6
                </span>
                <span className="font-bold text-slate-900 text-sm">Salaire net total</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 ml-8">
                Comprend le salaire mensualisé + heures complémentaires et majorées {summary.absenceHoursDeducted > 0 ? '- déduction pour absence' : ''} {p.nbJoursCP > 0 ? '+ CP' : ''} (HORS INDEMNITÉS).
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="font-mono text-xl font-extrabold text-blue-900 bg-blue-100/80 px-3 py-1 rounded-md">
                {p.salaireNetTotal.toFixed(2)} €
              </span>
              <button
                onClick={() => copyToClipboard(p.salaireNetTotal.toFixed(2), 'salaireNet')}
                className="p-2 rounded-lg bg-blue-200/60 hover:bg-blue-200 text-blue-900 transition-colors"
                title="Copier le salaire net"
              >
                {copiedKey === 'salaireNet' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 7. Indemnités d'entretien */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  7
                </span>
                <span className="font-semibold text-slate-800 text-sm">Indemnités d'entretien</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-8">
                Calculées sur les {summary.presentDaysCount} jours de présence effective selon la grille légale IDCC 3239.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="font-mono text-lg font-extrabold text-purple-900 bg-purple-50 px-3 py-1 rounded-md">
                {p.indemnitesEntretien.toFixed(2)} €
              </span>
              <button
                onClick={() => copyToClipboard(p.indemnitesEntretien.toFixed(2), 'indemniteEntretien')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Copier la valeur"
              >
                {copiedKey === 'indemniteEntretien' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 8. Indemnités de repas */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  8
                </span>
                <span className="font-semibold text-slate-800 text-sm">Indemnités de repas</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 ml-8">
                Repas & goûters préparés et fournis par l'assistante maternelle.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="font-mono text-lg font-extrabold text-amber-900 bg-amber-50 px-3 py-1 rounded-md">
                {p.indemnitesRepas.toFixed(2)} €
              </span>
              <button
                onClick={() => copyToClipboard(p.indemnitesRepas.toFixed(2), 'indemniteRepas')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Copier la valeur"
              >
                {copiedKey === 'indemniteRepas' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* TOTAL NET PAYÉ */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-950 via-slate-900 to-rose-950 text-white rounded-b-xl">
            <div>
              <span className="font-extrabold text-sm uppercase tracking-wider text-rose-300">
                Montant Total Net à Verser au Salarié
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                (Par virement bancaire ou prélèvement automatique Pajemploi+)
              </p>
            </div>

            <div className="flex items-center gap-3 sm:ml-auto">
              <span className="font-mono text-2xl font-black text-white">
                {p.totalVerse.toFixed(2)} €
              </span>
              <button
                onClick={() => copyToClipboard(p.totalVerse.toFixed(2), 'totalVerse')}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                title="Copier le montant total"
              >
                {copiedKey === 'totalVerse' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                Copier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Advice */}
      <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-600 space-y-2">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Astuce Pajemploi+ :
        </p>
        <p>
          Si vous avez activé le service <strong>Pajemploi+</strong>, l'Urssaf prélève directement sur le compte bancaire du parent employeur le montant du salaire net (déduction faite du CMG) et le verse automatiquement sur le compte de l'assistante maternelle sous 2 à 3 jours ouvrés.
        </p>
      </div>
    </div>
  );
};
