interface Env {
  GITHUB_OAUTH_ID: string;
  GITHUB_OAUTH_SECRET: string;
}

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';

function getAllowedOrigins(): string[] {
  return ['https://liteckyeditingservices.com', 'https://www.liteckyeditingservices.com'];
}

function setStateCookie(state: string, host: string): string {
  return `decap_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/; Domain=${host}`;
}

function getCookie(request: Request, name: string): string | undefined {
  const cookie = request.headers.get('cookie') || '';
  const found = cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return found?.split('=')[1];
}

function _htmlPostMessage(token: string, state: string, openerOrigin?: string): string {
  const allowed = getAllowedOrigins();
  const targets = Array.from(new Set([openerOrigin, ...allowed].filter(Boolean) as string[]));
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
        var state = ${JSON.stringify(state)};
        var targets = ${JSON.stringify(targets)};
        if (window.opener && token) {
          // Decap CMS expects this exact format with state and token_type
          var content = JSON.stringify({
            token: token,
            token_type: 'bearer',
            provider: 'github',
            state: state
          });
          var message = 'authorization:github:success:' + content;
          console.log('[OAuth] Sending message with state:', state);
          console.log('[OAuth] Message preview:', message.substring(0, 80) + '...');

          // Send to all targets with retries to avoid timing issues
          for (var i = 0; i < targets.length; i++) {
            console.log('[OAuth] Posting to:', targets[i]);
            window.opener.postMessage(message, targets[i]);
            // Retry after small delays
            setTimeout(function(target) {
              window.opener.postMessage(message, target);
            }.bind(null, targets[i]), 100);
            setTimeout(function(target) {
              window.opener.postMessage(message, target);
            }.bind(null, targets[i]), 250);
          }
          console.log('[OAuth] Message posted successfully');

          // Listen for ACK from opener
          function onAck(e) {
            if (e.data === 'authorization:ack') {
              console.log('[OAuth] Received ACK from opener');
              window.removeEventListener('message', onAck);
              setTimeout(function() { window.close(); }, 50);
            }
          }
          window.addEventListener('message', onAck);
        } else {
          console.error('[OAuth] Missing window.opener or token');
        }
      } catch(e) {
        console.error('[OAuth] Error:', e);
      }
      setTimeout(function() {
        console.log('[OAuth] Closing popup (failsafe)');
        window.close();
      }, 2500);
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
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Start OAuth flow
    if (url.pathname === '/auth') {
      // CRITICAL: Accept state from Decap CMS (passed via query param)
      // DO NOT generate our own state - must use Decap's for validation to work
      const state = url.searchParams.get('state');
      if (!state) {
        return new Response('Missing state parameter', {
          status: 400,
          headers: { 'Content-Type': 'text/plain' },
        });
      }

      // Use the worker's URL as base for callback
      const redirectUri = `${url.origin}/callback`;
      const originHeader = request.headers.get('origin') || undefined;
      const openerOrigin = getAllowedOrigins().includes(originHeader || '')
        ? originHeader
        : undefined;

      const authUrl = new URL(GITHUB_AUTHORIZE);
      authUrl.searchParams.set('client_id', env.GITHUB_OAUTH_ID);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'repo,user');
      authUrl.searchParams.set('state', state);

      return new Response(null, {
        status: 302,
        headers: {
          Location: authUrl.toString(),
          'Set-Cookie': [
            setStateCookie(state, url.hostname),
            openerOrigin
              ? `decap_oauth_origin=${openerOrigin}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/; Domain=${url.hostname}`
              : undefined,
          ]
            .filter(Boolean)
            .join(', '),
          'Cache-Control': 'no-store',
          // Keep popup ↔ opener link; COOP must not sever relationship
          'Cross-Origin-Opener-Policy': 'unsafe-none',
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
          headers: { 'Content-Type': 'text/plain' },
        });
      }

      // Exchange code for token
      const redirectUri = `${url.origin}/callback`;

      const tokenResponse = await fetch(GITHUB_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_OAUTH_ID,
          client_secret: env.GITHUB_OAUTH_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('GitHub token exchange failed:', errorText);
        return new Response(`Authentication failed: ${errorText}`, {
          status: 502,
          headers: { 'Content-Type': 'text/plain' },
        });
      }

      const tokenData = (await tokenResponse.json()) as {
        access_token?: string;
        error?: string;
      };

      if (!tokenData.access_token) {
        console.error('No access token in response:', tokenData);
        return new Response('Authentication failed: no token received', {
          status: 502,
          headers: { 'Content-Type': 'text/plain' },
        });
      }

      // Resolve opener origin from cookie, if present and allowed
      const openerCookie = getCookie(request, 'decap_oauth_origin');
      const openerOrigin = getAllowedOrigins().includes(openerCookie || '')
        ? openerCookie
        : undefined;

      // Redirect to same-origin callback page with token and state in URL hash
      // This ensures the postMessage comes from the correct origin for Decap CMS validation
      const callbackUrl = new URL('/admin/oauth-callback', openerOrigin || getAllowedOrigins()[0]);
      // Use URLSearchParams for robust encoding
      const hashParams = new URLSearchParams({
        token: tokenData.access_token,
        state: state,
      });
      callbackUrl.hash = hashParams.toString();

      return new Response(null, {
        status: 302,
        headers: {
          Location: callbackUrl.toString(),
          'Cache-Control': 'no-store',
          // Keep popup ↔ opener link; COOP must not sever relationship
          'Cross-Origin-Opener-Policy': 'unsafe-none',
          'Set-Cookie': `decap_oauth_state=; Max-Age=0; Path=/; Domain=${url.hostname}, decap_oauth_origin=; Max-Age=0; Path=/; Domain=${url.hostname}`,
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
