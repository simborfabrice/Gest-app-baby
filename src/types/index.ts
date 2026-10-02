export type AnneeType = 'complete' | 'incomplete';

export type DayStatus = 
  | 'present'                    // Accueil normal ou avec heures modifiées
  | 'absent_enfant_certif'       // Absence enfant pour maladie avec certif médical (déductible max 5j/an ou 14j consécutifs)
  | 'absent_enfant_convenance'   // Absence convenance des parents (maintenue et payée intégralement)
  | 'absent_assmat'              // Absence de l'assistante maternelle (déductible selon Cour de Cassation)
  | 'ferie_chome_paye'           // Jour férié chômé et rémunéré (si remplissant les conditions CCN)
  | 'ferie_travaille'            // Jour férié travaillé (rémunération majorée de 100% ou selon accord)
  | 'conge_paye'                 // Jour de congé payé pris
  | 'non_accueilli';             // Jour non prévu au contrat (ex: weekend ou jour non travaillé)

export interface DaySchedule {
  dayOfWeek: number; // 1 = Lundi, ..., 7 = Dimanche
  dayName: string;
  active: boolean;
  startTime: string; // "08:30"
  endTime: string;   // "17:30"
  plannedHours: number;
}

export interface AttendanceDay {
  date: string; // YYYY-MM-DD
  status: DayStatus;
  plannedHours: number;
  actualArrival: string; // "08:30"
  actualDeparture: string; // "17:30"
  actualHours: number;
  repasFourni: boolean;
  gouterFourni: boolean;
  kmParcourus: number;
  notes?: string;
}

export interface Contract {
  id: string;
  // Enfant & Parents
  childFirstName: string;
  childLastName: string;
  childBirthDate: string;
  parent1Name: string;
  parent2Name?: string;
  parentPhone: string;
  parentEmail: string;
  parentAddress: string;
  
  // Assistante maternelle
  assmatName: string;
  assmatAgrementDate: string;
  assmatAgrementNumber: string;
  assmatPhone: string;
  assmatAddress: string;
  assmatChildrenUnder15: number; // Pour le calcul des jours de CP supplémentaires si < 30j

  // Contrat & Régime
  startDate: string;
  endDate?: string;
  anneeType: AnneeType; // 'complete' (52 semaines) ou 'incomplete' (<= 46 semaines)
  weeksPerYear: number; // 52 pour complète, ex: 36 à 46 pour incomplète
  weeklySchedule: DaySchedule[];
  weeklyHours: number;
  
  // Tarification
  hourlyRateNet: number;
  hourlyRateBrut: number;
  isAlsaceMoselle: boolean; // Taux de cotisation différent (Alsace-Moselle)
  overtimeRatePercentage: number; // Ex: 10% (minimum CCN) ou 15%, 20%, 25%
  
  // Indemnités
  indemniteEntretienType: 'conventionnelle' | 'personnalisee';
  indemniteEntretienCustom: number; // Tarif journalier fixe si personnalisé
  repasTarif: number; // Si fourni par assmat (ex: 4.00€)
  gouterTarif: number; // Si fourni par assmat (ex: 1.00€)
  kmTarif: number; // Ex: 0.40€ / km
  
  // Options de congés payés pour Année Incomplète
  cpPaymentMethod: 'juin' | 'prise_principale' | 'au_fur_et_a_mesure';
  
  // Notes / Clauses particulières
  childGender?: 'fille' | 'garcon' | 'non_precise';
  dietaryRequirements?: string;
  emergencyContact?: string;
  authorizedPickupPersons?: string;
  pajemploiEmployerNumber?: string;
  medicalDoctor?: string;
  allergies?: string;
  notes?: string;
  active: boolean;
}

export interface MonthSummary {
  year: number;
  month: number; // 0-indexed (0 = Janvier, 11 = Décembre)
  contractId: string;
  
  // Base mensualisée
  baseHours: number;
  baseSalaryBrut: number;
  baseSalaryNet: number;
  
  // Heures complémentaires (< 45h hebdo)
  complementaryHours: number;
  complementaryAmountBrut: number;
  complementaryAmountNet: number;
  
  // Heures supplémentaires majorées (> 45h hebdo)
  overtimeHours: number;
  overtimeAmountBrut: number;
  overtimeAmountNet: number;
  
  // Absences justifiées déduites (Cour de Cassation)
  potentialHoursInMonth: number;
  absenceHoursDeducted: number;
  absenceDeductionBrut: number;
  absenceDeductionNet: number;
  
  // Congés payés (pour année incomplète si versé ce mois-ci)
  congesPayesAmountNet: number;
  congesPayesDaysCount: number;
  
  // Totaux Salaires
  totalBrut: number;
  totalNetFiscal: number;
  totalNetSalary: number;
  
  // Indemnités journalières
  presentDaysCount: number;
  totalIndemniteEntretien: number;
  totalIndemniteRepas: number;
  totalIndemniteGouter: number;
  totalIndemniteKm: number;
  totalIndemnites: number;
  
  // Net à payer
  totalNetToPay: number;
  
  // Déclaration Pajemploi exacte
  pajemploi: {
    nbHeuresNormales: number;
    nbJoursActivite: number;
    nbJoursCP: number;
    nbHeuresComplementaires: number;
    nbHeuresMajorees: number;
    salaireNetTotal: number;
    indemnitesEntretien: number;
    indemnitesRepas: number;
    indemnitesKm: number;
    totalVerse: number;
    
    // Plafond CMG
    montantJournalierMoyen: number;
    seuilMaxCmg: number;
    isCmgValide: boolean;
  };
}

export interface AnnualRegularisationRecord {
  monthLabel: string;
  year: number;
  month: number;
  plannedWeeks: number;
  realHoursWorked: number;
  paidHoursMensualisation: number;
  differenceHours: number;
  salaryPaidMensualisation: number;
  salaryDueReel: number;
  balanceDue: number; // Si positif, dû par l'employeur. Si négatif, reste acquis à l'assmat (CCN).
}

export type BoxStyle = 'custom' | 'clean' | 'pastel' | 'intense';
export type BoxRadius = 'sharp' | 'standard' | 'rounded' | 'extra';

export interface AppTheme {
  primaryColor: string;       // e.g. #f43f5e
  secondaryColor: string;     // e.g. #2563eb
  boxColor: string;           // couleur de toutes les cases / cartes (ex: #ffffff ou teinte choisie)
  boxBorderColor?: string;    // couleur des bordures des cases
  boxStyle: BoxStyle;         // 'custom' | 'clean' | 'pastel' | 'intense'
  borderRadius: BoxRadius;    // 'sharp' | 'standard' | 'rounded' | 'extra'
}
