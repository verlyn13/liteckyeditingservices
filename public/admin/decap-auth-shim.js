(function () {
  // Enable shim only when ?auth_shim=1 is present
  if (!new URLSearchParams(location.search).has('auth_shim')) return;

  // 1) If the object-form arrives first, re-emit the canonical string after a tick
  window.addEventListener('message', function (event) {
    try {
      if (event.origin !== window.location.origin) return;
      var d = event.data;
      if (d && typeof d === 'object' && d.type === 'authorization:github:success' && d.data) {
        var s = "authorization:github:success:" + JSON.stringify(d.data);
        setTimeout(function(){ window.postMessage(s, window.location.origin); }, 50);
      }
    } catch {}
  }, false);

  // 2) If Decap still hasn’t stored the token shortly after the canonical string arrives,
  //    re-emit the same string once more as a last-resort assist (dev-only).
  window.addEventListener('message', function (event) {
    try {
      if (event.origin !== window.location.origin) return;
      if (typeof event.data === 'string' && event.data.startsWith('authorization:github:success:')) {
        setTimeout(async function(){
          try {
            var has = await (window.CMS && window.CMS.getToken ? window.CMS.getToken().then(Boolean) : Promise.resolve(false));
            if (!has) window.postMessage(event.data, window.location.origin);
          } catch {}
        }, 500);
      }
    } catch {}
  }, false);
})();

