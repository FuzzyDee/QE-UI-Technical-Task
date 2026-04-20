import { chromium, firefox, webkit, type BrowserType } from '@playwright/test';

const BROWSER_TYPES: Record<string, BrowserType> = {
  chromium,
  firefox,
  webkit,
};

export function getBrowserType(browserName = 'chromium'): BrowserType {
  const normalizedBrowserName = browserName.toLowerCase();
  const browserType = BROWSER_TYPES[normalizedBrowserName];

  if (!browserType) {
    throw new Error(`Unsupported PW_BROWSER value: ${normalizedBrowserName}. Use chromium, firefox, or webkit.`);
  }

  return browserType;
}