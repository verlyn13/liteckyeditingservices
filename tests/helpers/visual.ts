import type { Locator, Page } from '@playwright/test';

export async function prepareForVisualTest(page: Page, el?: Locator) {
  await page.waitForLoadState('domcontentloaded');

  await page.addStyleTag({
    content: `
      [data-flaky], .live-chat, .cookie-banner { visibility: hidden !important; }
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
  });

  await page.evaluate(() =>
    Promise.all([
      (document as any).fonts?.ready,
      ...Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((res) => {
              (img.onload = img.onerror = res);
            }),
        ),
    ]),
  );

  if (el) await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
}

