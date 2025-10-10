(() => {
	const STATE_KEYS = [
		"netlify-cms-auth:state",
		"decap-cms-auth:state",
		"netlify-cms:auth:state",
		"decap-cms:auth:state",
	];

	const rand = (size = 32) => crypto.getRandomValues(new Uint8Array(size));
	const b64url = (buf) =>
		btoa(String.fromCharCode(...buf))
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");

	async function sha256ToB64Url(str) {
		const data = new TextEncoder().encode(str);
		const digest = await crypto.subtle.digest("SHA-256", data);
		return b64url(new Uint8Array(digest));
	}

	function genVerifier(len = 96) {
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
		let out = "";
		const r = rand(len);
		for (let i = 0; i < len; i++) out += chars[r[i] % chars.length];
		return out;
	}

	function setDecapState(state) {
		try {
			for (const k of STATE_KEYS) localStorage.setItem(k, state);
		} catch {}
	}

	async function startLogin() {
		const verifier = genVerifier(96);
		sessionStorage.setItem("pkce_code_verifier", verifier);
		const challenge = await sha256ToB64Url(verifier);

		const state = crypto.randomUUID();
		setDecapState(state);

		const u = new URL("/api/auth", location.origin);
		u.searchParams.set("code_challenge", challenge);
		u.searchParams.set("code_challenge_method", "S256");
		u.searchParams.set("client_state", state);
		window.open(u.toString(), "decap-oauth", "popup,width=600,height=800");
	}

	function bind() {
		// Heuristic: bind to Decap login button
		const btn = document.querySelector(
			'[data-testid="login-button"], .Login-button, button',
		);
		if (btn && !btn.__pkceBound) {
			btn.__pkceBound = true;
			btn.addEventListener(
				"click",
				(e) => {
					e.preventDefault();
					startLogin().catch(console.error);
				},
				{ capture: true },
			);
		}
	}

	const obs = new MutationObserver(() => bind());
	obs.observe(document.documentElement, { subtree: true, childList: true });
	if (
		document.readyState === "complete" ||
		document.readyState === "interactive"
	)
		bind();
	else addEventListener("DOMContentLoaded", bind);

	// Listen for callback code; exchange token; emit canonical success string
	window.addEventListener("message", async (event) => {
		try {
			if (event.origin !== location.origin) return;
			const s = String(event.data || "");
			if (!s.startsWith("authorization:github:success:")) return;
			const payload = JSON.parse(
				s.slice("authorization:github:success:".length),
			);
			if (!payload || !payload.code) return; // only handle code messages

			const verifier = sessionStorage.getItem("pkce_code_verifier");
			if (!verifier) return console.error("[PKCE] Missing verifier");

			const r = await fetch("/api/exchange-token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code: payload.code, verifier }),
			});
			const data = await r.json().catch(() => ({}));
			if (!data || !data.token)
				return console.error("[PKCE] No token in exchange response");

			// Emit canonical success string with token for Decap acceptance
			const expected =
				localStorage.getItem("netlify-cms-auth:state") ||
				localStorage.getItem("decap-cms-auth:state") ||
				payload.state ||
				null;
			const message = `authorization:github:success:${JSON.stringify({ token: data.token, provider: "github", state: expected })}`;
			window.postMessage(message, location.origin);
		} catch (e) {
			console.error("[PKCE] Error", e);
		}
	});
})();
