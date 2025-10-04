import { test, expect } from "@playwright/test";

test.describe("@admin Decap CMS Admin", () => {
  test("loads without runtime errors and exposes CMS global", async ({ page }, testInfo) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on("pageerror", (err) => pageErrors.push(String(err)));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/admin/index.html#/");
    await page.waitForLoadState("networkidle");

    // Basic health checks
    const hasCMS = await page.evaluate(() => typeof (window as any).CMS !== "undefined");
    const bodyText = (await page.textContent("body")) || "";

    // Save screenshot/artifacts for debugging
    await testInfo.attach("admin-body.txt", { body: bodyText, contentType: "text/plain" });
    await page.screenshot({ path: `admin-${testInfo.project.name}.png`, fullPage: true });

    // Assertions
    expect(hasCMS, "window.CMS should be defined").toBeTruthy();
    expect(bodyText, "Admin UI should not show runtime error text").not.toMatch(/NotFoundError|There's been an error|ErrorBoundary/i);
    expect(pageErrors, "No pageerrors should occur").toHaveLength(0);
    expect(consoleErrors.join("\n"), "No console errors should be logged").not.toMatch(/NotFoundError|removeChild|TypeError|ReferenceError/i);
  });
});

