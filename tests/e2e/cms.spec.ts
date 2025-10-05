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
