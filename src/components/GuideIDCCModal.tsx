import React from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Scale, 
  FileCheck, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

interface GuideIDCCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideIDCCModal: React.FC<GuideIDCCModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-rose-500 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-blue-950">
                Gest'app <span className="text-rose-500">Baby</span> • Guide Juridique IDCC 3239
              </h2>
              <p className="text-xs text-slate-500">
                Cadre légal de la Convention Collective Nationale des Assistants Maternels
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* 1. Durée du travail & Heures sup */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-600" />
              1. Durée Conventionnelle du Travail & Heures Supplémentaires
            </h3>
            <p>
              • <strong>Durée conventionnelle hebdomadaire :</strong> 45 heures par semaine.<br />
              • <strong>Heures complémentaires :</strong> Heures effectuées au-delà du volume hebdomadaire contractuel jusqu'à 45h. Rémunérées au taux normal contractuel.<br />
              • <strong>Heures supplémentaires :</strong> Heures accomplies au-delà de 45h/semaine. Majoration conventionnelle obligatoire d'au moins <strong>10%</strong> (ou taux contractuel supérieur). Bénéficient de l'exonération fiscale et d'un allègement de cotisations salariales (loi TEPA).<br />
              • <strong>Repos quotidien :</strong> Minimum 11 heures consécutives entre deux journées d'accueil.<br />
              • <strong>Repos hebdomadaire :</strong> Minimum 35 heures consécutives (24h + 11h).
            </p>
          </div>

          {/* 2. Absences et Retenue Cour de Cassation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-600" />
              2. Gestion des Absences & Formule de la Cour de Cassation
            </h3>
            <p>
              En droit français et sous l'IDCC 3239, la déduction d'une absence ne se fait jamais au réel horaire simple, mais <strong>obligatoirement selon la formule de la Cour de Cassation</strong> :
            </p>
            <div className="p-3 bg-white rounded-lg border border-indigo-200 font-mono text-[11px] text-indigo-900 font-bold">
              Retenue sur salaire = (Salaire mensuel de base / Heures potentielles du mois) × Heures d'absence
            </div>
            <p>
              • <strong>Absence enfant convenance des parents :</strong> Le salaire est intégralement maintenu (non déductible).<br />
              • <strong>Absence enfant maladie :</strong> Déductible uniquement si un certificat médical est fourni sous 48h, dans la limite stricte de <strong>5 jours par an</strong> (ou 14 jours consécutifs en cas d'hospitalisation).<br />
              • <strong>Absence de l'assistante maternelle :</strong> Déductible selon la formule ci-dessus.
            </p>
          </div>

          {/* 3. Indemnité d'Entretien */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. Barème des Indemnités d'Entretien
            </h3>
            <p>
              L'indemnité d'entretien couvre les frais engagés par l'assistante maternelle (eau, électricité, chauffage, usure du matériel de puériculture, jeux, etc.) :<br />
              • Due pour chaque journée de <strong>présence effective</strong> (non due si l'enfant est absent).<br />
              • <strong>Moins de 6h43 d'accueil :</strong> Forfait minimum légal de 2,65 €.<br />
              • <strong>De 6h43 à 9h d'accueil :</strong> Minimum conventionnel de 85% du minimum garanti (3,74 €).<br />
              • <strong>Au-delà de 9h :</strong> Calcul proratisé (environ 0,416 € / heure d'accueil).
            </p>
          </div>

          {/* 4. Régularisation Annuelle (Article 110) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-purple-600" />
              4. Régularisation de Salaire en Année Incomplète (Article 110)
            </h3>
            <p>
              Obligatoire à la date anniversaire du contrat ou à la rupture :<br />
              • Si Heures Réelles &gt; Heures Payées : l'employeur verse la différence.<br />
              • <strong>Règle d'or IDCC 3239 :</strong> Si Heures Réelles &lt; Heures Payées, <strong>le trop-perçu reste définitivement acquis</strong> à la salariée. Aucun remboursement ne peut être demandé.
            </p>
          </div>

          {/* 5. Fin de Contrat & Indemnité 1/80ème (Article 117) */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              5. Fin de Contrat & Indemnité de Rupture (Article 117)
            </h3>
            <p>
              • Condition d'ancienneté : <strong>au moins 9 mois continus</strong> au service du particulier employeur.<br />
              • Montant : <strong>1/80ème</strong> du total des salaires bruts perçus pendant toute la durée du contrat.<br />
              • Documents obligatoires à remettre : Certificat de travail, Reçu pour solde de tout compte, et Attestation France Travail (Urssaf/Pajemploi).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            Fermer le guide
          </button>
        </div>
      </div>
    </div>
  );
};
