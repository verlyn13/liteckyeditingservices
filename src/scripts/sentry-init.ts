/**
 * Client-side Sentry initialization
 * Loaded early in the page lifecycle to capture errors and performance metrics
 */

import { initSentry } from "../lib/sentry";

// Initialize Sentry on the client
initSentry({
	// Configuration is pulled from environment variables via import.meta.env
	// PUBLIC_SENTRY_DSN
	// PUBLIC_SENTRY_ENVIRONMENT
	// PUBLIC_SENTRY_RELEASE
});

// Make Sentry available globally for debugging
if (import.meta.env.DEV) {
	import("@sentry/browser").then((Sentry) => {
		(window as any).__sentry = Sentry;
		console.log("[Sentry] Available at window.__sentry");
	});
}
