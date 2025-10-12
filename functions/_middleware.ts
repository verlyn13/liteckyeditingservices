// functions/_middleware.ts
import sentryPlugin from '@cloudflare/pages-plugin-sentry';
import type { PagesFunction } from '@cloudflare/workers-types';

// 1) Sentry at the top of the chain. Prefer server DSN, fall back to PUBLIC_SENTRY_DSN.
export const onRequest: PagesFunction<{
  SENTRY_DSN?: string;
  PUBLIC_SENTRY_DSN?: string;
}> = (context) => {
  const dsn = context.env.SENTRY_DSN ?? context.env.PUBLIC_SENTRY_DSN ?? '';
  return sentryPlugin({ dsn })(context);
};

// 2) Shared security / caching headers for all dynamic responses
export const onRequestPost: PagesFunction[] = [
  async ({ next }: { next: () => Promise<Response> }) => {
    const res = await next();
    // Light, conservative defaults; tweak per-route where needed.
    const headers = new Headers(res.headers as unknown as HeadersInit);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
    // Example cache guidance for APIs; static pages use _headers / static caching.
    if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'no-store');

    return new Response(res.body as unknown as BodyInit, {
      status: res.status,
      statusText: res.statusText,
      headers,
    }) as unknown as Response;
  },
] as unknown as PagesFunction[];
