import { expect, type Page, test } from "@playwright/test";

async function disableAnimations(page: Page) {
	await page.addStyleTag({
		content: `* { animation: none !important; transition: none !important; }`,
	});
}

async function waitForFontsAndLayout(page: Page) {
	// Wait for fonts to load
	await page.evaluate(() => document.fonts.ready);
	// Give a moment for layout to fully stabilize
	await page.waitForTimeout(500);
}

test.describe("@visual Visual regression", () => {
	test("@visual home page", async ({ page }) => {
		await page.goto("/");
		await page.waitForLoadState("networkidle");
		await disableAnimations(page);
		await waitForFontsAndLayout(page);
		await expect(page).toHaveScreenshot("home.png", {
			fullPage: true,
			maxDiffPixelRatio: 0.03, // Increased tolerance for font rendering differences
			maxDiffPixels: 500, // Allow up to 500 different pixels
		});
	});

	test("@visual services page", async ({ page }) => {
		await page.goto("/services");
		await page.waitForLoadState("networkidle");
		await disableAnimations(page);
		await waitForFontsAndLayout(page);
		await expect(page).toHaveScreenshot("services.png", {
			fullPage: true,
			maxDiffPixelRatio: 0.03, // Increased tolerance for font rendering differences
			maxDiffPixels: 500, // Allow up to 500 different pixels
		});
	});
});
