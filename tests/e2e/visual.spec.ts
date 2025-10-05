import { expect, test } from "@playwright/test";
import { prepareForVisualTest } from "../helpers/visual";

test("header", async ({ page }) => {
	await page.goto("/");
	const header = page.getByRole("banner");
	await prepareForVisualTest(page, header);
	await expect(header).toHaveScreenshot("header.png");
});

test("footer", async ({ page }) => {
	await page.goto("/");
	const footer = page.getByRole("contentinfo");
	await prepareForVisualTest(page, footer);
	await expect(footer).toHaveScreenshot("footer.png");
});

test("hero section", async ({ page }) => {
	await page.goto("/");
	const hero = page.locator("section").first();
	await prepareForVisualTest(page, hero);
	await expect(hero).toHaveScreenshot("hero.png");
});

test("contact form", async ({ page }) => {
	await page.goto("/contact/");
	const form = page.locator("form").first();
	await prepareForVisualTest(page, form);
	await expect(form).toHaveScreenshot("contact-form.png");
});
