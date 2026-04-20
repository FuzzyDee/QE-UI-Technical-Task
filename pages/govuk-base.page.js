class GovUkBasePage {
  constructor(page) {
    this.page = page;
  }

  async acceptCookiesIfPrompted() {
    const acceptCookiesButton = this.page.getByRole('button', { name: 'Accept additional cookies' });

    if (await acceptCookiesButton.isVisible().catch(() => false)) {
      await acceptCookiesButton.click();
      await this.page
        .getByRole('button', { name: 'Hide cookie message' })
        .click({ timeout: 5_000 })
        .catch(() => {});
    }
  }

  async clickContinue() {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async getInlineErrorText() {
    return this.page.locator('.govuk-error-message').first().innerText();
  }

  async getHeadingText() {
    return this.page.locator('h1').first().innerText();
  }
}

module.exports = {
  GovUkBasePage,
};