import { expect, test } from '@playwright/test';

const isProd = !!process.env.BASE_URL && !/localhost|127\.0\.0\.1/i.test(process.env.BASE_URL);

test('CMS admin route is accessible', async ({ page }) => {
  // Contract test: /admin/ should return 200 and load hashed cms bundle (npm)
  const response = await page.goto('/admin/');

  // Admin route should be accessible
  expect(response?.status()).toBe(200);

  // Verify it contains the Decap CMS script reference (self-hosted)
  if (response?.status() === 200) {
    const content = await page.content();
    const hasHashed = /\/admin\/cms\.[a-f0-9]{8}\.js/.test(content);
    expect(hasHashed).toBe(true);
    expect(content).toContain('Content Manager');
  }
});

test('CMS admin forbids third-party script hosts (self-hosted)', async ({ page }) => {
  test.skip(!isProd, 'Prod-only header assertion');
  // Verify self-hosted Decap CMS - no third-party CDNs in CSP
  const response = await page.goto('/admin/');

  if (response?.status() === 200) {
    const cspHeader = response.headers()['content-security-policy'];

    // Verify CSP header exists
    expect(cspHeader).toBeDefined();

    if (cspHeader) {
      // Verify it does NOT allow third-party script hosts (self-hosted)
      expect(cspHeader).not.toMatch(/jsdelivr|unpkg/i);

      // Verify it allows 'self' for scripts (self-hosted bundle)
      expect(cspHeader).toContain("script-src 'self'");

      // Verify it allows GitHub API (required for GitHub backend)
      expect(cspHeader).toContain('api.github.com');
    }
  }
});

test('CMS script loads without CSP violations', async ({ page }) => {
  const cspViolations: string[] = [];

  // Listen for CSP violations
  page.on('console', (msg) => {
    if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
      cspViolations.push(msg.text());
    }
  });

  await page.goto('/admin/');

  // Wait for CMS to initialize (self-hosted bundle loads and sets window.CMS or window.__cmsApp)
  await page.waitForFunction(
    () => {
      const win = window as unknown as { CMS?: unknown; __cmsApp?: unknown };
      return !!(win.CMS || win.__cmsApp);
    },
    {
      timeout: 10000,
    }
  );

  // Verify no CSP violations occurred
  expect(cspViolations).toHaveLength(0);
});

test('CMS bundle is served with immutable caching', async ({ request, page }) => {
  test.skip(!isProd, 'Prod-only static asset header assertion');
  const resp = await page.goto('/admin/');
  if (!resp) throw new Error('Failed to load /admin/');
  const html = await resp.text();
  const m = html.match(/\/admin\/cms\.[a-f0-9]{8}\.js/);
  expect(m).not.toBeNull();
  if (!m) throw new Error('CMS bundle link not found');
  const response = await request.get(m[0]);
  expect(response.status()).toBe(200);
  const cacheControl = response.headers()['cache-control'] || '';
  expect(cacheControl).toContain('immutable');
  expect(cacheControl).toMatch(/max-age=31536000/);
});

test('Admin headers allow OAuth popup handoff (October 2025 hardened)', async ({ page }) => {
  test.skip(!isProd, 'Prod-only header assertion');
  // Verify COOP/COEP headers are correct for popup → opener postMessage
  const response = await page.goto('/admin/');

  if (response?.status() === 200) {
    const headers = response.headers();

    // COOP must be 'unsafe-none' to allow popup to retain window.opener
    const coop = headers['cross-origin-opener-policy'];
    expect(coop).toBe('unsafe-none');

    // COEP must NOT be set (would sever popup → opener link)
    const coep = headers['cross-origin-embedder-policy'];
    expect(coep).toBeUndefined();

    // CSP should NOT allow 'unsafe-inline' for scripts (hardened)
    const csp = headers['content-security-policy'];
    if (csp) {
      // script-src should allow 'self' but NOT 'unsafe-inline'
      expect(csp).toMatch(/script-src[^;]*'self'/);
      expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    }
  }
});

test('Admin CMS initializes without CSP violations', async ({ page }) => {
  // Synthetic test: verify CMS bundle loads and window.CMS or window.__cmsApp is available
  // Note: This doesn't test full OAuth flow (requires GitHub auth)
  // We verify the boot script loads the CMS successfully

  // Listen for CSP violations
  const cspViolations: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (/violat(es|ion).*content security policy/i.test(text)) {
      cspViolations.push(text);
    }
  });

  await page.goto('/admin/');

  // Wait for cms.js to load and initialize CMS
  // Decap sets window.CMS or window.__cmsApp when bundle loads
  const cmsInitialized = await page
    .waitForFunction(
      () => {
        const win = window as unknown as { CMS?: unknown; __cmsApp?: unknown };
        return !!(win.CMS || win.__cmsApp);
      },
      {
        timeout: 15000,
      }
    )
    .then(() => true)
    .catch(() => false);

  // Verify CMS initialized
  expect(cmsInitialized).toBe(true);

  // Verify no CSP violations during load
  expect(cspViolations).toHaveLength(0);

  // Verify CMS renders something (login screen or editor)
  // The page should have Decap's root element or login button
  const hasDecapRoot = await page.evaluate(() => {
    // Check for Decap's injected elements
    const hasRoot = !!document.querySelector('[id^="nc-root"]');
    const hasLogin = !!document.querySelector('button[type="button"]');
    const hasApp = !!document.querySelector('[class*="cms"]');
    return hasRoot || hasLogin || hasApp;
  });

  expect(hasDecapRoot).toBe(true);
});
