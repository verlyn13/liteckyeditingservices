import type { Locator, Page } from "@playwright/test";

/**
 * Prepare page for visual snapshots (Oct 2025 hardened best-practice).
 * - Freezes time & randomness for deterministic rendering
 * - Stabilizes scrollbar gutter to prevent 1px height shifts
 * - Ensures fonts are fully loaded and metrics are stable
 * - Blocks animations/transitions at both script and style level
 */
export async function prepareForVisualTest(
	page: Page,
	el?: Locator,
	opts?: { readySelector?: string },
) {
	// Freeze time and randomness BEFORE any page content loads
	await page.addInitScript(() => {
		// @ts-expect-error - global for test stability
		window.___fixedNow = new Date("2025-01-01T00:00:00Z").valueOf();
		const OrigDate = Date;
		// @ts-expect-error - override global Date for deterministic tests
		// biome-ignore lint/suspicious/noGlobalAssign: Intentional global override for deterministic tests
		Date = class extends OrigDate {
			// biome-ignore lint/suspicious/noExplicitAny: Test utility needs flexible args
			constructor(...args: any[]) {
				// @ts-expect-error - access to global
				super(...(args.length ? args : [window.___fixedNow]));
			}
			static now() {
				// @ts-expect-error - access to global
				return window.___fixedNow;
			}
		};
		// Deterministic random for any UI that uses Math.random()
		let seed = 42;
		Math.random = () => {
			seed = (seed * 1664525 + 1013904223) % 4294967296;
			return seed / 4294967296;
		};
	});

	// Stabilize layout BEFORE content renders
	await page.addInitScript(() => {
		const css = `
      /* Prevent scrollbar-induced width/height shifts (critical for 1px diffs) */
      html {
        scrollbar-gutter: stable both-edges;
        font-size: 16px; /* Lock base font size */
      }
      /* Ensure box-sizing is consistent */
      *, *::before, *::after { box-sizing: border-box !important; }
      /* Belt & suspenders: disable animations/transitions */
      *, *::before, *::after {
        animation: none !important;
        animation-duration: 0s !important;
        transition: none !important;
        transition-duration: 0s !important;
      }
    `;
		const style = document.createElement("style");
		style.setAttribute("data-visual-lock", "init");
		style.textContent = css;
		document.documentElement.appendChild(style);
	});

	await page.waitForLoadState("domcontentloaded");

	// Wait for specific element if provided
	if (opts?.readySelector) {
		await page
			.locator(opts.readySelector)
			.first()
			.waitFor({ state: "visible", timeout: 10_000 })
			.catch(() => {});
	}

	// CRITICAL: Wait for fonts to load before measuring/snapshotting
	await page.evaluate(async () => {
		// document.fonts.ready ensures @fontsource fonts are fully loaded
		if (document.fonts?.ready) {
			await document.fonts.ready;
		}
		// Double-check: also wait for any images still loading
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

	// Add runtime style locks (in case init script was bypassed)
	await page.addStyleTag({
		content: `
      /* Hide flaky dynamic elements */
      [data-flaky], .live-chat, .cookie-banner, .chat-widget {
        visibility: hidden !important;
      }
      /* Hide selection highlighting */
      ::selection { background: transparent !important; }
      /* Ensure overflow doesn't create scrollbars mid-test */
      html, body { overflow: hidden !important; }
      /* Hide carets in form fields */
      *, *::before, *::after {
        caret-color: transparent !important;
      }
    `,
	});

	// Scroll element into view if provided
	if (el) {
		await el.scrollIntoViewIfNeeded();
		await el.waitFor({ state: "visible" });
	}

	// Final settle time for any lingering layout shifts
	await page.waitForTimeout(100);
}
