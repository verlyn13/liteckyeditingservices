import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display main elements', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Home.*Litecky Editing Services/);

    // Check main heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // Check navigation
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check CTA button
    const ctaButton = page.locator('text=Get Started').first();
    await expect(ctaButton).toBeVisible();
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Contact');
    await expect(page).toHaveURL(/.*contact/);
    await expect(page).toHaveTitle(/Contact.*Litecky Editing Services/);
  });
});