#!/usr/bin/env node

// tests/admin-smoke.spec.mjs
import puppeteer from "puppeteer";

const url = process.env.ADMIN_URL ?? "http://localhost:4323/admin/index.html#/";

const viewport = { width: 1280, height: 800 };

const launchArgs = [
	"--no-sandbox",
	"--disable-setuid-sandbox",
	"--disable-extensions",
	"--disable-features=Translate,TranslateUI",
];

const timeout = 30_000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
	console.log("🔍 Starting Decap CMS Admin Smoke Test...");
	console.log(`📍 URL: ${url}`);

	// Use system Chromium as documented in BROWSER-AUTOMATION-SETUP.md
	const browser = await puppeteer.launch({
		executablePath: "/usr/bin/chromium-browser",
		headless: "new",
		args: launchArgs,
	});
	const page = await browser.newPage();
	await page.setViewport(viewport);

	const logs = [];
	page.on("console", (msg) =>
		logs.push({ type: msg.type(), text: msg.text() }),
	);
	page.on("pageerror", (err) =>
		logs.push({ type: "pageerror", text: String(err) }),
	);
	page.on("requestfailed", (req) =>
		logs.push({
			type: "requestfailed",
			text: `${req.url()} :: ${req.failure()?.errorText}`,
		}),
	);

	try {
		console.log("📂 Navigating to admin page...");
		await page.goto(url, { waitUntil: "networkidle2", timeout });

		// Give Decap time to mount and navigate its hash router
		console.log("⏳ Waiting for CMS to initialize...");
		await sleep(1500);

		const state = await page.evaluate(() => ({
			href: location.href,
			title: document.title,
			hasCMS: typeof window.CMS !== "undefined",
			decapBanner:
				!!document.querySelector('div[class*="CMS"]') ||
				!!document.getElementById("nc-root"),
			bodySample: document.body.innerText.slice(0, 500),
			bodyHTML: document.body.innerHTML.slice(0, 1000),
		}));

		console.log("📊 STATE:", JSON.stringify(state, null, 2));
		console.log("📝 LOGS:", JSON.stringify(logs, null, 2));

		// Assert basic invariants
		if (!state.hasCMS) throw new Error("❌ Decap CMS global not present");
		if (!state.decapBanner) throw new Error("❌ Decap root did not mount");

		// Check for error indicators
		const hasError =
			state.bodySample.includes("Error") ||
			state.bodySample.includes("NotFoundError") ||
			logs.some((log) => log.type === "pageerror");

		if (hasError) {
			console.log("⚠️  Error detected in CMS interface");
			await page.screenshot({ path: "admin-error.png", fullPage: true });
			throw new Error("CMS interface shows error state");
		}

		console.log("📸 Taking screenshot...");
		await page.screenshot({ path: "admin-smoke.png", fullPage: true });

		console.log("✅ Admin smoke test passed!");
		console.log("✅ Decap CMS loaded successfully");
		console.log("✅ No DOM manipulation errors detected");
	} catch (error) {
		console.error("❌ Admin smoke test failed:", error.message);
		await page.screenshot({ path: "admin-error.png", fullPage: true });
		process.exit(1);
	} finally {
		await browser.close();
	}
})();
