import { expect, test } from '@playwright/test';

const isProd = !!process.env.BASE_URL && !/localhost|127\.0\.0\.1/i.test(process.env.BASE_URL);

test('/admin/config.yml returns 410 (config now bundled)', async ({ request }) => {
  const res = await request.get('/admin/config.yml');
  // Config is now bundled in cms.js to prevent double-loading
  expect(res.status()).toBe(410);
  const cache = res.headers()['cache-control'] || '';
  expect(cache).toMatch(/no-store/i);
  const note = res.headers()['x-config-note'] || '';
  expect(note).toContain('cms.js');
});

test('/api/callback diagnostic headers reflect production handoff needs', async ({ request }) => {
  // Use diagnostic mode so we can assert headers without real OAuth
  const res = await request.get('/api/callback?diag=1');
  expect(res.status()).toBe(200);
  const headers = res.headers();
  const coop = headers['cross-origin-opener-policy'];
  expect(coop).toBe('unsafe-none');
  const csp = headers['content-security-policy'] || '';
  expect(csp).toMatch(/default-src 'none'/);
  expect(csp).toMatch(/script-src 'unsafe-inline'/);
  const cache = headers['cache-control'] || '';
  expect(cache).toMatch(/no-store/);
});

test('/admin shows preview banner on non-production hosts', async ({ page }) => {
  test.skip(isProd, 'Only relevant for non-production environments');
  await page.goto('/admin/');
  const hasBanner = await page.evaluate(
    () => !!document.querySelector('[data-admin-preview-banner]')
  );
  expect(hasBanner).toBe(true);
});
