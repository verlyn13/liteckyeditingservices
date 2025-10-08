/**
 * Cloudflare Pages Function for /admin/* routes
 * October 2025 hardened CSP + COOP for reliable OAuth popup handoff
 * Single source of truth for admin security headers
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
	const url = new URL(ctx.request.url);
	const headers = new Headers(res.headers);

	// -- Security headers (admin shell + app) ----------------------------
	headers.set("x-frame-options", "SAMEORIGIN");
	headers.set("referrer-policy", "strict-origin-when-cross-origin");
	headers.set(
		"permissions-policy",
		"camera=(), microphone=(), geolocation=(), usb=(), payment=()",
	);

	// -- CSP: self-hosted Decap with GitHub API direct access ------------
	const csp = [
		"default-src 'self'",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob: https:",
		"font-src 'self' data:",
		// Self-hosted bundle (no inline) + Turnstile + Decap requires unsafe-eval for AJV codegen
		"script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com",
		// Direct-to-GitHub (not proxying yet)
		"connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://github.com https://litecky-decap-oauth.jeffreyverlynjohnson.workers.dev",
		"frame-src 'self' https://challenges.cloudflare.com",
		"child-src 'self' blob:",
		"worker-src 'self' blob:",
		"frame-ancestors 'self'",
		"base-uri 'none'",
		"object-src 'none'",
		"form-action 'self' https://github.com",
	].join("; ");

	headers.delete("content-security-policy");
	headers.delete("Content-Security-Policy");
	headers.set("content-security-policy", csp);

	// CRITICAL: Allow popup handoff (popup must retain window.opener)
	headers.set("cross-origin-opener-policy", "unsafe-none");
	headers.delete("cross-origin-embedder-policy");

	// Cache admin HTML shell conservatively
	if (
		url.pathname === "/admin/" ||
		url.pathname === "/admin/index.html"
	) {
		headers.set("cache-control", "no-store");
	}

	return new Response(res.body, {
		status: res.status,
		statusText: res.statusText,
		headers,
	});
};
