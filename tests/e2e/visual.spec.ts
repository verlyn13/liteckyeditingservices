import type { Locator } from "@playwright/test";
import { expect, test } from "../fixtures/block-noise";
import { prepareForVisualTest } from "../helpers/visual";

/**
 * Visual regression tests for core UI components
 * Snapshot options are configured globally in playwright.config.ts
 */

/**
 * Dump computed styles for debugging visual regressions.
 * Compare output between passing and failing commits to identify style drift.
 */
async function dumpStyles(label: string, loc: Locator) {
	const data = await loc.evaluate((el: HTMLElement) => {
		const cs = getComputedStyle(el);
		const r = el.getBoundingClientRect();
		return {
			width: r.width,
			height: r.height,
			bg: cs.backgroundColor,
			color: cs.color,
			border: [cs.borderTopColor, cs.borderTopWidth, cs.borderTopStyle].join(
				" ",
			),
			fontFamily: cs.fontFamily,
			fontSize: cs.fontSize,
			lineHeight: cs.lineHeight,
			padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
			margin: `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`,
		};
	});
	console.log(`[VISUAL][${label}]`, data);
}

test("header", async ({ page }) => {
	await page.goto("/");
	const header = page.getByRole("banner");
	await prepareForVisualTest(page, header, { readySelector: "header" });
	await dumpStyles("header", header);
	await expect(header).toHaveScreenshot("header.png");
});

test("footer", async ({ page }) => {
	await page.goto("/");
	const footer = page.getByRole("contentinfo");
	await prepareForVisualTest(page, footer, { readySelector: "footer" });
	await dumpStyles("footer", footer);
	await expect(footer).toHaveScreenshot("footer.png");
});

test("hero section", async ({ page }) => {
	await page.goto("/");
	const hero = page.locator("section").first();
	await prepareForVisualTest(page, hero, { readySelector: "section" });
	await dumpStyles("hero", hero);
	await expect(hero).toHaveScreenshot("hero.png");
});

test("contact form", async ({ page }) => {
	await page.goto("/contact/");
	const form = page.locator("form").first();
	await prepareForVisualTest(page, form, { readySelector: "form" });
	await dumpStyles("contact-form", form);
	await expect(form).toHaveScreenshot("contact-form.png");
});
