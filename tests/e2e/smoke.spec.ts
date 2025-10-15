import { expect, test } from "@playwright/test";

test("home loads with banner and footer", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByRole("banner")).toBeVisible();
	await expect(page.getByRole("contentinfo")).toBeVisible();
});

test("contact page shows submit button", async ({ page }) => {
	await page.goto("/contact/");
	await expect(page.getByRole("button", { name: /quote/i })).toBeVisible();
});

test("services page loads with heading", async ({ page }) => {
	await page.goto("/services/");
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("about page loads with heading", async ({ page }) => {
	await page.goto("/about/");
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("pricing page loads with heading", async ({ page }) => {
	await page.goto("/pricing/");
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
