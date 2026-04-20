import { type Page } from '@playwright/test';

export class GovUkBasePage {
  constructor(protected readonly page: Page) {}

  async acceptCookiesIfPrompted(): Promise<void> {
    const acceptCookiesButton = this.page.getByRole('button', { name: 'Accept additional cookies' });

    if (await acceptCookiesButton.isVisible().catch(() => false)) {
      await acceptCookiesButton.click();
      await this.page
        .getByRole('button', { name: 'Hide cookie message' })
        .click({ timeout: 5_000 })
        .catch(() => undefined);
    }
  }

  async clickContinue(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async getInlineErrorText(): Promise<string> {
    return this.page.locator('.govuk-error-message').first().innerText();
  }

  async getHeadingText(): Promise<string> {
    return this.page.locator('h1').first().innerText();
  }
}