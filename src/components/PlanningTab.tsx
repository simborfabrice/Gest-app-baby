import React, { useState, useMemo } from 'react';
import { Contract, AttendanceDay, DayStatus } from '../types';
import { calculateIndemniteEntretien } from '../utils/idcc3239';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Coffee, 
  CheckSquare, 
  RotateCcw, 
  Sparkles,
  Info,
  ChevronDown,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';

interface PlanningTabProps {
  contract: Contract;
  year: number;
  month: number;
  attendanceDays: AttendanceDay[];
  onUpdateDay: (updatedDay: AttendanceDay) => void;
  onApplyDefaultSchedule: () => void;
  onClearMonth: () => void;
}

const STATUS_LABELS: Record<DayStatus, { label: string; shortLabel: string; badgeClass: string; isPayable: boolean }> = {
  present: { 
    label: 'Présent (Accueil)', 
    shortLabel: 'Présent',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300', 
    isPayable: true 
  },
  absent_enfant_certif: { 
    label: 'Absence enfant (Certif. médical)', 
    shortLabel: 'Maladie enfant',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300', 
    isPayable: false 
  },
  absent_enfant_convenance: { 
    label: 'Absence convenance parents (Payée)', 
    shortLabel: 'Absence payée',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300', 
    isPayable: true 
  },
  absent_assmat: { 
    label: 'Absence assistante maternelle', 
    shortLabel: 'Absence assmat',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300', 
    isPayable: false 
  },
  ferie_chome_paye: { 
    label: 'Férié chômé et payé', 
    shortLabel: 'Férié chômé',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300', 
    isPayable: true 
  },
  ferie_travaille: { 
    label: 'Férié travaillé', 
    shortLabel: 'Férié ouvré',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300', 
    isPayable: true 
  },
  conge_paye: { 
    label: 'Congé payé pris', 
    shortLabel: 'Congé payé',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300', 
    isPayable: true 
  },
  non_accueilli: { 
    label: 'Non prévu / Repos', 
    shortLabel: 'Repos',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200', 
    isPayable: false 
  },
};

const DAY_NAMES_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const WEEKDAY_HEADERS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const PlanningTab: React.FC<PlanningTabProps> = ({
  contract,
  attendanceDays,
  onUpdateDay,
  onApplyDefaultSchedule,
  onClearMonth,
}) => {
  const [filter, setFilter] = useState<'all' | 'planned' | 'modifications'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Calcul des statistiques rapides
  const stats = useMemo(() => {
    let plannedTotalHours = 0;
    let actualTotalHours = 0;
    let totalPresentDays = 0;
    let totalEntretien = 0;
    let totalMeals = 0;
    let absenceCertifCount = 0;
    let absenceAssmatCount = 0;

    for (const d of attendanceDays) {
      plannedTotalHours += d.plannedHours;
      if (d.status === 'present' || d.status === 'ferie_travaille') {
        actualTotalHours += d.actualHours;
        totalPresentDays++;
        totalEntretien += calculateIndemniteEntretien(d.actualHours, contract);
        if (d.repasFourni) totalMeals++;
      } else if (d.status === 'absent_enfant_certif') {
        absenceCertifCount++;
      } else if (d.status === 'absent_assmat') {
        absenceAssmatCount++;
      }
    }

    return {
      plannedTotalHours: Number(plannedTotalHours.toFixed(1)),
      actualTotalHours: Number(actualTotalHours.toFixed(1)),
      totalPresentDays,
      totalEntretien: Number(totalEntretien.toFixed(2)),
      totalMeals,
      absenceCertifCount,
      absenceAssmatCount,
    };
  }, [attendanceDays, contract]);

  const handleTimeChange = (day: AttendanceDay, field: 'actualArrival' | 'actualDeparture', val: string) => {
    const updated = { ...day, [field]: val };
    
    // Calcul automatique des heures réelles
    if (updated.actualArrival && updated.actualDeparture) {
      const [startH, startM] = updated.actualArrival.split(':').map(Number);
      const [endH, endM] = updated.actualDeparture.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      
      if (endMinutes > startMinutes) {
        const diffHours = (endMinutes - startMinutes) / 60;
        updated.actualHours = Number(diffHours.toFixed(2));
      } else {
        updated.actualHours = 0;
      }
    }
    onUpdateDay(updated);
  };

  const handleStatusChange = (day: AttendanceDay, newStatus: DayStatus) => {
    const updated = { ...day, status: newStatus };
    if (newStatus === 'non_accueilli' || newStatus === 'absent_enfant_certif' || newStatus === 'absent_assmat') {
      updated.actualHours = 0;
      updated.repasFourni = false;
      updated.gouterFourni = false;
      updated.kmParcourus = 0;
    } else if (newStatus === 'present' && updated.actualHours === 0 && day.plannedHours > 0) {
      const dow = new Date(day.date).getDay();
      const sched = contract.weeklySchedule.find(s => s.dayOfWeek === dow);
      if (sched) {
        updated.actualArrival = sched.startTime;
        updated.actualDeparture = sched.endTime;
        updated.actualHours = sched.plannedHours;
      }
    }
    onUpdateDay(updated);
  };

  const filteredDays = attendanceDays.filter(d => {
    if (filter === 'planned') {
      return d.plannedHours > 0;
    }
    if (filter === 'modifications') {
      return (
        d.status !== 'non_accueilli' &&
        (d.status !== 'present' || d.actualHours !== d.plannedHours || d.notes)
      );
    }
    return true;
  });

  // Calculate calendar grid cells offset (for French Monday-start calendar)
  const calendarPaddingCount = useMemo(() => {
    if (attendanceDays.length === 0) return 0;
    const firstDate = new Date(attendanceDays[0].date);
    const dayOfWeek = firstDate.getDay(); // 0 is Sunday, 1 is Monday
    return (dayOfWeek === 0 ? 7 : dayOfWeek) - 1;
  }, [attendanceDays]);

  return (
    <div className="space-y-6">
      {/* Top Banner KPI - Dynamic Theme Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="theme-box p-3.5 border shadow-2xs transition-colors">
          <span className="text-xs font-semibold flex items-center text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" style={{ color: 'var(--theme-secondary, #2563eb)' }} /> Jours d'accueil réels
          </span>
          <p className="text-xl font-black text-slate-900 mt-1">
            {stats.totalPresentDays} <span className="text-xs font-normal text-slate-500">jours</span>
          </p>
          <span className="text-[11px] font-semibold" style={{ color: 'var(--theme-secondary, #2563eb)' }}>
            Présences effectives
          </span>
        </div>

        <div className="theme-box p-3.5 border shadow-2xs transition-colors">
          <span className="text-xs font-semibold flex items-center text-slate-700">
            <Clock className="w-3.5 h-3.5 mr-1" style={{ color: 'var(--theme-primary, #f43f5e)' }} /> Heures travaillées
          </span>
          <p className="text-xl font-black text-slate-900 mt-1">
            {stats.actualTotalHours}h <span className="text-xs font-normal text-slate-400">/ {stats.plannedTotalHours}h</span>
          </p>
          <span 
            className="text-[11px] font-semibold"
            style={{ color: stats.actualTotalHours > stats.plannedTotalHours ? 'var(--theme-primary, #f43f5e)' : '#94a3b8' }}
          >
            {stats.actualTotalHours > stats.plannedTotalHours 
              ? `+${(stats.actualTotalHours - stats.plannedTotalHours).toFixed(1)}h complémentaires/sup`
              : 'Conforme au contrat'}
          </span>
        </div>

        <div className="theme-box p-3.5 border shadow-2xs transition-colors">
          <span className="text-xs font-semibold flex items-center text-slate-700">
            <Sparkles className="w-3.5 h-3.5 mr-1" style={{ color: 'var(--theme-primary, #f43f5e)' }} /> Indemnités entretien
          </span>
          <p className="text-xl font-black mt-1" style={{ color: 'var(--theme-primary, #f43f5e)' }}>
            {stats.totalEntretien.toFixed(2)} €
          </p>
          <span className="text-[11px] font-semibold opacity-80" style={{ color: 'var(--theme-primary, #f43f5e)' }}>
            Calcul IDCC 3239 au réel
          </span>
        </div>

        <div className="theme-box p-3.5 border shadow-2xs transition-colors">
          <span className="text-xs font-semibold flex items-center text-slate-700">
            <Coffee className="w-3.5 h-3.5 mr-1" style={{ color: 'var(--theme-secondary, #2563eb)' }} /> Repas fournis
          </span>
          <p className="text-xl font-black text-slate-900 mt-1">
            {stats.totalMeals} <span className="text-xs font-normal text-slate-400">repas</span>
          </p>
          <span className="text-[11px] font-semibold" style={{ color: 'var(--theme-secondary, #2563eb)' }}>
            {(stats.totalMeals * contract.repasTarif).toFixed(2)} € au tarif assmat
          </span>
        </div>

        <div className="theme-box p-3.5 border shadow-2xs col-span-2 md:col-span-4 lg:col-span-1 transition-colors">
          <span className="text-xs font-semibold flex items-center text-slate-700">
            <AlertCircle className="w-3.5 h-3.5 mr-1" style={{ color: 'var(--theme-primary, #f43f5e)' }} /> Absences déductibles
          </span>
          <p className="text-xl font-black mt-1" style={{ color: 'var(--theme-primary, #f43f5e)' }}>
            {stats.absenceCertifCount + stats.absenceAssmatCount} <span className="text-xs font-normal text-slate-400">jours</span>
          </p>
          <span className="text-[11px] font-semibold opacity-80" style={{ color: 'var(--theme-primary, #f43f5e)' }}>
            Règle Cour de Cassation
          </span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="theme-box p-3 border shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={filter === 'all' ? {
              background: 'linear-gradient(135deg, var(--theme-primary, #f43f5e), var(--theme-secondary, #2563eb))',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            } : {
              backgroundColor: 'rgba(0,0,0,0.04)',
              color: '#334155'
            }}
          >
            Tous les jours ({attendanceDays.length})
          </button>
          <button
            onClick={() => setFilter('planned')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={filter === 'planned' ? {
              background: 'linear-gradient(135deg, var(--theme-primary, #f43f5e), var(--theme-secondary, #2563eb))',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            } : {
              backgroundColor: 'rgba(0,0,0,0.04)',
              color: '#334155'
            }}
          >
            Jours prévus au contrat
          </button>
          <button
            onClick={() => setFilter('modifications')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={filter === 'modifications' ? {
              background: 'linear-gradient(135deg, var(--theme-primary, #f43f5e), var(--theme-secondary, #2563eb))',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            } : {
              backgroundColor: 'rgba(0,0,0,0.04)',
              color: '#334155'
            }}
          >
            Particularités & Absences
          </button>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Switch Grid / Table View */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-2xs text-slate-900' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vue Grille de Cases Calendrier (recommandé)"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-rose-500" />
              <span>Cases Calendrier</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' 
                  ? 'bg-white shadow-2xs text-slate-900' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Vue Tableau Détaillé"
            >
              <TableIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Tableau</span>
            </button>
          </div>

          <button
            onClick={onApplyDefaultSchedule}
            className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors shadow-2xs"
            style={{
              color: 'var(--theme-secondary, #2563eb)',
              backgroundColor: 'var(--theme-secondary-10, rgba(37,99,235,0.08))',
              borderColor: 'var(--theme-secondary-border, rgba(37,99,235,0.25))'
            }}
            title="Applique le planning hebdomadaire type sur tout le mois"
          >
            <CheckSquare className="w-3.5 h-3.5 mr-1.5" />
            Planning type
          </button>

          <button
            onClick={onClearMonth}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors shadow-2xs"
            style={{
              color: 'var(--theme-primary, #f43f5e)',
              backgroundColor: 'var(--theme-primary-5, rgba(244,63,94,0.05))',
              borderColor: 'var(--theme-primary-border, rgba(244,63,94,0.25))'
            }}
            title="Réinitialiser toutes les saisies du mois"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Info notice about IDCC 3239 legal rules */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">Rappels de la Convention Collective IDCC 3239 :</p>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            • <strong>Absence enfant pour convenance des parents</strong> : salaire intégralement maintenu.<br />
            • <strong>Absence maladie enfant (certif. médical)</strong> : déductible (max 5 jours/an) via la méthode légale de la Cour de Cassation.<br />
            • <strong>Heures supplémentaires (&gt; 45h/semaine)</strong> : obligatoirement majorées (+{contract.overtimeRatePercentage}% au contrat) et exonérées fiscalement.<br />
            • <strong>Indemnités d'entretien</strong> : dues uniquement lors des présences réelles (minimum conventionnel IDCC 3239 garanti).
          </p>
        </div>
      </div>

      {/* 1. VUE GRILLE DE CASES CALENDRIER */}
      {viewMode === 'grid' && (
        <div className="space-y-3">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
            {WEEKDAY_HEADERS.map((h, i) => (
              <div 
                key={h} 
                className={`py-1.5 rounded-lg border text-[11px] ${
                  i >= 5 ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white/80 border-slate-200 text-slate-700'
                }`}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Grid of Day Boxes (Les cases de l'application) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {/* Blank padding cells before day 1 */}
            {Array.from({ length: calendarPaddingCount }).map((_, idx) => (
              <div 
                key={`empty-${idx}`} 
                className="hidden lg:block opacity-25 rounded-2xl border border-dashed border-slate-200 p-2 min-h-[140px]"
              />
            ))}

            {filteredDays.map((day) => {
              const dateObj = new Date(day.date);
              const dayNumber = dateObj.getDate();
              const jsDay = dateObj.getDay();
              const dayName = DAY_NAMES_FR[jsDay];
              const isWeekend = jsDay === 0 || jsDay === 6;
              const statusMeta = STATUS_LABELS[day.status];
              const entretienAmount = (day.status === 'present' || day.status === 'ferie_travaille') 
                ? calculateIndemniteEntretien(day.actualHours, contract)
                : 0;

              return (
                <div
                  key={day.date}
                  className={`theme-box p-3 border shadow-2xs transition-all hover:shadow-md flex flex-col justify-between min-h-[155px] ${
                    isWeekend ? 'opacity-70 bg-slate-50/50' : ''
                  }`}
                >
                  {/* Top: Day Number & Day Name */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs text-white shadow-2xs"
                        style={{
                          background: isWeekend ? '#94a3b8' : 'var(--theme-primary, #f43f5e)'
                        }}
                      >
                        {dayNumber}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">
                        {dayName.slice(0, 3)}
                      </span>
                    </div>

                    {day.actualHours > 0 && (
                      <span className="font-mono text-xs font-extrabold text-slate-900 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
                        {day.actualHours}h
                      </span>
                    )}
                  </div>

                  {/* Middle: Status Selector */}
                  <div className="space-y-1.5 my-1">
                    <div className="relative">
                      <select
                        value={day.status}
                        onChange={(e) => handleStatusChange(day, e.target.value as DayStatus)}
                        className={`w-full py-1 px-1.5 pr-5 text-[10px] font-bold rounded-lg border appearance-none cursor-pointer focus:ring-1 focus:ring-rose-400 ${statusMeta.badgeClass}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([k, meta]) => (
                          <option key={k} value={k} className="bg-white text-slate-800 font-normal">
                            {meta.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-1.5 top-2 pointer-events-none text-current opacity-70" />
                    </div>

                    {/* Time Inputs if present */}
                    {(day.status === 'present' || day.status === 'ferie_travaille') && (
                      <div className="grid grid-cols-2 gap-1 pt-0.5">
                        <div>
                          <label className="text-[9px] text-slate-400 block font-semibold">Arrivée</label>
                          <input
                            type="time"
                            value={day.actualArrival}
                            onChange={(e) => handleTimeChange(day, 'actualArrival', e.target.value)}
                            className="w-full px-1 py-0.5 text-[10px] font-mono border border-slate-200 rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 block font-semibold">Départ</label>
                          <input
                            type="time"
                            value={day.actualDeparture}
                            onChange={(e) => handleTimeChange(day, 'actualDeparture', e.target.value)}
                            className="w-full px-1 py-0.5 text-[10px] font-mono border border-slate-200 rounded bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Repas & Indemnité info */}
                  <div className="border-t border-slate-100 pt-1.5 mt-auto flex items-center justify-between text-[10px]">
                    {(day.status === 'present' || day.status === 'ferie_travaille') ? (
                      <>
                        <label className="flex items-center gap-1 cursor-pointer font-medium text-slate-600 hover:text-slate-900">
                          <input
                            type="checkbox"
                            checked={day.repasFourni}
                            onChange={(e) => onUpdateDay({ ...day, repasFourni: e.target.checked })}
                            className="w-3.5 h-3.5 rounded text-rose-500 border-slate-300 focus:ring-0 cursor-pointer"
                          />
                          <span>Repas</span>
                        </label>
                        <span className="font-bold text-purple-700">
                          {entretienAmount.toFixed(2)}€
                        </span>
                      </>
                    ) : (
                      <span className="text-[9px] text-slate-400 italic">
                        {statusMeta.shortLabel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. VUE TABLEAU DÉTAILLÉ */}
      {viewMode === 'table' && (
        <div className="theme-box border shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Statut IDCC 3239</th>
                  <th className="py-3 px-2">Arrivée</th>
                  <th className="py-3 px-2">Départ</th>
                  <th className="py-3 px-2 text-center">Heures</th>
                  <th className="py-3 px-2 text-center">Repas</th>
                  <th className="py-3 px-2 text-center">Goûter</th>
                  <th className="py-3 px-2 text-center">Km</th>
                  <th className="py-3 px-3">Entretien</th>
                  <th className="py-3 px-3">Commentaire / Justificatif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDays.map(day => {
                  const dateObj = new Date(day.date);
                  const dayNumber = dateObj.getDate();
                  const jsDay = dateObj.getDay();
                  const dayName = DAY_NAMES_FR[jsDay];
                  const isWeekend = jsDay === 0 || jsDay === 6;
                  const statusMeta = STATUS_LABELS[day.status];
                  const entretienAmount = (day.status === 'present' || day.status === 'ferie_travaille') 
                    ? calculateIndemniteEntretien(day.actualHours, contract)
                    : 0;

                  const isOverPlanned = day.status === 'present' && day.actualHours > day.plannedHours;
                  const isUnderPlanned = day.status === 'present' && day.plannedHours > 0 && day.actualHours < day.plannedHours;

                  return (
                    <tr 
                      key={day.date}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isWeekend ? 'bg-slate-50/40 text-slate-400' : ''
                      } ${day.status === 'absent_enfant_certif' ? 'bg-amber-50/30' : ''}`}
                    >
                      {/* Date */}
                      <td className="py-2.5 px-3 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs text-white shadow-2xs"
                            style={{
                              background: isWeekend ? '#94a3b8' : 'var(--theme-primary, #f43f5e)'
                            }}
                          >
                            {dayNumber}
                          </span>
                          <div>
                            <p className="font-semibold text-slate-800">{dayName}</p>
                            <p className="text-[10px] text-slate-400">{day.date}</p>
                          </div>
                        </div>
                      </td>

                      {/* Status dropdown */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={day.status}
                            onChange={(e) => handleStatusChange(day, e.target.value as DayStatus)}
                            className={`w-full py-1.5 px-2.5 pr-7 text-xs font-semibold rounded-lg border appearance-none cursor-pointer focus:ring-2 focus:ring-rose-500 focus:outline-hidden ${statusMeta.badgeClass}`}
                          >
                            {Object.entries(STATUS_LABELS).map(([k, meta]) => (
                              <option key={k} value={k} className="bg-white text-slate-800 font-normal">
                                {meta.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none text-current opacity-70" />
                        </div>
                      </td>

                      {/* Arrivée */}
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <input
                          type="time"
                          value={day.actualArrival}
                          disabled={day.status !== 'present' && day.status !== 'ferie_travaille'}
                          onChange={(e) => handleTimeChange(day, 'actualArrival', e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md focus:border-rose-400 focus:ring-1 focus:ring-rose-400 disabled:opacity-30 disabled:bg-slate-100 bg-white"
                        />
                      </td>

                      {/* Départ */}
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <input
                          type="time"
                          value={day.actualDeparture}
                          disabled={day.status !== 'present' && day.status !== 'ferie_travaille'}
                          onChange={(e) => handleTimeChange(day, 'actualDeparture', e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md focus:border-rose-400 focus:ring-1 focus:ring-rose-400 disabled:opacity-30 disabled:bg-slate-100 bg-white"
                        />
                      </td>

                      {/* Heures réelles */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          isOverPlanned ? 'bg-amber-100 text-amber-800' :
                          isUnderPlanned ? 'bg-slate-200 text-slate-700' :
                          day.actualHours > 0 ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'
                        }`}>
                          {day.actualHours > 0 ? `${day.actualHours}h` : '-'}
                        </span>
                      </td>

                      {/* Repas */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={day.repasFourni}
                          disabled={day.status !== 'present' && day.status !== 'ferie_travaille'}
                          onChange={(e) => onUpdateDay({ ...day, repasFourni: e.target.checked })}
                          className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 disabled:opacity-30 cursor-pointer"
                          title={`Repas fourni (${contract.repasTarif.toFixed(2)} €)`}
                        />
                      </td>

                      {/* Goûter */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="checkbox"
                          checked={day.gouterFourni}
                          disabled={day.status !== 'present' && day.status !== 'ferie_travaille'}
                          onChange={(e) => onUpdateDay({ ...day, gouterFourni: e.target.checked })}
                          className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 disabled:opacity-30 cursor-pointer"
                          title={`Goûter fourni (${contract.gouterTarif.toFixed(2)} €)`}
                        />
                      </td>

                      {/* Km */}
                      <td className="py-2.5 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          max="200"
                          value={day.kmParcourus || ''}
                          disabled={day.status !== 'present' && day.status !== 'ferie_travaille'}
                          onChange={(e) => onUpdateDay({ ...day, kmParcourus: Number(e.target.value) || 0 })}
                          placeholder="0"
                          className="w-12 px-1 py-1 text-xs text-center border border-slate-200 rounded-md focus:border-rose-400 disabled:opacity-30 disabled:bg-slate-100 bg-white"
                        />
                      </td>

                      {/* Indemnité d'entretien */}
                      <td className="py-2.5 px-3 font-medium whitespace-nowrap">
                        <span className={`text-xs ${entretienAmount > 0 ? 'text-purple-700 font-semibold' : 'text-slate-400'}`}>
                          {entretienAmount > 0 ? `${entretienAmount.toFixed(2)} €` : '-'}
                        </span>
                      </td>

                      {/* Commentaire / Notes */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={day.notes || ''}
                          placeholder="Observation, motif absence..."
                          onChange={(e) => onUpdateDay({ ...day, notes: e.target.value })}
                          className="w-full min-w-[140px] px-2 py-1 text-xs border border-slate-200 rounded-md focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-white"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
