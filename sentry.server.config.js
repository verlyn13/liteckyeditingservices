import * as Sentry from "@sentry/astro";

Sentry.init({
	dsn: process.env.PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
	environment:
		process.env.PUBLIC_SENTRY_ENVIRONMENT ||
		process.env.ENVIRONMENT ||
		"production",
	release: process.env.PUBLIC_SENTRY_RELEASE || process.env.SENTRY_RELEASE,

	// Performance Monitoring
	tracesSampleRate: process.env.ENVIRONMENT === "production" ? 0.1 : 1.0,

	// Enable structured logs (Sentry recommended)
	enableLogs: true,

	// Filter out noise
	beforeSend(event, _hint) {
		// Don't send events if no DSN is configured
		const dsn = process.env.PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
		if (!dsn) {
			return null;
		}

		return event;
	},

	// Send default PII for better debugging (includes IP and headers, recommended by Sentry docs)
	sendDefaultPii: true,
});
