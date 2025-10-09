// Cloudflare Pages Function: /api/auth
// Starts GitHub OAuth by generating a state cookie and redirecting to GitHub authorize

type Env = {
  GITHUB_CLIENT_ID: string;
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
  next?: (request: Request, env: Env, ctx: EventContext<Env>) => Promise<Response>,
) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url);
  const clientId = ctx.env.GITHUB_CLIENT_ID;
  if (!clientId) return new Response("Missing GITHUB_CLIENT_ID", { status: 500 });

  // Generate state for CSRF protection; store in HttpOnly cookie
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const state = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");

  const redirectUri = `${url.origin}/api/callback`;
  const scope = "repo user"; // repo needed for private repos

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", scope);
  authorize.searchParams.set("state", state);

  // Capture opener origin if provided by Decap (optional)
  const openerOrigin = url.searchParams.get("origin");
  if (openerOrigin) authorize.searchParams.set("decap_origin", openerOrigin);

  const cookie = [
    `decap_oauth_state=${state}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=600",
  ].join("; ");

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      "Set-Cookie": cookie,
      // Keep popup ↔ opener relationship intact
      "Cross-Origin-Opener-Policy": "unsafe-none",
    },
  });
};

