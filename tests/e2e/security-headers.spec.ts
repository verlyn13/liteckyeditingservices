import { test, expect } from "@playwright/test";

test.describe("Security Headers", () => {
	test("should set critical security headers on homepage", async ({
		request,
		baseURL,
	}) => {
		const response = await request.get(`${baseURL}/`);

		// HSTS
		const hsts = response.headers()["strict-transport-security"];
		expect(hsts).toBeTruthy();
		expect(hsts).toContain("max-age=31536000");
		expect(hsts).toContain("includeSubDomains");

		// CSP
		const csp = response.headers()["content-security-policy"];
		expect(csp).toBeTruthy();
		expect(csp).toContain("default-src");
		expect(csp).toContain("script-src");
		expect(csp).toContain("object-src 'none'");
		expect(csp).toContain("frame-ancestors 'none'");
		expect(csp).toContain("upgrade-insecure-requests");

		// X-Frame-Options
		const xfo = response.headers()["x-frame-options"];
		expect(xfo).toBeTruthy();
		expect(xfo.toUpperCase()).toBe("DENY");

		// X-Content-Type-Options
		const xcto = response.headers()["x-content-type-options"];
		expect(xcto).toBeTruthy();
		expect(xcto.toLowerCase()).toBe("nosniff");

		// Referrer-Policy
		const referrer = response.headers()["referrer-policy"];
		expect(referrer).toBeTruthy();

		// Permissions-Policy
		const permissions = response.headers()["permissions-policy"];
		expect(permissions).toBeTruthy();
	});

	test("should allow relaxed CSP for admin panel", async ({
		request,
		baseURL,
	}) => {
		const response = await request.get(`${baseURL}/admin/`);

		const csp = response.headers()["content-security-policy"];
		expect(csp).toBeTruthy();
		// Admin needs unsafe-eval for Decap CMS
		expect(csp).toContain("unsafe-eval");
		// But should still have baseline protections
		expect(csp).toContain("object-src 'none'");
		expect(csp).toContain("frame-ancestors 'none'");
	});

	test("should not have CSP violations during normal navigation", async ({
		page,
	}) => {
		const violations: string[] = [];

		// Listen for CSP violations
		page.on("console", (msg) => {
			const text = msg.text();
			if (
				text.includes("Content Security Policy") ||
				text.includes("CSP") ||
				text.includes("blocked by CSP")
			) {
				violations.push(text);
			}
		});

		// Navigate through key pages
		await page.goto("/");
		await page.waitForLoadState("networkidle");

		await page.goto("/services");
		await page.waitForLoadState("networkidle");

		await page.goto("/contact");
		await page.waitForLoadState("networkidle");

		// Assert no CSP violations occurred
		expect(violations).toHaveLength(0);
	});
});
