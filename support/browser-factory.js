const { chromium, firefox, webkit } = require('playwright');

const BROWSER_TYPES = {
  chromium,
  firefox,
  webkit,
};

function getBrowserType(browserName = 'chromium') {
  const normalizedBrowserName = browserName.toLowerCase();
  const browserType = BROWSER_TYPES[normalizedBrowserName];

  if (!browserType) {
    throw new Error(`Unsupported PW_BROWSER value: ${normalizedBrowserName}. Use chromium, firefox, or webkit.`);
  }

  return browserType;
}

module.exports = {
  getBrowserType,
};