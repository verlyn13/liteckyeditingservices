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
  next?: (request: Request, env: Env, ctx: EventContext<Env>) => Promise<Response>
) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  try {
    const url = new URL(ctx.request.url);
    const clientId = ctx.env.GITHUB_CLIENT_ID;

    const traceId = crypto.randomUUID();
    console.log(
      JSON.stringify({
        evt: 'oauth_auth_begin',
        id: traceId,
        url: url.toString(),
        clientId: clientId ? 'present' : 'MISSING',
      })
    );

    if (!clientId) {
      console.error('[/api/auth] ERROR: Missing GITHUB_CLIENT_ID');
      return new Response('Missing GITHUB_CLIENT_ID', { status: 500 });
    }

    // Compute current origin from this request (works in dev & prod)
    const origin = `${url.protocol}//${url.host}`;
    const isHttps = url.protocol === 'https:';
    const secure = isHttps ? '; Secure' : '';
    console.log(JSON.stringify({ evt: 'oauth_origin', id: traceId, origin }));

    // PKCE params and optional client-provided state

    const codeChallenge = url.searchParams.get('code_challenge') ?? '';
    const codeChallengeMethod = url.searchParams.get('code_challenge_method') ?? '';
    // Accept both `state` (preferred) and legacy `client_state`
    const stateParam = url.searchParams.get('state') ?? '';
    const clientStateLegacy = url.searchParams.get('client_state') ?? '';
    const clientState = stateParam || clientStateLegacy || '';

    // Prefer PKCE; warn (for now) when absent. Can be tightened to 400 later.
    const usingPkce = !!(codeChallenge && codeChallengeMethod === 'S256');
    if (!usingPkce) {
      console.warn('[oauth] auth without PKCE; proceeding for compatibility');
    }

    // Use client_state if present so LS and cookie match
    const state = clientState || crypto.randomUUID();
    console.log(
      JSON.stringify({
        evt: 'oauth_state_set',
        id: traceId,
        fromClient: !!clientState,
        statePreview: `${state.slice(0, 8)}...`,
      })
    );

    // Scope
    const scope = url.searchParams.get('scope') || 'repo read:user';
    console.log(JSON.stringify({ evt: 'oauth_scope', id: traceId, scope }));

    const redirectUri = `${origin}/api/callback`;
    console.log(JSON.stringify({ evt: 'oauth_redirect_uri', id: traceId, redirectUri }));

    const authorize = new URL('https://github.com/login/oauth/authorize');
    authorize.searchParams.set('client_id', clientId);
    authorize.searchParams.set('redirect_uri', redirectUri);
    authorize.searchParams.set('scope', scope);
    authorize.searchParams.set('state', state);
    if (codeChallenge && codeChallengeMethod) {
      authorize.searchParams.set('code_challenge', codeChallenge);
      authorize.searchParams.set('code_challenge_method', codeChallengeMethod);
    }

    console.log(
      JSON.stringify({
        evt: 'oauth_auth_redirect',
        id: traceId,
        locationPreview: `${authorize.toString().slice(0, 128)}...`,
      })
    );

    // Optional diagnostics: no redirect, return summary JSON
    if (url.searchParams.get('dry_run') === '1') {
      const body = {
        id: traceId,
        origin,
        redirect: authorize.toString(),
        state,
        scope,
        code_challenge: codeChallenge ? 'present' : 'absent',
        code_challenge_method: codeChallengeMethod || null,
      };
      return new Response(JSON.stringify(body, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

    // Set state cookie for later verification
    const cookies = [
      // New name (preferred)
      `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure}`,
      // Back-compat for earlier attempts
      `decap_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure}`,
      `oauth_trace=${traceId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure}`,
      // Replay guard (advisory)
      `oauth_inflight=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=600${secure}`,
    ];

    return new Response(null, {
      status: 302,
      headers: {
        Location: authorize.toString(),
        'Set-Cookie': cookies.join(', '),
        // Keep popup ↔ opener relationship intact
        'Cross-Origin-Opener-Policy': 'unsafe-none',
      },
    });
  } catch (error) {
    try {
      console.error(JSON.stringify({ evt: 'oauth_auth_error', error: String(error) }));
    } catch {}
    return new Response(`OAuth start error: ${error}`, { status: 500 });
  }
};
