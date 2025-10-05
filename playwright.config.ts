import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 30_000,
	expect: {
		timeout: 5_000,
		toHaveScreenshot: { maxDiffPixelRatio: 0.005 }, // 0.5% is plenty
	},
	retries: 1, // allow a single retry for flake
	forbidOnly: !!process.env.CI,
	reporter: [
		["html", { open: "never" }],
		["list"],
	],
	use: {
		baseURL: process.env.BASE_URL ?? "http://localhost:4321",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "off",
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
	],

	// Auto-start dev server only when testing locally
	webServer:
		process.env.BASE_URL && !process.env.BASE_URL.includes("localhost")
			? undefined
			: {
					command: "pnpm dev",
					url: "http://localhost:4321",
					reuseExistingServer: true,
				},
});
