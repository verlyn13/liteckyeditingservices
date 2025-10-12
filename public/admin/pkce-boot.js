(() => {
  if (window.__decapPkceBooted) return;
  window.__decapPkceBooted = true;

  const isAuthUrl = (u) => {
    try {
      const url =
        typeof u === 'string'
          ? new URL(u, location.origin)
          : new URL(u?.href ?? '', location.origin);
      return url.origin === location.origin && url.pathname === '/api/auth';
    } catch {
      return false;
    }
  };

  // Freeze references to real open/assign/replace
  const realOpen = window.open.bind(window);
  const realAssign = window.location.assign.bind(window.location);
  const realReplace = window.location.replace.bind(window.location);

  function wrappedOpen(u, name, features) {
    if (isAuthUrl(u)) {
      // Signal our PKCE launcher should run instead
      window.__decapPendingAuthRequest = true;
      return null; // prevents Decap popup & focus errors
    }
    return realOpen(u, name, features);
  }

  function maybeShortCircuit(url, fn) {
    if (isAuthUrl(url)) {
      window.__decapPendingAuthRequest = true;
      return; // swallow navigation to /api/auth
    }
    return fn(url);
  }

  try {
    Object.defineProperty(window, 'open', {
      configurable: false,
      enumerable: true,
      writable: false,
      value: wrappedOpen,
    });
  } catch {}
  try {
    Window.prototype.open = wrappedOpen;
  } catch {}

  window.location.assign = (url) => maybeShortCircuit(url, realAssign);
  window.location.replace = (url) => maybeShortCircuit(url, realReplace);

  // Save a safe handle for our own popup use
  window.__realWindowOpen = realOpen;
})();
