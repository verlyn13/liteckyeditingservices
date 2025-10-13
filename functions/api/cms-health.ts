// Cloudflare Pages Function: /api/cms-health
// Returns a JSON summary useful for CMS OAuth triage

type Env = Record<string, never>;

interface EventContext<Env = unknown> {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, unknown>;
}

type PagesFunction<Env = unknown> = (context: EventContext<Env>) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const origin = url.origin;
  const host = url.hostname;

  const env =
    host === 'www.liteckyeditingservices.com' || host === 'liteckyeditingservices.com'
      ? 'production'
      : /pages\.dev$/i.test(host)
        ? 'preview'
        : 'development';

  const body = {
    origin,
    host,
    env,
    adminConfigURL: `${origin}/admin/config.yml`,
    authEndpoint: `${origin}/api/auth`,
    callbackEndpoint: `${origin}/api/callback`,
    decap: {
      delivery: 'npm-app',
      bundleURL: `${origin}/admin/cms.js`,
      autoInit: true,
      configDiscovery: 'link[rel="cms-config-url"][href="/admin/config.yml"]',
    },
    notes: [
      '/admin/config.yml served dynamically with origin-aware base_url',
      'Auto-init via link rel="cms-config-url"',
      'callback must set COOP unsafe-none and allow inline script',
      "auth must echo Decap 'state' and set HttpOnly SameSite=Lax cookie",
    ],
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
};
