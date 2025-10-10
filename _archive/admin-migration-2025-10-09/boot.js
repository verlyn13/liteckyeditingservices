/**
 * Decap CMS boot loader (October 2025 hardened)
 * Loads self-hosted bundle with cache-busting from manifest
 * External script to eliminate 'unsafe-inline' from CSP
 */
(async () => {
	try {
		// Prevent double-initialization during HMR or duplicate script injections
		if (window.__DECAP_BOOTED) {
			console.debug("[Decap Boot] Already booted; skipping re-init");
			return;
		}
		window.__DECAP_BOOTED = true;

		// Avoid adding the bundle twice
		if (document.querySelector("script#decap-cms-bundle")) {
			console.debug("[Decap Boot] Bundle already present; not re-adding");
			return;
		}

		const m = await fetch("/vendor/decap/manifest.json", {
			cache: "no-store",
		}).then((r) => r.json());
		const s = document.createElement("script");
		s.id = "decap-cms-bundle";
		s.dataset.decapCms = "1";
		s.defer = true;
		s.src = `/vendor/decap/decap-cms.js?v=${m.version}-${m.hash}`;
		// Do NOT call CMS.init here; Decap auto-initializes and reads config via <link rel="cms-config-url">.
		// Calling CMS.init in parallel can cause double-render and React removeChild errors.
		document.head.appendChild(s);
	} catch (e) {
		console.error("Failed to load Decap CMS:", e);
		document.body.innerHTML =
			'<p style="padding:2rem;color:#ef4444;">Failed to load CMS. Please refresh.</p>';
	}
})();
