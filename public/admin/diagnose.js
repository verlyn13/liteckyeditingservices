/**
 * Diagnostic script to check Decap CMS state
 * Run this in browser console after OAuth attempt
 */

async function diagnoseCMS() {
	console.group("🔍 Decap CMS Diagnostics");

	// Check if CMS is loaded
	console.log("1. CMS object exists:", !!window.CMS);

	if (!window.CMS) {
		console.error("❌ CMS not loaded - check boot.js and bundle");
		console.groupEnd();
		return;
	}

	// Check token
	try {
		const token = await window.CMS.getToken?.();
		console.log("2. Token stored:", !!token);
		if (token) {
			console.log("   Token preview:", token.slice(0, 8) + "…");
		} else {
			console.error("❌ No token stored - message not processed by Decap");
		}
	} catch (e) {
		console.error("❌ Error getting token:", e);
	}

	// Check backend
	try {
		const backend = await window.CMS.getBackend?.();
		console.log("3. Backend initialized:", !!backend);

		if (backend) {
			// Try to list collections
			try {
				const collections = await backend.listCollections?.();
				console.log("4. Collections accessible:", !!collections);
				if (collections) {
					console.log("   ✅ GitHub API working");
				}
			} catch (e) {
				console.error("❌ Collections error:", e.message, e.status);
				if (e.status === 401 || e.status === 403) {
					console.error("   → Check GitHub OAuth app scopes (need: repo, user)");
				}
			}
		}
	} catch (e) {
		console.error("❌ Error getting backend:", e);
	}

	// Check config
	console.log("5. Config check:");
	const configResp = await fetch("/admin/config.yml");
	const configText = await configResp.text();
	const baseUrlMatch = configText.match(/base_url:\s*(.+)/);
	const authEndpointMatch = configText.match(/auth_endpoint:\s*(.+)/);
	console.log("   base_url:", baseUrlMatch?.[1]?.trim());
	console.log("   auth_endpoint:", authEndpointMatch?.[1]?.trim());
	console.log("   Current origin:", window.location.origin);

	console.groupEnd();
}

// Auto-run after 2 seconds if CMS is loaded
setTimeout(() => {
	if (window.CMS) {
		console.log("🔍 Running auto-diagnostics...");
		diagnoseCMS();
	} else {
		console.log(
			"💡 CMS not loaded yet. Run diagnoseCMS() manually after login attempt.",
		);
	}
}, 2000);

// Make available globally
window.diagnoseCMS = diagnoseCMS;
console.log("💡 Diagnostic script loaded. Run: diagnoseCMS()");
