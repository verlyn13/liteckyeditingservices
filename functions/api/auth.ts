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

		console.log("[/api/auth] Request received:", {
			url: url.toString(),
			clientId: clientId ? "present" : "MISSING",
		});

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
		console.log("[/api/auth] Computed origin:", origin);

		// Use Decap-provided OAuth state if present; otherwise generate one
		// Decap validates the exact state value on postMessage, so we must echo it back
		const decapStateParam = url.searchParams.get("state");
		const state = decapStateParam || crypto.randomUUID();
		console.log(
			"[/api/auth] Using state:",
			state,
			decapStateParam ? "(from Decap)" : "(generated)",
		);

		// Prefer Decap-provided scope; default to repo
		const scope = url.searchParams.get("scope") || "repo";
		console.log("[/api/auth] Using scope:", scope);

		const redirectUri = `${origin}/api/callback`;
		console.log("[/api/auth] Redirect URI:", redirectUri);

		const authorize = new URL("https://github.com/login/oauth/authorize");
		authorize.searchParams.set("client_id", clientId);
		authorize.searchParams.set("redirect_uri", redirectUri);
		authorize.searchParams.set("scope", scope);
		authorize.searchParams.set("state", state);

		console.log("[/api/auth] Redirecting to GitHub:", authorize.toString());

		// Set state cookie for later verification + carry opener origin for callback postMessage
		const cookies = [
			`decap_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure}`,
			`decap_opener_origin=${encodeURIComponent(origin)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure}`,
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
		console.error("[/api/auth] Unhandled error:", error);
		return new Response(`OAuth start error: ${error}`, { status: 500 });
	}
};
