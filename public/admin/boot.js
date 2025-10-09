/**
 * Decap CMS boot loader (October 2025 hardened)
 * Loads self-hosted bundle with cache-busting from manifest
 * External script to eliminate 'unsafe-inline' from CSP
 */
(async () => {
	try {
		const m = await fetch("/vendor/decap/manifest.json", {
			cache: "no-store",
		}).then((r) => r.json());
		const s = document.createElement("script");
		s.defer = true;
		s.src = `/vendor/decap/decap-cms.js?v=${m.version}-${m.hash}`;

		// Wait for script to load, then initialize with correct config path
		s.onload = () => {
			if (window.CMS) {
				console.log("[Decap Boot] Initializing with config: /admin/config.yml");
				window.CMS.init({ config: "/admin/config.yml" });
			}
		};

		document.head.appendChild(s);
	} catch (e) {
		console.error("Failed to load Decap CMS:", e);
		document.body.innerHTML =
			'<p style="padding:2rem;color:#ef4444;">Failed to load CMS. Please refresh.</p>';
	}
})();
