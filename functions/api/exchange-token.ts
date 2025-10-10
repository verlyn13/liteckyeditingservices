// Cloudflare Pages Function: /api/exchange-token
// Exchanges an authorization code + code_verifier (PKCE) for an access token

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

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
	try {
		const url = new URL(ctx.request.url);
		const origin = `${url.protocol}//${url.host}`;
		const body = (await ctx.request.json().catch(() => ({}))) as {
			code?: string;
			verifier?: string;
		};
		const code = body.code || "";
		const verifier = body.verifier || "";
		if (!code || !verifier) {
			return new Response(
				JSON.stringify({ error: "missing_code_or_verifier" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json; charset=utf-8" },
				},
			);
		}

			const res = await fetch("https://github.com/login/oauth/access_token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Accept: "application/json",
				},
				body: new URLSearchParams({
					client_id: ctx.env.GITHUB_CLIENT_ID,
					client_secret: ctx.env.GITHUB_CLIENT_SECRET,
					code,
					code_verifier: verifier,
					redirect_uri: `${origin}/api/callback`,
				}),
			});

		const data = (await res.json().catch(() => ({}))) as {
			access_token?: string;
		};
		if (!res.ok || !data?.access_token) {
			return new Response(
				JSON.stringify({ error: "token_exchange_failed", details: data }),
				{
					status: 400,
					headers: { "Content-Type": "application/json; charset=utf-8" },
				},
			);
		}

		return new Response(JSON.stringify({ token: data.access_token }), {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Cache-Control": "no-store",
			},
		});
	} catch (e) {
		return new Response(
			JSON.stringify({ error: "exchange_unexpected", message: String(e) }),
			{
				status: 500,
				headers: { "Content-Type": "application/json; charset=utf-8" },
			},
		);
	}
};
