// functions/_middleware.ts

import type { EventContext, PagesFunction } from '@cloudflare/workers-types';
import * as Sentry from '@sentry/cloudflare';

type Env = {
  SENTRY_DSN?: string;
  PUBLIC_SENTRY_DSN?: string;
  ENVIRONMENT?: string;
  NODE_ENV?: string;
  SENTRY_RELEASE?: string;
  CF_PAGES_COMMIT_SHA?: string;
};

// Export an array of PagesFunction handlers (plugins + shared headers)
export const onRequest: PagesFunction<Env>[] = [
  // 1) Sentry first in chain
  (ctx: EventContext<Env, any, Record<string, unknown>>) => {
    const dsn = ctx.env.SENTRY_DSN ?? ctx.env.PUBLIC_SENTRY_DSN ?? '';
    const environment = ctx.env.ENVIRONMENT ?? ctx.env.NODE_ENV ?? 'production';
    const release = ctx.env.SENTRY_RELEASE ?? ctx.env.CF_PAGES_COMMIT_SHA ?? 'unknown';

    return Sentry.sentryPagesPlugin({
      dsn,
      tracesSampleRate: 1.0,
      environment,
      release,
    })(ctx as unknown as any) as unknown as Response | Promise<Response>;
  },

  // 2) Shared security headers for dynamic responses
  async (ctx: EventContext<Env, any, Record<string, unknown>>) => {
    const res = await ctx.next();
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
    if (!res.headers.has('Cache-Control')) res.headers.set('Cache-Control', 'no-store');
    return res;
  },
] as unknown as PagesFunction<Env>[];
