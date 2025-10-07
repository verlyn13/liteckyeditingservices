import { expect, test } from "../fixtures/block-noise";
import { prepareForVisualTest } from "../helpers/visual";

/**
 * Visual regression tests for core UI components
 * Snapshot options are configured globally in playwright.config.ts
 */

test("header", async ({ page }) => {
	await page.goto("/");
	const header = page.getByRole("banner");
	await prepareForVisualTest(page, header, { readySelector: "header" });
	await expect(header).toHaveScreenshot("header.png");
});

test("footer", async ({ page }) => {
	await page.goto("/");
	const footer = page.getByRole("contentinfo");
	await prepareForVisualTest(page, footer, { readySelector: "footer" });
	await expect(footer).toHaveScreenshot("footer.png");
});

test("hero section", async ({ page }) => {
	await page.goto("/");
	const hero = page.locator("section").first();
	await prepareForVisualTest(page, hero, { readySelector: "section" });
	await expect(hero).toHaveScreenshot("hero.png");
});

test("contact form", async ({ page }) => {
	await page.goto("/contact/");
	const form = page.locator("form").first();
	await prepareForVisualTest(page, form, { readySelector: "form" });
	await expect(form).toHaveScreenshot("contact-form.png");
});
