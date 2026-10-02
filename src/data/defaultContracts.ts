import { Contract, AttendanceDay, DaySchedule } from '../types';
import { netToBrut } from '../utils/idcc3239';

const standardWeekSchedule40h: DaySchedule[] = [
  { dayOfWeek: 1, dayName: 'Lundi', active: true, startTime: '08:30', endTime: '16:30', plannedHours: 8 },
  { dayOfWeek: 2, dayName: 'Mardi', active: true, startTime: '08:30', endTime: '16:30', plannedHours: 8 },
  { dayOfWeek: 3, dayName: 'Mercredi', active: true, startTime: '08:30', endTime: '16:30', plannedHours: 8 },
  { dayOfWeek: 4, dayName: 'Jeudi', active: true, startTime: '08:30', endTime: '16:30', plannedHours: 8 },
  { dayOfWeek: 5, dayName: 'Vendredi', active: true, startTime: '08:30', endTime: '16:30', plannedHours: 8 },
  { dayOfWeek: 6, dayName: 'Samedi', active: false, startTime: '08:30', endTime: '16:30', plannedHours: 0 },
  { dayOfWeek: 7, dayName: 'Dimanche', active: false, startTime: '08:30', endTime: '16:30', plannedHours: 0 },
];

const schedule45h: DaySchedule[] = [
  { dayOfWeek: 1, dayName: 'Lundi', active: true, startTime: '08:00', endTime: '17:00', plannedHours: 9 },
  { dayOfWeek: 2, dayName: 'Mardi', active: true, startTime: '08:00', endTime: '17:00', plannedHours: 9 },
  { dayOfWeek: 3, dayName: 'Mercredi', active: true, startTime: '08:00', endTime: '17:00', plannedHours: 9 },
  { dayOfWeek: 4, dayName: 'Jeudi', active: true, startTime: '08:00', endTime: '17:00', plannedHours: 9 },
  { dayOfWeek: 5, dayName: 'Vendredi', active: true, startTime: '08:00', endTime: '17:00', plannedHours: 9 },
  { dayOfWeek: 6, dayName: 'Samedi', active: false, startTime: '08:00', endTime: '17:00', plannedHours: 0 },
  { dayOfWeek: 7, dayName: 'Dimanche', active: false, startTime: '08:00', endTime: '17:00', plannedHours: 0 },
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'contract-lea-martin',
    childFirstName: 'Léa',
    childLastName: 'Martin',
    childBirthDate: '2025-04-12',
    parent1Name: 'Sophie Martin',
    parent2Name: 'Thomas Martin',
    parentPhone: '06 12 34 56 78',
    parentEmail: 'sophie.martin@example.fr',
    parentAddress: '14 rue des Lilas, 75015 Paris',
    
    assmatName: 'Nathalie Dupont',
    assmatAgrementDate: '2019-06-15',
    assmatAgrementNumber: 'AGR-75-2019-0482',
    assmatPhone: '06 98 76 54 32',
    assmatAddress: '28 avenue de la République, 75011 Paris',
    assmatChildrenUnder15: 1, // 1 enfant à charge pour les CP supplémentaires

    startDate: '2025-09-01',
    anneeType: 'complete',
    weeksPerYear: 52,
    weeklySchedule: standardWeekSchedule40h,
    weeklyHours: 40,
    
    hourlyRateNet: 4.50,
    hourlyRateBrut: netToBrut(4.50),
    isAlsaceMoselle: false,
    overtimeRatePercentage: 15, // +15% pour les heures > 45h (min CCN 10%)
    
    indemniteEntretienType: 'conventionnelle',
    indemniteEntretienCustom: 3.74,
    repasTarif: 4.20,
    gouterTarif: 1.00,
    kmTarif: 0.42,
    
    cpPaymentMethod: 'juin',
    medicalDoctor: 'Dr. Valérie Roche (01 45 67 89 00)',
    allergies: 'Aucune allergie connue. Intolérance légère au kiwi.',
    notes: 'Accueil du lundi au vendredi. Doudou lapin indispensable pour la sieste.',
    active: true,
  },
  {
    id: 'contract-lucas-dubois',
    childFirstName: 'Lucas',
    childLastName: 'Dubois',
    childBirthDate: '2024-11-20',
    parent1Name: 'Alexandre Dubois',
    parent2Name: 'Élodie Dubois',
    parentPhone: '06 45 67 89 12',
    parentEmail: 'alex.dubois@example.fr',
    parentAddress: '8 allée des Cerisiers, 92100 Boulogne-Billancourt',
    
    assmatName: 'Nathalie Dupont',
    assmatAgrementDate: '2019-06-15',
    assmatAgrementNumber: 'AGR-75-2019-0482',
    assmatPhone: '06 98 76 54 32',
    assmatAddress: '28 avenue de la République, 75011 Paris',
    assmatChildrenUnder15: 1,

    startDate: '2025-01-06',
    anneeType: 'incomplete',
    weeksPerYear: 44, // 44 semaines programmées (parents enseignants / congés décalés)
    weeklySchedule: schedule45h,
    weeklyHours: 45,
    
    hourlyRateNet: 4.80,
    hourlyRateBrut: netToBrut(4.80),
    isAlsaceMoselle: false,
    overtimeRatePercentage: 20,
    
    indemniteEntretienType: 'conventionnelle',
    indemniteEntretienCustom: 3.74,
    repasTarif: 4.50,
    gouterTarif: 1.20,
    kmTarif: 0.40,
    
    cpPaymentMethod: 'juin',
    medicalDoctor: 'Dr. Bernard Leclerc (01 42 33 44 55)',
    allergies: 'Asthme léger par temps froid (Puff Ventoline si ordonnance)',
    notes: 'Année incomplète 44 semaines. 8 semaines d’absence des parents par an.',
    active: true,
  }
];

/**
 * Génère des présences initiales réalistes pour un mois donné
 */
export function generateInitialMonthAttendance(contract: Contract, year: number, month: number): AttendanceDay[] {
  const date = new Date(year, month, 1);
  const days: AttendanceDay[] = [];
  
  while (date.getMonth() === month) {
    const dayOfMonth = date.getDate();
    const jsDay = date.getDay();
    const dayOfWeek = jsDay === 0 ? 7 : jsDay;
    const schedule = contract.weeklySchedule.find(s => s.dayOfWeek === dayOfWeek);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`;
    
    if (!schedule || !schedule.active) {
      days.push({
        date: dateStr,
        status: 'non_accueilli',
        plannedHours: 0,
        actualArrival: '',
        actualDeparture: '',
        actualHours: 0,
        repasFourni: false,
        gouterFourni: false,
        kmParcourus: 0,
      });
    } else {
      // Simulation réaliste
      // Ex: Jour 12 = absence enfant avec certificat médical
      if (dayOfMonth === 12) {
        days.push({
          date: dateStr,
          status: 'absent_enfant_certif',
          plannedHours: schedule.plannedHours,
          actualArrival: '',
          actualDeparture: '',
          actualHours: 0,
          repasFourni: false,
          gouterFourni: false,
          kmParcourus: 0,
          notes: 'Fièvre 38.8°C - Certificat médical fourni par le médecin'
        });
      } else if (dayOfMonth === 20) {
        // Ex: Dépassement d'horaires (départ 30 min plus tard -> heures complémentaires/sup)
        const [startH, startM] = schedule.startTime.split(':').map(Number);
        const [endH, endM] = schedule.endTime.split(':').map(Number);
        const departureH = endH;
        const departureM = endM + 30; // + 30 minutes
        const depStr = `${String(departureH).padStart(2, '0')}:${String(departureM).padStart(2, '0')}`;
        
        days.push({
          date: dateStr,
          status: 'present',
          plannedHours: schedule.plannedHours,
          actualArrival: schedule.startTime,
          actualDeparture: depStr,
          actualHours: schedule.plannedHours + 0.5,
          repasFourni: true,
          gouterFourni: true,
          kmParcourus: 0,
          notes: 'Départ tardif des parents (+30 min)'
        });
      } else {
        // Jour normal
        days.push({
          date: dateStr,
          status: 'present',
          plannedHours: schedule.plannedHours,
          actualArrival: schedule.startTime,
          actualDeparture: schedule.endTime,
          actualHours: schedule.plannedHours,
          repasFourni: true,
          gouterFourni: true,
          kmParcourus: 0,
        });
      }
    }
    date.setDate(date.getDate() + 1);
  }
  
  return days;
}
