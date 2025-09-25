interface Env {
  GITHUB_OAUTH_ID: string;
  GITHUB_OAUTH_SECRET: string;
}

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

function htmlPostMessage(token: string): string {
  const origin = getSiteOrigin();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Authenticating…</title>
</head>
<body>
  <script>
    (function() {
      try {
        var token = ${JSON.stringify(token)};
        var origin = ${JSON.stringify(origin)};
        if (window.opener && token) {
          window.opener.postMessage({ token: token }, origin);
        }
      } catch(e) {
        console.error('Auth error:', e);
      }
      setTimeout(function() { window.close(); }, 100);
    })();
  </script>
  <p>Authentication successful. You can close this window.</p>
</body>
</html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/') {
      return new Response('Litecky Decap OAuth Proxy - Operational', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Start OAuth flow
    if (url.pathname === '/auth') {
      const state = crypto.getRandomValues(new Uint8Array(16))
        .reduce((s, b) => s + b.toString(16).padStart(2, '0'), '');

      // Use the worker's URL as base for callback
      const redirectUri = `${url.origin}/callback`;

      const authUrl = new URL(GITHUB_AUTHORIZE);
      authUrl.searchParams.set('client_id', env.GITHUB_OAUTH_ID);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'repo,user');
      authUrl.searchParams.set('state', state);

      return new Response(null, {
        status: 302,
        headers: {
          'Location': authUrl.toString(),
          'Set-Cookie': setStateCookie(state, url.hostname),
          'Cache-Control': 'no-store'
        },
      });
    }

    // OAuth callback
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const expectedState = getCookie(request, 'decap_oauth_state');

      // Validate state parameter
      if (!code || !state || !expectedState || state !== expectedState) {
        return new Response('Invalid OAuth state', {
          status: 400,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      // Exchange code for token
      const redirectUri = `${url.origin}/callback`;

      const tokenResponse = await fetch(GITHUB_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: env.GITHUB_OAUTH_ID,
          client_secret: env.GITHUB_OAUTH_SECRET,
          code,
          redirect_uri: redirectUri
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('GitHub token exchange failed:', errorText);
        return new Response(`Authentication failed: ${errorText}`, {
          status: 502,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      const tokenData = await tokenResponse.json() as { access_token?: string; error?: string };

      if (!tokenData.access_token) {
        console.error('No access token in response:', tokenData);
        return new Response('Authentication failed: no token received', {
          status: 502,
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      // Return HTML that posts token to opener window
      const html = htmlPostMessage(tokenData.access_token);

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