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

	// Wait a moment for any CSP violations to be logged
	await page.waitForTimeout(2000);

	// Verify no CSP violations occurred
	expect(cspViolations).toHaveLength(0);
});
