export interface DateInput {
  day: string;
  month: string;
  year: string;
}

export const FULL_YEAR_BASIS_OPTIONS = [
  'days worked per week',
  'hours worked per week',
  'annualised hours',
  'compressed hours',
  'shifts',
] as const;

export type EntitlementBasis = (typeof FULL_YEAR_BASIS_OPTIONS)[number];

export interface DaysWorkedPerWeekFlow {
  basis: 'days worked per week';
  daysWorkedPerWeek: string;
}

export interface HoursWorkedPerWeekFlow {
  basis: 'hours worked per week';
  hoursWorkedPerWeek: string;
  daysWorkedPerWeek: string;
}

export interface AnnualisedHoursFlow {
  basis: 'annualised hours';
}

export interface CompressedHoursFlow {
  basis: 'compressed hours';
  hoursWorkedPerWeek: string;
  daysWorkedPerWeek: string;
}

export interface ShiftsFlow {
  basis: 'shifts';
  hoursPerShift: string;
  shiftsPerPattern: string;
  daysInShiftPattern: string;
}

export type FullYearBasisFlow =
  | DaysWorkedPerWeekFlow
  | HoursWorkedPerWeekFlow
  | AnnualisedHoursFlow
  | CompressedHoursFlow
  | ShiftsFlow;

export type FullYearBasisFlowMap = {
  [K in EntitlementBasis]: Extract<FullYearBasisFlow, { basis: K }>;
};

export const HOLIDAY_ENTITLEMENT = {
  startUrl: '/calculate-your-holiday-entitlement',
  absoluteStartUrl: 'https://www.gov.uk/calculate-your-holiday-entitlement',
  resultHeading: 'Calculate holiday entitlement: Information based on your answers',
  daysWorkedHeading: 'Number of days worked per week?',
  firstQuestionError: 'Please answer this question',
  daysValidationMessage: 'There are only 7 days in a week. Please check and enter a correct value.',
  expectedEntitlement: '28 days holiday',
  firstYearAccrualGuidance: 'Leave entitlement accrues differently in a worker’s first year.',
} as const;

export const FULL_YEAR_BASIS_FLOWS: FullYearBasisFlowMap = {
  'days worked per week': {
    basis: 'days worked per week',
    daysWorkedPerWeek: '5',
  },
  'hours worked per week': {
    basis: 'hours worked per week',
    hoursWorkedPerWeek: '40',
    daysWorkedPerWeek: '5',
  },
  'annualised hours': {
    basis: 'annualised hours',
  },
  'compressed hours': {
    basis: 'compressed hours',
    hoursWorkedPerWeek: '40',
    daysWorkedPerWeek: '4',
  },
  shifts: {
    basis: 'shifts',
    hoursPerShift: '12',
    shiftsPerPattern: '4',
    daysInShiftPattern: '7',
  },
};

export function isEntitlementBasis(value: string): value is EntitlementBasis {
  return FULL_YEAR_BASIS_OPTIONS.includes(value as EntitlementBasis);
}

export const TEST_DATA: {
  validDaysWorked: string;
  boundaryDaysWorked: string;
  invalidDaysWorked: string[];
  leaveYearStartDate: DateInput;
  accrualStartDate: DateInput;
  irregularDaysWorked: string;
  accruedStartingEntitlement: string;
  accruedLeavingEntitlement: string;
  deepLinkValidation: {
    url: string;
    entitlement: string;
    answerSummaryFragments: string[];
  };
  fullYearBasisFlows: FullYearBasisFlowMap;
} = {
  validDaysWorked: '5',
  boundaryDaysWorked: '7',
  invalidDaysWorked: ['0', '8', 'abc'],
  leaveYearStartDate: { day: '1', month: '1', year: '2024' },
  accrualStartDate: { day: '1', month: '2', year: '2024' },
  irregularDaysWorked: '3',
  accruedStartingEntitlement: '15.5 days holiday',
  accruedLeavingEntitlement: '1.5 days holiday',
  deepLinkValidation: {
    url: 'https://www.gov.uk/calculate-your-holiday-entitlement/y/regular/days-worked-per-week/full-year/3.0',
    entitlement: '16.8 days holiday',
    answerSummaryFragments: [
      'Does the employee work irregular hours or for part of the year? No',
      'Is the holiday entitlement based on: days worked per week',
      'Do you want to work out holiday: for a full leave year',
      'Number of days worked per week? 3.0',
    ],
  },
  fullYearBasisFlows: FULL_YEAR_BASIS_FLOWS,
};