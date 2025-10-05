/**
 * Modern visual regression tests with deterministic rendering
 * Uses October 2025 best practices for stability
 */

import { expect, test } from "@playwright/test";
import { preparePageForScreenshot, waitForElementStable } from "./_prepare";

test.describe("@visual Visual regression tests (Modern)", () => {
	// Tests run with deterministic settings from playwright.config.ts

	test("@visual homepage - viewport only", async ({ page }) => {
		await page.goto("/");
		await preparePageForScreenshot(page);

		// Prefer viewport over fullPage to avoid height variations
		await expect(page).toHaveScreenshot("home-viewport.png", {
			fullPage: false, // Reduces flake from page height shifts
			// Tolerances are set globally in config, override only if needed
		});
	});

	test("@visual homepage - critical fold", async ({ page }) => {
		await page.goto("/");
		await preparePageForScreenshot(page);

		// Screenshot just the above-fold area (more stable)
		await page.setViewportSize({ width: 1280, height: 800 });
		await expect(page).toHaveScreenshot("home-critical.png", {
			fullPage: false,
		});
	});

	test("@visual services page - viewport", async ({ page }) => {
		await page.goto("/services");
		await preparePageForScreenshot(page);

		await expect(page).toHaveScreenshot("services-viewport.png", {
			fullPage: false,
		});
	});

	test("@visual header component", async ({ page }) => {
		await page.goto("/");
		await preparePageForScreenshot(page);

		// Component-level screenshots are more stable
		const header = page.locator("header").first();
		await waitForElementStable(page, "header");

		await expect(header).toHaveScreenshot("header.png");
	});

	test("@visual footer component", async ({ page }) => {
		await page.goto("/");
		await preparePageForScreenshot(page);

		// Scroll to footer
		const footer = page.locator("footer").first();
		await footer.scrollIntoViewIfNeeded();
		await waitForElementStable(page, "footer");

		await expect(footer).toHaveScreenshot("footer.png");
	});

	test("@visual contact form", async ({ page }) => {
		await page.goto("/contact");
		await preparePageForScreenshot(page);

		const form = page.locator("form").first();
		await waitForElementStable(page, "form");

		await expect(form).toHaveScreenshot("contact-form.png");
	});
});

test.describe("@visual Mobile views", () => {
	// Mobile tests with fixed viewport from config

	test.use({
		viewport: { width: 390, height: 844 }, // iPhone 12 size
	});

	test("@visual mobile homepage", async ({ page }) => {
		await page.goto("/");
		await preparePageForScreenshot(page);

		await expect(page).toHaveScreenshot("mobile-home.png", {
			fullPage: false,
		});
	});

	test("@visual mobile menu", async ({ page }) => {
		await page.goto("/");
		await preparePageForScreenshot(page);

		// Open mobile menu - use data attribute to avoid Astro dev overlay button
		const menuButton = page.locator("[data-menu-toggle]").first();
		if (await menuButton.isVisible()) {
			await menuButton.click();
			await page.waitForTimeout(300); // Wait for menu animation

			await expect(page).toHaveScreenshot("mobile-menu-open.png", {
				fullPage: false,
			});
		}
	});
});

test.describe("@visual Dark mode (if applicable)", () => {
	test.use({
		colorScheme: "dark",
	});

	test.skip("@visual homepage dark", async ({ page }) => {
		// Skip if dark mode not implemented yet
		await page.goto("/");
		await preparePageForScreenshot(page);

		await expect(page).toHaveScreenshot("home-dark.png", {
			fullPage: false,
		});
	});
});
