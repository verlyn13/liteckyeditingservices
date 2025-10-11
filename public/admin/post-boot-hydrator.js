// /public/admin/post-boot-hydrator.js
// Deterministic, safe post-boot hydration helper for Decap CMS.
// Runs only if LS already has a user but Decap hasn't hydrated after navigation.
(() => {
  const getSentry = () => (window.Sentry || window.__sentry || null);
  const bc = (message, data = {}) => {
    try { getSentry()?.addBreadcrumb?.({ category: 'hydr', level: 'info', message, data }); } catch {}
    try { console.info('[HYDR]', message, data); } catch {}
  };
  const cap = (err, ctx) => {
    try { if (err && !err.name) err.name = 'HydratorError'; getSentry()?.captureException?.(err, { extra: ctx || {} }); } catch {}
    try { console.error('[HYDR] ERROR:', err, ctx); } catch {}
  };

  if (window.__decapHydratorRan) return; // single-run guard
  window.__decapHydratorRan = true;

  const LS_KEYS = ['decap-cms-user', 'netlify-cms-user'];
  const readUserFromLS = () => {
    for (const k of LS_KEYS) {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      try {
        const u = JSON.parse(raw);
        if (u && typeof u.token === 'string' && u.token) return { key: k, user: u };
      } catch (e) { cap(e, { phase: 'parse-ls', key: k }); }
    }
    return null;
  };

  const reEmitCanonical = (user) => {
    try {
      const state = localStorage.getItem('decap-cms:auth:state')
        || localStorage.getItem('netlify-cms:auth:state')
        || localStorage.getItem('decap-cms-auth:state')
        || localStorage.getItem('netlify-cms-auth:state')
        || 'hydrator';
      const msg = `authorization:github:success:${JSON.stringify({ token: user.token, state })}`;
      window.postMessage(msg, window.location.origin);
      bc('hydr:re-emit-canonical', { state, tokenPreview: user.token.slice(0, 6) + '…' });
    } catch (e) { cap(e, { phase: 're-emit' }); }
  };

  const manualDispatch = (store, user) => {
    try {
      store.dispatch?.({ type: 'OAUTH_AUTHORIZE_SUCCESS' });
      store.dispatch?.({ type: 'LOGIN_SUCCESS', payload: { token: user.token, backendName: user.backendName || 'github', login: user.login || 'github', isFetching: false } });
      bc('hydr:manual-dispatch', { actions: ['OAUTH_AUTHORIZE_SUCCESS','LOGIN_SUCCESS'] });
    } catch (e) { cap(e, { phase: 'dispatch' }); }
  };

  const getStore = () => (window.CMS && (window.CMS.reduxStore || window.CMS.store || window.CMS.getStore?.())) || null;
  const getToken = async () => (window.CMS?.getToken ? window.CMS.getToken() : null);

  const userEntry = readUserFromLS();
  if (!userEntry) { bc('hydr:no-ls-user'); return; }
  bc('hydr:ls-user-found', { key: userEntry.key, login: userEntry.user.login || 'github' });

  // Phase 1: Wait for Decap store to appear (backoff up to ~6s)
  let attempts = 0;
  const waitForStore = (resolve, reject) => {
    attempts += 1;
    const store = getStore();
    if (store) { bc('hydr:store-available', { attempts }); resolve(store); return; }
    if (attempts > 12) { cap(new Error('Decap store never appeared'), { phase: 'wait-store', attempts }); reject(new Error('no-store')); return; }
    const delay = Math.min(500 * attempts, 1000);
    setTimeout(() => waitForStore(resolve, reject), delay);
  };

  new Promise(waitForStore)
    .then(async (store) => {
      // Phase 2: If already hydrated, nothing to do
      try {
        const tok = await getToken();
        if (tok) { bc('hydr:already-hydrated', { tokenPreview: String(tok).slice(0, 6) + '…' }); return; }
      } catch (e) { cap(e, { phase: 'probe-token' }); }

      // Phase 3: Re-emit canonical success string to trigger listeners
      reEmitCanonical(userEntry.user);
      setTimeout(async () => {
        const tok2 = await getToken();
        if (tok2) { bc('hydr:success-after-reemit', { tokenPreview: String(tok2).slice(0, 6) + '…' }); return; }

        // Phase 4: Manual dispatch
        manualDispatch(store, userEntry.user);
        setTimeout(async () => {
          const tok3 = await getToken();
          if (tok3) { bc('hydr:success-after-dispatch', { tokenPreview: String(tok3).slice(0, 6) + '…' }); return; }

          // Phase 5: One-time soft reload
          bc('hydr:final-soft-reload');
          try { location.reload(); } catch (e) { cap(e, { phase: 'final-reload' }); }
        }, 400);
      }, 300);
    })
    .catch((e) => { cap(e, { phase: 'hydr-root' }); });
})();

