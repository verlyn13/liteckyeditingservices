import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(
      /(analytics|gtag|google-analytics|segment|hotjar|sentry|doubleclick|facebook|intercom|hubspot)/i,
      (r) => r.abort()
    );
    await use(page);
  },
});
export const expect = test.expect;
