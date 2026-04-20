const { GovUkBasePage } = require('./govuk-base.page');

class HolidayEntitlementStartPage extends GovUkBasePage {
  async open(startUrl) {
    await this.page.goto(startUrl);
    await this.acceptCookiesIfPrompted();
  }

  async startCalculator() {
    await this.page.getByRole('button', { name: 'Start now' }).click();
  }
}

module.exports = {
  HolidayEntitlementStartPage,
};