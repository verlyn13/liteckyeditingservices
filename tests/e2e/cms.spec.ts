import { expect, test } from "@playwright/test";

test("Decap CMS login UI is present", async ({ page }) => {
	await page.goto("/admin/");
	await expect(
		page.getByRole("button", { name: /log in|login with/i }),
	).toBeVisible({ timeout: 20_000 });
});
