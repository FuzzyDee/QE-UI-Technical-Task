import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { getBrowserType } from '../../support/browser-factory';
import {
  HOLIDAY_ENTITLEMENT,
  TEST_DATA,
  isEntitlementBasis,
  type EntitlementBasis,
  type FullYearBasisFlow,
} from '../../support/holiday-entitlement.constants';
import { HolidayEntitlementStartPage } from '../../pages/holiday-entitlement-start.page';
import { HolidayEntitlementFormPage } from '../../pages/holiday-entitlement-form.page';
import { HolidayEntitlementResultPage } from '../../pages/holiday-entitlement-result.page';
import { type HolidayEntitlementWorld } from '../support/custom-world';

function getStartPage(world: HolidayEntitlementWorld): HolidayEntitlementStartPage {
  if (!world.startPage) {
    throw new Error('Start page is not initialized.');
  }

  return world.startPage;
}

function getFormPage(world: HolidayEntitlementWorld): HolidayEntitlementFormPage {
  if (!world.formPage) {
    throw new Error('Form page is not initialized.');
  }

  return world.formPage;
}

function getResultPage(world: HolidayEntitlementWorld): HolidayEntitlementResultPage {
  if (!world.resultPage) {
    throw new Error('Result page is not initialized.');
  }

  return world.resultPage;
}

async function completeFullYearBasisFlow(formPage: HolidayEntitlementFormPage, flowData: FullYearBasisFlow): Promise<void> {
  switch (flowData.basis) {
    case 'days worked per week':
      await formPage.submitDaysWorkedPerWeek(flowData.daysWorkedPerWeek);
      return;
    case 'hours worked per week':
      await formPage.submitHoursWorkedPerWeek(flowData.hoursWorkedPerWeek, flowData.daysWorkedPerWeek);
      return;
    case 'annualised hours':
      return;
    case 'compressed hours':
      await formPage.submitCompressedHours(flowData.hoursWorkedPerWeek, flowData.daysWorkedPerWeek);
      return;
    case 'shifts':
      await formPage.submitShifts(flowData.hoursPerShift, flowData.shiftsPerPattern, flowData.daysInShiftPattern);
      return;
  }
}

function parseEntitlementBasis(value: string): EntitlementBasis {
  if (!isEntitlementBasis(value)) {
    throw new Error(`Unsupported entitlement basis flow: ${value}`);
  }

  return value;
}

Before(async function (this: HolidayEntitlementWorld) {
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

After(async function (this: HolidayEntitlementWorld) {
  await this.context?.close();
  await this.browser?.close();
});

Given('I open the holiday entitlement start page', async function (this: HolidayEntitlementWorld) {
  await getStartPage(this).open(HOLIDAY_ENTITLEMENT.absoluteStartUrl);
});

Given('I open the holiday entitlement page {string}', async function (this: HolidayEntitlementWorld, url: string) {
  await getStartPage(this).open(url);
});

When('I start the calculator journey', async function (this: HolidayEntitlementWorld) {
  await getStartPage(this).startCalculator();
});

When('I choose regular hours worker', async function (this: HolidayEntitlementWorld) {
  await getFormPage(this).chooseRegularHoursWorker();
});

When('I choose irregular hours or part-year worker', async function (this: HolidayEntitlementWorld) {
  await getFormPage(this).chooseIrregularHoursWorker();
});

When('I choose entitlement based on days worked per week', async function (this: HolidayEntitlementWorld) {
  await getFormPage(this).chooseDaysWorkedPerWeekFlow();
});

When('I choose entitlement basis {string}', async function (this: HolidayEntitlementWorld, basis: string) {
  await getFormPage(this).chooseEntitlementBasis(basis);
});

When('I choose full leave year', async function (this: HolidayEntitlementWorld) {
  await getFormPage(this).chooseFullLeaveYear();
});

When('I choose holiday calculation option {string}', async function (this: HolidayEntitlementWorld, option: string) {
  await getFormPage(this).chooseHolidayCalculationOption(option);
});

When('I complete full-year inputs for entitlement basis {string}', async function (this: HolidayEntitlementWorld, basis: string) {
  const typedBasis = parseEntitlementBasis(basis);
  const flowData = TEST_DATA.fullYearBasisFlows[typedBasis];

  await completeFullYearBasisFlow(getFormPage(this), flowData);
});

When('I enter the date as {string} {string} {string}', async function (this: HolidayEntitlementWorld, day: string, month: string, year: string) {
  await getFormPage(this).enterDate({ day, month, year });
});

When('I submit days worked per week value {string}', async function (this: HolidayEntitlementWorld, daysWorked: string) {
  await getFormPage(this).submitDaysWorkedPerWeek(daysWorked);
});

When('I continue without answering the irregular-hours question', async function (this: HolidayEntitlementWorld) {
  await getFormPage(this).continueWithoutAnsweringIrregularHoursQuestion();
});

Then('I should see a holiday entitlement result', async function (this: HolidayEntitlementWorld) {
  const heading = getResultPage(this).getResultHeading(HOLIDAY_ENTITLEMENT.resultHeading);
  await heading.waitFor({ state: 'visible' });
});

Then('the statutory entitlement should be {string}', async function (this: HolidayEntitlementWorld, expectedEntitlement: string) {
  const mainText = await getResultPage(this).getMainContentText();
  assert.ok(mainText.includes(`The statutory holiday entitlement is ${expectedEntitlement}.`));
});

Then('I should see first-question validation message', async function (this: HolidayEntitlementWorld) {
  const errorText = await getFormPage(this).getInlineErrorText();
  assert.ok(errorText.includes(HOLIDAY_ENTITLEMENT.firstQuestionError));
});

Then('I should remain on days worked per week page', async function (this: HolidayEntitlementWorld) {
  const h1Text = await getFormPage(this).getHeadingText();
  assert.equal(h1Text.trim(), HOLIDAY_ENTITLEMENT.daysWorkedHeading);
});

Then('I should see days-worked validation message', async function (this: HolidayEntitlementWorld) {
  const errorText = await getFormPage(this).getInlineErrorText();
  assert.ok(errorText.includes(HOLIDAY_ENTITLEMENT.daysValidationMessage));
});

Then('the results should mention first-year accrual guidance', async function (this: HolidayEntitlementWorld) {
  const mainText = await getResultPage(this).getMainContentText();
  assert.ok(mainText.includes(HOLIDAY_ENTITLEMENT.firstYearAccrualGuidance));
});

Then('the result summary should include {string}', async function (this: HolidayEntitlementWorld, expectedText: string) {
  const mainText = await getResultPage(this).getMainContentText();
  const normalizedMainText = mainText.replace(/\s+/g, ' ').trim();
  assert.ok(normalizedMainText.includes(expectedText));
});