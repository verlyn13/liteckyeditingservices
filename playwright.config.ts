import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:4321";
const useExternalBase =
	!!process.env.PLAYWRIGHT_BASE_URL &&
	!process.env.PLAYWRIGHT_BASE_URL.includes("localhost");

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",

	// Deterministic screenshot configuration
	snapshotPathTemplate:
		"{testDir}/{testFileName}-snapshots/{projectName}/{arg}{ext}",

	expect: {
		// Global screenshot defaults for consistency
		toHaveScreenshot: {
			// Keep strict by default; only raise when intentionally needed
			maxDiffPixelRatio: 0.0025,
			maxDiffPixels: 150,
			// Apply stabilization stylesheet during capture
			stylePath: "./tests/e2e/_screenshot.css",
		},
	},

	use: {
		baseURL,
		trace: "on-first-retry",

		// Deterministic rendering settings
		viewport: { width: 1280, height: 1700 },
		deviceScaleFactor: 1,
		colorScheme: "light",
		locale: "en-US",
		timezoneId: "America/Los_Angeles",

		// Consistent font rendering (Chromium flags)
		launchOptions: {
			args: [
				"--force-color-profile=srgb",
				"--disable-lcd-text",
				"--font-render-hinting=none",
				"--disable-blink-features=AutomationControlled",
			],
		},
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		// Keep other browsers for comprehensive testing, but consider
		// focusing on chromium for visual tests to reduce baseline management
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
		// Mobile projects with fixed viewports for consistency
		{
			name: "Mobile Chrome",
			use: {
				...devices["Pixel 5"],
				viewport: { width: 393, height: 851 }, // Fixed Pixel 5 dimensions
			},
		},
		{
			name: "Mobile Safari",
			use: {
				...devices["iPhone 12"],
				viewport: { width: 390, height: 844 }, // Fixed iPhone 12 dimensions
			},
		},
	],

	webServer: useExternalBase
		? undefined
		: {
				command: "pnpm dev",
				url: "http://localhost:4321",
				reuseExistingServer: true,
			},
});
