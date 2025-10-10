// Cloudflare Pages Function: /api/auth
// Starts GitHub OAuth by generating a state cookie and redirecting to GitHub authorize

type Env = {
	GITHUB_CLIENT_ID: string;
};

interface EventContext<Env = unknown> {
	request: Request;
	env: Env;
	params: Record<string, string>;
	waitUntil: (promise: Promise<unknown>) => void;
	next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
	data: Record<string, unknown>;
}

type PagesFunction<Env = unknown> = (
	context: EventContext<Env>,
	next?: (
		request: Request,
		env: Env,
		ctx: EventContext<Env>,
	) => Promise<Response>,
) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
	try {
		const url = new URL(ctx.request.url);
		const clientId = ctx.env.GITHUB_CLIENT_ID;

		const traceId = crypto.randomUUID();
		console.log(
			JSON.stringify({
				evt: "oauth_auth_begin",
				id: traceId,
				url: url.toString(),
				clientId: clientId ? "present" : "MISSING",
			}),
		);

		if (!clientId) {
			console.error("[/api/auth] ERROR: Missing GITHUB_CLIENT_ID");
			return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });
		}

		// Compute current origin from this request (works in dev & prod)
		// Prefer explicit origin provided by Decap (it includes the admin opener origin)
		const decapOriginParam = url.searchParams.get("origin");
		const origin = decapOriginParam || `${url.protocol}//${url.host}`;
		const isHttps = url.protocol === "https:";
		const secure = isHttps ? "; Secure" : "";
		console.log(JSON.stringify({ evt: "oauth_origin", id: traceId, origin }));

		// Use Decap-provided OAuth state if present; otherwise generate one
		// Decap validates the exact state value on postMessage, so we must echo it back
		const decapStateParam = url.searchParams.get("state");
		const state = decapStateParam || crypto.randomUUID();
		console.log(
			JSON.stringify({
				evt: "oauth_state_set",
				id: traceId,
				fromDecap: !!decapStateParam,
				statePreview: `${state.slice(0, 8)}...`,
			}),
		);

		// Prefer Decap-provided scope; default to repo
		const scope = url.searchParams.get("scope") || "repo";
		console.log(JSON.stringify({ evt: "oauth_scope", id: traceId, scope }));

		const redirectUri = `${origin}/api/callback`;
		console.log(
			JSON.stringify({ evt: "oauth_redirect_uri", id: traceId, redirectUri }),
		);

		const authorize = new URL("https://github.com/login/oauth/authorize");
		authorize.searchParams.set("client_id", clientId);
		authorize.searchParams.set("redirect_uri", redirectUri);
		authorize.searchParams.set("scope", scope);
		authorize.searchParams.set("state", state);

		console.log(
			JSON.stringify({
				evt: "oauth_auth_redirect",
				id: traceId,
				locationPreview: `${authorize.toString().slice(0, 128)}...`,
			}),
		);

		// Optional diagnostics: no redirect, return summary JSON
		if (url.searchParams.get("dry_run") === "1") {
			const body = {
				id: traceId,
				origin,
				redirect: authorize.toString(),
				state,
				scope,
			};
			return new Response(JSON.stringify(body, null, 2), {
				headers: {
					"Content-Type": "application/json; charset=utf-8",
					"Cache-Control": "no-store",
				},
			});
		}

		// Set state cookie for later verification + carry opener origin for callback postMessage
		const cookies = [
			`decap_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure}`,
			`decap_opener_origin=${encodeURIComponent(origin)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure}`,
			`oauth_trace=${traceId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure}`,
		];

		return new Response(null, {
			status: 302,
			headers: {
				Location: authorize.toString(),
				"Set-Cookie": cookies.join(", "),
				// Keep popup ↔ opener relationship intact
				"Cross-Origin-Opener-Policy": "unsafe-none",
			},
		});
	} catch (error) {
		try {
			console.error(
				JSON.stringify({ evt: "oauth_auth_error", error: String(error) }),
			);
		} catch {}
		return new Response(`OAuth start error: ${error}`, { status: 500 });
	}
};
