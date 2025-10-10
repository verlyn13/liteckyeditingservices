// Cloudflare Pages Function: /api/callback
// Validates state, exchanges code for token, posts message to opener, and closes popup

type Env = {
	GITHUB_CLIENT_ID: string;
	GITHUB_CLIENT_SECRET: string;
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

function parseCookies(h: string | null): Record<string, string> {
	const out: Record<string, string> = {};
	(h || "")
		.split(";")
		.map((c) => c.trim())
		.forEach((c) => {
			const i = c.indexOf("=");
			if (i > 0) out[c.slice(0, i)] = c.slice(i + 1);
		});
	return out;
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
	try {
		const reqUrl = new URL(ctx.request.url);
		const code = reqUrl.searchParams.get("code") ?? "";
		const state = reqUrl.searchParams.get("state") ?? "";

		console.log("[/api/callback] Request received:", {
			url: reqUrl.toString(),
			hasCode: !!code,
			state: state.slice(0, 8) + "...",
		});

		const cookie = ctx.request.headers.get("Cookie") || "";
		const cookies = parseCookies(cookie);
		const wantState = cookies.decap_oauth_state ?? "";
		const openerOrigin = decodeURIComponent(
			cookies.decap_opener_origin ?? "",
		);

		console.log("[/api/callback] Cookie state:", {
			wantState: wantState.slice(0, 8) + "...",
			openerOrigin,
			stateMatch: state === wantState,
		});

		// Basic CSRF/state check
		if (!code || !state || !wantState || state !== wantState) {
			console.error("[/api/callback] State validation failed:", {
				hasCode: !!code,
				hasState: !!state,
				hasWantState: !!wantState,
				stateMatch: state === wantState,
			});
			return new Response(
				`Invalid OAuth state. Code: ${!!code}, State: ${!!state}, Cookie state: ${!!wantState}, Match: ${state === wantState}`,
				{ status: 400 },
			);
		}

		const clientId = ctx.env.GITHUB_CLIENT_ID;
		const clientSecret = ctx.env.GITHUB_CLIENT_SECRET;

		console.log("[/api/callback] GitHub credentials:", {
			clientId: clientId ? "present" : "MISSING",
			clientSecret: clientSecret ? "present" : "MISSING",
		});

		if (!clientId || !clientSecret) {
			console.error("[/api/callback] Missing GitHub credentials");
			return new Response("Missing GitHub credentials", { status: 500 });
		}

		// Exchange code → access_token
		console.log("[/api/callback] Exchanging code for token...");
		const tokenRes = await fetch(
			"https://github.com/login/oauth/access_token",
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					// redirect_uri must match what we used in /api/auth:
					redirect_uri: `${reqUrl.origin}/api/callback`,
					state,
				}),
			},
		);

		console.log("[/api/callback] Token response:", {
			status: tokenRes.status,
			ok: tokenRes.ok,
		});

		if (!tokenRes.ok) {
			const t = await tokenRes.text();
			console.error("[/api/callback] Token exchange failed:", t);
			return new Response(`Token exchange failed: ${t}`, { status: 502 });
		}

		const tokenData = (await tokenRes.json()) as {
			access_token?: string;
			token_type?: string;
		};
		const token = tokenData.access_token || "";
		const tokenType = tokenData.token_type || "bearer";

		console.log("[/api/callback] Token received:", {
			hasToken: !!token,
			tokenType,
			tokenPreview: token.slice(0, 8) + "...",
		});

            // Post success message to opener (Decap 3.8.x compatible), then close
            const targetOrigin = openerOrigin || reqUrl.origin;
            const strPayload = 'authorization:github:success:' + JSON.stringify({
                token,
                provider: 'github',
                token_type: tokenType || 'bearer',
                state,
            });
            const objPayload = {
                type: 'authorization:github:success',
                data: { token, provider: 'github', token_type: tokenType || 'bearer', state },
            };

            const html = `<!doctype html><html><body><script>(function(){\n  var target=${JSON.stringify(targetOrigin)};\n  var s=${JSON.stringify(strPayload)};\n  var o=${JSON.stringify(objPayload)};\n  var attempts=0;\n  function send(){ attempts++; try{ if(window.opener){ window.opener.postMessage(s, target); window.opener.postMessage(o, target); } }catch(e){} if(attempts<20){ setTimeout(send,100); } else { setTimeout(function(){ window.close(); }, 50); } }\n  send();\n})();</script><p>You may close this window.</p></body></html>`;

            const isHttps = reqUrl.protocol === "https:";
            const secure = isHttps ? "; Secure" : "";
            const clearCookies = [
                "decap_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" + secure,
                "decap_opener_origin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" + secure,
            ];

            return new Response(html, {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                    "Cache-Control": "no-store",
                    "Set-Cookie": clearCookies.join(", "),
                    "Cross-Origin-Opener-Policy": "unsafe-none",
                    "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
                },
            });
	} catch (error) {
		console.error("[/api/callback] Unhandled error:", error);
		return new Response(`OAuth callback error: ${error}`, { status: 500 });
	}
};
