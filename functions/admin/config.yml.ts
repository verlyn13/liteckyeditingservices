/**
 * Cloudflare Pages Function for /admin/config.yml
 * Dynamically generates Decap CMS config with origin-aware base_url
 *
 * CRITICAL: base_url is REQUIRED when using external OAuth handlers.
 * Without it, Decap doesn't enter "external-auth" mode and won't process
 * the authorization:github:success postMessage events.
 *
 * References:
 * - https://decapcms.org/docs/backends-overview/
 * - https://github.com/vencax/netlify-cms-github-oauth-provider
 * - https://docs.cloud.gov/pages/using-pages/getting-started-with-netlify-cms/
 */

type Env = Record<string, never>;

interface EventContext<Env> {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}

type PagesFunction<Env> = (context: EventContext<Env>) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const origin = new URL(context.request.url).origin;

  try {
    console.log(
      JSON.stringify({
        evt: 'cms_config_deprecated',
        origin,
        path: '/admin/config.yml',
        note: 'Config now loaded programmatically via cms.js - this endpoint is deprecated',
      })
    );
  } catch {}

  // Config is now bundled in /admin/cms.js to prevent double-loading
  // Return 410 Gone to indicate this endpoint is intentionally removed
  return new Response('Config loaded programmatically. See /admin/cms.js', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Config-Note': 'Bundled in cms.js',
    },
  });
};
