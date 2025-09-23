import { test, expect } from '@playwright/test';

test('contact form submits with success message', async ({ page }) => {
  // Intercept API to simulate success (works in dev where Pages Functions may not run)
  await page.route('**/api/contact', async (route) => {
    const req = route.request();
    if (req.method() === 'POST') {
      await route.fulfill({ status: 202, body: JSON.stringify({ status: 'enqueued' }), headers: { 'content-type': 'application/json' } });
      return;
    }
    await route.fallback();
  });

  await page.goto('http://localhost:4321/contact');
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Service Type').selectOption('substantive');
  await page.getByLabel('Message (optional)').fill('Hello!');
  await page.getByRole('button', { name: 'Get My Free Quote' }).click();

  await expect(page.locator('text=Request received. We will reply shortly.')).toBeVisible();
});

