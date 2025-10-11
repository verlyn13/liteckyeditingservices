// [PKCE-LOGIN] build=2025-10-11T18:07:02Z commit=a9da9273 accept: write user → clear → replace('/admin/#/')
(() => {
	try {
		console.log("[PKCE-LOGIN] build=2025-10-11T18:07:02Z commit=a9da9273");
	} catch {}
})();

// v3 is a cache-busted copy of pkce-login.js with the same logic.
// Source: public/admin/pkce-login.js at the time of creation.
("use strict");
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

	const LOGIN_SELECTORS = [
		'[data-testid="login-button"]',
		".Login-button",
		'button[aria-label="Login with GitHub"]',
		"button",
	];

	if (window.__decapPkceActive) return;
	window.__decapPkceActive = true;

	function looksLikeLogin(el) {
		const txt = (el.textContent || "").toLowerCase();
		return /\blogin\b/.test(txt) || /\bgithub\b/.test(txt);
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
		u.searchParams.set("state", state);
		u.searchParams.set("client_state", state);
		try {
			sessionStorage.setItem("oauth_state", state);
		} catch {}
		try {
			const isHttps = location.protocol === "https:";
			const secure = isHttps ? "; Secure" : "";
			document.cookie = `oauth_pkce_verifier=${encodeURIComponent(verifier)}; Path=/; SameSite=Lax; Max-Age=600${secure}`;
		} catch {}
		const openFn = window.__realWindowOpen || window.open;
		const win = openFn.call(
			window,
			u.toString(),
			"decap-oauth",
			"popup,width=600,height=800",
		);
		try {
			window.__pkcePopup = win;
		} catch {}
	}

	async function startLoginOnce(e, btn) {
		if (e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
		}
		if (btn) btn.setAttribute("data-pkce-active", "true");
		try {
			await startLogin();
		} catch (err) {
			console.error(err);
		}
	}

	function wireLogin() {
		LOGIN_SELECTORS.forEach((sel) => {
			document.querySelectorAll(sel).forEach((btn) => {
				if (!looksLikeLogin(btn)) return;
				if (btn.__pkceCapture) return;
				btn.__pkceCapture = true;
				btn.classList.add("pkce-login-bound");
				if (!btn.querySelector(".pkce-badge")) {
					const b = document.createElement("span");
					b.className = "pkce-badge";
					b.textContent = "PKCE";
					b.style.cssText = "margin-left:.5rem;font-size:.75em;opacity:.7";
					btn.appendChild(b);
				}
				btn.addEventListener("click", (e) => startLoginOnce(e, btn), {
					capture: true,
				});
			});
		});

		if (!window.__pkceGlobalCapture) {
			window.__pkceGlobalCapture = true;
			document.addEventListener(
				"click",
				(e) => {
					const t =
						e.target &&
						(e.target.closest("button, a, [role=button]") || e.target);
					if (!t) return;
					if (!looksLikeLogin(t)) return;
					startLoginOnce(e, t);
				},
				{ capture: true },
			);
		}
	}

	const mo = new MutationObserver(wireLogin);
	mo.observe(document.documentElement, { subtree: true, childList: true });
	if (document.readyState !== "loading") wireLogin();
	else addEventListener("DOMContentLoaded", wireLogin);

	function neuterDecapAuthorizer() {
		const CMS = window.CMS;
		if (!CMS) return;
		try {
			const authz =
				(CMS && CMS.auth && CMS.auth.authorizer) ||
				(CMS && CMS.OAuthAuthorizer && CMS.OAuthAuthorizer.prototype) ||
				null;
			if (authz && !authz.__patched) {
				const deny = () =>
					Promise.reject(
						new Error("Decap authorizer disabled (PKCE externalized)."),
					);
				["authenticate", "openPopup", "pollWindow"].forEach((k) => {
					if (authz[k]) authz[k] = deny;
				});
				authz.__patched = true;
				console.log("[PKCE] Decap OAuth authorizer neutered");
			}
		} catch {}
	}
	if (document.readyState === "complete") neuterDecapAuthorizer();
	else addEventListener("load", neuterDecapAuthorizer);

	async function onPkceSuccess(finalToken, _state) {
		const userObj = {
			token: finalToken,
			backendName: "github",
			login: "github",
			isGuest: false,
		};
		try {
			localStorage.setItem("netlify-cms-user", JSON.stringify(userObj));
			localStorage.setItem("decap-cms-user", JSON.stringify(userObj));
		} catch (e) {
			console.warn("[PKCE] Failed to write user to localStorage", e);
		}

		try {
			sessionStorage.removeItem("pkce_code_verifier");
		} catch {}
		try {
			sessionStorage.removeItem("oauth_state");
		} catch {}

		const store = window.CMS?.getStore?.();
		if (store) {
			try {
				const tryDispatch = (type) =>
					store.dispatch({ type, payload: userObj });
				try {
					tryDispatch("OAUTH_AUTHORIZE_SUCCESS");
				} catch {}
				try {
					tryDispatch("LOGIN_SUCCESS");
				} catch {}
				setTimeout(() => {
					try {
						window.__dumpUser?.();
					} catch {}
					try {
						location.replace(new URL("/admin/#/", location.origin).href);
					} catch {}
				}, 50);
				return;
			} catch (e) {
				console.warn("[PKCE] Store dispatch failed; reloading", e);
			}
		}
		try {
			location.replace(new URL("/admin/#/", location.origin).href);
		} catch {}
	}

	let completed = false;
	let exchanging = false;
	window.addEventListener("message", async (event) => {
		try {
			if (completed) return;
			if (event.origin !== location.origin) return;
			const s = String(event.data || "");
			if (!s.startsWith("authorization:github:success:")) return;
			const payload = JSON.parse(
				s.slice("authorization:github:success:".length),
			);
			if (!payload) return;

			const myState = sessionStorage.getItem("oauth_state") || "";
			if (
				(payload.code || payload.token) &&
				payload.state &&
				myState &&
				payload.state !== myState
			)
				return;

			if (payload.token) {
				completed = true;
				const expected =
					localStorage.getItem("netlify-cms-auth:state") ||
					localStorage.getItem("decap-cms-auth:state") ||
					payload.state ||
					null;
				const message = `authorization:github:success:${JSON.stringify({ token: payload.token, provider: "github", state: expected })}`;
				window.postMessage(message, location.origin);
				try {
					window.__pkcePopup?.postMessage("authorization:ack", location.origin);
				} catch {}
				try {
					await onPkceSuccess(payload.token, expected);
				} catch {}
				return;
			}

			if (!payload.code) return;
			if (exchanging) return;
			exchanging = true;

			const verifier = sessionStorage.getItem("pkce_code_verifier");
			if (!verifier) return console.error("[PKCE] Missing verifier");

			const r = await fetch("/api/exchange-token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code: payload.code, verifier }),
			});
			const data = await r.json().catch(() => ({}));
			const accessToken = data && (data.access_token || data.token);
			if (!accessToken) {
				exchanging = false;
				return console.error("[PKCE] No token in exchange response");
			}

			const expected =
				localStorage.getItem("netlify-cms-auth:state") ||
				localStorage.getItem("decap-cms-auth:state") ||
				payload.state ||
				null;
			const message = `authorization:github:success:${JSON.stringify({ token: accessToken, provider: "github", state: expected })}`;
			window.postMessage(message, location.origin);
			try {
				window.__pkcePopup?.postMessage("authorization:ack", location.origin);
			} catch {}
			try {
				await onPkceSuccess(accessToken, expected);
			} catch {}
			completed = true;
			try {
				sessionStorage.removeItem("pkce_code_verifier");
			} catch {}
			try {
				sessionStorage.removeItem("oauth_state");
			} catch {}
			exchanging = false;
		} catch (e) {
			console.error("[PKCE] Error", e);
			exchanging = false;
		}
	});
})();
