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
	const url = new URL(ctx.request.url);
	const state = url.searchParams.get("state");
	const code = url.searchParams.get("code");
	const decapOrigin = url.searchParams.get("decap_origin");

	const cookies = parseCookies(ctx.request.headers.get("Cookie"));
	const expectedState = cookies["decap_oauth_state"];
	if (!state || !expectedState || state !== expectedState) {
		return new Response("Invalid OAuth state", { status: 400 });
	}
	if (!code) return new Response("Missing code", { status: 400 });

	const clientId = ctx.env.GITHUB_CLIENT_ID;
	const clientSecret = ctx.env.GITHUB_CLIENT_SECRET;
	if (!clientId || !clientSecret)
		return new Response("Missing GitHub credentials", { status: 500 });

	// Exchange code -> access_token
	const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: `${url.origin}/api/callback`,
			state,
		}),
	});

	if (!tokenRes.ok) {
		const t = await tokenRes.text();
		return new Response(`Token exchange failed: ${t}`, { status: 502 });
	}

	const tokenData = (await tokenRes.json()) as { access_token?: string };
	const token = tokenData.access_token || "";

	// Determine target origin
	const targets = Array.from(
		new Set([decapOrigin, url.origin].filter(Boolean) as string[]),
	);

	// HTML that posts token to opener and closes. Use string + object message formats Decap accepts.
	const html = `<!doctype html><html><body><script>(function(){\n  var t=${JSON.stringify(
		token,
	)}; var state=${JSON.stringify(state)}; var targets=${JSON.stringify(
		targets,
	)};\n  var payload='authorization:github:success:'+JSON.stringify({token:t, provider:'github', token_type:'bearer', state:state});\n  function send(){ try{ for(var i=0;i<targets.length;i++){ window.opener && window.opener.postMessage(payload, targets[i]); } }catch(e){} }\n  // resend a few times to avoid timing races\n  send(); setTimeout(send,120); setTimeout(send,300);\n  // also send object-style message accepted by Decap\n  var objMsg={ type:'authorization:github:success', data:{ token:t, provider:'github', token_type:'bearer', state:state } };\n  function sendObj(){ try{ for(var i=0;i<targets.length;i++){ window.opener && window.opener.postMessage(objMsg, targets[i]); } }catch(e){} }\n  sendObj(); setTimeout(sendObj,140);\n  // wait for ack then close; otherwise close after fail-safe\n  function onAck(ev){ if(targets.indexOf(ev.origin)>-1 && ev.data==='authorization:ack'){ window.removeEventListener('message', onAck); setTimeout(function(){ window.close(); }, 50); } }\n  window.addEventListener('message', onAck);\n  setTimeout(function(){ window.close(); }, 2500);\n})();</script><p>You may close this window.</p></body></html>`;

	const clearState = [
		"decap_oauth_state=; Max-Age=0",
		"Path=/",
		"HttpOnly",
		"Secure",
		"SameSite=Lax",
	].join("; ");

	return new Response(html, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Set-Cookie": clearState,
			// Allow popup → opener postMessage handshake
			"Cross-Origin-Opener-Policy": "unsafe-none",
			// Minimal CSP that allows the inline script above
			"Content-Security-Policy": [
				"default-src 'self'",
				"script-src 'self' 'unsafe-inline'",
				"style-src 'self' 'unsafe-inline'",
				"img-src 'self' data:",
				"base-uri 'none'",
				"object-src 'none'",
			].join("; "),
		},
	});
};
