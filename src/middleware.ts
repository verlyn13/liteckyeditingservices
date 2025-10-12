/**
 * Middleware for development server security headers
 * In production, headers are set by:
 * - public/_headers for general routes
 * - functions/admin/[[path]].ts for /admin/* routes
 */
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;

  // Only apply in development (production uses _headers file and Pages Functions)
  if (import.meta.env.PROD) {
    return next();
  }

  const response = await next();
  const headers = new Headers(response.headers);

  // Apply relaxed CSP for admin routes in development
  if (url.pathname.startsWith('/admin')) {
    headers.set(
      'Content-Security-Policy',
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
      ].join('; ')
    );

    headers.set('Cache-Control', 'no-store');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // Apply standard CSP for other routes in development
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' data: https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://challenges.cloudflare.com",
      'frame-src https://challenges.cloudflare.com',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; ')
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
