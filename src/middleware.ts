/**
 * Middleware for security headers
 * Runs in both dev and production to ensure proper CSP configuration
 * In production, this overrides the _headers file to prevent header merging
 */
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
	const { url } = context;

	// Get the response first
	const response = await next();

	// Apply relaxed CSP for admin routes (both dev and prod)
	// In production, this overrides the _headers file to ensure only one CSP is sent
	if (url.pathname.startsWith("/admin")) {
		const headers = new Headers(response.headers);

		// Match the production CSP from public/_headers
		headers.set(
			"Content-Security-Policy",
			[
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
			].join("; "),
		);

		headers.set("Cache-Control", "no-store");

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	}

	// Apply standard CSP for other routes in development
	const headers = new Headers(response.headers);

	headers.set(
		"Content-Security-Policy",
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' data: https://challenges.cloudflare.com",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: https:",
			"font-src 'self' data:",
			"connect-src 'self' https://challenges.cloudflare.com",
			"frame-src https://challenges.cloudflare.com",
			"object-src 'none'",
			"base-uri 'self'",
			"form-action 'self'",
			"frame-ancestors 'self'",
			"upgrade-insecure-requests",
		].join("; "),
	);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
