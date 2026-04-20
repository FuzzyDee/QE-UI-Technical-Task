const HOLIDAY_ENTITLEMENT = {
  startUrl: '/calculate-your-holiday-entitlement',
  absoluteStartUrl: 'https://www.gov.uk/calculate-your-holiday-entitlement',
  resultHeading: 'Calculate holiday entitlement: Information based on your answers',
  daysWorkedHeading: 'Number of days worked per week?',
  firstQuestionError: 'Please answer this question',
  daysValidationMessage: 'There are only 7 days in a week. Please check and enter a correct value.',
  expectedEntitlement: '28 days holiday',
  firstYearAccrualGuidance: 'Leave entitlement accrues differently in a worker’s first year.',
};

const TEST_DATA = {
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
  fullYearBasisFlows: {
    'days worked per week': {
      daysWorkedPerWeek: '5',
    },
    'hours worked per week': {
      hoursWorkedPerWeek: '40',
      daysWorkedPerWeek: '5',
    },
    'annualised hours': {},
    'compressed hours': {
      hoursWorkedPerWeek: '40',
      daysWorkedPerWeek: '4',
    },
    shifts: {
      hoursPerShift: '12',
      shiftsPerPattern: '4',
      daysInShiftPattern: '7',
    },
  },
};

module.exports = {
  HOLIDAY_ENTITLEMENT,
  TEST_DATA,
};