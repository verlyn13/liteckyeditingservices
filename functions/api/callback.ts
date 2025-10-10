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

		// Diagnostic mode: return a minimal HTML shell with the same
		// security headers as a successful callback, without posting tokens.
		if (reqUrl.searchParams.get("diag") === "1") {
			const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Callback Diagnostics</title>
</head>
<body>
  <p>Diagnostic callback page. Headers mirror successful OAuth callback.</p>
</body>
</html>`;

			const isHttps = reqUrl.protocol === "https:";
			const secure = isHttps ? "; Secure" : "";
			return new Response(html, {
				headers: {
					"Content-Type": "text/html; charset=utf-8",
					"Cache-Control": "no-store",
					"Set-Cookie": [
						`decap_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
						`decap_opener_origin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
					].join(", "),
					"Cross-Origin-Opener-Policy": "unsafe-none",
					"Content-Security-Policy":
						"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
				},
			});
		}

		const code = reqUrl.searchParams.get("code") ?? "";
		const state = reqUrl.searchParams.get("state") ?? "";

		console.log("[/api/callback] Request received:", {
			url: reqUrl.toString(),
			hasCode: !!code,
			state: `${state.slice(0, 8)}...`,
		});

		const cookie = ctx.request.headers.get("Cookie") || "";
		const cookies = parseCookies(cookie);
		const wantState = cookies.decap_oauth_state ?? "";
		const openerOrigin = decodeURIComponent(cookies.decap_opener_origin ?? "");
		const traceId = cookies.oauth_trace || crypto.randomUUID();

		console.log(
			JSON.stringify({
				evt: "oauth_callback_begin",
				id: traceId,
				url: reqUrl.toString(),
				hasCode: !!code,
				statePreview: `${state.slice(0, 8)}...`,
			}),
		);

		console.log(
			JSON.stringify({
				evt: "oauth_callback_cookies",
				id: traceId,
				wantStatePreview: `${wantState.slice(0, 8)}...`,
				openerOrigin,
				stateMatch: state === wantState,
			}),
		);

		// Basic CSRF/state check
		if (!code || !state || !wantState || state !== wantState) {
			try {
				console.error(
					JSON.stringify({
						evt: "oauth_state_invalid",
						id: traceId,
						hasCode: !!code,
						hasState: !!state,
						hasWantState: !!wantState,
						stateMatch: state === wantState,
					}),
				);
			} catch {}
			const html = `<!doctype html><meta charset="utf-8"><title>Authentication Error</title>
<div style="font-family:system-ui;padding:16px;color:#b00020">
  <h2 style="margin:0 0 8px;">Invalid OAuth state</h2>
  <div>Request ID: ${traceId}</div>
  <div>Please close this window and try again.</div>
</div>`;
			return new Response(html, {
				status: 400,
				headers: {
					"Content-Type": "text/html; charset=utf-8",
					"Cache-Control": "no-store",
				},
			});
		}

		const clientId = ctx.env.GITHUB_CLIENT_ID;
		const clientSecret = ctx.env.GITHUB_CLIENT_SECRET;

		console.log(
			JSON.stringify({
				evt: "oauth_credentials",
				id: traceId,
				clientId: clientId ? "present" : "MISSING",
				clientSecret: clientSecret ? "present" : "MISSING",
			}),
		);

		if (!clientId || !clientSecret) {
			console.error("[/api/callback] Missing GitHub credentials");
			return new Response("Missing GitHub credentials", { status: 500 });
		}

		// Return HTML that posts CODE (PKCE flow) to opener window (Decap CMS)
		const targetOrigin = reqUrl.origin;
		const stringMessage = `authorization:github:success:${JSON.stringify({ code, state })}`;

		console.log(
			JSON.stringify({ evt: "oauth_render_callback_html", id: traceId }),
		);

		// HTML with inline script to post message and close window
		// This script runs in the popup window that Decap opened
		const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Authenticating…</title>
</head>
<body>
  <p>Authentication successful. Closing window...</p>
  <script>
    (function() {
      if (!window.opener) {
        document.body.innerHTML = '<p style="color:red;">Error: No opener window found.</p>';
        return;
      }

      const target = ${JSON.stringify(targetOrigin)};
      const strMsg = ${JSON.stringify(stringMessage)};

      console.log('[Callback] Sending messages to opener; id=${traceId}');

      // Send every 100ms up to 10 tries, then close
      var tries = 0;
      var timer = setInterval(function() {
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(strMsg, target);
            console.log('[Callback] Messages sent; id=${traceId}; try=' + tries);
          }
        } catch (e) {
          console.error('[Callback] Error:', e);
        }
        tries++;
        if (tries >= 10) {
          clearInterval(timer);
          console.log('[Callback] Closing popup; id=${traceId}');
          window.close();
        }
      }, 100);
    })();
  </script>
</body>
</html>`;

		const isHttps = reqUrl.protocol === "https:";
		const secure = isHttps ? "; Secure" : "";
		const clearCookies = [
			`decap_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
			`decap_opener_origin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
		];

		return new Response(html, {
			headers: {
				"Content-Type": "text/html; charset=utf-8",
				"Cache-Control": "no-store",
				"Set-Cookie": clearCookies.join(", "),
				"Cross-Origin-Opener-Policy": "unsafe-none",
				// Allow inline script in THIS response only
				"Content-Security-Policy":
					"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
			},
		});
	} catch (error) {
		try {
			console.error(
				JSON.stringify({ evt: "oauth_callback_error", error: String(error) }),
			);
		} catch {}
		return new Response("OAuth callback error", { status: 500 });
	}
};
