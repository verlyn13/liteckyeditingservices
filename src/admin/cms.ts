// NPM-delivered Decap CMS entry (decap-cms-app)
// Auto-init mode: Decap discovers config via <link rel="cms-config-url" href="/admin/config.yml">.
// Do not call CMS.init here; let Decap handle OAuth and store updates.

import CMS from "decap-cms-app";

// Initialize Decap, letting it load /admin/config.yml via the link tag
const cms = CMS as unknown as DecapCMS;
try {
	// Calling init with no config triggers config discovery from the link tag
	(cms as unknown as { init?: () => void }).init?.();
	console.log("[CMS Init] Auto-init via /admin/config.yml");
} catch (e) {
	console.error("[CMS Init] Failed to auto-init", e);
}

// Diagnostics: expose global reference for tests/inspections
(window as Window & { CMS?: unknown; __cmsApp?: unknown }).CMS = cms;
(window as Window & { CMS?: unknown; __cmsApp?: unknown }).__cmsApp = cms;
