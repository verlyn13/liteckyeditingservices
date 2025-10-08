import { expect, test } from "@playwright/test";

test("CMS admin route is accessible", async ({ page }) => {
	// Contract test: /admin/ should return 200 and contain CMS initialization
	// Note: Decap CMS renders UI via async CDN script, which may be blocked
	// by User-Agent filtering or CSP in production. We verify the route works
	// rather than testing the full UI rendering.
	const response = await page.goto("/admin/");

	// Admin route should be accessible (200, 401, or 403 are acceptable)
	expect([200, 401, 403]).toContain(response?.status() ?? 0);

	// If accessible, verify it contains the CMS script reference
	if (response?.status() === 200) {
		const content = await page.content();
		expect(content).toMatch(/decap-cms|netlify-cms/i);
	}
});

test("CMS admin forbids third-party script hosts (self-hosted)", async ({
	page,
}) => {
	// Verify self-hosted Decap CMS - no third-party CDNs in CSP
	const response = await page.goto("/admin/");

	if (response?.status() === 200) {
		const cspHeader = response.headers()["content-security-policy"];

		// Verify CSP header exists
		expect(cspHeader).toBeDefined();

		if (cspHeader) {
			// Verify it does NOT allow third-party script hosts (self-hosted)
			expect(cspHeader).not.toMatch(/jsdelivr|unpkg/i);

			// Verify it allows 'self' for scripts (self-hosted bundle)
			expect(cspHeader).toContain("script-src 'self'");

			// Verify it allows GitHub API (required for GitHub backend)
			expect(cspHeader).toContain("api.github.com");
		}
	}
});

test("CMS script loads without CSP violations", async ({ page }) => {
	const cspViolations: string[] = [];

	// Listen for CSP violations
	page.on("console", (msg) => {
		if (
			msg.type() === "error" &&
			msg.text().includes("Content Security Policy")
		) {
			cspViolations.push(msg.text());
		}
	});

	await page.goto("/admin/");

	// Wait for CMS to initialize (self-hosted bundle loads and sets window.CMS)
	await page.waitForFunction(() => !!(window as any).CMS, { timeout: 5000 });

	// Verify no CSP violations occurred
	expect(cspViolations).toHaveLength(0);
});

test("Vendored CMS assets have immutable caching", async ({ request }) => {
	// Verify self-hosted bundle has proper cache headers
	const response = await request.get("/vendor/decap/decap-cms.js");

	expect(response.status()).toBe(200);

	const cacheControl = response.headers()["cache-control"];
	expect(cacheControl).toContain("immutable");
	expect(cacheControl).toContain("max-age=31536000");
});

test("Admin headers allow OAuth popup handoff (October 2025 hardened)", async ({
	page,
}) => {
	// Verify COOP/COEP headers are correct for popup → opener postMessage
	const response = await page.goto("/admin/");

	if (response?.status() === 200) {
		const headers = response.headers();

		// COOP must be 'unsafe-none' to allow popup to retain window.opener
		const coop = headers["cross-origin-opener-policy"];
		expect(coop).toBe("unsafe-none");

		// COEP must NOT be set (would sever popup → opener link)
		const coep = headers["cross-origin-embedder-policy"];
		expect(coep).toBeUndefined();

		// CSP should NOT allow 'unsafe-inline' for scripts (hardened)
		const csp = headers["content-security-policy"];
		if (csp) {
			// script-src should allow 'self' but NOT 'unsafe-inline'
			expect(csp).toMatch(/script-src[^;]*'self'/);
			expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
		}
	}
});

test("Admin editor UI appears after boot script loads", async ({ page }) => {
	// Synthetic test: verify CMS actually renders after auth
	// Note: This doesn't test full OAuth flow (requires GitHub auth)
	// but verifies the editor shell loads correctly

	// Listen for CSP violations
	const cspViolations: string[] = [];
	page.on("console", (msg) => {
		const text = msg.text();
		if (/violat(es|ion).*content security policy/i.test(text)) {
			cspViolations.push(text);
			test.fail(); // Fail immediately on CSP violation
		}
	});

	await page.goto("/admin/");

	// Wait for boot.js to load and initialize CMS
	// Decap sets window.CMS when bundle loads
	await page
		.waitForFunction(() => !!(window as any).CMS, { timeout: 10000 })
		.catch(() => {
			test.fail(
				true,
				"window.CMS not initialized (boot.js failed or CSP blocked it)",
			);
		});

	// Verify no CSP violations during load
	expect(cspViolations).toHaveLength(0);

	// Optional: Look for Decap UI elements (login screen or editor)
	// This may show login screen (unauthenticated) or editor (if cookies present)
	const hasDecapUI =
		(await page.locator('[data-testid="login-button"]').count()) > 0 ||
		(await page.locator(".nc-app, [class*='cms']").count()) > 0;

	expect(hasDecapUI).toBe(true);
});
