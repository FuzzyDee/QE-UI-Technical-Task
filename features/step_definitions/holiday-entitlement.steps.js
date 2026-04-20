const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { getBrowserType } = require('../../support/browser-factory');
const { HOLIDAY_ENTITLEMENT, TEST_DATA } = require('../../support/holiday-entitlement.constants');
const { HolidayEntitlementStartPage } = require('../../pages/holiday-entitlement-start.page');
const { HolidayEntitlementFormPage } = require('../../pages/holiday-entitlement-form.page');
const { HolidayEntitlementResultPage } = require('../../pages/holiday-entitlement-result.page');

Before(async function () {
  const isHeadless = process.env.PW_HEADLESS !== 'false';
  const browserName = (process.env.PW_BROWSER || 'chromium').toLowerCase();
  const browserType = getBrowserType(browserName);

  this.browser = await browserType.launch({ headless: isHeadless });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.startPage = new HolidayEntitlementStartPage(this.page);
  this.formPage = new HolidayEntitlementFormPage(this.page);
  this.resultPage = new HolidayEntitlementResultPage(this.page);
});

After(async function () {
  await this.context?.close();
  await this.browser?.close();
});

Given('I open the holiday entitlement start page', async function () {
  await this.startPage.open(HOLIDAY_ENTITLEMENT.absoluteStartUrl);
});

Given('I open the holiday entitlement page {string}', async function (url) {
  await this.startPage.open(url);
});

When('I start the calculator journey', async function () {
  await this.startPage.startCalculator();
});

When('I choose regular hours worker', async function () {
  await this.formPage.chooseRegularHoursWorker();
});

When('I choose irregular hours or part-year worker', async function () {
  await this.formPage.chooseIrregularHoursWorker();
});

When('I choose entitlement based on days worked per week', async function () {
  await this.formPage.chooseDaysWorkedPerWeekFlow();
});

When('I choose entitlement basis {string}', async function (basis) {
  await this.formPage.chooseEntitlementBasis(basis);
});

When('I choose full leave year', async function () {
  await this.formPage.chooseFullLeaveYear();
});

When('I choose holiday calculation option {string}', async function (option) {
  await this.formPage.chooseHolidayCalculationOption(option);
});

When('I complete full-year inputs for entitlement basis {string}', async function (basis) {
  const flowData = TEST_DATA.fullYearBasisFlows[basis];

  if (!flowData) {
    throw new Error(`Unsupported entitlement basis flow: ${basis}`);
  }

  if (basis === 'days worked per week') {
    await this.formPage.submitDaysWorkedPerWeek(flowData.daysWorkedPerWeek);
    return;
  }

  if (basis === 'hours worked per week') {
    await this.formPage.submitHoursWorkedPerWeek(flowData.hoursWorkedPerWeek, flowData.daysWorkedPerWeek);
    return;
  }

  if (basis === 'compressed hours') {
    await this.formPage.submitCompressedHours(flowData.hoursWorkedPerWeek, flowData.daysWorkedPerWeek);
    return;
  }

  if (basis === 'shifts') {
    await this.formPage.submitShifts(flowData.hoursPerShift, flowData.shiftsPerPattern, flowData.daysInShiftPattern);
    return;
  }
});

When('I enter the date as {string} {string} {string}', async function (day, month, year) {
  await this.formPage.enterDate({ day, month, year });
});

When('I submit days worked per week value {string}', async function (daysWorked) {
  await this.formPage.submitDaysWorkedPerWeek(daysWorked);
});

When('I continue without answering the irregular-hours question', async function () {
  await this.formPage.continueWithoutAnsweringIrregularHoursQuestion();
});

Then('I should see a holiday entitlement result', async function () {
  const heading = this.resultPage.getResultHeading(HOLIDAY_ENTITLEMENT.resultHeading);
  await heading.waitFor({ state: 'visible' });
});

Then('the statutory entitlement should be {string}', async function (expectedEntitlement) {
  const mainText = await this.resultPage.getMainContentText();
  assert.ok(mainText.includes(`The statutory holiday entitlement is ${expectedEntitlement}.`));
});

Then('I should see first-question validation message', async function () {
  const errorText = await this.formPage.getInlineErrorText();
  assert.ok(errorText.includes(HOLIDAY_ENTITLEMENT.firstQuestionError));
});

Then('I should remain on days worked per week page', async function () {
  const h1Text = await this.formPage.getHeadingText();
  assert.equal(h1Text.trim(), HOLIDAY_ENTITLEMENT.daysWorkedHeading);
});

Then('I should see days-worked validation message', async function () {
  const errorText = await this.formPage.getInlineErrorText();
  assert.ok(errorText.includes(HOLIDAY_ENTITLEMENT.daysValidationMessage));
});

Then('the results should mention first-year accrual guidance', async function () {
  const mainText = await this.resultPage.getMainContentText();
  assert.ok(mainText.includes(HOLIDAY_ENTITLEMENT.firstYearAccrualGuidance));
});

Then('the result summary should include {string}', async function (expectedText) {
  const mainText = await this.resultPage.getMainContentText();
  const normalizedMainText = mainText.replace(/\s+/g, ' ').trim();
  assert.ok(normalizedMainText.includes(expectedText));
});