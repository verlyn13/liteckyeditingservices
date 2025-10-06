import type { Locator, Page } from "@playwright/test";

/**
 * Prepares a page for visual regression testing by ensuring stable rendering
 * Following October 2025 Playwright best practices for visual stability
 */
export async function prepareForVisualTest(page: Page, el?: Locator) {
	// Wait for network to be idle to ensure all resources loaded
	await page.waitForLoadState("networkidle");

	// Disable animations, transitions, and carets for deterministic rendering
	await page.addStyleTag({
		content: `
      [data-flaky], .live-chat, .cookie-banner { visibility: hidden !important; }
      html, body { overflow: scroll !important; }
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
	});

	// Wait for fonts and images to fully load
	await page.evaluate(() => {
		const fontPromise = (document.fonts as FontFaceSet | undefined)?.ready;
		const imagePromises = Array.from(document.images)
			.filter((img) => !img.complete)
			.map(
				(img) =>
					new Promise((res) => {
						img.onload = img.onerror = res;
					}),
			);
		return Promise.all([fontPromise, ...imagePromises]);
	});

	// Ensure element is visible and stable
	if (el) {
		await el.scrollIntoViewIfNeeded();
		await el.waitFor({ state: "visible" });
	}

	// Final settle time for layout stability
	await page.waitForTimeout(200);
}
