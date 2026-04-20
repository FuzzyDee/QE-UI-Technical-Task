const { test, expect } = require('@playwright/test');
const { HolidayEntitlementStartPage } = require('../pages/holiday-entitlement-start.page');
const { HolidayEntitlementFormPage } = require('../pages/holiday-entitlement-form.page');
const { HolidayEntitlementResultPage } = require('../pages/holiday-entitlement-result.page');
const { HOLIDAY_ENTITLEMENT, TEST_DATA } = require('../support/holiday-entitlement.constants');

test.describe('GOV.UK - Calculate your holiday entitlement', () => {
  test.beforeEach(async ({ page }) => {
    const startPage = new HolidayEntitlementStartPage(page);
    await startPage.open(HOLIDAY_ENTITLEMENT.startUrl);
  });

  test('Scenario: Successful full-year calculation for regular worker on 5 days per week', async ({ page }) => {
    const startPage = new HolidayEntitlementStartPage(page);
    const formPage = new HolidayEntitlementFormPage(page);
    const resultPage = new HolidayEntitlementResultPage(page);

    await startPage.startCalculator();
    await formPage.chooseRegularHoursWorker();
    await formPage.chooseDaysWorkedPerWeekFlow();
    await formPage.chooseFullLeaveYear();
    await formPage.submitDaysWorkedPerWeek(TEST_DATA.validDaysWorked);

    await expect(resultPage.getResultHeading(HOLIDAY_ENTITLEMENT.resultHeading)).toBeVisible();
    await expect(resultPage.getEntitlementText(HOLIDAY_ENTITLEMENT.expectedEntitlement)).toBeVisible();
  });

  test('Scenario: Validation is shown if first question is skipped', async ({ page }) => {
    const startPage = new HolidayEntitlementStartPage(page);
    const formPage = new HolidayEntitlementFormPage(page);

    await startPage.startCalculator();
    await formPage.continueWithoutAnsweringIrregularHoursQuestion();

    await expect(page.getByText('Error: Please answer this question')).toBeVisible();
    await expect(page).toHaveTitle(/Error - Does the employee work irregular hours or for part of the year\?/);
  });

  TEST_DATA.invalidDaysWorked.forEach((days) => {
    test(`Scenario Outline: Invalid day values are rejected for days-worked flow (days=${days})`, async ({ page }) => {
      const startPage = new HolidayEntitlementStartPage(page);
      const formPage = new HolidayEntitlementFormPage(page);

      await startPage.startCalculator();
      await formPage.chooseRegularHoursWorker();
      await formPage.chooseDaysWorkedPerWeekFlow();
      await formPage.chooseFullLeaveYear();
      await formPage.submitDaysWorkedPerWeek(days);

      await expect(page.getByRole('heading', { name: HOLIDAY_ENTITLEMENT.daysWorkedHeading })).toBeVisible();
      await expect(page.locator('.govuk-error-message').filter({ hasText: HOLIDAY_ENTITLEMENT.daysValidationMessage })).toBeVisible();
    });
  });

  test('Scenario: Boundary value 7 days is accepted', async ({ page }) => {
    const startPage = new HolidayEntitlementStartPage(page);
    const formPage = new HolidayEntitlementFormPage(page);
    const resultPage = new HolidayEntitlementResultPage(page);

    await startPage.startCalculator();
    await formPage.chooseRegularHoursWorker();
    await formPage.chooseDaysWorkedPerWeekFlow();
    await formPage.chooseFullLeaveYear();
    await formPage.submitDaysWorkedPerWeek(TEST_DATA.boundaryDaysWorked);

    await expect(resultPage.getResultHeading(HOLIDAY_ENTITLEMENT.resultHeading)).toBeVisible();
    await expect(resultPage.getEntitlementText(HOLIDAY_ENTITLEMENT.expectedEntitlement)).toBeVisible();
  });

  test('Scenario: Irregular-hours worker starting part way through leave year gets accrued entitlement', async ({ page }) => {
    const startPage = new HolidayEntitlementStartPage(page);
    const formPage = new HolidayEntitlementFormPage(page);
    const resultPage = new HolidayEntitlementResultPage(page);

    await startPage.startCalculator();
    await formPage.chooseIrregularHoursWorker();
    await formPage.enterDate(TEST_DATA.leaveYearStartDate);
    await formPage.chooseDaysWorkedPerWeekFlow();
    await formPage.chooseHolidayCalculationOption('for someone starting part way through a leave year');
    await formPage.enterDate(TEST_DATA.accrualStartDate);
    await formPage.submitDaysWorkedPerWeek(TEST_DATA.irregularDaysWorked);

    await expect(resultPage.getResultHeading(HOLIDAY_ENTITLEMENT.resultHeading)).toBeVisible();
    await expect(resultPage.getEntitlementText(TEST_DATA.accruedStartingEntitlement)).toBeVisible();
    await expect(page.getByText(HOLIDAY_ENTITLEMENT.firstYearAccrualGuidance)).toBeVisible();
  });

  test('Scenario: Irregular-hours worker leaving part way through leave year gets pro-rated entitlement', async ({ page }) => {
    const startPage = new HolidayEntitlementStartPage(page);
    const formPage = new HolidayEntitlementFormPage(page);
    const resultPage = new HolidayEntitlementResultPage(page);

    await startPage.startCalculator();
    await formPage.chooseIrregularHoursWorker();
    await formPage.enterDate(TEST_DATA.leaveYearStartDate);
    await formPage.chooseDaysWorkedPerWeekFlow();
    await formPage.chooseHolidayCalculationOption('for someone leaving part way through a leave year');
    await formPage.enterDate(TEST_DATA.accrualStartDate);
    await formPage.submitDaysWorkedPerWeek(TEST_DATA.irregularDaysWorked);

    await expect(resultPage.getResultHeading(HOLIDAY_ENTITLEMENT.resultHeading)).toBeVisible();
    await expect(resultPage.getEntitlementText(TEST_DATA.accruedLeavingEntitlement)).toBeVisible();
  });

  test('Scenario: Validate deep-link questionnaire answers for regular full-year 3.0 days', async ({ page }) => {
    const startPage = new HolidayEntitlementStartPage(page);
    const resultPage = new HolidayEntitlementResultPage(page);

    await startPage.open(TEST_DATA.deepLinkValidation.url);

    await expect(resultPage.getResultHeading(HOLIDAY_ENTITLEMENT.resultHeading)).toBeVisible();
    await expect(resultPage.getEntitlementText(TEST_DATA.deepLinkValidation.entitlement)).toBeVisible();

    const mainContentText = (await resultPage.getMainContentText()).replace(/\s+/g, ' ').trim();
    for (const fragment of TEST_DATA.deepLinkValidation.answerSummaryFragments) {
      expect(mainContentText).toContain(fragment);
    }
  });

  Object.keys(TEST_DATA.fullYearBasisFlows).forEach((basis) => {
    test(`Scenario Outline: Full-year regular worker supports entitlement basis option (${basis})`, async ({ page }) => {
      const startPage = new HolidayEntitlementStartPage(page);
      const formPage = new HolidayEntitlementFormPage(page);
      const resultPage = new HolidayEntitlementResultPage(page);
      const flowData = TEST_DATA.fullYearBasisFlows[basis];

      await startPage.startCalculator();
      await formPage.chooseRegularHoursWorker();
      await formPage.chooseEntitlementBasis(basis);
      await formPage.chooseFullLeaveYear();

      if (basis === 'days worked per week') {
        await formPage.submitDaysWorkedPerWeek(flowData.daysWorkedPerWeek);
      }

      if (basis === 'hours worked per week') {
        await formPage.submitHoursWorkedPerWeek(flowData.hoursWorkedPerWeek, flowData.daysWorkedPerWeek);
      }

      if (basis === 'compressed hours') {
        await formPage.submitCompressedHours(flowData.hoursWorkedPerWeek, flowData.daysWorkedPerWeek);
      }

      if (basis === 'shifts') {
        await formPage.submitShifts(flowData.hoursPerShift, flowData.shiftsPerPattern, flowData.daysInShiftPattern);
      }

      await expect(resultPage.getResultHeading(HOLIDAY_ENTITLEMENT.resultHeading)).toBeVisible();

      const mainContentText = (await resultPage.getMainContentText()).replace(/\s+/g, ' ').trim();
      expect(mainContentText).toContain(`Is the holiday entitlement based on: ${basis}`);
    });
  });
});