// NPM-delivered Decap CMS entry (decap-cms-app)
// Uses explicit CMS.init with config mirroring our dynamic /api/config.yml
// and handles canonical OAuth success to persist + dispatch + navigate.

import CMS from "decap-cms-app";
import baseConfig from "./cms-config";

const origin = window.location.origin;

const config = (() => {
	const merged: Record<string, unknown> = { ...(baseConfig as any) };
	const backend = { ...(baseConfig as any).backend } as Record<string, unknown>;
	backend.base_url = origin;
	backend.auth_endpoint = "api/auth";
	(merged as any).backend = backend;
	return merged as typeof baseConfig;
})();

CMS.init({ config } as any);

// Canonical popup message → persist + dispatch + navigate
window.addEventListener(
	"message",
	(e) => {
		if (e.origin !== window.location.origin) return;
		const s = String(e.data || "");
		if (!s.startsWith("authorization:github:success:")) return;
		try {
			const payload = JSON.parse(
				s.slice("authorization:github:success:".length),
			);
			const token = payload?.token as string | undefined;
			if (!token) return;
			const user = {
				token,
				backendName: "github",
				login: "github",
				isGuest: false,
			};
			try {
				localStorage.setItem("decap-cms-user", JSON.stringify(user));
			} catch {}
			try {
				localStorage.setItem("netlify-cms-user", JSON.stringify(user));
			} catch {}
			type StoreLike = { dispatch?: (action: unknown) => unknown } | undefined;
			const cmsObj = CMS as unknown as {
				reduxStore?: StoreLike;
				store?: StoreLike;
			};
			const store = (cmsObj.reduxStore ?? cmsObj.store) as StoreLike;
			try {
				store?.dispatch?.({
					type: "LOGIN_SUCCESS",
					payload: { token },
				} as unknown);
			} catch {}
			// Clear legacy auth state keys
			try {
				localStorage.removeItem("decap-cms-auth:state");
			} catch {}
			try {
				localStorage.removeItem("netlify-cms-auth:state");
			} catch {}

			// Re-emit canonical success string once (idempotent)
			try {
				const msg = `authorization:github:success:${JSON.stringify({ token, state: "post-boot" })}`;
				window.postMessage(msg, window.location.origin);
			} catch {}

			// Short token retry (≤500ms); do not reload if null
			const start = Date.now();
			const check = async () => {
				try {
					const tok = await (CMS as any)?.getToken?.();
					if (tok) {
						window.location.replace("/admin/#/");
						return;
					}
				} catch {}
				if (Date.now() - start < 500) setTimeout(check, 100);
				else
					try {
						window.location.replace("/admin/#/");
					} catch {}
			};
			check();
		} catch {
			// ignore
		}
	},
	true,
);

// Diagnostics handle
declare global {
	interface Window {
		__cmsApp?: unknown;
	}
}
(window as Window).__cmsApp = CMS as unknown;
