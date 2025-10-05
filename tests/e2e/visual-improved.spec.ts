import { expect, type Page, test } from "@playwright/test";

/**
 * Comprehensive visual regression testing with improved stability
 */

async function preparePageForScreenshot(page: Page) {
	// 1. Disable all animations and transitions
	await page.addStyleTag({
		content: `
			*, *::before, *::after {
				animation: none !important;
				animation-duration: 0s !important;
				animation-delay: 0s !important;
				transition: none !important;
				transition-duration: 0s !important;
				transition-delay: 0s !important;
			}
		`,
	});

	// 2. Hide any dynamic content that might change
	await page.addStyleTag({
		content: `
			/* Hide potential dynamic elements */
			.timestamp, .date-display, time { visibility: hidden !important; }
			/* Stabilize loading states */
			.loading, .skeleton, .shimmer { display: none !important; }
		`,
	});

	// 3. Wait for fonts to fully load
	await page.evaluate(() => {
		return document.fonts.ready;
	});

	// 4. Wait for all images to load
	await page.evaluate(() => {
		const images = Array.from(document.querySelectorAll("img"));
		return Promise.all(
			images
				.filter((img) => !img.complete)
				.map(
					(img) =>
						new Promise((resolve) => {
							img.addEventListener("load", resolve);
							img.addEventListener("error", resolve);
						}),
				),
		);
	});

	// 5. Scroll to top to ensure consistent starting position
	await page.evaluate(() => window.scrollTo(0, 0));

	// 6. Wait for any lazy-loaded content
	await page.waitForLoadState("networkidle");

	// 7. Additional wait for layout stability (increased from 500ms)
	await page.waitForTimeout(1500);
}

test.describe("@visual Visual regression tests (Improved)", () => {
	// Set consistent viewport for all visual tests
	test.use({
		viewport: { width: 1280, height: 720 },
		// Ensure consistent device scale factor
		deviceScaleFactor: 1,
		// Disable hardware acceleration differences
		hasTouch: false,
		isMobile: false,
	});

	test.beforeEach(async ({ page }) => {
		// Set consistent timezone and locale
		await page.context().addInitScript(() => {
			// Mock Date to return consistent values
			const constantDate = new Date("2025-01-01T12:00:00Z");
			// biome-ignore lint/suspicious/noGlobalAssign: Required for deterministic testing
			Date = class extends Date {
				constructor() {
					super(constantDate);
				}
			} as any as DateConstructor;
		});
	});

	test("@visual homepage - desktop", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });
		await preparePageForScreenshot(page);

		// Take screenshot with higher tolerance for CI environment differences
		await expect(page).toHaveScreenshot("home-desktop.png", {
			fullPage: true,
			maxDiffPixelRatio: 0.05, // 5% difference allowed
			maxDiffPixels: 1000, // Allow up to 1000 different pixels
			animations: "disabled",
		});
	});

	test("@visual services page - desktop", async ({ page }) => {
		await page.goto("/services", { waitUntil: "networkidle" });
		await preparePageForScreenshot(page);

		await expect(page).toHaveScreenshot("services-desktop.png", {
			fullPage: true,
			maxDiffPixelRatio: 0.05,
			maxDiffPixels: 1000,
			animations: "disabled",
		});
	});

	test("@visual homepage - mobile", async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		await page.goto("/", { waitUntil: "networkidle" });
		await preparePageForScreenshot(page);

		await expect(page).toHaveScreenshot("home-mobile.png", {
			fullPage: true,
			maxDiffPixelRatio: 0.05,
			maxDiffPixels: 1000,
			animations: "disabled",
		});
	});

	test("@visual services page - mobile", async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		await page.goto("/services", { waitUntil: "networkidle" });
		await preparePageForScreenshot(page);

		await expect(page).toHaveScreenshot("services-mobile.png", {
			fullPage: true,
			maxDiffPixelRatio: 0.05,
			maxDiffPixels: 1000,
			animations: "disabled",
		});
	});
});

test.describe("@visual Critical UI elements", () => {
	test.use({
		viewport: { width: 1280, height: 720 },
		deviceScaleFactor: 1,
	});

	test("@visual header navigation", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });
		await preparePageForScreenshot(page);

		// Take screenshot of just the header
		const header = page.locator("header").first();
		await expect(header).toHaveScreenshot("header-nav.png", {
			maxDiffPixelRatio: 0.05,
			maxDiffPixels: 500,
		});
	});

	test("@visual footer", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });
		await preparePageForScreenshot(page);

		// Take screenshot of just the footer
		const footer = page.locator("footer").first();
		await expect(footer).toHaveScreenshot("footer.png", {
			maxDiffPixelRatio: 0.05,
			maxDiffPixels: 500,
		});
	});
});
