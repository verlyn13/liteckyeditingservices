// /public/admin/diagnostics.v2.js
// Adds a temporary rescue: if a token message arrives and localStorage is empty, seed user and navigate.
(() => {
	try {
		// Carry over existing diagnostics listener if present
		console.log("[ADMIN DEBUG] diagnostics.v2 loaded");

		// Rescue acceptance (idempotent)
		if (!window.__decapRescueArmed) {
			window.__decapRescueArmed = true;
			window.addEventListener(
				"message",
				(ev) => {
					try {
						if (typeof ev.data !== "string") return;
						const prefix = "authorization:github:success:";
						if (!ev.data.startsWith(prefix)) return;
						if (window.__decapRescueDone) return;

						const payload = JSON.parse(ev.data.slice(prefix.length));
						if (!payload?.token) return;

						const hasUser = !!(
							localStorage.getItem("decap-cms-user") ||
							localStorage.getItem("netlify-cms-user")
						);
						if (hasUser) return; // already persisted by main script

						const u = {
							token: payload.token,
							backendName: "github",
							login: "github",
							isGuest: false,
						};
						localStorage.setItem("decap-cms-user", JSON.stringify(u));
						localStorage.setItem("netlify-cms-user", JSON.stringify(u));
						window.__decapRescueDone = true;
						console.log("[RESCUE] user persisted; navigating to editor");
						location.replace("/admin/#/");
					} catch (e) {
						console.log("[RESCUE] error parsing token message", e);
					}
				},
				{ passive: true },
			);
			console.log("[RESCUE] armed");
		}
	} catch {}
})();
