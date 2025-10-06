import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 30_000,
	expect: {
		timeout: 5_000,
		toHaveScreenshot: { maxDiffPixelRatio: 0.005 }, // 0.5% strict baseline
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
		viewport: { width: 1280, height: 960 },
		deviceScaleFactor: 1, // Prevents fractional pixel rounding
		colorScheme: "light",
		locale: "en-US",
	},

	// Use plain chromium project so top-level `use` isn't overridden by device preset
	projects: [{ name: "chromium", use: { browserName: "chromium" } }],

	// Prefer preview (built site) for visual tests to avoid HMR websockets
	webServer:
		process.env.BASE_URL && !process.env.BASE_URL.includes("localhost")
			? undefined
			: {
					// Build once, then preview (static server, no HMR)
					command: "pnpm build && pnpm preview --port 4321 --strictPort",
					url: "http://localhost:4321",
					reuseExistingServer: true,
					timeout: 120_000, // Allow time for build + preview startup
				},

	// Keep snapshots organized by OS/browser (October 2025 best practice)
	snapshotPathTemplate:
		"{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}-{platform}.png",
});
