import { GovUkBasePage } from './govuk-base.page';
import { type DateInput } from '../support/holiday-entitlement.constants';

export class HolidayEntitlementFormPage extends GovUkBasePage {
  async chooseIrregularHoursWorker(): Promise<void> {
    await this.page.getByLabel('Yes').check();
    await this.clickContinue();
  }

  async chooseRegularHoursWorker(): Promise<void> {
    await this.page.getByLabel('No').check();
    await this.clickContinue();
  }

  async chooseEntitlementBasis(optionLabel: string): Promise<void> {
    await this.page.getByLabel(optionLabel).check();
    await this.clickContinue();
  }

  async chooseDaysWorkedPerWeekFlow(): Promise<void> {
    await this.chooseEntitlementBasis('days worked per week');
  }

  async chooseHolidayCalculationOption(optionLabel: string): Promise<void> {
    await this.page.getByLabel(optionLabel).check();
    await this.clickContinue();
  }

  async chooseFullLeaveYear(): Promise<void> {
    await this.chooseHolidayCalculationOption('for a full leave year');
  }

  async continueWithoutAnsweringIrregularHoursQuestion(): Promise<void> {
    await this.clickContinue();
  }

  async enterDate({ day, month, year }: DateInput): Promise<void> {
    await this.page.getByLabel('Day').fill(day);
    await this.page.getByLabel('Month').fill(month);
    await this.page.getByLabel('Year').fill(year);
    await this.clickContinue();
  }

  async submitDaysWorkedPerWeek(value: string): Promise<void> {
    const input = this.page.getByLabel('Number of days worked per week?');
    await input.fill('');

    if (value.length > 0) {
      await input.fill(value);
    }

    await this.clickContinue();
  }

  async submitHoursWorkedPerWeek(hoursWorkedPerWeek: string, daysWorkedPerWeek: string): Promise<void> {
    await this.page.getByLabel('Number of hours worked per week?').fill(hoursWorkedPerWeek);
    await this.clickContinue();
    await this.submitDaysWorkedPerWeek(daysWorkedPerWeek);
  }

  async submitCompressedHours(hoursWorkedPerWeek: string, daysWorkedPerWeek: string): Promise<void> {
    await this.submitHoursWorkedPerWeek(hoursWorkedPerWeek, daysWorkedPerWeek);
  }

  async submitShifts(hoursPerShift: string, shiftsPerPattern: string, daysInShiftPattern: string): Promise<void> {
    await this.page.getByLabel('How many hours in each shift?').fill(hoursPerShift);
    await this.clickContinue();
    await this.page.getByLabel('How many shifts will be worked per shift pattern?').fill(shiftsPerPattern);
    await this.clickContinue();
    await this.page.getByLabel('How many days in the shift pattern?').fill(daysInShiftPattern);
    await this.clickContinue();
  }
}