import { expect, test } from '@playwright/test';

const isProd = !!process.env.BASE_URL && !/localhost|127\.0\.0\.1/i.test(process.env.BASE_URL);

test('/admin/config.yml served with correct headers and fields', async ({ request }) => {
  const res = await request.get('/admin/config.yml');
  expect(res.status()).toBe(200);
  const ct = res.headers()['content-type'] || '';
  expect(ct).toMatch(/text\/yaml/i);
  const cache = res.headers()['cache-control'] || '';
  expect(cache).toMatch(/no-store/i);
  const body = await res.text();
  expect(body).toMatch(/backend:\s*\n/);
  expect(body).toMatch(/base_url:\s*https?:\/\//);
  expect(body).toMatch(/auth_endpoint:\s*\/api\/auth/);
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
