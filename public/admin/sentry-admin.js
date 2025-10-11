/**
 * Sentry instrumentation for /admin (Decap CMS)
 * Tracks OAuth flows, login attempts, and CMS interactions
 */

(() => {
	// Import Sentry from CDN for admin (avoid bundler complexity)
	const SENTRY_DSN = window.SENTRY_DSN || import.meta?.env?.PUBLIC_SENTRY_DSN;

	if (!SENTRY_DSN) {
		console.warn("[Sentry Admin] DSN not configured; skipping initialization");
		return;
	}

	// Load Sentry SDK
	const script = document.createElement("script");
	script.src =
		"https://browser.sentry-cdn.com/8.48.0/bundle.tracing.replay.min.js";
	script.integrity =
		"sha384-sNEPSS1a7GrAqcTpBz8TxPvP//wnrJTVHxYgXXQ7OOA+OeQpC0JC8nKzT3f0r7Ju";
	script.crossOrigin = "anonymous";
	script.onload = initSentry;
	document.head.appendChild(script);

	function initSentry() {
		if (!window.Sentry) {
			console.error("[Sentry Admin] Failed to load Sentry SDK");
			return;
		}

		const Sentry = window.Sentry;

		Sentry.init({
			dsn: SENTRY_DSN,
			environment:
				window.SENTRY_ENVIRONMENT ||
				(location.hostname === "localhost" ? "development" : "production"),
			release: window.SENTRY_RELEASE,

			// Moderate tracing for admin (less traffic than main site)
			tracesSampleRate: 0.2,

			integrations: [
				Sentry.browserTracingIntegration({
					enableInp: true,
				}),
				Sentry.replayIntegration({
					maskAllText: true,
					blockAllMedia: true,
				}),
				Sentry.httpClientIntegration({
					failedRequestStatusCodes: [400, 599],
				}),
			],

			replaysSessionSampleRate: 0.1,
			replaysOnErrorSampleRate: 1.0,

			beforeSend(event) {
				// Filter browser extension errors
				const error = event.exception?.values?.[0];
				if (
					error?.stacktrace?.frames?.some(
						(frame) =>
							frame.filename?.includes("chrome-extension://") ||
							frame.filename?.includes("moz-extension://"),
					)
				) {
					return null;
				}
				return event;
			},
		});

		console.log("[Sentry Admin] Initialized");

		// Instrument OAuth flow
		instrumentOAuthFlow();

		// Instrument CMS interactions
		instrumentCMSInteractions();

		// Expose for debugging
		window.__sentryAdmin = Sentry;
	}

	function instrumentOAuthFlow() {
		const { logger } = window.Sentry;

		// Track login button clicks
		document.addEventListener(
			"click",
			(e) => {
				const btn = e.target.closest("button, [role=button]");
				if (!btn) return;
				const text = (btn.textContent || "").toLowerCase();
				if (text.includes("login") || text.includes("github")) {
					window.Sentry.startSpan(
						{
							op: "ui.click",
							name: "Admin Login Click",
						},
						() => {
							logger.info("Login button clicked", {
								buttonText: btn.textContent?.trim(),
							});
							window.Sentry.addBreadcrumb({
								category: "auth",
								message: "Login initiated",
								level: "info",
							});
						},
					);
				}
			},
			{ capture: true },
		);

		// Track OAuth messages
		window.addEventListener("message", (ev) => {
			if (ev.origin !== location.origin) return;
			if (
				typeof ev.data === "string" &&
				ev.data.startsWith("authorization:github:")
			) {
				const isSuccess = ev.data.includes(":success:");
				window.Sentry.startSpan(
					{
						op: "auth.oauth",
						name: isSuccess
							? "OAuth Success Message Received"
							: "OAuth Message Received",
					},
					() => {
						const level = isSuccess ? "info" : "warning";
						logger[level]("OAuth callback message received", {
							messageType: isSuccess ? "success" : "other",
						});
						window.Sentry.addBreadcrumb({
							category: "auth",
							message: `OAuth ${isSuccess ? "success" : "message"}`,
							level,
						});
					},
				);
			}
		});

		// Track localStorage changes (user persistence)
		const originalSetItem = Storage.prototype.setItem;
		Storage.prototype.setItem = function (key, value) {
			if (key.includes("cms-user") || key.includes("auth:state")) {
				window.Sentry?.addBreadcrumb({
					category: "storage",
					message: `localStorage.setItem: ${key}`,
					level: "debug",
					data: {
						key,
						valueLength: value?.length,
					},
				});
			}
			return originalSetItem.call(this, key, value);
		};
	}

	function instrumentCMSInteractions() {
		// Wait for CMS to load
		const checkCMS = setInterval(() => {
			if (!window.CMS) return;
			clearInterval(checkCMS);

			const { logger } = window.Sentry;

			try {
				// Track CMS state changes via Redux store
				const store = window.CMS.getStore?.();
				if (store) {
					let previousState = store.getState();
					store.subscribe(() => {
						const currentState = store.getState();

						// Track auth state changes
						if (previousState.auth !== currentState.auth) {
							const user = currentState.auth?.user;
							if (user) {
								window.Sentry.setUser({
									id: user.login || "unknown",
									username: user.login,
								});
								logger.info("CMS user authenticated", {
									backend: user.backendName,
								});
							} else {
								window.Sentry.setUser(null);
								logger.info("CMS user logged out");
							}
						}

						previousState = currentState;
					});

					logger.info("CMS store instrumentation active");
				}
			} catch (e) {
				window.Sentry.captureException(e, {
					tags: { component: "cms-instrumentation" },
				});
			}
		}, 100);

		// Timeout after 10 seconds
		setTimeout(() => clearInterval(checkCMS), 10000);
	}
})();
