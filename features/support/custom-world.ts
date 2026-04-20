import { World, setWorldConstructor, type IWorldOptions } from '@cucumber/cucumber';
import { type Browser, type BrowserContext, type Page } from '@playwright/test';
import { HolidayEntitlementStartPage } from '../../pages/holiday-entitlement-start.page';
import { HolidayEntitlementFormPage } from '../../pages/holiday-entitlement-form.page';
import { HolidayEntitlementResultPage } from '../../pages/holiday-entitlement-result.page';

export class HolidayEntitlementWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  startPage?: HolidayEntitlementStartPage;
  formPage?: HolidayEntitlementFormPage;
  resultPage?: HolidayEntitlementResultPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(HolidayEntitlementWorld);