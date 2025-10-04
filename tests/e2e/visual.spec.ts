import { test, expect, type Page } from "@playwright/test";

async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: `* { animation: none !important; transition: none !important; }`,
  });
}

test.describe("@visual Visual regression", () => {
  test("@visual home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await disableAnimations(page);
    await expect(page).toHaveScreenshot("home.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("@visual services page", async ({ page }) => {
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    await disableAnimations(page);
    await expect(page).toHaveScreenshot("services.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});

