type Env = {
  GITHUB_OAUTH_ID: string;
  GITHUB_OAUTH_SECRET: string;
};

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';

function getSiteOrigin(): string {
  return 'https://liteckyeditingservices.com';
}

function setStateCookie(state: string, host: string): string {
  return `decap_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/; Domain=${host}`;
}

function getCookie(request: Request, name: string): string | undefined {
  const cookie = request.headers.get('cookie') || '';
  const found = cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(name + '='));
  return found?.split('=')[1];
}

function htmlPostMessage(token: string, origin: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Authenticating…</title></head><body><script>(function(){try{var t=${JSON.stringify(
    token,
  )};var o=${JSON.stringify(
    getSiteOrigin(),
  )};if(window.opener&&t){window.opener.postMessage({token:t},o)}}catch(e){}setTimeout(function(){window.close()},100)})();</script><p>Authentication successful. You can close this window.</p></body></html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health
    if (url.pathname === '/') {
      return new Response('Litecky Decap OAuth Proxy - Operational', { headers: { 'Content-Type': 'text/plain' } });
    }

    // Start OAuth
    if (url.pathname === '/auth') {
      const state = crypto.getRandomValues(new Uint8Array(16)).reduce((s, b) => s + b.toString(16).padStart(2, '0'), '');
      const redirectUri = `https://${url.hostname}/callback`;

      const authUrl = new URL(GITHUB_AUTHORIZE);
      authUrl.searchParams.set('client_id', env.GITHUB_OAUTH_ID);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'repo,user');
      authUrl.searchParams.set('state', state);

      return new Response(null, {
        status: 302,
        headers: { Location: authUrl.toString(), 'Set-Cookie': setStateCookie(state, url.hostname), 'Cache-Control': 'no-store' },
      });
    }

    // Callback
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const expected = getCookie(request, 'decap_oauth_state');
      if (!code || !state || !expected || state !== expected) {
        return new Response('Invalid OAuth state', { status: 400, headers: { 'Content-Type': 'text/plain' } });
      }

      const tokenResp = await fetch(GITHUB_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ client_id: env.GITHUB_OAUTH_ID, client_secret: env.GITHUB_OAUTH_SECRET, code, redirect_uri: `https://${url.hostname}/callback` }),
      });
      if (!tokenResp.ok) {
        const txt = await tokenResp.text();
        return new Response(`Authentication failed: ${txt}`, { status: 502, headers: { 'Content-Type': 'text/plain' } });
      }
      const data = (await tokenResp.json()) as { access_token?: string };
      if (!data.access_token) {
        return new Response('Authentication failed: no token', { status: 502, headers: { 'Content-Type': 'text/plain' } });
      }
      const html = htmlPostMessage(data.access_token, getSiteOrigin());
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          'Set-Cookie': `decap_oauth_state=; Max-Age=0; Path=/; Domain=${url.hostname}`,
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
