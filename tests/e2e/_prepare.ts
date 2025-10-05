/**
 * Visual test preparation utilities
 * Modern, deterministic helpers for Playwright screenshot tests
 */

import type { Page } from "@playwright/test";

/**
 * Prepare page for deterministic screenshot capture
 * Call this before toHaveScreenshot() to ensure consistency
 */
export async function hardenForScreenshot(page: Page) {
	// 1. Wait for web fonts to fully load
	await page.evaluate(() => (document as any).fonts?.ready);

	// 2. Wait for network to settle (images, async resources)
	await page.waitForLoadState("networkidle");

	// 3. Small grace period for final layout shifts
	await page.waitForTimeout(300);

	// 4. Freeze time and randomness for deterministic output
	const fixedNow = new Date("2025-01-01T12:00:00Z").valueOf();
	await page.addInitScript((now) => {
		// Override Date.now() to return fixed timestamp
		Date.now = () => now as number;

		// Override Date constructor
		const OriginalDate = Date;
		// biome-ignore lint/suspicious/noGlobalAssign: Required for deterministic testing
		Date = class extends OriginalDate {
			constructor() {
				super(now);
			}
		} as any as DateConstructor;

		// Deterministic Math.random using simple LCG
		let seed = 42;
		Math.random = () => {
			seed = (seed * 16807) % 2147483647;
			return seed / 2147483647;
		};

		// Freeze performance.now() for consistent timing
		const fixedPerf = 1000;
		performance.now = () => fixedPerf;
	}, fixedNow);

	// 5. Ensure viewport is at top (for fullPage screenshots)
	await page.evaluate(() => window.scrollTo(0, 0));

	// 6. Clear any active selections that might highlight text
	await page.evaluate(() => {
		const selection = window.getSelection();
		if (selection) {
			selection.removeAllRanges();
		}
	});
}

/**
 * Wait for specific element to be stable
 * Useful when you know a particular element causes issues
 */
export async function waitForElementStable(
	page: Page,
	selector: string,
	timeout = 5000,
) {
	const element = page.locator(selector);

	// Wait for element to be visible
	await element.waitFor({ state: "visible", timeout });

	// Wait for element's bounding box to stabilize
	let previousBox = await element.boundingBox();
	let stableCount = 0;
	const requiredStableChecks = 3;

	while (stableCount < requiredStableChecks) {
		await page.waitForTimeout(100);
		const currentBox = await element.boundingBox();

		if (
			previousBox &&
			currentBox &&
			Math.abs(previousBox.x - currentBox.x) < 1 &&
			Math.abs(previousBox.y - currentBox.y) < 1 &&
			Math.abs(previousBox.width - currentBox.width) < 1 &&
			Math.abs(previousBox.height - currentBox.height) < 1
		) {
			stableCount++;
		} else {
			stableCount = 0;
		}

		previousBox = currentBox;
	}
}

/**
 * Hide dynamic elements by data attribute
 * Add data-test-hide="true" to elements you want hidden in screenshots
 */
export async function hideDynamicElements(page: Page) {
	await page.addStyleTag({
		content: `
      [data-test-hide="true"],
      [data-testid*="dynamic"],
      [data-test*="timestamp"] {
        visibility: hidden !important;
      }
    `,
	});
}

/**
 * Set feature flags or test mode
 * Useful for disabling features that cause screenshot differences
 */
export async function setTestMode(page: Page) {
	await page.addInitScript(() => {
		// Set global flag that your app can check
		(window as any).__TEST_MODE__ = true;
		(window as any).__DISABLE_ANIMATIONS__ = true;
		(window as any).__HIDE_DYNAMIC_CONTENT__ = true;

		// If using localStorage for feature flags
		localStorage.setItem("test-mode", "true");
		localStorage.setItem("disable-animations", "true");
	});
}

/**
 * Composite preparation function for typical use
 */
export async function preparePageForScreenshot(page: Page) {
	await setTestMode(page);
	await hardenForScreenshot(page);
	await hideDynamicElements(page);
}
