import { Contract, AttendanceDay, MonthSummary, DaySchedule, AnnualRegularisationRecord } from '../types';

// Constantes légales conventionnelles IDCC 3239
export const COTISATION_SALARIALE_METROPOLE = 0.2196; // 21.96%
export const COTISATION_SALARIALE_ALSACE = 0.2326;     // 23.26%
export const COEFFICIENT_NET_METROPOLE = 1 - COTISATION_SALARIALE_METROPOLE; // 0.7804
export const COEFFICIENT_NET_ALSACE = 1 - COTISATION_SALARIALE_ALSACE;       // 0.7674

export const SMIC_HORAIRE_BRUT = 12.02; // Taux de référence légal
export const PLAFOND_JOURNALIER_CMG_BRUT = SMIC_HORAIRE_BRUT * 5; // 5 x SMIC horaire brut (Pajemploi)
export const DUREE_HEBDO_LEGALE_CCN = 45; // Seuil des heures supplémentaires sous IDCC 3239

// Barème indemnité d'entretien minimum légal & conventionnel IDCC 3239
export const INDEMNITE_ENTRETIEN_MIN_LEGAL = 2.65; // Plancher pour toute journée (< 6h43)
export const INDEMNITE_ENTRETIEN_9H = 3.74;        // Minimum conventionnel pour 9h (85% du MG)
export const INDEMNITE_ENTRETIEN_PAR_HEURE_BASE = INDEMNITE_ENTRETIEN_9H / 9; // ~0.4156 € / heure

/**
 * Conversion Brut -> Net
 */
export function brutToNet(brut: number, isAlsaceMoselle = false): number {
  const coef = isAlsaceMoselle ? COEFFICIENT_NET_ALSACE : COEFFICIENT_NET_METROPOLE;
  return Number((brut * coef).toFixed(2));
}

/**
 * Conversion Net -> Brut
 */
export function netToBrut(net: number, isAlsaceMoselle = false): number {
  const coef = isAlsaceMoselle ? COEFFICIENT_NET_ALSACE : COEFFICIENT_NET_METROPOLE;
  return Number((net / coef).toFixed(2));
}

/**
 * Calcul de l'indemnité d'entretien selon l'IDCC 3239
 * - Moins de 6h43 (6.717h) : Forfait légal de 2.65 €
 * - 6h43 à 9h : 3.74 € (85% du minimum garanti)
 * - Plus de 9h : 3.74 € + (heures - 9) * (3.74 / 9)
 */
export function calculateIndemniteEntretien(hours: number, contract: Contract): number {
  if (hours <= 0) return 0;
  if (contract.indemniteEntretienType === 'personnalisee' && contract.indemniteEntretienCustom > 0) {
    return Number(contract.indemniteEntretienCustom.toFixed(2));
  }
  
  if (hours < 6.717) {
    return INDEMNITE_ENTRETIEN_MIN_LEGAL;
  } else if (hours <= 9) {
    return INDEMNITE_ENTRETIEN_9H;
  } else {
    const total = INDEMNITE_ENTRETIEN_PAR_HEURE_BASE * hours;
    return Number(total.toFixed(2));
  }
}

/**
 * Calcul de la mensualisation de base
 * - Année complète : (Taux horaire brut * heures hebdo * 52) / 12
 * - Année incomplète : (Taux horaire brut * heures hebdo * semaines programmées) / 12
 */
export function calculateMonthlyBase(contract: Contract) {
  const weeks = contract.anneeType === 'complete' ? 52 : contract.weeksPerYear;
  const baseHours = Number(((contract.weeklyHours * weeks) / 12).toFixed(2));
  const baseSalaryBrut = Number((baseHours * contract.hourlyRateBrut).toFixed(2));
  const baseSalaryNet = brutToNet(baseSalaryBrut, contract.isAlsaceMoselle);
  
  return {
    weeks,
    baseHours,
    baseSalaryBrut,
    baseSalaryNet,
  };
}

/**
 * Nombre de jours d'activité Pajemploi mensualisés
 * Formule officielle : (Nombre de jours d'accueil par semaine * Nombre de semaines) / 12 (arrondi au supérieur)
 */
export function calculatePajemploiJoursActivite(contract: Contract): number {
  const activeDaysPerWeek = contract.weeklySchedule.filter(d => d.active).length;
  const weeks = contract.anneeType === 'complete' ? 52 : contract.weeksPerYear;
  return Math.ceil((activeDaysPerWeek * weeks) / 12);
}

/**
 * Nombre d'heures normales Pajemploi mensualisées
 * Formule officielle : (Heures hebdo * Nb semaines) / 12 (arrondi à l'entier le plus proche)
 */
export function calculatePajemploiHeuresNormales(contract: Contract): number {
  const weeks = contract.anneeType === 'complete' ? 52 : contract.weeksPerYear;
  return Math.round((contract.weeklyHours * weeks) / 12);
}

/**
 * Détermination des jours d'un mois donné avec leur jour de la semaine
 */
export function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

/**
 * Calcule les heures potentielles du mois (règle Cour de Cassation pour retenue sur salaire)
 * = heures qui auraient été travaillées si l'assistante maternelle avait travaillé tous les jours prévus au contrat dans ce mois complet.
 */
export function calculatePotentialHours(year: number, month: number, weeklySchedule: DaySchedule[]): number {
  const days = getDaysInMonth(year, month);
  let totalPotential = 0;
  
  for (const day of days) {
    // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
    const jsDay = day.getDay();
    const dayOfWeek = jsDay === 0 ? 7 : jsDay;
    const schedule = weeklySchedule.find(s => s.dayOfWeek === dayOfWeek);
    if (schedule && schedule.active) {
      totalPotential += schedule.plannedHours;
    }
  }
  
  return totalPotential;
}

/**
 * Découpage des jours du mois par semaine civile (du Lundi au Dimanche)
 * pour le décompte légal des heures complémentaires et supplémentaires (>45h)
 */
export function groupAttendanceByWeek(attendanceDays: AttendanceDay[]): Map<string, AttendanceDay[]> {
  const weeksMap = new Map<string, AttendanceDay[]>();
  
  for (const day of attendanceDays) {
    const d = new Date(day.date);
    const dayOfWeek = d.getDay(); // 0 is Sunday
    // Move to Monday of current week
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const weekKey = monday.toISOString().split('T')[0];
    
    if (!weeksMap.has(weekKey)) {
      weeksMap.set(weekKey, []);
    }
    weeksMap.get(weekKey)!.push(day);
  }
  
  return weeksMap;
}

/**
 * Calcul complet de la paie et de la déclaration Pajemploi pour un mois donné
 */
export function calculateMonthSummary(
  contract: Contract,
  year: number,
  month: number,
  attendanceDays: AttendanceDay[],
  congesPayesAmountNet = 0,
  congesPayesDaysCount = 0
): MonthSummary {
  const base = calculateMonthlyBase(contract);
  const potentialHours = calculatePotentialHours(year, month, contract.weeklySchedule);
  
  // Analyse des présences et des heures
  let presentDaysCount = 0;
  let totalIndemniteEntretien = 0;
  let totalIndemniteRepas = 0;
  let totalIndemniteGouter = 0;
  let totalIndemniteKm = 0;
  let absenceHoursDeducted = 0;
  
  for (const day of attendanceDays) {
    if (day.status === 'present') {
      presentDaysCount++;
      totalIndemniteEntretien += calculateIndemniteEntretien(day.actualHours, contract);
      if (day.repasFourni) {
        totalIndemniteRepas += contract.repasTarif;
      }
      if (day.gouterFourni) {
        totalIndemniteGouter += contract.gouterTarif;
      }
      if (day.kmParcourus > 0) {
        totalIndemniteKm += day.kmParcourus * contract.kmTarif;
      }
    } else if (day.status === 'ferie_travaille') {
      presentDaysCount++;
      totalIndemniteEntretien += calculateIndemniteEntretien(day.actualHours, contract);
      if (day.repasFourni) totalIndemniteRepas += contract.repasTarif;
      if (day.gouterFourni) totalIndemniteGouter += contract.gouterTarif;
    } else if (day.status === 'absent_enfant_certif' || day.status === 'absent_assmat') {
      // Absences déductibles selon la Cour de Cassation
      absenceHoursDeducted += day.plannedHours;
    }
    // Note : absent_enfant_convenance et ferie_chome_paye sont rémunérés, donc pas d'heures déduites.
  }
  
  // Décomposition par semaine pour heures complémentaires et heures supplémentaires (> 45h/semaine)
  const weeksMap = groupAttendanceByWeek(attendanceDays);
  let complementaryHours = 0;
  let overtimeHours = 0;
  
  weeksMap.forEach((weekDays) => {
    let weekActualHours = 0;
    for (const d of weekDays) {
      if (d.status === 'present' || d.status === 'ferie_travaille') {
        weekActualHours += d.actualHours;
      }
    }
    
    const contractualWeeklyHours = contract.weeklyHours;
    if (weekActualHours > contractualWeeklyHours) {
      if (contractualWeeklyHours >= DUREE_HEBDO_LEGALE_CCN) {
        // Le contrat est déjà à 45h ou plus : tout dépassement est une heure sup majorée
        overtimeHours += (weekActualHours - contractualWeeklyHours);
      } else {
        // Le contrat est inférieur à 45h (ex: 35h)
        if (weekActualHours <= DUREE_HEBDO_LEGALE_CCN) {
          // Tout est heure complémentaire
          complementaryHours += (weekActualHours - contractualWeeklyHours);
        } else {
          // Heures complémentaires jusqu'à 45h, et heures sup au-delà
          complementaryHours += (DUREE_HEBDO_LEGALE_CCN - contractualWeeklyHours);
          overtimeHours += (weekActualHours - DUREE_HEBDO_LEGALE_CCN);
        }
      }
    }
  });
  
  // Arrondis des heures
  complementaryHours = Number(complementaryHours.toFixed(2));
  overtimeHours = Number(overtimeHours.toFixed(2));
  
  // Calculs financiers
  // 1. Heures complémentaires : taux normal
  const complementaryAmountBrut = Number((complementaryHours * contract.hourlyRateBrut).toFixed(2));
  const complementaryAmountNet = brutToNet(complementaryAmountBrut, contract.isAlsaceMoselle);
  
  // 2. Heures supplémentaires : taux majoré (+10% min IDCC 3239 ou taux contractuel)
  const overtimeRateBrut = contract.hourlyRateBrut * (1 + contract.overtimeRatePercentage / 100);
  const overtimeAmountBrut = Number((overtimeHours * overtimeRateBrut).toFixed(2));
  // Heures supplémentaires exonérées de cotisations salariales (loi TEPA ~11.31% d'allègement)
  // En pratique conventionnelle, le net d'une heure majorée défiscalisée est environ égal au brut * 0.8935
  const coefHSOptim = contract.isAlsaceMoselle ? 0.8805 : 0.8935;
  const overtimeAmountNet = Number((overtimeAmountBrut * coefHSOptim).toFixed(2));
  
  // 3. Déduction Cour de Cassation pour absences déductibles
  // Formule : (Salaire mensuel de base / Heures potentielles) * Heures d'absence
  let absenceDeductionBrut = 0;
  if (potentialHours > 0 && absenceHoursDeducted > 0) {
    const rateCourDeCassation = base.baseSalaryBrut / potentialHours;
    absenceDeductionBrut = Number((rateCourDeCassation * absenceHoursDeducted).toFixed(2));
  }
  const absenceDeductionNet = brutToNet(absenceDeductionBrut, contract.isAlsaceMoselle);
  
  // 4. Totaux salaires
  const totalBrut = Number((base.baseSalaryBrut + complementaryAmountBrut + overtimeAmountBrut - absenceDeductionBrut).toFixed(2));
  const totalNetSalary = Number((base.baseSalaryNet + complementaryAmountNet + overtimeAmountNet - absenceDeductionNet + congesPayesAmountNet).toFixed(2));
  const totalNetFiscal = totalNetSalary; // Soumis à l'impôt sur le revenu
  
  // 5. Totaux indemnités (non soumises aux cotisations ni à l'impôt)
  totalIndemniteEntretien = Number(totalIndemniteEntretien.toFixed(2));
  totalIndemniteRepas = Number(totalIndemniteRepas.toFixed(2));
  totalIndemniteGouter = Number(totalIndemniteGouter.toFixed(2));
  totalIndemniteKm = Number(totalIndemniteKm.toFixed(2));
  const totalIndemnites = Number((totalIndemniteEntretien + totalIndemniteRepas + totalIndemniteGouter + totalIndemniteKm).toFixed(2));
  
  // 6. Net total à verser par le parent à l'assistante maternelle
  const totalNetToPay = Number((totalNetSalary + totalIndemnites).toFixed(2));
  
  // 7. Déclaration Pajemploi exacte
  const basePajemploiHeures = calculatePajemploiHeuresNormales(contract);
  const basePajemploiJours = calculatePajemploiJoursActivite(contract);
  
  // Si déduction d'heures pour absence, on déduit le prorata d'heures normales
  const pajemploiHeuresNormales = Math.max(0, Math.round(basePajemploiHeures - absenceHoursDeducted));
  const joursAbsentsDeduits = Math.round(absenceHoursDeducted / (contract.weeklyHours / (contract.weeklySchedule.filter(s => s.active).length || 5)));
  const pajemploiJoursActivite = Math.max(1, basePajemploiJours - joursAbsentsDeduits);
  
  // Vérification Plafond CMG Pajemploi : Salaire net journalier moyen ne doit pas dépasser 5 SMIC horaire brut (converti en net max ~46.90€ net ou 60.10€ brut)
  const salaireJournalierMoyen = totalNetSalary / (pajemploiJoursActivite + congesPayesDaysCount);
  const seuilMaxCmgNet = brutToNet(PLAFOND_JOURNALIER_CMG_BRUT, contract.isAlsaceMoselle);
  const isCmgValide = salaireJournalierMoyen <= seuilMaxCmgNet;
  
  return {
    year,
    month,
    contractId: contract.id,
    baseHours: base.baseHours,
    baseSalaryBrut: base.baseSalaryBrut,
    baseSalaryNet: base.baseSalaryNet,
    complementaryHours,
    complementaryAmountBrut,
    complementaryAmountNet,
    overtimeHours,
    overtimeAmountBrut,
    overtimeAmountNet,
    potentialHoursInMonth: potentialHours,
    absenceHoursDeducted,
    absenceDeductionBrut,
    absenceDeductionNet,
    congesPayesAmountNet,
    congesPayesDaysCount,
    totalBrut,
    totalNetFiscal,
    totalNetSalary,
    presentDaysCount,
    totalIndemniteEntretien,
    totalIndemniteRepas,
    totalIndemniteGouter,
    totalIndemniteKm,
    totalIndemnites,
    totalNetToPay,
    pajemploi: {
      nbHeuresNormales: pajemploiHeuresNormales,
      nbJoursActivite: pajemploiJoursActivite,
      nbJoursCP: congesPayesDaysCount,
      nbHeuresComplementaires: complementaryHours,
      nbHeuresMajorees: overtimeHours,
      salaireNetTotal: totalNetSalary,
      indemnitesEntretien: totalIndemniteEntretien,
      indemnitesRepas: totalIndemniteRepas + totalIndemniteGouter,
      indemnitesKm: totalIndemniteKm,
      totalVerse: totalNetToPay,
      montantJournalierMoyen: Number(salaireJournalierMoyen.toFixed(2)),
      seuilMaxCmg: Number(seuilMaxCmgNet.toFixed(2)),
      isCmgValide,
    }
  };
}

/**
 * Calcul de l'indemnité légale de fin de contrat IDCC 3239
 * Article 117 CCN : Au terme d'au moins 9 mois de contrat continu,
 * l'assistante maternelle a droit à une indemnité égale à 1/80ème du total des salaires bruts perçus pendant toute la durée du contrat.
 */
export function calculateEndContractIndemnity(totalGrossSalaries: number, monthsOfSeniority: number): {
  isEligible: boolean;
  amount: number;
  explanation: string;
} {
  const isEligible = monthsOfSeniority >= 9;
  if (!isEligible) {
    return {
      isEligible: false,
      amount: 0,
      explanation: `Non éligible : l'ancienneté est de ${monthsOfSeniority} mois (minimum 9 mois requis sous la convention IDCC 3239).`
    };
  }
  
  const amount = Number((totalGrossSalaries * (1 / 80)).toFixed(2));
  return {
    isEligible: true,
    amount,
    explanation: `Éligible (ancienneté ≥ 9 mois) : 1/80ème du total des salaires bruts perçus (${totalGrossSalaries.toFixed(2)} € / 80) = ${amount.toFixed(2)} €.`
  };
}

/**
 * Calcul de la régularisation de salaire pour Année Incomplète (IDCC 3239)
 * Règle d'or IDCC 3239 :
 * Si Heures Réelles > Heures Payées => L'employeur doit verser la différence.
 * Si Heures Réelles < Heures Payées => Le trop-perçu reste acquis au salarié (pas de remboursement).
 */
export function computeAnnualRegularisation(records: AnnualRegularisationRecord[]): {
  totalRealHours: number;
  totalPaidHours: number;
  balanceHours: number;
  totalPaidSalary: number;
  totalDueSalary: number;
  balanceAmountDueToAssmat: number;
  tropPercuAcquis: number;
} {
  let totalRealHours = 0;
  let totalPaidHours = 0;
  let totalPaidSalary = 0;
  let totalDueSalary = 0;
  
  records.forEach(r => {
    totalRealHours += r.realHoursWorked;
    totalPaidHours += r.paidHoursMensualisation;
    totalPaidSalary += r.salaryPaidMensualisation;
    totalDueSalary += r.salaryDueReel;
  });
  
  const balanceHours = Number((totalRealHours - totalPaidHours).toFixed(2));
  const diffSalary = Number((totalDueSalary - totalPaidSalary).toFixed(2));
  
  if (diffSalary > 0) {
    return {
      totalRealHours: Number(totalRealHours.toFixed(2)),
      totalPaidHours: Number(totalPaidHours.toFixed(2)),
      balanceHours,
      totalPaidSalary: Number(totalPaidSalary.toFixed(2)),
      totalDueSalary: Number(totalDueSalary.toFixed(2)),
      balanceAmountDueToAssmat: diffSalary,
      tropPercuAcquis: 0
    };
  } else {
    // Si négatif, selon la CCN IDCC 3239 le trop-perçu reste définitivement acquis à l'assistante maternelle !
    return {
      totalRealHours: Number(totalRealHours.toFixed(2)),
      totalPaidHours: Number(totalPaidHours.toFixed(2)),
      balanceHours,
      totalPaidSalary: Number(totalPaidSalary.toFixed(2)),
      totalDueSalary: Number(totalDueSalary.toFixed(2)),
      balanceAmountDueToAssmat: 0,
      tropPercuAcquis: Math.abs(diffSalary)
    };
  }
}
