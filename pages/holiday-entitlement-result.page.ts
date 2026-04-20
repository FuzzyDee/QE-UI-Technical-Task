import { type Locator, type Page } from '@playwright/test';

export class HolidayEntitlementResultPage {
  constructor(private readonly page: Page) {}

  getResultHeading(headingText: string): Locator {
    return this.page.getByRole('heading', { name: headingText });
  }

  getEntitlementText(expectedEntitlement: string): Locator {
    return this.page.getByText(`The statutory holiday entitlement is ${expectedEntitlement}.`);
  }

  async getMainContentText(): Promise<string> {
    return this.page.locator('main').innerText();
  }
}