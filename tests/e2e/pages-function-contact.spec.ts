import { expect, test } from '@playwright/test';

// This test verifies that the Cloudflare Pages Function route `/api/contact`
// responds when running under `wrangler pages dev`.
//
// It is skipped when not running a Pages dev server. To run locally:
//   1) In one terminal: wrangler pages dev . --port=4321
//   2) In another: pnpm test:e2e

test.describe('Pages Function /api/contact', () => {
  test.skip(!process.env.PAGES_BASE_URL && !process.env.CI, 'Requires Cloudflare Pages dev server');

  test('responds to POST with JSON', async ({ request, baseURL }) => {
    const url = process.env.PAGES_BASE_URL || `${baseURL}/api/contact`;
    const target = process.env.PAGES_BASE_URL ? `${process.env.PAGES_BASE_URL}/api/contact` : `${baseURL}/api/contact`;

    const res = await request.post(target, {
      headers: { 'content-type': 'application/json' },
      data: {
        name: 'Playwright Test',
        email: 'playwright@example.com',
        service: 'proofreading',
        message: 'API route probe from Playwright.'
      }
    });

    // Pages function should not 404. Accept 2xx (accepted) or 4xx (validation) as valid path response
    expect([200, 201, 202, 400, 401, 403, 415]).toContain(res.status());
    const ct = res.headers()['content-type'] || '';
    expect(ct).toContain('application/json');
    const body = await res.json().catch(() => ({}));
    expect(body).toBeTruthy();
  });
});

