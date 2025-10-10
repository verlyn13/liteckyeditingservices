// /public/admin/diagnostics.js
// Admin diagnostics: capture OAuth messages and compare expected state vs message state
(() => {
	try {
		window.__lastAuth = null;

		window.addEventListener(
			"message",
			(event) => {
				console.log("[ADMIN DEBUG] postMessage received:", {
					origin: event.origin,
					data: event.data,
					type: typeof event.data,
					timestamp: new Date().toISOString(),
				});

				// OAuth string format
				if (
					typeof event.data === "string" &&
					event.data.startsWith("authorization:github:success:")
				) {
					console.log("[ADMIN DEBUG] ✅ OAuth message detected!");
					try {
						const payload = JSON.parse(
							event.data.slice("authorization:github:success:".length),
						);
						window.__lastAuth = payload;
						const expected =
							localStorage.getItem("netlify-cms-auth:state") ||
							localStorage.getItem("decap-cms-auth:state") ||
							null;
						const messageState = payload?.state ?? null;
						const match = expected && messageState && expected === messageState;
						console.log("[ADMIN DEBUG] STATE CHECK", {
							expected,
							messageState,
							match,
						});
					} catch (err) {
						console.warn("[ADMIN DEBUG] parse error", err);
					}
					return;
				}

				// OAuth object format (logged for visibility; acceptance is string-only now)
				if (
					event.data &&
					typeof event.data === "object" &&
					event.data.type &&
					/authorization:github:success/.test(String(event.data.type))
				) {
					console.log("[ADMIN DEBUG] ✅ OAuth object message detected!");
					return;
				}
			},
			false,
		);

		console.log("[ADMIN DEBUG] Diagnostics listener registered");

		// Helper: dump Decap user state
		window.__dumpUser = () => {
			const store = window.CMS?.getStore?.();
			const st = store?.getState?.();
			const user = st?.auth?.get ? st.auth.get("user") : st?.auth?.user;
			// @ts-expect-error
			const userJS = user?.toJS?.() ?? user ?? null;
			console.log("[ADMIN DEBUG] Decap user:", userJS);
			console.log(
				"[ADMIN DEBUG] localStorage user:",
				localStorage.getItem("netlify-cms-user") ||
					localStorage.getItem("decap-cms-user"),
			);
		};
	} catch (_) {
		// no-op
	}
})();
