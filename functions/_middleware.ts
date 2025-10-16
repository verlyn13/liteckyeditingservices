// functions/_middleware.ts

import type { EventContext, PagesFunction } from '@cloudflare/workers-types';
import type { ErrorEvent, EventHint } from '@sentry/cloudflare';
import * as Sentry from '@sentry/cloudflare';

type Env = {
  SENTRY_DSN?: string;
  PUBLIC_SENTRY_DSN?: string;
  ENVIRONMENT?: string;
  NODE_ENV?: string;
  SENTRY_RELEASE?: string;
  CF_PAGES_COMMIT_SHA?: string;
};

/**
 * Scrub sensitive data from Sentry error events
 *
 * Uses proper ErrorEvent and EventHint types re-exported from @sentry/cloudflare
 */
function scrubSentryEvent(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
  // Scrub sensitive fields from request data
  if (event.request) {
    // Remove cookies (cookies is a Record<string, string>)
    if (event.request.cookies) {
      event.request.cookies = {};
    }
    // Remove authorization headers
    if (event.request.headers) {
      const headers = { ...event.request.headers };
      const sensitiveHeaders = ['authorization', 'cookie', 'x-auth-token', 'api-key'];
      sensitiveHeaders.forEach((header) => {
        if (headers[header]) {
          headers[header] = '[Filtered]';
        }
      });
      event.request.headers = headers;
    }
  }

  // Scrub sensitive data from extra context
  if (event.extra) {
    const extra = { ...event.extra };
    const sensitiveKeys = ['password', 'email', 'token', 'secret', 'api_key'];
    Object.keys(extra).forEach((key) => {
      if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
        extra[key] = '[Filtered]';
      }
    });
    event.extra = extra;
  }

  // Scrub user email if present but keep ID
  if (event.user?.email) {
    event.user.email = '[Filtered]';
  }

  return event;
}

// Export an array of PagesFunction handlers (plugins + shared headers)
export const onRequest: PagesFunction<Env>[] = [
  // 0) Canonical host redirect (apex -> www) in production
  async (ctx: EventContext<Env, string, Record<string, unknown>>) => {
    const url = new URL(ctx.request.url);
    const isProduction = ctx.env.ENVIRONMENT === 'production' || ctx.env.NODE_ENV === 'production';
    if (isProduction && url.hostname === 'liteckyeditingservices.com') {
      url.hostname = 'www.liteckyeditingservices.com';
      return Response.redirect(url.toString(), 301);
    }
    return ctx.next();
  },
  // 1) Sentry first in chain with enhanced configuration
  (ctx: EventContext<Env, string, Record<string, unknown>>) => {
    const dsn = ctx.env.SENTRY_DSN ?? ctx.env.PUBLIC_SENTRY_DSN ?? '';
    const environment = ctx.env.ENVIRONMENT ?? ctx.env.NODE_ENV ?? 'production';
    const release = ctx.env.SENTRY_RELEASE ?? ctx.env.CF_PAGES_COMMIT_SHA ?? 'unknown';

    // Use lower sampling rate in production to manage costs
    const tracesSampleRate = environment === 'production' ? 0.1 : 1.0;

    return Sentry.sentryPagesPlugin({
      dsn,
      environment,
      release,
      tracesSampleRate,
      beforeSend: (event, hint) => {
        // Scrub sensitive data before sending to Sentry
        return scrubSentryEvent(event, hint);
      },
      integrations: [
        // Add request data integration
        Sentry.requestDataIntegration({
          include: {
            cookies: false, // Don't include cookies
            data: true,
            headers: true,
            ip: true,
            query_string: true,
            url: true,
            // Note: user data is scrubbed in beforeSend hook
          },
        }),
      ],
      // biome-ignore lint/suspicious/noExplicitAny: sentryPagesPlugin uses incompatible internal types
    })(ctx as any) as unknown as Response | Promise<Response>;
  },

  // 2) Shared security headers for dynamic responses
  async (ctx: EventContext<Env, string, Record<string, unknown>>) => {
    const res = await ctx.next();
    const isProduction = ctx.env.ENVIRONMENT === 'production' || ctx.env.NODE_ENV === 'production';

    // Security headers
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // HSTS only in production
    if (isProduction) {
      res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    // Cache control if not already set
    if (!res.headers.has('Cache-Control')) {
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    }

    return res;
  },
] as unknown as PagesFunction<Env>[];
