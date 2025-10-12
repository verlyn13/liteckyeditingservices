import { defineConfig } from "@playwright/test";

// Default visual policy for macOS/overlay scrollbars to avoid width gutter mismatch
if (!process.env.VISUAL_POLICY) process.env.VISUAL_POLICY = "no-gutter";

// Canonical viewport dimensions matching committed baselines
const CANONICAL_WIDTH = 1250;
const CANONICAL_HEIGHT = 900;

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 30_000,
	expect: {
		timeout: 5_000,
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.003, // 0.3% tolerance (tighter than before)
			// Hardened snapshot defaults (October 2025)
			animations: "disabled",
			caret: "hide",
			threshold: 0.2, // Intensity threshold for antialiasing differences
		},
	},
	retries: 1, // allow a single retry for flake
	forbidOnly: !!process.env.CI,
	reporter: [["html", { open: "never" }], ["list"]],
	use: {
		baseURL: process.env.BASE_URL ?? "http://localhost:4321",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "off",
		// Lock rendering environment for visual stability (October 2025 best practice)
		headless: true,
		viewport: { width: CANONICAL_WIDTH, height: CANONICAL_HEIGHT },
		deviceScaleFactor: 1, // Prevents fractional pixel rounding
		isMobile: false,
		hasTouch: false,
		colorScheme: "light",
		locale: "en-US",
		timezoneId: "UTC", // Deterministic timezone
		permissions: [],
		// Reduce flakiness from font loading
		serviceWorkers: "block",
	},

	// Use plain chromium project so top-level `use` isn't overridden by device preset
	projects: [{ name: "chromium", use: { browserName: "chromium" } }],

	// Prefer preview (built site) for visual tests to avoid HMR websockets
	webServer:
		process.env.BASE_URL && !process.env.BASE_URL.includes("localhost")
			? undefined
			: {
					// Build once, then run Cloudflare Pages dev to include Functions locally
					// Ensures /api/* and /admin/config.yml endpoints exist during e2e
					command:
						"pnpm build && pnpm exec wrangler pages dev dist --port 4321 --local",
					url: "http://localhost:4321",
					reuseExistingServer: !process.env.CI, // Reuse locally, fresh in CI
					timeout: 180_000, // Allow time for build + wrangler startup
					stdout: "pipe", // Capture logs for debugging
					stderr: "pipe",
				},

	// Keep snapshots organized by OS/browser (October 2025 best practice)
	snapshotPathTemplate:
		"{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}-{platform}.png",
});
