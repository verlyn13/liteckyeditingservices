import type { Locator, Page } from "@playwright/test";

/**
 * Prepare page for visual snapshots (Oct 2025 best-practice).
 * - Avoids `networkidle` (can hang with HMR/websockets)
 * - Stabilizes fonts/images/layout
 * - Hides flaky UI
 */
export async function prepareForVisualTest(
	page: Page,
	el?: Locator,
	opts?: { readySelector?: string },
) {
	await page.waitForLoadState("domcontentloaded");
	if (opts?.readySelector) {
		await page
			.locator(opts.readySelector)
			.first()
			.waitFor({ state: "visible", timeout: 10_000 })
			.catch(() => {});
	}

	await page.evaluate(async () => {
		if (document.fonts?.ready) await document.fonts.ready;
		const pending = Array.from(document.images)
			.filter((img) => !img.complete)
			.map(
				(img) =>
					new Promise<void>((res) => {
						img.addEventListener("load", () => res(), { once: true });
						img.addEventListener("error", () => res(), { once: true });
					}),
			);
		await Promise.all(pending);
	});

	await page.addStyleTag({
		content: `
      :root { scrollbar-gutter: stable both-edges; }
      html, body { overflow: hidden !important; }
      [data-flaky], .live-chat, .cookie-banner { visibility: hidden !important; }
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      ::selection { background: transparent !important; }
    `,
	});

	if (el) {
		await el.scrollIntoViewIfNeeded();
		await el.waitFor({ state: "visible" });
	}

	await page.waitForTimeout(50);
}
