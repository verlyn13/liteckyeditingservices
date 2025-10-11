// /public/admin/html-start.js
// Emits an early breadcrumb without requiring inline script (CSP-safe).
try {
	(window.__sentry || window.Sentry)?.addBreadcrumb?.({
		category: "admin",
		message: "admin:html-start",
		level: "info",
	});
} catch {}
