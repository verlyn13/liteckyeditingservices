// /public/admin/diagnostics.js
// Admin diagnostics: capture OAuth messages and compare expected state vs message state
(() => {
  try {
    window.__lastAuth = null;

    // ===== Storage write tracer =====
    (function traceStorageWrites() {
      const logWrite = (kind, k, v) => {
        try {
          if (/(cms|netlify).*auth.*state/i.test(String(k))) {
            console.log('[ADMIN DEBUG] STORAGE WRITE', {
              kind,
              key: k,
              value: v,
            });
          }
        } catch {}
      };
      const wrap = (store, kind) => {
        try {
          const _set = store.setItem.bind(store);
          store.setItem = (k, v) => {
            logWrite(kind, k, v);
            return _set(k, v);
          };
        } catch {}
      };
      wrap(window.localStorage, 'localStorage');
      wrap(window.sessionStorage, 'sessionStorage');
    })();

    // ===== State sweeps =====
    function sweepStates(tag) {
      const take = (store, kind) => {
        const out = {};
        try {
          for (let i = 0; i < store.length; i++) {
            const k = store.key(i);
            if (/cms|netlify/i.test(String(k)) && /state/i.test(String(k))) {
              out[`${kind}:${k}`] = store.getItem(k);
            }
          }
        } catch {}
        return out;
      };
      const all = {
        ...take(localStorage, 'LS'),
        ...take(sessionStorage, 'SS'),
      };
      console.log(`[ADMIN DEBUG] ${tag} STATE SWEEP`, all);
      return all;
    }

    // ===== Message listener =====
    window.addEventListener(
      'message',
      (event) => {
        const info = {
          origin: event.origin,
          data: typeof event.data === 'string' ? event.data : { type: typeof event.data },
          type: typeof event.data,
          timestamp: new Date().toISOString(),
        };
        console.log('[ADMIN DEBUG] postMessage received:', info);

        // OAuth string format
        if (
          typeof event.data === 'string' &&
          event.data.startsWith('authorization:github:success:')
        ) {
          console.log('[ADMIN DEBUG] ✅ OAuth message detected!');
          try {
            const payload = JSON.parse(event.data.slice('authorization:github:success:'.length));
            window.__lastAuth = payload;

            const candidates = [
              'netlify-cms-auth:state',
              'decap-cms-auth:state',
              'netlify-cms:auth:state',
              'decap-cms:auth:state',
            ];
            let expected = null;
            for (const k of candidates) {
              expected = expected ?? localStorage.getItem(k);
              expected = expected ?? sessionStorage.getItem(k);
            }
            const sweep = sweepStates('POST-MESSAGE');
            if (expected == null) {
              expected =
                Object.values(sweep).find((v) => v && /^[0-9a-f-]{8,}$/i.test(String(v))) ?? null;
            }

            const messageState = payload?.state ?? null;
            console.log('[ADMIN DEBUG] STATE CHECK', {
              expected,
              messageState,
              match: expected != null && expected === messageState,
            });
          } catch (err) {
            console.warn('[ADMIN DEBUG] parse error', err);
          }
          return;
        }

        // OAuth object format (logged for visibility; acceptance is string-only now)
        if (
          event.data &&
          typeof event.data === 'object' &&
          event.data.type &&
          /authorization:github:success/.test(String(event.data.type))
        ) {
          console.log('[ADMIN DEBUG] ✅ OAuth object message detected!');
          return;
        }
      },
      false
    );

    console.log('[ADMIN DEBUG] Diagnostics listener registered');

    // Log state around login button interactions
    document.addEventListener('click', (e) => {
      try {
        const t = e.target;
        const text = (t && (t.closest('button, a, [role=button]')?.textContent || ''))
          .trim()
          .toLowerCase();
        if (text.includes('github') || text.includes('login')) {
          setTimeout(() => sweepStates('PRE-POPUP'), 0);
        }
      } catch {}
    });

    // Probe: log when Decap opens /api/auth via window.open
    (function probeWindowOpen() {
      try {
        const _open = window.open;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.open = function (...args) {
          try {
            const url = String(args[0]);
            if (url.includes('/api/auth')) {
              console.log('[ADMIN DEBUG] window.open to /api/auth by Decap');
              setTimeout(() => sweepStates('AFTER-window.open(/api/auth)'), 0);
            }
          } catch {}
          // @ts-expect-error
          return _open.apply(this, args);
        };
      } catch {}
    })();

    // Helper: dump Decap user state
    window.__dumpUser = () => {
      const store = window.CMS?.getStore?.();
      const st = store?.getState?.();
      const user = st?.auth?.get ? st.auth.get('user') : st?.auth?.user;
      // @ts-expect-error
      const userJS = user?.toJS?.() ?? user ?? null;
      console.log('[ADMIN DEBUG] Decap user:', userJS);
      console.log(
        '[ADMIN DEBUG] localStorage user:',
        localStorage.getItem('netlify-cms-user') ||
          localStorage.getItem('decap-cms-user') ||
          localStorage.getItem('netlify-cms:user') ||
          localStorage.getItem('decap-cms:user')
      );
    };

    // Diagnostic shim: force accept if state key missing but payload present
    window.__forceAccept = () => {
      try {
        if (!window.__lastAuth?.state) {
          console.warn('[ADMIN DEBUG] No lastAuth to accept.');
          return;
        }
        const state = window.__lastAuth.state;
        const candidateKeys = [
          'netlify-cms-auth:state',
          'decap-cms-auth:state',
          'netlify-cms:auth:state',
          'decap-cms:auth:state',
        ];
        for (const k of candidateKeys) {
          try {
            localStorage.setItem(k, state);
          } catch {}
          try {
            sessionStorage.setItem(k, state);
          } catch {}
        }
        console.log('[ADMIN DEBUG] FORCE SET STATE', { state, candidateKeys });

        const msg =
          'authorization:github:success:' +
          JSON.stringify({
            token: window.__lastAuth.token,
            provider: 'github',
            state,
          });
        window.postMessage(msg, window.location.origin);
        console.log('[ADMIN DEBUG] RE-EMIT DONE');
      } catch (e) {
        console.error('[ADMIN DEBUG] FORCE ACCEPT ERROR', e);
      }
    };
  } catch (_) {
    // no-op
  }
})();
