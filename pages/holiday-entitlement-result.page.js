class HolidayEntitlementResultPage {
  constructor(page) {
    this.page = page;
  }

  getResultHeading(headingText) {
    return this.page.getByRole('heading', { name: headingText });
  }

  getEntitlementText(expectedEntitlement) {
    return this.page.getByText(`The statutory holiday entitlement is ${expectedEntitlement}.`);
  }

  async getMainContentText() {
    return this.page.locator('main').innerText();
  }
}

module.exports = {
  HolidayEntitlementResultPage,
};