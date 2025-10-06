import { expect, test } from "../fixtures/block-noise";
import { prepareForVisualTest } from "../helpers/visual";

// Snapshot options for stable visual regression testing (October 2025 best practices)
const snapshotOptions = {
	animations: "disabled" as const,
	caret: "hide" as const,
	maxDiffPixelRatio: 0.005,
};

test("header", async ({ page }) => {
	await page.goto("/");
	const header = page.getByRole("banner");
	await prepareForVisualTest(page, header, { readySelector: "header" });
	await expect(header).toHaveScreenshot("header.png", snapshotOptions);
});

test("footer", async ({ page }) => {
	await page.goto("/");
	const footer = page.getByRole("contentinfo");
	await prepareForVisualTest(page, footer, { readySelector: "footer" });
	await expect(footer).toHaveScreenshot("footer.png", snapshotOptions);
});

test("hero section", async ({ page }) => {
	await page.goto("/");
	const hero = page.locator("section").first();
	await prepareForVisualTest(page, hero, { readySelector: "section" });
	await expect(hero).toHaveScreenshot("hero.png", snapshotOptions);
});

test("contact form", async ({ page }) => {
	await page.goto("/contact/");
	const form = page.locator("form").first();
	await prepareForVisualTest(page, form, { readySelector: "form" });
	await expect(form).toHaveScreenshot("contact-form.png", snapshotOptions);
});
