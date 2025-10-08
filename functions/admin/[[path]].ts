/**
 * Cloudflare Pages Function for /admin/* routes
 * Sets a single authoritative CSP header for Decap CMS
 * This overrides any headers from public/_headers to prevent merging
 */

type Env = {};

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
) => Response | Promise<Response>;

export const onRequest: PagesFunction<Env> = async (ctx) => {
	const res = await ctx.next();
	const headers = new Headers(res.headers);

	// Single authoritative CSP for admin (Decap CMS)
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net https://identity.netlify.com",
		"style-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net",
		"img-src 'self' data: blob: https:",
		"font-src 'self' data: https://unpkg.com https://cdn.jsdelivr.net",
		"connect-src 'self' https://challenges.cloudflare.com https://api.github.com https://github.com https://api.netlify.com https://unpkg.com https://cdn.jsdelivr.net https://litecky-decap-oauth.jeffreyverlynjohnson.workers.dev",
		"frame-src 'self' https://challenges.cloudflare.com",
		"child-src 'self' blob:",
		"worker-src 'self' blob:",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self' https://github.com",
		"frame-ancestors 'self'",
	].join("; ");

	// Remove any existing CSP headers to prevent merging
	headers.delete("content-security-policy");
	headers.delete("Content-Security-Policy");

	// Set single CSP
	headers.set("content-security-policy", csp);

	// Avoid stale admin shell during deploys
	headers.set("cache-control", "no-store");

	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers,
	});
};
