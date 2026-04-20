import { GovUkBasePage } from './govuk-base.page';

export class HolidayEntitlementStartPage extends GovUkBasePage {
  async open(startUrl: string): Promise<void> {
    await this.page.goto(startUrl);
    await this.acceptCookiesIfPrompted();
  }

  async startCalculator(): Promise<void> {
    await this.page.getByRole('button', { name: 'Start now' }).click();
  }
}