import React, { useState } from 'react';
import { Contract, DaySchedule, AnneeType } from '../types';
import { netToBrut } from '../utils/idcc3239';
import { X, Baby, Plus, Check } from 'lucide-react';

interface NewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContract: (contract: Contract) => void;
}

const defaultWeek: DaySchedule[] = [
  { dayOfWeek: 1, dayName: 'Lundi', active: true, startTime: '08:30', endTime: '17:00', plannedHours: 8.5 },
  { dayOfWeek: 2, dayName: 'Mardi', active: true, startTime: '08:30', endTime: '17:00', plannedHours: 8.5 },
  { dayOfWeek: 3, dayName: 'Mercredi', active: true, startTime: '08:30', endTime: '17:00', plannedHours: 8.5 },
  { dayOfWeek: 4, dayName: 'Jeudi', active: true, startTime: '08:30', endTime: '17:00', plannedHours: 8.5 },
  { dayOfWeek: 5, dayName: 'Vendredi', active: true, startTime: '08:30', endTime: '17:00', plannedHours: 8.5 },
  { dayOfWeek: 6, dayName: 'Samedi', active: false, startTime: '08:30', endTime: '17:00', plannedHours: 0 },
  { dayOfWeek: 7, dayName: 'Dimanche', active: false, startTime: '08:30', endTime: '17:00', plannedHours: 0 },
];

export const NewContractModal: React.FC<NewContractModalProps> = ({
  isOpen,
  onClose,
  onAddContract,
}) => {
  const [childFirstName, setChildFirstName] = useState('');
  const [childLastName, setChildLastName] = useState('');
  const [childBirthDate, setChildBirthDate] = useState('2025-05-10');
  const [parent1Name, setParent1Name] = useState('');
  const [parentPhone, setParentPhone] = useState('06 00 00 00 00');
  const [parentEmail, setParentEmail] = useState('');
  const [anneeType, setAnneeType] = useState<AnneeType>('complete');
  const [weeksPerYear, setWeeksPerYear] = useState(52);
  const [weeklyHours, setWeeklyHours] = useState(42.5);
  const [hourlyRateNet, setHourlyRateNet] = useState(4.50);
  const [repasTarif, setRepasTarif] = useState(4.00);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childFirstName || !parent1Name) return;

    const newId = `contract-${Date.now()}`;
    const newContract: Contract = {
      id: newId,
      childFirstName,
      childLastName: childLastName || 'Enfant',
      childBirthDate,
      parent1Name,
      parentPhone,
      parentEmail: parentEmail || 'parent@example.com',
      parentAddress: 'Adresse des parents',
      assmatName: 'Nathalie Dupont',
      assmatAgrementDate: '2019-06-15',
      assmatAgrementNumber: 'AGR-75-2019-0482',
      assmatPhone: '06 98 76 54 32',
      assmatAddress: '28 avenue de la République, 75011 Paris',
      assmatChildrenUnder15: 1,
      startDate: new Date().toISOString().split('T')[0],
      anneeType,
      weeksPerYear: anneeType === 'complete' ? 52 : weeksPerYear,
      weeklySchedule: defaultWeek,
      weeklyHours,
      hourlyRateNet,
      hourlyRateBrut: netToBrut(hourlyRateNet),
      isAlsaceMoselle: false,
      overtimeRatePercentage: 15,
      indemniteEntretienType: 'conventionnelle',
      indemniteEntretienCustom: 3.74,
      repasTarif,
      gouterTarif: 1.00,
      kmTarif: 0.40,
      cpPaymentMethod: 'juin',
      active: true,
    };

    onAddContract(newContract);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 border border-rose-100">
        <div className="px-6 py-4 border-b border-rose-100/80 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-rose-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-rose-500 flex items-center justify-center text-white shadow-xs">
              <Baby className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-blue-950">
                Gest'app <span className="text-rose-500">Baby</span>
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Nouveau contrat d'accueil (IDCC 3239)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prénom de l'enfant * :</label>
              <input
                type="text"
                required
                placeholder="Ex: Gabriel"
                value={childFirstName}
                onChange={(e) => setChildFirstName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nom de famille :</label>
              <input
                type="text"
                placeholder="Ex: Moreau"
                value={childLastName}
                onChange={(e) => setChildLastName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nom du Parent Employeur * :</label>
              <input
                type="text"
                required
                placeholder="Ex: Céline Moreau"
                value={parent1Name}
                onChange={(e) => setParent1Name(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date de naissance :</label>
              <input
                type="date"
                value={childBirthDate}
                onChange={(e) => setChildBirthDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Type de Contrat :</label>
              <select
                value={anneeType}
                onChange={(e) => setAnneeType(e.target.value as AnneeType)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
              >
                <option value="complete">Année Complète (52 sem)</option>
                <option value="incomplete">Année Incomplète (&le; 46 sem)</option>
              </select>
            </div>
            {anneeType === 'incomplete' ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nb Semaines programmées :</label>
                <input
                  type="number"
                  min="1"
                  max="46"
                  value={weeksPerYear}
                  onChange={(e) => setWeeksPerYear(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
                />
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Heures hebdomadaires :</label>
                <input
                  type="number"
                  step="0.5"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Taux Horaire Net (€) :</label>
              <input
                type="number"
                step="0.10"
                min="3.00"
                value={hourlyRateNet}
                onChange={(e) => setHourlyRateNet(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono font-bold text-rose-700 border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Indemnité de Repas (€) :</label>
              <input
                type="number"
                step="0.10"
                min="0"
                value={repasTarif}
                onChange={(e) => setRepasTarif(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-rose-500 hover:from-blue-700 hover:to-rose-600 shadow-md shadow-rose-200/50"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Créer le contrat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
