/**
 * Sentry client-side configuration
 * Error tracking, performance monitoring, and structured logging
 */

import * as Sentry from "@sentry/browser";

// Minimal SpanAttributes type compatible with Sentry's startSpan
type SpanAttrPrimitive = string | number | boolean;
type SpanAttrValue = SpanAttrPrimitive | SpanAttrPrimitive[];
type SpanAttributes = Record<string, SpanAttrValue | undefined>;

export interface SentryConfig {
	dsn?: string;
	environment?: string;
	release?: string;
	tracesSampleRate?: number;
	replaysSessionSampleRate?: number;
	replaysOnErrorSampleRate?: number;
	enableLogs?: boolean;
	debug?: boolean;
}

/**
 * Initialize Sentry with environment-aware configuration
 */
export function initSentry(config: SentryConfig = {}) {
	const {
		dsn = import.meta.env.PUBLIC_SENTRY_DSN,
		environment = import.meta.env.PUBLIC_SENTRY_ENVIRONMENT || "production",
		release = import.meta.env.PUBLIC_SENTRY_RELEASE,
		tracesSampleRate = 0.1, // 10% of transactions
		replaysSessionSampleRate = 0.1, // 10% of sessions
		replaysOnErrorSampleRate = 1.0, // 100% of sessions with errors
		enableLogs = true,
		debug = import.meta.env.DEV,
	} = config;

	// Skip initialization if no DSN provided
	if (!dsn) {
		console.warn("[Sentry] DSN not configured; skipping initialization");
		return;
	}

	Sentry.init({
		dsn,
		environment,
		release,
		debug,
		enableLogs,

		// Performance Monitoring
		tracesSampleRate,
		integrations: [
			// Browser tracing for automatic instrumentation
			Sentry.browserTracingIntegration({
				// Track navigation/routing
				enableInp: true,
			}),

			// Session replay for debugging
			Sentry.replayIntegration({
				maskAllText: true,
				blockAllMedia: true,
			}),

			// Console logging integration
			Sentry.consoleLoggingIntegration({
				levels: ["error", "warn"], // Only log errors and warnings
			}),

			// HTTP client instrumentation
			Sentry.httpClientIntegration({
				failedRequestStatusCodes: [400, 599],
			}),
		],

		// Session Replay sampling
		replaysSessionSampleRate,
		replaysOnErrorSampleRate,

		// Filter out known noisy errors
		beforeSend(event, hint) {
			const error = hint.originalException;

			// Filter out browser extension errors
			if (
				error &&
				typeof error === "object" &&
				"stack" in error &&
				typeof error.stack === "string" &&
				(error.stack.includes("chrome-extension://") ||
					error.stack.includes("moz-extension://") ||
					error.stack.includes("safari-extension://"))
			) {
				return null;
			}

			// Filter out network errors in dev
			if (
				import.meta.env.DEV &&
				event.exception?.values?.[0]?.type === "NetworkError"
			) {
				return null;
			}

			return event;
		},

		// Add user context from localStorage if available
		beforeSendTransaction(event) {
			try {
				const user =
					localStorage.getItem("decap-cms-user") ||
					localStorage.getItem("netlify-cms-user");
				if (user) {
					const parsed = JSON.parse(user);
					event.user = {
						id: parsed.login || "unknown",
						username: parsed.login,
					};
				}
			} catch {}
			return event;
		},
	});

	console.log(
		`[Sentry] Initialized (env: ${environment}, release: ${release || "unknown"})`,
	);
}

/**
 * Structured logger using Sentry
 */
export const { logger } = Sentry;

/**
 * Helper to capture exceptions with context
 */
export function captureException(
	error: unknown,
	context?: Record<string, unknown>,
) {
	Sentry.captureException(error, {
		extra: context,
	});
}

/**
 * Helper to create custom spans for performance tracking
 */
export function startSpan<T>(
    options: { op: string; name: string; attributes?: SpanAttributes },
    callback: () => T | Promise<T>,
): T | Promise<T> {
    // Avoid tight coupling to internal SpanAttribute types; omit attributes for safety.
    return Sentry.startSpan({ op: options.op, name: options.name }, callback);
}

/**
 * Set user context for error tracking
 */
export function setUser(
	user: { id: string; email?: string; username?: string } | null,
) {
	Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging trail
 */
export function addBreadcrumb(breadcrumb: {
	message: string;
	level?: "info" | "warning" | "error" | "debug";
	category?: string;
	data?: Record<string, unknown>;
}) {
	Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Test Sentry integration
 */
export function testSentry() {
	try {
		logger.info("Sentry test initiated");
		Sentry.captureMessage("Sentry test message", "info");
		throw new Error("Sentry test error");
	} catch (error) {
		Sentry.captureException(error);
		console.log("[Sentry] Test error captured successfully");
	}
}
