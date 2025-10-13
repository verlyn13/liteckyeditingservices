// Classic (non-ESM) Sentry instrumentation for /admin
// - Avoids import.meta and inline scripts (CSP-safe)
(() => {
  function readMeta(name) {
    try {
      return document.querySelector(`meta[name="${name}"]`)?.content || '';
    } catch {
      return '';
    }
  }

  const cfg = {
    dsn: readMeta('sentry-dsn') || window.SENTRY_DSN || '',
    environment:
      readMeta('sentry-environment') ||
      window.SENTRY_ENVIRONMENT ||
      (location.hostname === 'localhost' ? 'development' : 'production'),
    release: readMeta('sentry-release') || window.SENTRY_RELEASE || undefined,
  };

  if (!cfg.dsn) {
    try {
      console.warn('[Sentry Admin] DSN not configured; skipping initialization');
    } catch {}
    return;
  }

  function initSentry() {
    if (!window.Sentry) {
      try {
        console.error('[Sentry Admin] Failed to load Sentry SDK');
      } catch {}
      return;
    }
    const Sentry = window.Sentry;
    try {
      Sentry.init({
        dsn: cfg.dsn,
        environment: cfg.environment,
        release: cfg.release,
        tracesSampleRate: 0.2,
        integrations: [
          Sentry.browserTracingIntegration({ enableInp: true }),
          Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
          Sentry.httpClientIntegration({
            failedRequestStatusCodes: [400, 599],
          }),
        ],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        beforeSend: (event) => {
          try {
            const error = event?.exception?.values?.[0];
            const frames = error?.stacktrace?.frames || [];
            for (let i = 0; i < frames.length; i++) {
              const f = frames[i].filename || '';
              if (f.indexOf('chrome-extension://') !== -1 || f.indexOf('moz-extension://') !== -1)
                return null;
            }
          } catch {}
          return event;
        },
      });
      window.__sentry = Sentry; // expose for other admin scripts
      try {
        console.log('[Sentry Admin] Initialized');
      } catch {}
    } catch (e) {
      try {
        console.warn('[Sentry Admin] init error', e);
      } catch {}
    }

    instrumentOAuthFlow();
    instrumentCMSInteractions();
    window.__sentryAdmin = Sentry;
  }

  function instrumentOAuthFlow() {
    const logger = window.Sentry?.logger || console;
    document.addEventListener(
      'click',
      (e) => {
        const btn = e.target?.closest?.('button, [role=button]');
        if (!btn) return;
        const text = (btn.textContent || '').toLowerCase();
        if (text.indexOf('login') !== -1 || text.indexOf('github') !== -1) {
          try {
            window.Sentry?.startSpan?.({ op: 'ui.click', name: 'Admin Login Click' }, () => {
              try {
                logger.info?.('Login button clicked', {
                  buttonText: (btn.textContent || '').trim(),
                });
              } catch {}
              try {
                window.Sentry.addBreadcrumb?.({
                  category: 'auth',
                  message: 'Login initiated',
                  level: 'info',
                });
              } catch {}
            });
          } catch {}
        }
      },
      { capture: true }
    );

    window.addEventListener('message', (ev) => {
      if (ev.origin !== location.origin) return;
      if (typeof ev.data === 'string' && ev.data.indexOf('authorization:github:') === 0) {
        const isSuccess = ev.data.indexOf(':success:') !== -1;
        try {
          window.Sentry?.startSpan?.(
            {
              op: 'auth.oauth',
              name: isSuccess ? 'OAuth Success Message Received' : 'OAuth Message Received',
            },
            () => {
              const level = isSuccess ? 'info' : 'warning';
              try {
                logger[level]?.('OAuth callback message received', {
                  messageType: isSuccess ? 'success' : 'other',
                });
              } catch {}
              try {
                window.Sentry.addBreadcrumb?.({
                  category: 'auth',
                  message: `OAuth ${isSuccess ? 'success' : 'message'}`,
                  level: level,
                });
              } catch {}
            }
          );
        } catch {}
      }
    });
    var originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      try {
        if (key.indexOf('cms-user') !== -1 || key.indexOf('auth:state') !== -1) {
          window.Sentry?.addBreadcrumb?.({
            category: 'storage',
            message: `localStorage.setItem: ${key}`,
            level: 'debug',
            data: { key: key, valueLength: value?.length },
          });
        }
      } catch {}
      return originalSetItem.call(this, key, value);
    };
  }

  function instrumentCMSInteractions() {
    const checkCMS = setInterval(() => {
      if (!window.CMS) return;
      clearInterval(checkCMS);
      const logger = window.Sentry?.logger || console;
      try {
        const store = window.CMS.getStore?.();
        if (store) {
          let previousState = store.getState();
          store.subscribe(() => {
            const currentState = store.getState();
            if (previousState.auth !== currentState.auth) {
              const user = currentState.auth?.user;
              if (user) {
                try {
                  window.Sentry?.setUser?.({
                    id: user.login || 'unknown',
                    username: user.login,
                  });
                } catch {}
                try {
                  logger.info?.('CMS user authenticated', {
                    backend: user.backendName,
                  });
                } catch {}
              } else {
                try {
                  window.Sentry?.setUser?.(null);
                } catch {}
                try {
                  logger.info?.('CMS user logged out');
                } catch {}
              }
            }
            previousState = currentState;
          });
          try {
            logger.info?.('CMS store instrumentation active');
          } catch {}
        }
      } catch (e) {
        try {
          window.Sentry?.captureException?.(e, {
            tags: { component: 'cms-instrumentation' },
          });
        } catch {}
      }
    }, 100);
    setTimeout(() => {
      try {
        clearInterval(checkCMS);
      } catch {}
    }, 10000);
  }

  // Load Sentry SDK (bundled tracing+replay) from CDN
  const script = document.createElement('script');
  script.src = 'https://browser.sentry-cdn.com/8.48.0/bundle.tracing.replay.min.js';
  script.integrity = 'sha384-gdAAufpzRZFoI7KqFiKJljH/2YMTO32L2rZL8rpO7ef1BTD8aJMPwdMiSJkjw/8I';
  script.crossOrigin = 'anonymous';
  script.onload = initSentry;
  script.onerror = function() {
    try {
      console.error('[Sentry Admin] Failed to load Sentry SDK from CDN');
    } catch {}
  };
  document.head.appendChild(script);
})();
