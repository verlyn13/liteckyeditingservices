/* admin/accept-login.js
   Robust token acceptor for Decap CMS with structured logging & retries.
   Usage:
     acceptAndFlipFromToken({ token, state });
   Or if you receive the canonical string:
     handleCanonicalAuthString("authorization:github:success:{...}");
*/

(() => {
  // --------- tiny logger that also buffers to window.__adminLog ----------
  const LOG_KEY = '__adminLog';
  if (!window[LOG_KEY]) window[LOG_KEY] = [];
  const BUCKET = window[LOG_KEY];
  const ts = () => new Date().toISOString().replace('T', ' ').replace('Z', '');
  const write = (lvl, msg, extra) => {
    const line = { t: ts(), lvl, msg, extra };
    BUCKET.push(line);
    const fn = lvl === 'error' ? console.error : lvl === 'warn' ? console.warn : console.log;
    extra
      ? fn(`[ADMIN] ${lvl.toUpperCase()}: ${msg}`, extra)
      : fn(`[ADMIN] ${lvl.toUpperCase()}: ${msg}`);
  };
  const log = (m, e) => write('info', m, e);
  const warn = (m, e) => write('warn', m, e);
  const error = (m, e) => write('error', m, e);

  // --------- utils ----------
  const safeParse = (s) => {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Where we store the user for Decap/Netlify compatibility
  const USER_KEYS = ['decap-cms-user', 'netlify-cms-user'];
  const STATE_KEYS = [
    'decap-cms:auth:state',
    'netlify-cms:auth:state',
    'decap-cms-auth:state',
    'netlify-cms-auth:state',
  ];

  function persistUser(token) {
    if (!token || typeof token !== 'string') throw new Error('persistUser: empty token');
    const user = {
      token,
      backendName: 'github',
      login: 'github',
      isGuest: false,
    };
    const raw = JSON.stringify(user);
    for (const k of USER_KEYS) {
      localStorage.setItem(k, raw);
    }
    log('persisted user', { keys: USER_KEYS });
    return user;
  }

  function clearPkceState() {
    for (const k of STATE_KEYS) {
      localStorage.removeItem(k);
    }
    log('cleared transient PKCE state', { removed: STATE_KEYS });
  }

  function emitCanonical({ token, state }) {
    try {
      const msg = `authorization:github:success:${JSON.stringify({ token, state })}`;
      window.postMessage(msg, window.location.origin);
      log('re-emitted canonical success string');
    } catch (e) {
      warn('emitCanonical failed (non-fatal)', String(e));
    }
  }

  function dispatchIfPossible(user) {
    const store = window.CMS?.reduxStore || window.CMS?.store || window.CMS?.getStore?.();
    if (!store) {
      warn('no CMS store available yet (will rely on reload)');
      return false;
    }
    try {
      store.dispatch?.({
        type: 'OAUTH_AUTHORIZE_SUCCESS',
        payload: { token: user.token },
      });
      store.dispatch?.({ type: 'LOGIN_SUCCESS', payload: { ...user } });
      log('dispatched LOGIN_SUCCESS to Decap');
      return true;
    } catch (e) {
      warn('dispatch failed (will rely on reload)', String(e));
      return false;
    }
  }

  async function verifyHydration({ attempts = 5, delayMs = 200 } = {}) {
    for (let i = 0; i < attempts; i++) {
      try {
        const tok = await (window.CMS?.getToken?.() ?? Promise.resolve(null));
        if (tok) {
          log('Decap getToken() OK');
          return true;
        }
      } catch (e) {
        warn('getToken threw (retrying)', String(e));
      }
      await sleep(delayMs);
    }
    return false;
  }

  async function navigateToEditor(state = 'pkce') {
    try {
      // Cache-busted, hash-changing hard nav to defeat "same URL" no-op
      const base = '/admin/#/';
      const url = `${base}?flip=${encodeURIComponent(state)}&t=${Date.now()}`;
      log('navigating to editor (hard flip)', { url });
      location.assign(url);

      // Final guard to force transition even if router swallows it
      setTimeout(() => {
        if (!/[?&]flip=/.test(location.href)) {
          log('router no-op detected, forcing reload');
          location.replace(`/admin/#/?flip=${encodeURIComponent(state)}&t=${Date.now()}`);
        }
      }, 150);
    } catch (e) {
      error('navigation failed', String(e));
      location.href = '/admin/#/';
    }
  }

  // ---------- main entry: accept token and flip ----------
  let completionGuard = false;
  async function acceptAndFlipFromToken({ token, state = 'pkce' }) {
    if (completionGuard) return;
    completionGuard = true; // avoid reprocessing repeated posts
    log('accepting token', { haveToken: Boolean(token), state });

    try {
      const user = persistUser(token);
      clearPkceState();

      // Emit canonical in case the bundle is listening to message flow
      emitCanonical({ token, state });

      // Try direct dispatch first; if not possible, rely on fresh boot
      dispatchIfPossible(user);

      // Always navigate for a clean boot (avoids router timing races)
      await sleep(0);
      await navigateToEditor(state);

      // Optional post-nav verification with a short backoff
      const ok = await verifyHydration({ attempts: 6, delayMs: 250 });
      if (!ok) {
        warn('post-nav hydration still null; will rely on Decap LS bootstrap');
      }
    } catch (e) {
      completionGuard = false; // allow retry
      error('acceptAndFlipFromToken failed', String(e));
      const lsUser = {};
      for (const k of USER_KEYS) {
        lsUser[k] = localStorage.getItem(k);
      }
      log('DIAG', {
        url: location.href,
        ls_user: lsUser,
        versions: (() => {
          const lines = [];
          try {
            lines.push(window.__decap_banner || 'decap banner unknown');
          } catch {}
          return lines;
        })(),
      });
    }
  }

  // ---------- helper if you receive the canonical string ----------
  function handleCanonicalAuthString(s) {
    if (typeof s !== 'string') return;
    const pfx = 'authorization:github:success:';
    if (!s.startsWith(pfx)) return;
    try {
      const data = safeParse(s.slice(pfx.length)) || {};
      const token = data.token || data.access_token;
      if (!token) throw new Error('no token in canonical string');
      acceptAndFlipFromToken({ token, state: data.state || 'message' });
    } catch (e) {
      error('handleCanonicalAuthString failed', String(e));
    }
  }

  // ---------- optional rescue: message listeners ----------
  window.addEventListener(
    'message',
    (ev) => {
      if (ev.origin !== location.origin) return;
      if (typeof ev.data === 'string' && ev.data.startsWith('authorization:github:success:')) {
        handleCanonicalAuthString(ev.data);
      } else if (
        ev.data &&
        typeof ev.data === 'object' &&
        ev.data.type === 'authorization:github:success'
      ) {
        const s = `authorization:github:success:${JSON.stringify(ev.data.data || {})}`;
        setTimeout(() => handleCanonicalAuthString(s), 0);
      }
    },
    true
  );

  // Expose for debugging & popup handoff
  window.__acceptAndFlipFromToken = acceptAndFlipFromToken;
  window.__adminLog = BUCKET;
})();
