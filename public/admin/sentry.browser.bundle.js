var Sentry = (() => {
  var Da = Object.defineProperty;
  var jg = Object.getOwnPropertyDescriptor;
  var qg = Object.getOwnPropertyNames;
  var Vg = Object.prototype.hasOwnProperty;
  var Pa = (e, t) => {
      for (var n in t) Da(e, n, { get: t[n], enumerable: !0 });
    },
    Yg = (e, t, n, r) => {
      if ((t && typeof t == 'object') || typeof t == 'function')
        for (let o of qg(t))
          !Vg.call(e, o) &&
            o !== n &&
            Da(e, o, { get: () => t[o], enumerable: !(r = jg(t, o)) || r.enumerable });
      return e;
    };
  var Jg = (e) => Yg(Da({}, '__esModule', { value: !0 }), e);
  var cx = {};
  Pa(cx, {
    BrowserClient: () => Mr,
    OpenFeatureIntegrationHook: () => La,
    SDK_VERSION: () => nt,
    SEMANTIC_ATTRIBUTE_SENTRY_OP: () => Se,
    SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN: () => X,
    SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE: () => en,
    SEMANTIC_ATTRIBUTE_SENTRY_SOURCE: () => Ie,
    Scope: () => qe,
    WINDOW: () => O,
    addBreadcrumb: () => Ze,
    addEventProcessor: () => Co,
    addIntegration: () => Er,
    breadcrumbsIntegration: () => Zs,
    browserApiErrorsIntegration: () => Qs,
    browserProfilingIntegration: () => Lg,
    browserSessionIntegration: () => ea,
    browserTracingIntegration: () => hg,
    buildLaunchDarklyFlagUsedHandler: () => Fg,
    captureConsoleIntegration: () => Qc,
    captureEvent: () => on,
    captureException: () => ht,
    captureFeedback: () => Ho,
    captureMessage: () => Rn,
    captureSession: () => yr,
    chromeStackLineParser: () => nl,
    close: () => Cc,
    consoleLoggingIntegration: () => au,
    contextLinesIntegration: () => Am,
    continueTrace: () => hc,
    createConsolaReporter: () => uu,
    createTransport: () => Lo,
    createUserFeedbackEnvelope: () => fm,
    dedupeIntegration: () => Bo,
    defaultRequestInstrumentationOptions: () => gi,
    defaultStackLineParsers: () => ol,
    defaultStackParser: () => Ks,
    diagnoseSdkConnectivity: () => $g,
    endSession: () => Ao,
    eventFiltersIntegration: () => as,
    eventFromException: () => ks,
    eventFromMessage: () => Ns,
    exceptionFromError: () => Nr,
    extraErrorDataIntegration: () => eu,
    featureFlagsIntegration: () => iu,
    feedbackAsyncIntegration: () => Pp,
    feedbackIntegration: () => Ou,
    feedbackSyncIntegration: () => Ou,
    flush: () => xc,
    forceLoad: () => Sm,
    functionToStringIntegration: () => Fo,
    geckoStackLineParser: () => rl,
    getActiveSpan: () => Z,
    getClient: () => b,
    getCurrentScope: () => M,
    getDefaultIntegrations: () => il,
    getFeedback: () => Tp,
    getGlobalScope: () => Dt,
    getIsolationScope: () => se,
    getReplay: () => zh,
    getRootSpan: () => re,
    getSpanDescendants: () => tn,
    getSpanStatusFromHttpCode: () => ki,
    getTraceData: () => Gn,
    globalHandlersIntegration: () => ta,
    graphqlClientIntegration: () => Om,
    httpClientIntegration: () => vm,
    httpContextIntegration: () => na,
    inboundFiltersIntegration: () => Uo,
    init: () => _m,
    instrumentOutgoingRequests: () => ka,
    instrumentSupabaseClient: () => fs,
    isEnabled: () => xo,
    isInitialized: () => Ac,
    lastEventId: () => Ro,
    launchDarklyIntegration: () => Pg,
    lazyLoadIntegration: () => As,
    linkedErrorsIntegration: () => ra,
    logger: () => hs,
    makeBrowserOfflineTransport: () => yg,
    makeFetchTransport: () => Hr,
    makeMultiplexedTransport: () => zc,
    metrics: () => gs,
    moduleMetadataIntegration: () => Zc,
    onLoad: () => ym,
    openFeatureIntegration: () => Ug,
    opera10StackLineParser: () => um,
    opera11StackLineParser: () => lm,
    parameterize: () => is,
    registerSpanErrorInstrumentation: () => So,
    registerWebWorker: () => zg,
    replayCanvasIntegration: () => ig,
    replayIntegration: () => Gh,
    reportPageLoaded: () => _g,
    reportingObserverIntegration: () => Tm,
    rewriteFramesIntegration: () => tu,
    sendFeedback: () => wu,
    setActiveSpanInBrowser: () => Sg,
    setContext: () => wo,
    setCurrentClient: () => rs,
    setExtra: () => Ic,
    setExtras: () => Tc,
    setHttpStatus: () => Yt,
    setMeasurement: () => Eo,
    setTag: () => wc,
    setTags: () => vc,
    setUser: () => Rc,
    showReportDialog: () => Em,
    spanToBaggageHeader: () => ac,
    spanToJSON: () => D,
    spanToTraceHeader: () => go,
    spotlightBrowserIntegration: () => Dg,
    startBrowserTracingNavigationSpan: () => id,
    startBrowserTracingPageLoadSpan: () => od,
    startInactiveSpan: () => st,
    startNewTrace: () => Yi,
    startSession: () => Sr,
    startSpan: () => In,
    startSpanManual: () => mc,
    statsigIntegration: () => Hg,
    supabaseIntegration: () => nu,
    suppressTracing: () => bo,
    thirdPartyErrorFilterIntegration: () => ou,
    unleashIntegration: () => Bg,
    updateSpanName: () => ic,
    webWorkerIntegration: () => Gg,
    winjsStackLineParser: () => cm,
    withActiveSpan: () => vn,
    withIsolationScope: () => Ci,
    withScope: () => ke,
    zodErrorsIntegration: () => ru,
  });
  var y = typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__;
  var v = globalThis;
  var nt = '10.19.0';
  function Ke() {
    return (_n(v), v);
  }
  function _n(e) {
    let t = (e.__SENTRY__ = e.__SENTRY__ || {});
    return ((t.version = t.version || nt), (t[nt] = t[nt] || {}));
  }
  function Ot(e, t, n = v) {
    let r = (n.__SENTRY__ = n.__SENTRY__ || {}),
      o = (r[nt] = r[nt] || {});
    return o[e] || (o[e] = t());
  }
  var Ln = ['debug', 'info', 'warn', 'error', 'log', 'assert', 'trace'],
    Kg = 'Sentry Logger ',
    ir = {};
  function Le(e) {
    if (!('console' in v)) return e();
    let t = v.console,
      n = {},
      r = Object.keys(ir);
    r.forEach((o) => {
      let i = ir[o];
      ((n[o] = t[o]), (t[o] = i));
    });
    try {
      return e();
    } finally {
      r.forEach((o) => {
        t[o] = n[o];
      });
    }
  }
  function Xg() {
    Ua().enabled = !0;
  }
  function Zg() {
    Ua().enabled = !1;
  }
  function dd() {
    return Ua().enabled;
  }
  function Qg(...e) {
    Fa('log', ...e);
  }
  function e_(...e) {
    Fa('warn', ...e);
  }
  function t_(...e) {
    Fa('error', ...e);
  }
  function Fa(e, ...t) {
    y &&
      dd() &&
      Le(() => {
        v.console[e](`${Kg}[${e}]:`, ...t);
      });
  }
  function Ua() {
    return y ? Ot('loggerSettings', () => ({ enabled: !1 })) : { enabled: !1 };
  }
  var h = { enable: Xg, disable: Zg, isEnabled: dd, log: Qg, warn: e_, error: t_ };
  var fd = /\(error: (.*)\)/,
    pd = /captureMessage|captureException/;
  function Ei(...e) {
    let t = e.sort((n, r) => n[0] - r[0]).map((n) => n[1]);
    return (n, r = 0, o = 0) => {
      let i = [],
        s = n.split(`
`);
      for (let a = r; a < s.length; a++) {
        let c = s[a];
        c.length > 1024 && (c = c.slice(0, 1024));
        let u = fd.test(c) ? c.replace(fd, '$1') : c;
        if (!u.match(/\S*Error: /)) {
          for (let d of t) {
            let l = d(u);
            if (l) {
              i.push(l);
              break;
            }
          }
          if (i.length >= 50 + o) break;
        }
      }
      return md(i.slice(o));
    };
  }
  function Ha(e) {
    return Array.isArray(e) ? Ei(...e) : e;
  }
  function md(e) {
    if (!e.length) return [];
    let t = Array.from(e);
    return (
      /sentryWrapped/.test(yi(t).function || '') && t.pop(),
      t.reverse(),
      pd.test(yi(t).function || '') && (t.pop(), pd.test(yi(t).function || '') && t.pop()),
      t
        .slice(0, 50)
        .map((n) => ({ ...n, filename: n.filename || yi(t).filename, function: n.function || '?' }))
    );
  }
  function yi(e) {
    return e[e.length - 1] || {};
  }
  var Ba = '<anonymous>';
  function rt(e) {
    try {
      return !e || typeof e != 'function' ? Ba : e.name || Ba;
    } catch {
      return Ba;
    }
  }
  function sr(e) {
    let t = e.exception;
    if (t) {
      let n = [];
      try {
        return (
          t.values.forEach((r) => {
            r.stacktrace.frames && n.push(...r.stacktrace.frames);
          }),
          n
        );
      } catch {
        return;
      }
    }
  }
  var bi = {},
    hd = {};
  function $e(e, t) {
    ((bi[e] = bi[e] || []), bi[e].push(t));
  }
  function We(e, t) {
    if (!hd[e]) {
      hd[e] = !0;
      try {
        t();
      } catch (n) {
        y && h.error(`Error while instrumenting ${e}`, n);
      }
    }
  }
  function xe(e, t) {
    let n = e && bi[e];
    if (n)
      for (let r of n)
        try {
          r(t);
        } catch (o) {
          y &&
            h.error(
              `Error while triggering instrumentation handler.
Type: ${e}
Name: ${rt(r)}
Error:`,
              o
            );
        }
  }
  var $a = null;
  function io(e) {
    let t = 'error';
    ($e(t, e), We(t, n_));
  }
  function n_() {
    (($a = v.onerror),
      (v.onerror = function (e, t, n, r, o) {
        return (
          xe('error', { column: r, error: o, line: n, msg: e, url: t }),
          $a ? $a.apply(this, arguments) : !1
        );
      }),
      (v.onerror.__SENTRY_INSTRUMENTED__ = !0));
  }
  var Wa = null;
  function so(e) {
    let t = 'unhandledrejection';
    ($e(t, e), We(t, r_));
  }
  function r_() {
    ((Wa = v.onunhandledrejection),
      (v.onunhandledrejection = function (e) {
        return (xe('unhandledrejection', e), Wa ? Wa.apply(this, arguments) : !0);
      }),
      (v.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0));
  }
  var gd = Object.prototype.toString;
  function ot(e) {
    switch (gd.call(e)) {
      case '[object Error]':
      case '[object Exception]':
      case '[object DOMException]':
      case '[object WebAssembly.Exception]':
        return !0;
      default:
        return lt(e, Error);
    }
  }
  function ar(e, t) {
    return gd.call(e) === `[object ${t}]`;
  }
  function Ti(e) {
    return ar(e, 'ErrorEvent');
  }
  function Ii(e) {
    return ar(e, 'DOMError');
  }
  function Ga(e) {
    return ar(e, 'DOMException');
  }
  function De(e) {
    return ar(e, 'String');
  }
  function Sn(e) {
    return (
      typeof e == 'object' &&
      e !== null &&
      '__sentry_template_string__' in e &&
      '__sentry_template_values__' in e
    );
  }
  function bt(e) {
    return e === null || Sn(e) || (typeof e != 'object' && typeof e != 'function');
  }
  function Ge(e) {
    return ar(e, 'Object');
  }
  function Dn(e) {
    return typeof Event < 'u' && lt(e, Event);
  }
  function za(e) {
    return typeof Element < 'u' && lt(e, Element);
  }
  function ja(e) {
    return ar(e, 'RegExp');
  }
  function Tt(e) {
    return !!(e?.then && typeof e.then == 'function');
  }
  function qa(e) {
    return Ge(e) && 'nativeEvent' in e && 'preventDefault' in e && 'stopPropagation' in e;
  }
  function lt(e, t) {
    try {
      return e instanceof t;
    } catch {
      return !1;
    }
  }
  function ao(e) {
    return !!(typeof e == 'object' && e !== null && (e.__isVue || e._isVue));
  }
  function vi(e) {
    return typeof Request < 'u' && lt(e, Request);
  }
  var Va = v,
    o_ = 80;
  function Ce(e, t = {}) {
    if (!e) return '<unknown>';
    try {
      let n = e,
        r = 5,
        o = [],
        i = 0,
        s = 0,
        a = ' > ',
        c = a.length,
        u,
        d = Array.isArray(t) ? t : t.keyAttrs,
        l = (!Array.isArray(t) && t.maxStringLength) || o_;
      for (
        ;
        n &&
        i++ < r &&
        ((u = i_(n, d)), !(u === 'html' || (i > 1 && s + o.length * c + u.length >= l)));

      )
        (o.push(u), (s += u.length), (n = n.parentNode));
      return o.reverse().join(a);
    } catch {
      return '<unknown>';
    }
  }
  function i_(e, t) {
    let n = e,
      r = [];
    if (!n?.tagName) return '';
    if (Va.HTMLElement && n instanceof HTMLElement && n.dataset) {
      if (n.dataset.sentryComponent) return n.dataset.sentryComponent;
      if (n.dataset.sentryElement) return n.dataset.sentryElement;
    }
    r.push(n.tagName.toLowerCase());
    let o = t?.length
      ? t.filter((s) => n.getAttribute(s)).map((s) => [s, n.getAttribute(s)])
      : null;
    if (o?.length)
      o.forEach((s) => {
        r.push(`[${s[0]}="${s[1]}"]`);
      });
    else {
      n.id && r.push(`#${n.id}`);
      let s = n.className;
      if (s && De(s)) {
        let a = s.split(/\s+/);
        for (let c of a) r.push(`.${c}`);
      }
    }
    let i = ['aria-label', 'type', 'name', 'title', 'alt'];
    for (let s of i) {
      let a = n.getAttribute(s);
      a && r.push(`[${s}="${a}"]`);
    }
    return r.join('');
  }
  function Xe() {
    try {
      return Va.document.location.href;
    } catch {
      return '';
    }
  }
  function co(e) {
    if (!Va.HTMLElement) return null;
    let t = e,
      n = 5;
    for (let r = 0; r < n; r++) {
      if (!t) return null;
      if (t instanceof HTMLElement) {
        if (t.dataset.sentryComponent) return t.dataset.sentryComponent;
        if (t.dataset.sentryElement) return t.dataset.sentryElement;
      }
      t = t.parentNode;
    }
    return null;
  }
  function It(e, t = 0) {
    return typeof e != 'string' || t === 0 || e.length <= t ? e : `${e.slice(0, t)}...`;
  }
  function uo(e, t) {
    let n = e,
      r = n.length;
    if (r <= 150) return n;
    t > r && (t = r);
    let o = Math.max(t - 60, 0);
    o < 5 && (o = 0);
    let i = Math.min(o + 140, r);
    return (
      i > r - 5 && (i = r),
      i === r && (o = Math.max(i - 140, 0)),
      (n = n.slice(o, i)),
      o > 0 && (n = `'{snip} ${n}`),
      i < r && (n += ' {snip}'),
      n
    );
  }
  function Pn(e, t) {
    if (!Array.isArray(e)) return '';
    let n = [];
    for (let r = 0; r < e.length; r++) {
      let o = e[r];
      try {
        ao(o) ? n.push('[VueViewModel]') : n.push(String(o));
      } catch {
        n.push('[value cannot be serialized]');
      }
    }
    return n.join(t);
  }
  function cr(e, t, n = !1) {
    return De(e) ? (ja(t) ? t.test(e) : De(t) ? (n ? e === t : e.includes(t)) : !1) : !1;
  }
  function Ue(e, t = [], n = !1) {
    return t.some((r) => cr(e, r, n));
  }
  function be(e, t, n) {
    if (!(t in e)) return;
    let r = e[t];
    if (typeof r != 'function') return;
    let o = n(r);
    typeof o == 'function' && wi(o, r);
    try {
      e[t] = o;
    } catch {
      y && h.log(`Failed to replace method "${t}" in object`, e);
    }
  }
  function he(e, t, n) {
    try {
      Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 });
    } catch {
      y && h.log(`Failed to add non-enumerable property "${t}" to object`, e);
    }
  }
  function wi(e, t) {
    try {
      let n = t.prototype || {};
      ((e.prototype = t.prototype = n), he(e, '__sentry_original__', t));
    } catch {}
  }
  function Fn(e) {
    return e.__sentry_original__;
  }
  function Ri(e) {
    if (ot(e)) return { message: e.message, name: e.name, stack: e.stack, ...Sd(e) };
    if (Dn(e)) {
      let t = { type: e.type, target: _d(e.target), currentTarget: _d(e.currentTarget), ...Sd(e) };
      return (typeof CustomEvent < 'u' && lt(e, CustomEvent) && (t.detail = e.detail), t);
    } else return e;
  }
  function _d(e) {
    try {
      return za(e) ? Ce(e) : Object.prototype.toString.call(e);
    } catch {
      return '<unknown>';
    }
  }
  function Sd(e) {
    if (typeof e == 'object' && e !== null) {
      let t = {};
      for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
      return t;
    } else return {};
  }
  function Ya(e, t = 40) {
    let n = Object.keys(Ri(e));
    n.sort();
    let r = n[0];
    if (!r) return '[object has no keys]';
    if (r.length >= t) return It(r, t);
    for (let o = n.length; o > 0; o--) {
      let i = n.slice(0, o).join(', ');
      if (!(i.length > t)) return o === n.length ? i : It(i, t);
    }
    return '';
  }
  function s_() {
    let e = v;
    return e.crypto || e.msCrypto;
  }
  function ge(e = s_()) {
    let t = () => Math.random() * 16;
    try {
      if (e?.randomUUID) return e.randomUUID().replace(/-/g, '');
      e?.getRandomValues &&
        (t = () => {
          let n = new Uint8Array(1);
          return (e.getRandomValues(n), n[0]);
        });
    } catch {}
    return ('10000000100040008000' + 1e11).replace(/[018]/g, (n) =>
      (n ^ ((t() & 15) >> (n / 4))).toString(16)
    );
  }
  function yd(e) {
    return e.exception?.values?.[0];
  }
  function jt(e) {
    let { message: t, event_id: n } = e;
    if (t) return t;
    let r = yd(e);
    return r
      ? r.type && r.value
        ? `${r.type}: ${r.value}`
        : r.type || r.value || n || '<unknown>'
      : n || '<unknown>';
  }
  function ur(e, t, n) {
    let r = (e.exception = e.exception || {}),
      o = (r.values = r.values || []),
      i = (o[0] = o[0] || {});
    (i.value || (i.value = t || ''), i.type || (i.type = n || 'Error'));
  }
  function ze(e, t) {
    let n = yd(e);
    if (!n) return;
    let r = { type: 'generic', handled: !0 },
      o = n.mechanism;
    if (((n.mechanism = { ...r, ...o, ...t }), t && 'data' in t)) {
      let i = { ...o?.data, ...t.data };
      n.mechanism.data = i;
    }
  }
  function Ja(e, t, n = 5) {
    if (t.lineno === void 0) return;
    let r = e.length,
      o = Math.max(Math.min(r - 1, t.lineno - 1), 0);
    t.pre_context = e.slice(Math.max(0, o - n), o).map((s) => uo(s, 0));
    let i = Math.min(r - 1, o);
    ((t.context_line = uo(e[i], t.colno || 0)),
      (t.post_context = e.slice(Math.min(o + 1, r), o + 1 + n).map((s) => uo(s, 0))));
  }
  function xi(e) {
    if (a_(e)) return !0;
    try {
      he(e, '__sentry_captured__', !0);
    } catch {}
    return !1;
  }
  function a_(e) {
    try {
      return e.__sentry_captured__;
    } catch {}
  }
  var bd = 1e3;
  function dt() {
    return Date.now() / bd;
  }
  function c_() {
    let { performance: e } = v;
    if (!e?.now || !e.timeOrigin) return dt;
    let t = e.timeOrigin;
    return () => (t + e.now()) / bd;
  }
  var Ed;
  function K() {
    return (Ed ?? (Ed = c_()))();
  }
  var Ka;
  function u_() {
    let { performance: e } = v;
    if (!e?.now) return [void 0, 'none'];
    let t = 3600 * 1e3,
      n = e.now(),
      r = Date.now(),
      o = e.timeOrigin ? Math.abs(e.timeOrigin + n - r) : t,
      i = o < t,
      s = e.timing?.navigationStart,
      c = typeof s == 'number' ? Math.abs(s + n - r) : t,
      u = c < t;
    return i || u
      ? o <= c
        ? [e.timeOrigin, 'timeOrigin']
        : [s, 'navigationStart']
      : [r, 'dateNow'];
  }
  function _e() {
    return (Ka || (Ka = u_()), Ka[0]);
  }
  function Td(e) {
    let t = K(),
      n = {
        sid: ge(),
        init: !0,
        timestamp: t,
        started: t,
        duration: 0,
        status: 'ok',
        errors: 0,
        ignoreDuration: !1,
        toJSON: () => l_(n),
      };
    return (e && Qt(n, e), n);
  }
  function Qt(e, t = {}) {
    if (
      (t.user &&
        (!e.ipAddress && t.user.ip_address && (e.ipAddress = t.user.ip_address),
        !e.did && !t.did && (e.did = t.user.id || t.user.email || t.user.username)),
      (e.timestamp = t.timestamp || K()),
      t.abnormal_mechanism && (e.abnormal_mechanism = t.abnormal_mechanism),
      t.ignoreDuration && (e.ignoreDuration = t.ignoreDuration),
      t.sid && (e.sid = t.sid.length === 32 ? t.sid : ge()),
      t.init !== void 0 && (e.init = t.init),
      !e.did && t.did && (e.did = `${t.did}`),
      typeof t.started == 'number' && (e.started = t.started),
      e.ignoreDuration)
    )
      e.duration = void 0;
    else if (typeof t.duration == 'number') e.duration = t.duration;
    else {
      let n = e.timestamp - e.started;
      e.duration = n >= 0 ? n : 0;
    }
    (t.release && (e.release = t.release),
      t.environment && (e.environment = t.environment),
      !e.ipAddress && t.ipAddress && (e.ipAddress = t.ipAddress),
      !e.userAgent && t.userAgent && (e.userAgent = t.userAgent),
      typeof t.errors == 'number' && (e.errors = t.errors),
      t.status && (e.status = t.status));
  }
  function Id(e, t) {
    let n = {};
    (t ? (n = { status: t }) : e.status === 'ok' && (n = { status: 'exited' }), Qt(e, n));
  }
  function l_(e) {
    return {
      sid: `${e.sid}`,
      init: e.init,
      started: new Date(e.started * 1e3).toISOString(),
      timestamp: new Date(e.timestamp * 1e3).toISOString(),
      status: e.status,
      errors: e.errors,
      did: typeof e.did == 'number' || typeof e.did == 'string' ? `${e.did}` : void 0,
      duration: e.duration,
      abnormal_mechanism: e.abnormal_mechanism,
      attrs: {
        release: e.release,
        environment: e.environment,
        ip_address: e.ipAddress,
        user_agent: e.userAgent,
      },
    };
  }
  function yn(e, t, n = 2) {
    if (!t || typeof t != 'object' || n <= 0) return t;
    if (e && Object.keys(t).length === 0) return e;
    let r = { ...e };
    for (let o in t) Object.prototype.hasOwnProperty.call(t, o) && (r[o] = yn(r[o], t[o], n - 1));
    return r;
  }
  function Be() {
    return ge();
  }
  function je() {
    return ge().substring(16);
  }
  var Xa = '_sentrySpan';
  function it(e, t) {
    t ? he(e, Xa, t) : delete e[Xa];
  }
  function Lt(e) {
    return e[Xa];
  }
  var d_ = 100,
    qe = class e {
      constructor() {
        ((this._notifyingListeners = !1),
          (this._scopeListeners = []),
          (this._eventProcessors = []),
          (this._breadcrumbs = []),
          (this._attachments = []),
          (this._user = {}),
          (this._tags = {}),
          (this._extra = {}),
          (this._contexts = {}),
          (this._sdkProcessingMetadata = {}),
          (this._propagationContext = { traceId: Be(), sampleRand: Math.random() }));
      }
      clone() {
        let t = new e();
        return (
          (t._breadcrumbs = [...this._breadcrumbs]),
          (t._tags = { ...this._tags }),
          (t._extra = { ...this._extra }),
          (t._contexts = { ...this._contexts }),
          this._contexts.flags &&
            (t._contexts.flags = { values: [...this._contexts.flags.values] }),
          (t._user = this._user),
          (t._level = this._level),
          (t._session = this._session),
          (t._transactionName = this._transactionName),
          (t._fingerprint = this._fingerprint),
          (t._eventProcessors = [...this._eventProcessors]),
          (t._attachments = [...this._attachments]),
          (t._sdkProcessingMetadata = { ...this._sdkProcessingMetadata }),
          (t._propagationContext = { ...this._propagationContext }),
          (t._client = this._client),
          (t._lastEventId = this._lastEventId),
          it(t, Lt(this)),
          t
        );
      }
      setClient(t) {
        this._client = t;
      }
      setLastEventId(t) {
        this._lastEventId = t;
      }
      getClient() {
        return this._client;
      }
      lastEventId() {
        return this._lastEventId;
      }
      addScopeListener(t) {
        this._scopeListeners.push(t);
      }
      addEventProcessor(t) {
        return (this._eventProcessors.push(t), this);
      }
      setUser(t) {
        return (
          (this._user = t || { email: void 0, id: void 0, ip_address: void 0, username: void 0 }),
          this._session && Qt(this._session, { user: t }),
          this._notifyScopeListeners(),
          this
        );
      }
      getUser() {
        return this._user;
      }
      setTags(t) {
        return ((this._tags = { ...this._tags, ...t }), this._notifyScopeListeners(), this);
      }
      setTag(t, n) {
        return ((this._tags = { ...this._tags, [t]: n }), this._notifyScopeListeners(), this);
      }
      setExtras(t) {
        return ((this._extra = { ...this._extra, ...t }), this._notifyScopeListeners(), this);
      }
      setExtra(t, n) {
        return ((this._extra = { ...this._extra, [t]: n }), this._notifyScopeListeners(), this);
      }
      setFingerprint(t) {
        return ((this._fingerprint = t), this._notifyScopeListeners(), this);
      }
      setLevel(t) {
        return ((this._level = t), this._notifyScopeListeners(), this);
      }
      setTransactionName(t) {
        return ((this._transactionName = t), this._notifyScopeListeners(), this);
      }
      setContext(t, n) {
        return (
          n === null ? delete this._contexts[t] : (this._contexts[t] = n),
          this._notifyScopeListeners(),
          this
        );
      }
      setSession(t) {
        return (t ? (this._session = t) : delete this._session, this._notifyScopeListeners(), this);
      }
      getSession() {
        return this._session;
      }
      update(t) {
        if (!t) return this;
        let n = typeof t == 'function' ? t(this) : t,
          r = n instanceof e ? n.getScopeData() : Ge(n) ? t : void 0,
          {
            tags: o,
            extra: i,
            user: s,
            contexts: a,
            level: c,
            fingerprint: u = [],
            propagationContext: d,
          } = r || {};
        return (
          (this._tags = { ...this._tags, ...o }),
          (this._extra = { ...this._extra, ...i }),
          (this._contexts = { ...this._contexts, ...a }),
          s && Object.keys(s).length && (this._user = s),
          c && (this._level = c),
          u.length && (this._fingerprint = u),
          d && (this._propagationContext = d),
          this
        );
      }
      clear() {
        return (
          (this._breadcrumbs = []),
          (this._tags = {}),
          (this._extra = {}),
          (this._user = {}),
          (this._contexts = {}),
          (this._level = void 0),
          (this._transactionName = void 0),
          (this._fingerprint = void 0),
          (this._session = void 0),
          it(this, void 0),
          (this._attachments = []),
          this.setPropagationContext({ traceId: Be(), sampleRand: Math.random() }),
          this._notifyScopeListeners(),
          this
        );
      }
      addBreadcrumb(t, n) {
        let r = typeof n == 'number' ? n : d_;
        if (r <= 0) return this;
        let o = { timestamp: dt(), ...t, message: t.message ? It(t.message, 2048) : t.message };
        return (
          this._breadcrumbs.push(o),
          this._breadcrumbs.length > r &&
            ((this._breadcrumbs = this._breadcrumbs.slice(-r)),
            this._client?.recordDroppedEvent('buffer_overflow', 'log_item')),
          this._notifyScopeListeners(),
          this
        );
      }
      getLastBreadcrumb() {
        return this._breadcrumbs[this._breadcrumbs.length - 1];
      }
      clearBreadcrumbs() {
        return ((this._breadcrumbs = []), this._notifyScopeListeners(), this);
      }
      addAttachment(t) {
        return (this._attachments.push(t), this);
      }
      clearAttachments() {
        return ((this._attachments = []), this);
      }
      getScopeData() {
        return {
          breadcrumbs: this._breadcrumbs,
          attachments: this._attachments,
          contexts: this._contexts,
          tags: this._tags,
          extra: this._extra,
          user: this._user,
          level: this._level,
          fingerprint: this._fingerprint || [],
          eventProcessors: this._eventProcessors,
          propagationContext: this._propagationContext,
          sdkProcessingMetadata: this._sdkProcessingMetadata,
          transactionName: this._transactionName,
          span: Lt(this),
        };
      }
      setSDKProcessingMetadata(t) {
        return ((this._sdkProcessingMetadata = yn(this._sdkProcessingMetadata, t, 2)), this);
      }
      setPropagationContext(t) {
        return ((this._propagationContext = t), this);
      }
      getPropagationContext() {
        return this._propagationContext;
      }
      captureException(t, n) {
        let r = n?.event_id || ge();
        if (!this._client)
          return (y && h.warn('No client configured on scope - will not capture exception!'), r);
        let o = new Error('Sentry syntheticException');
        return (
          this._client.captureException(
            t,
            { originalException: t, syntheticException: o, ...n, event_id: r },
            this
          ),
          r
        );
      }
      captureMessage(t, n, r) {
        let o = r?.event_id || ge();
        if (!this._client)
          return (y && h.warn('No client configured on scope - will not capture message!'), o);
        let i = new Error(t);
        return (
          this._client.captureMessage(
            t,
            n,
            { originalException: t, syntheticException: i, ...r, event_id: o },
            this
          ),
          o
        );
      }
      captureEvent(t, n) {
        let r = n?.event_id || ge();
        return this._client
          ? (this._client.captureEvent(t, { ...n, event_id: r }, this), r)
          : (y && h.warn('No client configured on scope - will not capture event!'), r);
      }
      _notifyScopeListeners() {
        this._notifyingListeners ||
          ((this._notifyingListeners = !0),
          this._scopeListeners.forEach((t) => {
            t(this);
          }),
          (this._notifyingListeners = !1));
      }
    };
  function vd() {
    return Ot('defaultCurrentScope', () => new qe());
  }
  function wd() {
    return Ot('defaultIsolationScope', () => new qe());
  }
  var Za = class {
    constructor(t, n) {
      let r;
      t ? (r = t) : (r = new qe());
      let o;
      (n ? (o = n) : (o = new qe()), (this._stack = [{ scope: r }]), (this._isolationScope = o));
    }
    withScope(t) {
      let n = this._pushScope(),
        r;
      try {
        r = t(n);
      } catch (o) {
        throw (this._popScope(), o);
      }
      return Tt(r)
        ? r.then(
            (o) => (this._popScope(), o),
            (o) => {
              throw (this._popScope(), o);
            }
          )
        : (this._popScope(), r);
    }
    getClient() {
      return this.getStackTop().client;
    }
    getScope() {
      return this.getStackTop().scope;
    }
    getIsolationScope() {
      return this._isolationScope;
    }
    getStackTop() {
      return this._stack[this._stack.length - 1];
    }
    _pushScope() {
      let t = this.getScope().clone();
      return (this._stack.push({ client: this.getClient(), scope: t }), t);
    }
    _popScope() {
      return this._stack.length <= 1 ? !1 : !!this._stack.pop();
    }
  };
  function lr() {
    let e = Ke(),
      t = _n(e);
    return (t.stack = t.stack || new Za(vd(), wd()));
  }
  function f_(e) {
    return lr().withScope(e);
  }
  function p_(e, t) {
    let n = lr();
    return n.withScope(() => ((n.getStackTop().scope = e), t(e)));
  }
  function Rd(e) {
    return lr().withScope(() => e(lr().getIsolationScope()));
  }
  function xd() {
    return {
      withIsolationScope: Rd,
      withScope: f_,
      withSetScope: p_,
      withSetIsolationScope: (e, t) => Rd(t),
      getCurrentScope: () => lr().getScope(),
      getIsolationScope: () => lr().getIsolationScope(),
    };
  }
  function vt(e) {
    let t = _n(e);
    return t.acs ? t.acs : xd();
  }
  function M() {
    let e = Ke();
    return vt(e).getCurrentScope();
  }
  function se() {
    let e = Ke();
    return vt(e).getIsolationScope();
  }
  function Dt() {
    return Ot('globalScope', () => new qe());
  }
  function ke(...e) {
    let t = Ke(),
      n = vt(t);
    if (e.length === 2) {
      let [r, o] = e;
      return r ? n.withSetScope(r, o) : n.withScope(o);
    }
    return n.withScope(e[0]);
  }
  function Ci(...e) {
    let t = Ke(),
      n = vt(t);
    if (e.length === 2) {
      let [r, o] = e;
      return r ? n.withSetIsolationScope(r, o) : n.withIsolationScope(o);
    }
    return n.withIsolationScope(e[0]);
  }
  function b() {
    return M().getClient();
  }
  function Ai(e) {
    let t = e.getPropagationContext(),
      { traceId: n, parentSpanId: r, propagationSpanId: o } = t,
      i = { trace_id: n, span_id: o || je() };
    return (r && (i.parent_span_id = r), i);
  }
  var Ie = 'sentry.source',
    en = 'sentry.sample_rate',
    lo = 'sentry.previous_trace_sample_rate',
    Se = 'sentry.op',
    X = 'sentry.origin',
    En = 'sentry.idle_span_finish_reason',
    qt = 'sentry.measurement_unit',
    Vt = 'sentry.measurement_value',
    dr = 'sentry.custom_span_name',
    fr = 'sentry.profile_id',
    wt = 'sentry.exclusive_time';
  var Qa = 'http.request.method',
    ec = 'url.full',
    tc = 'sentry.link.type';
  function ki(e) {
    if (e < 400 && e >= 100) return { code: 1 };
    if (e >= 400 && e < 500)
      switch (e) {
        case 401:
          return { code: 2, message: 'unauthenticated' };
        case 403:
          return { code: 2, message: 'permission_denied' };
        case 404:
          return { code: 2, message: 'not_found' };
        case 409:
          return { code: 2, message: 'already_exists' };
        case 413:
          return { code: 2, message: 'failed_precondition' };
        case 429:
          return { code: 2, message: 'resource_exhausted' };
        case 499:
          return { code: 2, message: 'cancelled' };
        default:
          return { code: 2, message: 'invalid_argument' };
      }
    if (e >= 500 && e < 600)
      switch (e) {
        case 501:
          return { code: 2, message: 'unimplemented' };
        case 503:
          return { code: 2, message: 'unavailable' };
        case 504:
          return { code: 2, message: 'deadline_exceeded' };
        default:
          return { code: 2, message: 'internal_error' };
      }
    return { code: 2, message: 'unknown_error' };
  }
  function Yt(e, t) {
    e.setAttribute('http.response.status_code', t);
    let n = ki(t);
    n.message !== 'unknown_error' && e.setStatus(n);
  }
  var Cd = '_sentryScope',
    Ad = '_sentryIsolationScope';
  function m_(e) {
    try {
      let t = v.WeakRef;
      if (typeof t == 'function') return new t(e);
    } catch {}
    return e;
  }
  function h_(e) {
    if (e) {
      if (typeof e == 'object' && 'deref' in e && typeof e.deref == 'function')
        try {
          return e.deref();
        } catch {
          return;
        }
      return e;
    }
  }
  function kd(e, t, n) {
    e && (he(e, Ad, m_(n)), he(e, Cd, t));
  }
  function Un(e) {
    let t = e;
    return { scope: t[Cd], isolationScope: h_(t[Ad]) };
  }
  var Ni = 'sentry-',
    g_ = /^sentry-/,
    __ = 8192;
  function pr(e) {
    let t = S_(e);
    if (!t) return;
    let n = Object.entries(t).reduce((r, [o, i]) => {
      if (o.match(g_)) {
        let s = o.slice(Ni.length);
        r[s] = i;
      }
      return r;
    }, {});
    if (Object.keys(n).length > 0) return n;
  }
  function Mi(e) {
    if (!e) return;
    let t = Object.entries(e).reduce((n, [r, o]) => (o && (n[`${Ni}${r}`] = o), n), {});
    return y_(t);
  }
  function S_(e) {
    if (!(!e || (!De(e) && !Array.isArray(e))))
      return Array.isArray(e)
        ? e.reduce((t, n) => {
            let r = Nd(n);
            return (
              Object.entries(r).forEach(([o, i]) => {
                t[o] = i;
              }),
              t
            );
          }, {})
        : Nd(e);
  }
  function Nd(e) {
    return e
      .split(',')
      .map((t) => {
        let n = t.indexOf('=');
        if (n === -1) return [];
        let r = t.slice(0, n),
          o = t.slice(n + 1);
        return [r, o].map((i) => {
          try {
            return decodeURIComponent(i.trim());
          } catch {
            return;
          }
        });
      })
      .reduce((t, [n, r]) => (n && r && (t[n] = r), t), {});
  }
  function y_(e) {
    if (Object.keys(e).length !== 0)
      return Object.entries(e).reduce((t, [n, r], o) => {
        let i = `${encodeURIComponent(n)}=${encodeURIComponent(r)}`,
          s = o === 0 ? i : `${t},${i}`;
        return s.length > __
          ? (y &&
              h.warn(
                `Not adding key: ${n} with val: ${r} to baggage header due to exceeding baggage size limits.`
              ),
            t)
          : s;
      }, '');
  }
  var E_ = /^o(\d+)\./,
    b_ = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
  function T_(e) {
    return e === 'http' || e === 'https';
  }
  function Ve(e, t = !1) {
    let { host: n, path: r, pass: o, port: i, projectId: s, protocol: a, publicKey: c } = e;
    return `${a}://${c}${t && o ? `:${o}` : ''}@${n}${i ? `:${i}` : ''}/${r && `${r}/`}${s}`;
  }
  function Oi(e) {
    let t = b_.exec(e);
    if (!t) {
      Le(() => {
        console.error(`Invalid Sentry Dsn: ${e}`);
      });
      return;
    }
    let [n, r, o = '', i = '', s = '', a = ''] = t.slice(1),
      c = '',
      u = a,
      d = u.split('/');
    if ((d.length > 1 && ((c = d.slice(0, -1).join('/')), (u = d.pop())), u)) {
      let l = u.match(/^\d+/);
      l && (u = l[0]);
    }
    return Md({ host: i, pass: o, path: c, projectId: u, port: s, protocol: n, publicKey: r });
  }
  function Md(e) {
    return {
      protocol: e.protocol,
      publicKey: e.publicKey || '',
      pass: e.pass || '',
      host: e.host,
      port: e.port || '',
      path: e.path || '',
      projectId: e.projectId,
    };
  }
  function I_(e) {
    if (!y) return !0;
    let { port: t, projectId: n, protocol: r } = e;
    return ['protocol', 'publicKey', 'host', 'projectId'].find((s) =>
      e[s] ? !1 : (h.error(`Invalid Sentry Dsn: ${s} missing`), !0)
    )
      ? !1
      : n.match(/^\d+$/)
        ? T_(r)
          ? t && isNaN(parseInt(t, 10))
            ? (h.error(`Invalid Sentry Dsn: Invalid port ${t}`), !1)
            : !0
          : (h.error(`Invalid Sentry Dsn: Invalid protocol ${r}`), !1)
        : (h.error(`Invalid Sentry Dsn: Invalid projectId ${n}`), !1);
  }
  function v_(e) {
    return e.match(E_)?.[1];
  }
  function Li(e) {
    let t = e.getOptions(),
      { host: n } = e.getDsn() || {},
      r;
    return (t.orgId ? (r = String(t.orgId)) : n && (r = v_(n)), r);
  }
  function fo(e) {
    let t = typeof e == 'string' ? Oi(e) : Md(e);
    if (!(!t || !I_(t))) return t;
  }
  function ft(e) {
    if (typeof e == 'boolean') return Number(e);
    let t = typeof e == 'string' ? parseFloat(e) : e;
    if (!(typeof t != 'number' || isNaN(t) || t < 0 || t > 1)) return t;
  }
  var Di = new RegExp('^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$');
  function Od(e) {
    if (!e) return;
    let t = e.match(Di);
    if (!t) return;
    let n;
    return (
      t[3] === '1' ? (n = !0) : t[3] === '0' && (n = !1),
      { traceId: t[1], parentSampled: n, parentSpanId: t[2] }
    );
  }
  function po(e, t) {
    let n = Od(e),
      r = pr(t);
    if (!n?.traceId) return { traceId: Be(), sampleRand: Math.random() };
    let o = w_(n, r);
    r && (r.sample_rand = o.toString());
    let { traceId: i, parentSpanId: s, parentSampled: a } = n;
    return { traceId: i, parentSpanId: s, sampled: a, dsc: r || {}, sampleRand: o };
  }
  function mo(e = Be(), t = je(), n) {
    let r = '';
    return (n !== void 0 && (r = n ? '-1' : '-0'), `${e}-${t}${r}`);
  }
  function Pi(e = Be(), t = je(), n) {
    return `00-${e}-${t}-${n ? '01' : '00'}`;
  }
  function w_(e, t) {
    let n = ft(t?.sample_rand);
    if (n !== void 0) return n;
    let r = ft(t?.sample_rate);
    return r && e?.parentSampled !== void 0
      ? e.parentSampled
        ? Math.random() * r
        : r + Math.random() * (1 - r)
      : Math.random();
  }
  function nc(e, t) {
    let n = Li(e);
    return t && n && t !== n
      ? (h.log(
          `Won't continue trace because org IDs don't match (incoming baggage: ${t}, SDK options: ${n})`
        ),
        !1)
      : (e.getOptions().strictTraceContinuation || !1) && ((t && !n) || (!t && n))
        ? (h.log(
            `Starting a new trace because strict trace continuation is enabled but one org ID is missing (incoming baggage: ${t}, Sentry client: ${n})`
          ),
          !1)
        : !0;
  }
  var Fi = 0,
    Ui = 1,
    Ld = !1;
  function Pd(e) {
    let { spanId: t, traceId: n } = e.spanContext(),
      { data: r, op: o, parent_span_id: i, status: s, origin: a, links: c } = D(e);
    return {
      parent_span_id: i,
      span_id: t,
      trace_id: n,
      data: r,
      op: o,
      status: s,
      origin: a,
      links: c,
    };
  }
  function ho(e) {
    let { spanId: t, traceId: n, isRemote: r } = e.spanContext(),
      o = r ? t : D(e).parent_span_id,
      i = Un(e).scope,
      s = r ? i?.getPropagationContext().propagationSpanId || je() : t;
    return { parent_span_id: o, span_id: s, trace_id: n };
  }
  function go(e) {
    let { traceId: t, spanId: n } = e.spanContext(),
      r = pt(e);
    return mo(t, n, r);
  }
  function Fd(e) {
    let { traceId: t, spanId: n } = e.spanContext(),
      r = pt(e);
    return Pi(t, n, r);
  }
  function Bi(e) {
    if (e && e.length > 0)
      return e.map(
        ({ context: { spanId: t, traceId: n, traceFlags: r, ...o }, attributes: i }) => ({
          span_id: t,
          trace_id: n,
          sampled: r === Ui,
          attributes: i,
          ...o,
        })
      );
  }
  function Pt(e) {
    return typeof e == 'number'
      ? Dd(e)
      : Array.isArray(e)
        ? e[0] + e[1] / 1e9
        : e instanceof Date
          ? Dd(e.getTime())
          : K();
  }
  function Dd(e) {
    return e > 9999999999 ? e / 1e3 : e;
  }
  function D(e) {
    if (C_(e)) return e.getSpanJSON();
    let { spanId: t, traceId: n } = e.spanContext();
    if (x_(e)) {
      let { attributes: r, startTime: o, name: i, endTime: s, status: a, links: c } = e,
        u =
          'parentSpanId' in e
            ? e.parentSpanId
            : 'parentSpanContext' in e
              ? e.parentSpanContext?.spanId
              : void 0;
      return {
        span_id: t,
        trace_id: n,
        data: r,
        description: i,
        parent_span_id: u,
        start_timestamp: Pt(o),
        timestamp: Pt(s) || void 0,
        status: Hi(a),
        op: r[Se],
        origin: r[X],
        links: Bi(c),
      };
    }
    return { span_id: t, trace_id: n, start_timestamp: 0, data: {} };
  }
  function x_(e) {
    let t = e;
    return !!t.attributes && !!t.startTime && !!t.name && !!t.endTime && !!t.status;
  }
  function C_(e) {
    return typeof e.getSpanJSON == 'function';
  }
  function pt(e) {
    let { traceFlags: t } = e.spanContext();
    return t === Ui;
  }
  function Hi(e) {
    if (!(!e || e.code === 0)) return e.code === 1 ? 'ok' : e.message || 'unknown_error';
  }
  var Bn = '_sentryChildSpans',
    rc = '_sentryRootSpan';
  function $i(e, t) {
    let n = e[rc] || e;
    (he(t, rc, n), e[Bn] ? e[Bn].add(t) : he(e, Bn, new Set([t])));
  }
  function Ud(e, t) {
    e[Bn] && e[Bn].delete(t);
  }
  function tn(e) {
    let t = new Set();
    function n(r) {
      if (!t.has(r) && pt(r)) {
        t.add(r);
        let o = r[Bn] ? Array.from(r[Bn]) : [];
        for (let i of o) n(i);
      }
    }
    return (n(e), Array.from(t));
  }
  function re(e) {
    return e[rc] || e;
  }
  function Z() {
    let e = Ke(),
      t = vt(e);
    return t.getActiveSpan ? t.getActiveSpan() : Lt(M());
  }
  function _o() {
    Ld ||
      (Le(() => {
        console.warn(
          '[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`.'
        );
      }),
      (Ld = !0));
  }
  function ic(e, t) {
    (e.updateName(t), e.setAttributes({ [Ie]: 'custom', [dr]: t }));
  }
  var Bd = !1;
  function So() {
    if (Bd) return;
    function e() {
      let t = Z(),
        n = t && re(t);
      if (n) {
        let r = 'internal_error';
        (y && h.log(`[Tracing] Root span: ${r} -> Global error occurred`),
          n.setStatus({ code: 2, message: r }));
      }
    }
    ((e.tag = 'sentry_tracingErrorCallback'), (Bd = !0), io(e), so(e));
  }
  function Ne(e) {
    if (typeof __SENTRY_TRACING__ == 'boolean' && !__SENTRY_TRACING__) return !1;
    let t = e || b()?.getOptions();
    return !!t && (t.tracesSampleRate != null || !!t.tracesSampler);
  }
  function Hd(e) {
    h.log(`Ignoring span ${e.op} - ${e.description} because it matches \`ignoreSpans\`.`);
  }
  function Hn(e, t) {
    if (!t?.length || !e.description) return !1;
    for (let n of t) {
      if (A_(n)) {
        if (cr(e.description, n)) return (y && Hd(e), !0);
        continue;
      }
      if (!n.name && !n.op) continue;
      let r = n.name ? cr(e.description, n.name) : !0,
        o = n.op ? e.op && cr(e.op, n.op) : !0;
      if (r && o) return (y && Hd(e), !0);
    }
    return !1;
  }
  function $d(e, t) {
    let n = t.parent_span_id,
      r = t.span_id;
    if (n) for (let o of e) o.parent_span_id === r && (o.parent_span_id = n);
  }
  function A_(e) {
    return typeof e == 'string' || e instanceof RegExp;
  }
  var nn = 'production';
  var Wd = '_frozenDsc';
  function mr(e, t) {
    he(e, Wd, t);
  }
  function sc(e, t) {
    let n = t.getOptions(),
      { publicKey: r } = t.getDsn() || {},
      o = {
        environment: n.environment || nn,
        release: n.release,
        public_key: r,
        trace_id: e,
        org_id: Li(t),
      };
    return (t.emit('createDsc', o), o);
  }
  function hr(e, t) {
    let n = t.getPropagationContext();
    return n.dsc || sc(n.traceId, e);
  }
  function Re(e) {
    let t = b();
    if (!t) return {};
    let n = re(e),
      r = D(n),
      o = r.data,
      i = n.spanContext().traceState,
      s = i?.get('sentry.sample_rate') ?? o[en] ?? o[lo];
    function a(m) {
      return ((typeof s == 'number' || typeof s == 'string') && (m.sample_rate = `${s}`), m);
    }
    let c = n[Wd];
    if (c) return a(c);
    let u = i?.get('sentry.dsc'),
      d = u && pr(u);
    if (d) return a(d);
    let l = sc(e.spanContext().traceId, t),
      p = o[Ie],
      f = r.description;
    return (
      p !== 'url' && f && (l.transaction = f),
      Ne() &&
        ((l.sampled = String(pt(n))),
        (l.sample_rand =
          i?.get('sentry.sample_rand') ??
          Un(n).scope?.getPropagationContext().sampleRand.toString())),
      a(l),
      t.emit('createDsc', l, n),
      l
    );
  }
  function ac(e) {
    let t = Re(e);
    return Mi(t);
  }
  var Ye = class {
    constructor(t = {}) {
      ((this._traceId = t.traceId || Be()), (this._spanId = t.spanId || je()));
    }
    spanContext() {
      return { spanId: this._spanId, traceId: this._traceId, traceFlags: Fi };
    }
    end(t) {}
    setAttribute(t, n) {
      return this;
    }
    setAttributes(t) {
      return this;
    }
    setStatus(t) {
      return this;
    }
    updateName(t) {
      return this;
    }
    isRecording() {
      return !1;
    }
    addEvent(t, n, r) {
      return this;
    }
    addLink(t) {
      return this;
    }
    addLinks(t) {
      return this;
    }
    recordException(t, n) {}
  };
  function Me(e, t = 100, n = 1 / 0) {
    try {
      return cc('', e, t, n);
    } catch (r) {
      return { ERROR: `**non-serializable** (${r})` };
    }
  }
  function Wi(e, t = 3, n = 100 * 1024) {
    let r = Me(e, t);
    return O_(r) > n ? Wi(e, t - 1, n) : r;
  }
  function cc(e, t, n = 1 / 0, r = 1 / 0, o = L_()) {
    let [i, s] = o;
    if (
      t == null ||
      ['boolean', 'string'].includes(typeof t) ||
      (typeof t == 'number' && Number.isFinite(t))
    )
      return t;
    let a = k_(e, t);
    if (!a.startsWith('[object ')) return a;
    if (t.__sentry_skip_normalization__) return t;
    let c =
      typeof t.__sentry_override_normalization_depth__ == 'number'
        ? t.__sentry_override_normalization_depth__
        : n;
    if (c === 0) return a.replace('object ', '');
    if (i(t)) return '[Circular ~]';
    let u = t;
    if (u && typeof u.toJSON == 'function')
      try {
        let f = u.toJSON();
        return cc('', f, c - 1, r, o);
      } catch {}
    let d = Array.isArray(t) ? [] : {},
      l = 0,
      p = Ri(t);
    for (let f in p) {
      if (!Object.prototype.hasOwnProperty.call(p, f)) continue;
      if (l >= r) {
        d[f] = '[MaxProperties ~]';
        break;
      }
      let m = p[f];
      ((d[f] = cc(f, m, c - 1, r, o)), l++);
    }
    return (s(t), d);
  }
  function k_(e, t) {
    try {
      if (e === 'domain' && t && typeof t == 'object' && t._events) return '[Domain]';
      if (e === 'domainEmitter') return '[DomainEmitter]';
      if (typeof global < 'u' && t === global) return '[Global]';
      if (typeof window < 'u' && t === window) return '[Window]';
      if (typeof document < 'u' && t === document) return '[Document]';
      if (ao(t)) return '[VueViewModel]';
      if (qa(t)) return '[SyntheticEvent]';
      if (typeof t == 'number' && !Number.isFinite(t)) return `[${t}]`;
      if (typeof t == 'function') return `[Function: ${rt(t)}]`;
      if (typeof t == 'symbol') return `[${String(t)}]`;
      if (typeof t == 'bigint') return `[BigInt: ${String(t)}]`;
      let n = N_(t);
      return /^HTML(\w*)Element$/.test(n) ? `[HTMLElement: ${n}]` : `[object ${n}]`;
    } catch (n) {
      return `**non-serializable** (${n})`;
    }
  }
  function N_(e) {
    let t = Object.getPrototypeOf(e);
    return t?.constructor ? t.constructor.name : 'null prototype';
  }
  function M_(e) {
    return ~-encodeURI(e).split(/%..|./).length;
  }
  function O_(e) {
    return M_(JSON.stringify(e));
  }
  function L_() {
    let e = new WeakSet();
    function t(r) {
      return e.has(r) ? !0 : (e.add(r), !1);
    }
    function n(r) {
      e.delete(r);
    }
    return [t, n];
  }
  function Oe(e, t = []) {
    return [e, t];
  }
  function uc(e, t) {
    let [n, r] = e;
    return [n, [...r, t]];
  }
  function mt(e, t) {
    let n = e[1];
    for (let r of n) {
      let o = r[0].type;
      if (t(r, o)) return !0;
    }
    return !1;
  }
  function zi(e, t) {
    return mt(e, (n, r) => t.includes(r));
  }
  function Gi(e) {
    let t = _n(v);
    return t.encodePolyfill ? t.encodePolyfill(e) : new TextEncoder().encode(e);
  }
  function D_(e) {
    let t = _n(v);
    return t.decodePolyfill ? t.decodePolyfill(e) : new TextDecoder().decode(e);
  }
  function bn(e) {
    let [t, n] = e,
      r = JSON.stringify(t);
    function o(i) {
      typeof r == 'string'
        ? (r = typeof i == 'string' ? r + i : [Gi(r), i])
        : r.push(typeof i == 'string' ? Gi(i) : i);
    }
    for (let i of n) {
      let [s, a] = i;
      if (
        (o(`
${JSON.stringify(s)}
`),
        typeof a == 'string' || a instanceof Uint8Array)
      )
        o(a);
      else {
        let c;
        try {
          c = JSON.stringify(a);
        } catch {
          c = JSON.stringify(Me(a));
        }
        o(c);
      }
    }
    return typeof r == 'string' ? r : P_(r);
  }
  function P_(e) {
    let t = e.reduce((o, i) => o + i.length, 0),
      n = new Uint8Array(t),
      r = 0;
    for (let o of e) (n.set(o, r), (r += o.length));
    return n;
  }
  function lc(e) {
    let t = typeof e == 'string' ? Gi(e) : e;
    function n(s) {
      let a = t.subarray(0, s);
      return ((t = t.subarray(s + 1)), a);
    }
    function r() {
      let s = t.indexOf(10);
      return (s < 0 && (s = t.length), JSON.parse(D_(n(s))));
    }
    let o = r(),
      i = [];
    for (; t.length; ) {
      let s = r(),
        a = typeof s.length == 'number' ? s.length : void 0;
      i.push([s, a ? n(a) : r()]);
    }
    return [o, i];
  }
  function dc(e) {
    return [{ type: 'span' }, e];
  }
  function fc(e) {
    let t = typeof e.data == 'string' ? Gi(e.data) : e.data;
    return [
      {
        type: 'attachment',
        length: t.length,
        filename: e.filename,
        content_type: e.contentType,
        attachment_type: e.attachmentType,
      },
      t,
    ];
  }
  var F_ = {
    session: 'session',
    sessions: 'session',
    attachment: 'attachment',
    transaction: 'transaction',
    event: 'error',
    client_report: 'internal',
    user_report: 'default',
    profile: 'profile',
    profile_chunk: 'profile',
    replay_event: 'replay',
    replay_recording: 'replay',
    check_in: 'monitor',
    feedback: 'feedback',
    span: 'span',
    raw_security: 'security',
    log: 'log_item',
    metric: 'metric',
    trace_metric: 'metric',
  };
  function ji(e) {
    return F_[e];
  }
  function gr(e) {
    if (!e?.sdk) return;
    let { name: t, version: n } = e.sdk;
    return { name: t, version: n };
  }
  function yo(e, t, n, r) {
    let o = e.sdkProcessingMetadata?.dynamicSamplingContext;
    return {
      event_id: e.event_id,
      sent_at: new Date().toISOString(),
      ...(t && { sdk: t }),
      ...(!!n && r && { dsn: Ve(r) }),
      ...(o && { trace: o }),
    };
  }
  function U_(e, t) {
    if (!t) return e;
    let n = e.sdk || {};
    return (
      (e.sdk = {
        ...n,
        name: n.name || t.name,
        version: n.version || t.version,
        integrations: [...(e.sdk?.integrations || []), ...(t.integrations || [])],
        packages: [...(e.sdk?.packages || []), ...(t.packages || [])],
        settings: e.sdk?.settings || t.settings ? { ...e.sdk?.settings, ...t.settings } : void 0,
      }),
      e
    );
  }
  function Gd(e, t, n, r) {
    let o = gr(n),
      i = {
        sent_at: new Date().toISOString(),
        ...(o && { sdk: o }),
        ...(!!r && t && { dsn: Ve(t) }),
      },
      s = 'aggregates' in e ? [{ type: 'sessions' }, e] : [{ type: 'session' }, e.toJSON()];
    return Oe(i, [s]);
  }
  function zd(e, t, n, r) {
    let o = gr(n),
      i = e.type && e.type !== 'replay_event' ? e.type : 'event';
    U_(e, n?.sdk);
    let s = yo(e, o, r, t);
    return (delete e.sdkProcessingMetadata, Oe(s, [[{ type: i }, e]]));
  }
  function jd(e, t) {
    function n(f) {
      return !!f.trace_id && !!f.public_key;
    }
    let r = Re(e[0]),
      o = t?.getDsn(),
      i = t?.getOptions().tunnel,
      s = {
        sent_at: new Date().toISOString(),
        ...(n(r) && { trace: r }),
        ...(!!i && o && { dsn: Ve(o) }),
      },
      { beforeSendSpan: a, ignoreSpans: c } = t?.getOptions() || {},
      u = c?.length ? e.filter((f) => !Hn(D(f), c)) : e,
      d = e.length - u.length;
    d && t?.recordDroppedEvent('before_send', 'span', d);
    let l = a
        ? (f) => {
            let m = D(f),
              _ = a(m);
            return _ || (_o(), m);
          }
        : D,
      p = [];
    for (let f of u) {
      let m = l(f);
      m && p.push(dc(m));
    }
    return Oe(s, p);
  }
  function qd(e) {
    if (!y) return;
    let { description: t = '< unknown name >', op: n = '< unknown op >', parent_span_id: r } = D(e),
      { spanId: o } = e.spanContext(),
      i = pt(e),
      s = re(e),
      a = s === e,
      c = `[Tracing] Starting ${i ? 'sampled' : 'unsampled'} ${a ? 'root ' : ''}span`,
      u = [`op: ${n}`, `name: ${t}`, `ID: ${o}`];
    if ((r && u.push(`parent ID: ${r}`), !a)) {
      let { op: d, description: l } = D(s);
      (u.push(`root ID: ${s.spanContext().spanId}`),
        d && u.push(`root op: ${d}`),
        l && u.push(`root description: ${l}`));
    }
    h.log(`${c}
  ${u.join(`
  `)}`);
  }
  function Vd(e) {
    if (!y) return;
    let { description: t = '< unknown name >', op: n = '< unknown op >' } = D(e),
      { spanId: r } = e.spanContext(),
      i = re(e) === e,
      s = `[Tracing] Finishing "${n}" ${i ? 'root ' : ''}span "${t}" with ID ${r}`;
    h.log(s);
  }
  function Eo(e, t, n, r = Z()) {
    let o = r && re(r);
    o &&
      (y && h.log(`[Measurement] Setting measurement on root span: ${e} = ${t} ${n}`),
      o.addEvent(e, { [Vt]: t, [qt]: n }));
  }
  function qi(e) {
    if (!e || e.length === 0) return;
    let t = {};
    return (
      e.forEach((n) => {
        let r = n.attributes || {},
          o = r[qt],
          i = r[Vt];
        typeof o == 'string' && typeof i == 'number' && (t[n.name] = { value: i, unit: o });
      }),
      t
    );
  }
  var Yd = 1e3,
    Tn = class {
      constructor(t = {}) {
        ((this._traceId = t.traceId || Be()),
          (this._spanId = t.spanId || je()),
          (this._startTime = t.startTimestamp || K()),
          (this._links = t.links),
          (this._attributes = {}),
          this.setAttributes({ [X]: 'manual', [Se]: t.op, ...t.attributes }),
          (this._name = t.name),
          t.parentSpanId && (this._parentSpanId = t.parentSpanId),
          'sampled' in t && (this._sampled = t.sampled),
          t.endTimestamp && (this._endTime = t.endTimestamp),
          (this._events = []),
          (this._isStandaloneSpan = t.isStandalone),
          this._endTime && this._onSpanEnded());
      }
      addLink(t) {
        return (this._links ? this._links.push(t) : (this._links = [t]), this);
      }
      addLinks(t) {
        return (this._links ? this._links.push(...t) : (this._links = t), this);
      }
      recordException(t, n) {}
      spanContext() {
        let { _spanId: t, _traceId: n, _sampled: r } = this;
        return { spanId: t, traceId: n, traceFlags: r ? Ui : Fi };
      }
      setAttribute(t, n) {
        return (n === void 0 ? delete this._attributes[t] : (this._attributes[t] = n), this);
      }
      setAttributes(t) {
        return (Object.keys(t).forEach((n) => this.setAttribute(n, t[n])), this);
      }
      updateStartTime(t) {
        this._startTime = Pt(t);
      }
      setStatus(t) {
        return ((this._status = t), this);
      }
      updateName(t) {
        return ((this._name = t), this.setAttribute(Ie, 'custom'), this);
      }
      end(t) {
        this._endTime || ((this._endTime = Pt(t)), Vd(this), this._onSpanEnded());
      }
      getSpanJSON() {
        return {
          data: this._attributes,
          description: this._name,
          op: this._attributes[Se],
          parent_span_id: this._parentSpanId,
          span_id: this._spanId,
          start_timestamp: this._startTime,
          status: Hi(this._status),
          timestamp: this._endTime,
          trace_id: this._traceId,
          origin: this._attributes[X],
          profile_id: this._attributes[fr],
          exclusive_time: this._attributes[wt],
          measurements: qi(this._events),
          is_segment: (this._isStandaloneSpan && re(this) === this) || void 0,
          segment_id: this._isStandaloneSpan ? re(this).spanContext().spanId : void 0,
          links: Bi(this._links),
        };
      }
      isRecording() {
        return !this._endTime && !!this._sampled;
      }
      addEvent(t, n, r) {
        y && h.log('[Tracing] Adding an event to span:', t);
        let o = Jd(n) ? n : r || K(),
          i = Jd(n) ? {} : n || {},
          s = { name: t, time: Pt(o), attributes: i };
        return (this._events.push(s), this);
      }
      isStandaloneSpan() {
        return !!this._isStandaloneSpan;
      }
      _onSpanEnded() {
        let t = b();
        if ((t && t.emit('spanEnd', this), !(this._isStandaloneSpan || this === re(this)))) return;
        if (this._isStandaloneSpan) {
          this._sampled
            ? H_(jd([this], t))
            : (y &&
                h.log(
                  '[Tracing] Discarding standalone span because its trace was not chosen to be sampled.'
                ),
              t && t.recordDroppedEvent('sample_rate', 'span'));
          return;
        }
        let r = this._convertSpanToTransaction();
        r && (Un(this).scope || M()).captureEvent(r);
      }
      _convertSpanToTransaction() {
        if (!Kd(D(this))) return;
        this._name ||
          (y && h.warn('Transaction has no name, falling back to `<unlabeled transaction>`.'),
          (this._name = '<unlabeled transaction>'));
        let { scope: t, isolationScope: n } = Un(this),
          r = t?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
        if (this._sampled !== !0) return;
        let i = tn(this)
            .filter((d) => d !== this && !B_(d))
            .map((d) => D(d))
            .filter(Kd),
          s = this._attributes[Ie];
        (delete this._attributes[dr],
          i.forEach((d) => {
            delete d.data[dr];
          }));
        let a = {
            contexts: { trace: Pd(this) },
            spans:
              i.length > Yd
                ? i.sort((d, l) => d.start_timestamp - l.start_timestamp).slice(0, Yd)
                : i,
            start_timestamp: this._startTime,
            timestamp: this._endTime,
            transaction: this._name,
            type: 'transaction',
            sdkProcessingMetadata: {
              capturedSpanScope: t,
              capturedSpanIsolationScope: n,
              dynamicSamplingContext: Re(this),
            },
            request: r,
            ...(s && { transaction_info: { source: s } }),
          },
          c = qi(this._events);
        return (
          c &&
            Object.keys(c).length &&
            (y &&
              h.log(
                '[Measurements] Adding measurements to transaction event',
                JSON.stringify(c, void 0, 2)
              ),
            (a.measurements = c)),
          a
        );
      }
    };
  function Jd(e) {
    return (e && typeof e == 'number') || e instanceof Date || Array.isArray(e);
  }
  function Kd(e) {
    return !!e.start_timestamp && !!e.timestamp && !!e.span_id && !!e.trace_id;
  }
  function B_(e) {
    return e instanceof Tn && e.isStandaloneSpan();
  }
  function H_(e) {
    let t = b();
    if (!t) return;
    let n = e[1];
    if (!n || n.length === 0) {
      t.recordDroppedEvent('before_send', 'span');
      return;
    }
    t.sendEnvelope(e);
  }
  function pc(e, t, n = () => {}, r = () => {}) {
    let o;
    try {
      o = e();
    } catch (i) {
      throw (t(i), n(), i);
    }
    return $_(o, t, n, r);
  }
  function $_(e, t, n, r) {
    return Tt(e)
      ? e.then(
          (o) => (n(), r(o), o),
          (o) => {
            throw (t(o), n(), o);
          }
        )
      : (n(), r(e), e);
  }
  function Xd(e, t, n) {
    if (!Ne(e)) return [!1];
    let r, o;
    typeof e.tracesSampler == 'function'
      ? ((o = e.tracesSampler({
          ...t,
          inheritOrSampleWith: (a) =>
            typeof t.parentSampleRate == 'number'
              ? t.parentSampleRate
              : typeof t.parentSampled == 'boolean'
                ? Number(t.parentSampled)
                : a,
        })),
        (r = !0))
      : t.parentSampled !== void 0
        ? (o = t.parentSampled)
        : typeof e.tracesSampleRate < 'u' && ((o = e.tracesSampleRate), (r = !0));
    let i = ft(o);
    if (i === void 0)
      return (
        y &&
          h.warn(
            `[Tracing] Discarding root span because of invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(o)} of type ${JSON.stringify(typeof o)}.`
          ),
        [!1]
      );
    if (!i)
      return (
        y &&
          h.log(
            `[Tracing] Discarding transaction because ${typeof e.tracesSampler == 'function' ? 'tracesSampler returned 0 or false' : 'a negative sampling decision was inherited or tracesSampleRate is set to 0'}`
          ),
        [!1, i, r]
      );
    let s = n < i;
    return (
      s ||
        (y &&
          h.log(
            `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(o)})`
          )),
      [s, i, r]
    );
  }
  var Vi = '__SENTRY_SUPPRESS_TRACING__';
  function In(e, t) {
    let n = To();
    if (n.startSpan) return n.startSpan(e, t);
    let r = _c(e),
      { forceTransaction: o, parentSpan: i, scope: s } = e,
      a = s?.clone();
    return ke(a, () =>
      Qd(i)(() => {
        let u = M(),
          d = Sc(u, i),
          p =
            e.onlyIfParent && !d
              ? new Ye()
              : gc({ parentSpan: d, spanArguments: r, forceTransaction: o, scope: u });
        return (
          it(u, p),
          pc(
            () => t(p),
            () => {
              let { status: f } = D(p);
              p.isRecording() &&
                (!f || f === 'ok') &&
                p.setStatus({ code: 2, message: 'internal_error' });
            },
            () => {
              p.end();
            }
          )
        );
      })
    );
  }
  function mc(e, t) {
    let n = To();
    if (n.startSpanManual) return n.startSpanManual(e, t);
    let r = _c(e),
      { forceTransaction: o, parentSpan: i, scope: s } = e,
      a = s?.clone();
    return ke(a, () =>
      Qd(i)(() => {
        let u = M(),
          d = Sc(u, i),
          p =
            e.onlyIfParent && !d
              ? new Ye()
              : gc({ parentSpan: d, spanArguments: r, forceTransaction: o, scope: u });
        return (
          it(u, p),
          pc(
            () => t(p, () => p.end()),
            () => {
              let { status: f } = D(p);
              p.isRecording() &&
                (!f || f === 'ok') &&
                p.setStatus({ code: 2, message: 'internal_error' });
            }
          )
        );
      })
    );
  }
  function st(e) {
    let t = To();
    if (t.startInactiveSpan) return t.startInactiveSpan(e);
    let n = _c(e),
      { forceTransaction: r, parentSpan: o } = e;
    return (e.scope ? (s) => ke(e.scope, s) : o !== void 0 ? (s) => vn(o, s) : (s) => s())(() => {
      let s = M(),
        a = Sc(s, o);
      return e.onlyIfParent && !a
        ? new Ye()
        : gc({ parentSpan: a, spanArguments: n, forceTransaction: r, scope: s });
    });
  }
  var hc = (e, t) => {
    let n = Ke(),
      r = vt(n);
    if (r.continueTrace) return r.continueTrace(e, t);
    let { sentryTrace: o, baggage: i } = e,
      s = b(),
      a = pr(i);
    return s && !nc(s, a?.org_id)
      ? Yi(t)
      : ke((c) => {
          let u = po(o, i);
          return (c.setPropagationContext(u), t());
        });
  };
  function vn(e, t) {
    let n = To();
    return n.withActiveSpan ? n.withActiveSpan(e, t) : ke((r) => (it(r, e || void 0), t(r)));
  }
  function bo(e) {
    let t = To();
    return t.suppressTracing
      ? t.suppressTracing(e)
      : ke((n) => {
          n.setSDKProcessingMetadata({ [Vi]: !0 });
          let r = e();
          return (n.setSDKProcessingMetadata({ [Vi]: void 0 }), r);
        });
  }
  function Yi(e) {
    return ke(
      (t) => (
        t.setPropagationContext({ traceId: Be(), sampleRand: Math.random() }),
        y && h.log(`Starting a new trace with id ${t.getPropagationContext().traceId}`),
        vn(null, e)
      )
    );
  }
  function gc({ parentSpan: e, spanArguments: t, forceTransaction: n, scope: r }) {
    if (!Ne()) {
      let s = new Ye();
      if (n || !e) {
        let a = { sampled: 'false', sample_rate: '0', transaction: t.name, ...Re(s) };
        mr(s, a);
      }
      return s;
    }
    let o = se(),
      i;
    if (e && !n) ((i = W_(e, r, t)), $i(e, i));
    else if (e) {
      let s = Re(e),
        { traceId: a, spanId: c } = e.spanContext(),
        u = pt(e);
      ((i = Zd({ traceId: a, parentSpanId: c, ...t }, r, u)), mr(i, s));
    } else {
      let {
        traceId: s,
        dsc: a,
        parentSpanId: c,
        sampled: u,
      } = { ...o.getPropagationContext(), ...r.getPropagationContext() };
      ((i = Zd({ traceId: s, parentSpanId: c, ...t }, r, u)), a && mr(i, a));
    }
    return (qd(i), kd(i, r, o), i);
  }
  function _c(e) {
    let n = { isStandalone: (e.experimental || {}).standalone, ...e };
    if (e.startTime) {
      let r = { ...n };
      return ((r.startTimestamp = Pt(e.startTime)), delete r.startTime, r);
    }
    return n;
  }
  function To() {
    let e = Ke();
    return vt(e);
  }
  function Zd(e, t, n) {
    let r = b(),
      o = r?.getOptions() || {},
      { name: i = '' } = e,
      s = { spanAttributes: { ...e.attributes }, spanName: i, parentSampled: n };
    r?.emit('beforeSampling', s, { decision: !1 });
    let a = s.parentSampled ?? n,
      c = s.spanAttributes,
      u = t.getPropagationContext(),
      [d, l, p] = t.getScopeData().sdkProcessingMetadata[Vi]
        ? [!1]
        : Xd(
            o,
            { name: i, parentSampled: a, attributes: c, parentSampleRate: ft(u.dsc?.sample_rate) },
            u.sampleRand
          ),
      f = new Tn({
        ...e,
        attributes: { [Ie]: 'custom', [en]: l !== void 0 && p ? l : void 0, ...c },
        sampled: d,
      });
    return (
      !d &&
        r &&
        (y &&
          h.log('[Tracing] Discarding root span because its trace was not chosen to be sampled.'),
        r.recordDroppedEvent('sample_rate', 'transaction')),
      r && r.emit('spanStart', f),
      f
    );
  }
  function W_(e, t, n) {
    let { spanId: r, traceId: o } = e.spanContext(),
      i = t.getScopeData().sdkProcessingMetadata[Vi] ? !1 : pt(e),
      s = i ? new Tn({ ...n, parentSpanId: r, traceId: o, sampled: i }) : new Ye({ traceId: o });
    $i(e, s);
    let a = b();
    return (a && (a.emit('spanStart', s), n.endTimestamp && a.emit('spanEnd', s)), s);
  }
  function Sc(e, t) {
    if (t) return t;
    if (t === null) return;
    let n = Lt(e);
    if (!n) return;
    let r = b();
    return (r ? r.getOptions() : {}).parentSpanIsAlwaysRootSpan ? re(n) : n;
  }
  function Qd(e) {
    return e !== void 0 ? (t) => vn(e, t) : (t) => t();
  }
  var _r = { idleTimeout: 1e3, finalTimeout: 3e4, childSpanTimeout: 15e3 },
    G_ = 'heartbeatFailed',
    z_ = 'idleTimeout',
    j_ = 'finalTimeout',
    q_ = 'externalFinish';
  function Ji(e, t = {}) {
    let n = new Map(),
      r = !1,
      o,
      i = q_,
      s = !t.disableAutoFinish,
      a = [],
      {
        idleTimeout: c = _r.idleTimeout,
        finalTimeout: u = _r.finalTimeout,
        childSpanTimeout: d = _r.childSpanTimeout,
        beforeSpanEnd: l,
        trimIdleSpanEndTimestamp: p = !0,
      } = t,
      f = b();
    if (!f || !Ne()) {
      let T = new Ye(),
        R = { sample_rate: '0', sampled: 'false', ...Re(T) };
      return (mr(T, R), T);
    }
    let m = M(),
      _ = Z(),
      g = V_(e);
    g.end = new Proxy(g.end, {
      apply(T, R, I) {
        if ((l && l(g), R instanceof Ye)) return;
        let [k, ...H] = I,
          x = k || K(),
          L = Pt(x),
          q = tn(g).filter(($) => $ !== g),
          J = D(g);
        if (!q.length || !p) return (A(L), Reflect.apply(T, R, [L, ...H]));
        let ne = f.getOptions().ignoreSpans,
          C = q?.reduce(
            ($, Q) => {
              let ae = D(Q);
              return !ae.timestamp || (ne && Hn(ae, ne))
                ? $
                : $
                  ? Math.max($, ae.timestamp)
                  : ae.timestamp;
            },
            void 0
          ),
          z = J.start_timestamp,
          N = Math.min(z ? z + u / 1e3 : 1 / 0, Math.max(z || -1 / 0, Math.min(L, C || 1 / 0)));
        return (A(N), Reflect.apply(T, R, [N, ...H]));
      },
    });
    function S() {
      o && (clearTimeout(o), (o = void 0));
    }
    function E(T) {
      (S(),
        (o = setTimeout(() => {
          !r && n.size === 0 && s && ((i = z_), g.end(T));
        }, c)));
    }
    function P(T) {
      o = setTimeout(() => {
        !r && s && ((i = G_), g.end(T));
      }, d);
    }
    function w(T) {
      (S(), n.set(T, !0));
      let R = K();
      P(R + d / 1e3);
    }
    function F(T) {
      if ((n.has(T) && n.delete(T), n.size === 0)) {
        let R = K();
        E(R + c / 1e3);
      }
    }
    function A(T) {
      ((r = !0), n.clear(), a.forEach((L) => L()), it(m, _));
      let R = D(g),
        { start_timestamp: I } = R;
      if (!I) return;
      (R.data[En] || g.setAttribute(En, i), h.log(`[Tracing] Idle span "${R.op}" finished`));
      let H = tn(g).filter((L) => L !== g),
        x = 0;
      (H.forEach((L) => {
        L.isRecording() &&
          (L.setStatus({ code: 2, message: 'cancelled' }),
          L.end(T),
          y &&
            h.log(
              '[Tracing] Cancelling span since span ended early',
              JSON.stringify(L, void 0, 2)
            ));
        let q = D(L),
          { timestamp: J = 0, start_timestamp: ne = 0 } = q,
          C = ne <= T,
          z = (u + c) / 1e3,
          N = J - ne <= z;
        if (y) {
          let $ = JSON.stringify(L, void 0, 2);
          C
            ? N ||
              h.log('[Tracing] Discarding span since it finished after idle span final timeout', $)
            : h.log('[Tracing] Discarding span since it happened after idle span was finished', $);
        }
        (!N || !C) && (Ud(g, L), x++);
      }),
        x > 0 && g.setAttribute('sentry.idle_span_discarded_spans', x));
    }
    return (
      a.push(
        f.on('spanStart', (T) => {
          if (r || T === g || D(T).timestamp || (T instanceof Tn && T.isStandaloneSpan())) return;
          tn(g).includes(T) && w(T.spanContext().spanId);
        })
      ),
      a.push(
        f.on('spanEnd', (T) => {
          r || F(T.spanContext().spanId);
        })
      ),
      a.push(
        f.on('idleSpanEnableAutoFinish', (T) => {
          T === g && ((s = !0), E(), n.size && P());
        })
      ),
      t.disableAutoFinish || E(),
      setTimeout(() => {
        r || (g.setStatus({ code: 2, message: 'deadline_exceeded' }), (i = j_), g.end());
      }, u),
      g
    );
  }
  function V_(e) {
    let t = st(e);
    return (it(M(), t), y && h.log('[Tracing] Started span is an idle span'), t);
  }
  var yc = 0,
    ef = 1,
    tf = 2;
  function wn(e) {
    return new Io((t) => {
      t(e);
    });
  }
  function $n(e) {
    return new Io((t, n) => {
      n(e);
    });
  }
  var Io = class e {
    constructor(t) {
      ((this._state = yc), (this._handlers = []), this._runExecutor(t));
    }
    then(t, n) {
      return new e((r, o) => {
        (this._handlers.push([
          !1,
          (i) => {
            if (!t) r(i);
            else
              try {
                r(t(i));
              } catch (s) {
                o(s);
              }
          },
          (i) => {
            if (!n) o(i);
            else
              try {
                r(n(i));
              } catch (s) {
                o(s);
              }
          },
        ]),
          this._executeHandlers());
      });
    }
    catch(t) {
      return this.then((n) => n, t);
    }
    finally(t) {
      return new e((n, r) => {
        let o, i;
        return this.then(
          (s) => {
            ((i = !1), (o = s), t && t());
          },
          (s) => {
            ((i = !0), (o = s), t && t());
          }
        ).then(() => {
          if (i) {
            r(o);
            return;
          }
          n(o);
        });
      });
    }
    _executeHandlers() {
      if (this._state === yc) return;
      let t = this._handlers.slice();
      ((this._handlers = []),
        t.forEach((n) => {
          n[0] ||
            (this._state === ef && n[1](this._value),
            this._state === tf && n[2](this._value),
            (n[0] = !0));
        }));
    }
    _runExecutor(t) {
      let n = (i, s) => {
          if (this._state === yc) {
            if (Tt(s)) {
              s.then(r, o);
              return;
            }
            ((this._state = i), (this._value = s), this._executeHandlers());
          }
        },
        r = (i) => {
          n(ef, i);
        },
        o = (i) => {
          n(tf, i);
        };
      try {
        t(r, o);
      } catch (i) {
        o(i);
      }
    }
  };
  function nf(e, t, n, r = 0) {
    try {
      let o = Ec(t, n, e, r);
      return Tt(o) ? o : wn(o);
    } catch (o) {
      return $n(o);
    }
  }
  function Ec(e, t, n, r) {
    let o = n[r];
    if (!e || !o) return e;
    let i = o({ ...e }, t);
    return (
      y && i === null && h.log(`Event processor "${o.id || '?'}" dropped event`),
      Tt(i) ? i.then((s) => Ec(s, t, n, r + 1)) : Ec(i, t, n, r + 1)
    );
  }
  function rf(e, t) {
    let { fingerprint: n, span: r, breadcrumbs: o, sdkProcessingMetadata: i } = t;
    (Y_(e, t), r && X_(e, r), Z_(e, n), J_(e, o), K_(e, i));
  }
  function rn(e, t) {
    let {
      extra: n,
      tags: r,
      user: o,
      contexts: i,
      level: s,
      sdkProcessingMetadata: a,
      breadcrumbs: c,
      fingerprint: u,
      eventProcessors: d,
      attachments: l,
      propagationContext: p,
      transactionName: f,
      span: m,
    } = t;
    (Ki(e, 'extra', n),
      Ki(e, 'tags', r),
      Ki(e, 'user', o),
      Ki(e, 'contexts', i),
      (e.sdkProcessingMetadata = yn(e.sdkProcessingMetadata, a, 2)),
      s && (e.level = s),
      f && (e.transactionName = f),
      m && (e.span = m),
      c.length && (e.breadcrumbs = [...e.breadcrumbs, ...c]),
      u.length && (e.fingerprint = [...e.fingerprint, ...u]),
      d.length && (e.eventProcessors = [...e.eventProcessors, ...d]),
      l.length && (e.attachments = [...e.attachments, ...l]),
      (e.propagationContext = { ...e.propagationContext, ...p }));
  }
  function Ki(e, t, n) {
    e[t] = yn(e[t], n, 1);
  }
  function Y_(e, t) {
    let { extra: n, tags: r, user: o, contexts: i, level: s, transactionName: a } = t;
    (Object.keys(n).length && (e.extra = { ...n, ...e.extra }),
      Object.keys(r).length && (e.tags = { ...r, ...e.tags }),
      Object.keys(o).length && (e.user = { ...o, ...e.user }),
      Object.keys(i).length && (e.contexts = { ...i, ...e.contexts }),
      s && (e.level = s),
      a && e.type !== 'transaction' && (e.transaction = a));
  }
  function J_(e, t) {
    let n = [...(e.breadcrumbs || []), ...t];
    e.breadcrumbs = n.length ? n : void 0;
  }
  function K_(e, t) {
    e.sdkProcessingMetadata = { ...e.sdkProcessingMetadata, ...t };
  }
  function X_(e, t) {
    ((e.contexts = { trace: ho(t), ...e.contexts }),
      (e.sdkProcessingMetadata = { dynamicSamplingContext: Re(t), ...e.sdkProcessingMetadata }));
    let n = re(t),
      r = D(n).description;
    r && !e.transaction && e.type === 'transaction' && (e.transaction = r);
  }
  function Z_(e, t) {
    ((e.fingerprint = e.fingerprint
      ? Array.isArray(e.fingerprint)
        ? e.fingerprint
        : [e.fingerprint]
      : []),
      t && (e.fingerprint = e.fingerprint.concat(t)),
      e.fingerprint.length || delete e.fingerprint);
  }
  var Xi, of, Zi;
  function Qi(e) {
    let t = v._sentryDebugIds;
    if (!t) return {};
    let n = Object.keys(t);
    return (
      (Zi && n.length === of) ||
        ((of = n.length),
        (Zi = n.reduce((r, o) => {
          Xi || (Xi = {});
          let i = Xi[o];
          if (i) r[i[0]] = i[1];
          else {
            let s = e(o);
            for (let a = s.length - 1; a >= 0; a--) {
              let u = s[a]?.filename,
                d = t[o];
              if (u && d) {
                ((r[u] = d), (Xi[o] = [u, d]));
                break;
              }
            }
          }
          return r;
        }, {}))),
      Zi
    );
  }
  function bc(e, t) {
    let n = Qi(e);
    if (!n) return [];
    let r = [];
    for (let o of t) o && n[o] && r.push({ type: 'sourcemap', code_file: o, debug_id: n[o] });
    return r;
  }
  function vo(e, t, n, r, o, i) {
    let { normalizeDepth: s = 3, normalizeMaxBreadth: a = 1e3 } = e,
      c = { ...t, event_id: t.event_id || n.event_id || ge(), timestamp: t.timestamp || dt() },
      u = n.integrations || e.integrations.map((g) => g.name);
    (Q_(c, e),
      nS(c, u),
      o && o.emit('applyFrameMetadata', t),
      t.type === void 0 && eS(c, e.stackParser));
    let d = oS(r, n.captureContext);
    n.mechanism && ze(c, n.mechanism);
    let l = o ? o.getEventProcessors() : [],
      p = Dt().getScopeData();
    if (i) {
      let g = i.getScopeData();
      rn(p, g);
    }
    if (d) {
      let g = d.getScopeData();
      rn(p, g);
    }
    let f = [...(n.attachments || []), ...p.attachments];
    (f.length && (n.attachments = f), rf(c, p));
    let m = [...l, ...p.eventProcessors];
    return nf(m, c, n).then((g) => (g && tS(g), typeof s == 'number' && s > 0 ? rS(g, s, a) : g));
  }
  function Q_(e, t) {
    let { environment: n, release: r, dist: o, maxValueLength: i = 250 } = t;
    ((e.environment = e.environment || n || nn),
      !e.release && r && (e.release = r),
      !e.dist && o && (e.dist = o));
    let s = e.request;
    s?.url && (s.url = It(s.url, i));
  }
  function eS(e, t) {
    let n = Qi(t);
    e.exception?.values?.forEach((r) => {
      r.stacktrace?.frames?.forEach((o) => {
        o.filename && (o.debug_id = n[o.filename]);
      });
    });
  }
  function tS(e) {
    let t = {};
    if (
      (e.exception?.values?.forEach((r) => {
        r.stacktrace?.frames?.forEach((o) => {
          o.debug_id &&
            (o.abs_path ? (t[o.abs_path] = o.debug_id) : o.filename && (t[o.filename] = o.debug_id),
            delete o.debug_id);
        });
      }),
      Object.keys(t).length === 0)
    )
      return;
    ((e.debug_meta = e.debug_meta || {}), (e.debug_meta.images = e.debug_meta.images || []));
    let n = e.debug_meta.images;
    Object.entries(t).forEach(([r, o]) => {
      n.push({ type: 'sourcemap', code_file: r, debug_id: o });
    });
  }
  function nS(e, t) {
    t.length > 0 &&
      ((e.sdk = e.sdk || {}), (e.sdk.integrations = [...(e.sdk.integrations || []), ...t]));
  }
  function rS(e, t, n) {
    if (!e) return null;
    let r = {
      ...e,
      ...(e.breadcrumbs && {
        breadcrumbs: e.breadcrumbs.map((o) => ({
          ...o,
          ...(o.data && { data: Me(o.data, t, n) }),
        })),
      }),
      ...(e.user && { user: Me(e.user, t, n) }),
      ...(e.contexts && { contexts: Me(e.contexts, t, n) }),
      ...(e.extra && { extra: Me(e.extra, t, n) }),
    };
    return (
      e.contexts?.trace &&
        r.contexts &&
        ((r.contexts.trace = e.contexts.trace),
        e.contexts.trace.data && (r.contexts.trace.data = Me(e.contexts.trace.data, t, n))),
      e.spans &&
        (r.spans = e.spans.map((o) => ({ ...o, ...(o.data && { data: Me(o.data, t, n) }) }))),
      e.contexts?.flags && r.contexts && (r.contexts.flags = Me(e.contexts.flags, 3, n)),
      r
    );
  }
  function oS(e, t) {
    if (!t) return e;
    let n = e ? e.clone() : new qe();
    return (n.update(t), n);
  }
  function sf(e) {
    if (e) return iS(e) ? { captureContext: e } : aS(e) ? { captureContext: e } : e;
  }
  function iS(e) {
    return e instanceof qe || typeof e == 'function';
  }
  var sS = ['user', 'level', 'extra', 'contexts', 'tags', 'fingerprint', 'propagationContext'];
  function aS(e) {
    return Object.keys(e).some((t) => sS.includes(t));
  }
  function ht(e, t) {
    return M().captureException(e, sf(t));
  }
  function Rn(e, t) {
    let n = typeof t == 'string' ? t : void 0,
      r = typeof t != 'string' ? { captureContext: t } : void 0;
    return M().captureMessage(e, n, r);
  }
  function on(e, t) {
    return M().captureEvent(e, t);
  }
  function wo(e, t) {
    se().setContext(e, t);
  }
  function Tc(e) {
    se().setExtras(e);
  }
  function Ic(e, t) {
    se().setExtra(e, t);
  }
  function vc(e) {
    se().setTags(e);
  }
  function wc(e, t) {
    se().setTag(e, t);
  }
  function Rc(e) {
    se().setUser(e);
  }
  function Ro() {
    return se().lastEventId();
  }
  async function xc(e) {
    let t = b();
    return t
      ? t.flush(e)
      : (y && h.warn('Cannot flush events. No client defined.'), Promise.resolve(!1));
  }
  async function Cc(e) {
    let t = b();
    return t
      ? t.close(e)
      : (y && h.warn('Cannot flush events and disable SDK. No client defined.'),
        Promise.resolve(!1));
  }
  function Ac() {
    return !!b();
  }
  function xo() {
    let e = b();
    return e?.getOptions().enabled !== !1 && !!e?.getTransport();
  }
  function Co(e) {
    se().addEventProcessor(e);
  }
  function Sr(e) {
    let t = se(),
      n = M(),
      { userAgent: r } = v.navigator || {},
      o = Td({ user: n.getUser() || t.getUser(), ...(r && { userAgent: r }), ...e }),
      i = t.getSession();
    return (i?.status === 'ok' && Qt(i, { status: 'exited' }), Ao(), t.setSession(o), o);
  }
  function Ao() {
    let e = se(),
      n = M().getSession() || e.getSession();
    (n && Id(n), af(), e.setSession());
  }
  function af() {
    let e = se(),
      t = b(),
      n = e.getSession();
    n && t && t.captureSession(n);
  }
  function yr(e = !1) {
    if (e) {
      Ao();
      return;
    }
    af();
  }
  var cS = '7';
  function cf(e) {
    let t = e.protocol ? `${e.protocol}:` : '',
      n = e.port ? `:${e.port}` : '';
    return `${t}//${e.host}${n}${e.path ? `/${e.path}` : ''}/api/`;
  }
  function uS(e) {
    return `${cf(e)}${e.projectId}/envelope/`;
  }
  function lS(e, t) {
    let n = { sentry_version: cS };
    return (
      e.publicKey && (n.sentry_key = e.publicKey),
      t && (n.sentry_client = `${t.name}/${t.version}`),
      new URLSearchParams(n).toString()
    );
  }
  function ko(e, t, n) {
    return t || `${uS(e)}?${lS(e, n)}`;
  }
  function kc(e, t) {
    let n = fo(e);
    if (!n) return '';
    let r = `${cf(n)}embed/error-page/`,
      o = `dsn=${Ve(n)}`;
    for (let i in t)
      if (i !== 'dsn' && i !== 'onClose')
        if (i === 'user') {
          let s = t.user;
          if (!s) continue;
          (s.name && (o += `&name=${encodeURIComponent(s.name)}`),
            s.email && (o += `&email=${encodeURIComponent(s.email)}`));
        } else o += `&${encodeURIComponent(i)}=${encodeURIComponent(t[i])}`;
    return `${r}?${o}`;
  }
  var uf = [];
  function dS(e) {
    let t = {};
    return (
      e.forEach((n) => {
        let { name: r } = n,
          o = t[r];
        (o && !o.isDefaultInstance && n.isDefaultInstance) || (t[r] = n);
      }),
      Object.values(t)
    );
  }
  function Nc(e) {
    let t = e.defaultIntegrations || [],
      n = e.integrations;
    t.forEach((o) => {
      o.isDefaultInstance = !0;
    });
    let r;
    if (Array.isArray(n)) r = [...t, ...n];
    else if (typeof n == 'function') {
      let o = n(t);
      r = Array.isArray(o) ? o : [o];
    } else r = t;
    return dS(r);
  }
  function lf(e, t) {
    let n = {};
    return (
      t.forEach((r) => {
        r && Oc(e, r, n);
      }),
      n
    );
  }
  function Mc(e, t) {
    for (let n of t) n?.afterAllSetup && n.afterAllSetup(e);
  }
  function Oc(e, t, n) {
    if (n[t.name]) {
      y && h.log(`Integration skipped because it was already installed: ${t.name}`);
      return;
    }
    if (
      ((n[t.name] = t),
      uf.indexOf(t.name) === -1 &&
        typeof t.setupOnce == 'function' &&
        (t.setupOnce(), uf.push(t.name)),
      t.setup && typeof t.setup == 'function' && t.setup(e),
      typeof t.preprocessEvent == 'function')
    ) {
      let r = t.preprocessEvent.bind(t);
      e.on('preprocessEvent', (o, i) => r(o, i, e));
    }
    if (typeof t.processEvent == 'function') {
      let r = t.processEvent.bind(t),
        o = Object.assign((i, s) => r(i, s, e), { id: t.name });
      e.addEventProcessor(o);
    }
    y && h.log(`Integration installed: ${t.name}`);
  }
  function Er(e) {
    let t = b();
    if (!t) {
      y && h.warn(`Cannot add integration "${e.name}" because no SDK Client is available.`);
      return;
    }
    t.addIntegration(e);
  }
  function df(e, t, n) {
    let r = [{ type: 'client_report' }, { timestamp: n || dt(), discarded_events: e }];
    return Oe(t ? { dsn: t } : {}, [r]);
  }
  function es(e) {
    let t = [];
    e.message && t.push(e.message);
    try {
      let n = e.exception.values[e.exception.values.length - 1];
      n?.value && (t.push(n.value), n.type && t.push(`${n.type}: ${n.value}`));
    } catch {}
    return t;
  }
  function ff(e) {
    let {
      trace_id: t,
      parent_span_id: n,
      span_id: r,
      status: o,
      origin: i,
      data: s,
      op: a,
    } = e.contexts?.trace ?? {};
    return {
      data: s ?? {},
      description: e.transaction,
      op: a,
      parent_span_id: n,
      span_id: r ?? '',
      start_timestamp: e.start_timestamp ?? 0,
      status: o,
      timestamp: e.timestamp,
      trace_id: t ?? '',
      origin: i,
      profile_id: s?.[fr],
      exclusive_time: s?.[wt],
      measurements: e.measurements,
      is_segment: !0,
    };
  }
  function pf(e) {
    return {
      type: 'transaction',
      timestamp: e.timestamp,
      start_timestamp: e.start_timestamp,
      transaction: e.description,
      contexts: {
        trace: {
          trace_id: e.trace_id,
          span_id: e.span_id,
          parent_span_id: e.parent_span_id,
          op: e.op,
          status: e.status,
          origin: e.origin,
          data: {
            ...e.data,
            ...(e.profile_id && { [fr]: e.profile_id }),
            ...(e.exclusive_time && { [wt]: e.exclusive_time }),
          },
        },
      },
      measurements: e.measurements,
    };
  }
  var mf = "Not capturing exception because it's already been captured.",
    hf = 'Discarded session because of missing or non-string release',
    Sf = Symbol.for('SentryInternalError'),
    yf = Symbol.for('SentryDoNotSendEventError');
  function ts(e) {
    return { message: e, [Sf]: !0 };
  }
  function Lc(e) {
    return { message: e, [yf]: !0 };
  }
  function gf(e) {
    return !!e && typeof e == 'object' && Sf in e;
  }
  function _f(e) {
    return !!e && typeof e == 'object' && yf in e;
  }
  var No = class {
    constructor(t) {
      if (
        ((this._options = t),
        (this._integrations = {}),
        (this._numProcessing = 0),
        (this._outcomes = {}),
        (this._hooks = {}),
        (this._eventProcessors = []),
        t.dsn
          ? (this._dsn = fo(t.dsn))
          : y && h.warn('No DSN provided, client will not send events.'),
        this._dsn)
      ) {
        let n = ko(this._dsn, t.tunnel, t._metadata ? t._metadata.sdk : void 0);
        this._transport = t.transport({
          tunnel: this._options.tunnel,
          recordDroppedEvent: this.recordDroppedEvent.bind(this),
          ...t.transportOptions,
          url: n,
        });
      }
    }
    captureException(t, n, r) {
      let o = ge();
      if (xi(t)) return (y && h.log(mf), o);
      let i = { event_id: o, ...n };
      return (
        this._process(this.eventFromException(t, i).then((s) => this._captureEvent(s, i, r))),
        i.event_id
      );
    }
    captureMessage(t, n, r, o) {
      let i = { event_id: ge(), ...r },
        s = Sn(t) ? t : String(t),
        a = bt(t) ? this.eventFromMessage(s, n, i) : this.eventFromException(t, i);
      return (this._process(a.then((c) => this._captureEvent(c, i, o))), i.event_id);
    }
    captureEvent(t, n, r) {
      let o = ge();
      if (n?.originalException && xi(n.originalException)) return (y && h.log(mf), o);
      let i = { event_id: o, ...n },
        s = t.sdkProcessingMetadata || {},
        a = s.capturedSpanScope,
        c = s.capturedSpanIsolationScope;
      return (this._process(this._captureEvent(t, i, a || r, c)), i.event_id);
    }
    captureSession(t) {
      (this.sendSession(t), Qt(t, { init: !1 }));
    }
    getDsn() {
      return this._dsn;
    }
    getOptions() {
      return this._options;
    }
    getSdkMetadata() {
      return this._options._metadata;
    }
    getTransport() {
      return this._transport;
    }
    async flush(t) {
      let n = this._transport;
      if (!n) return !0;
      this.emit('flush');
      let r = await this._isClientDoneProcessing(t),
        o = await n.flush(t);
      return r && o;
    }
    async close(t) {
      let n = await this.flush(t);
      return ((this.getOptions().enabled = !1), this.emit('close'), n);
    }
    getEventProcessors() {
      return this._eventProcessors;
    }
    addEventProcessor(t) {
      this._eventProcessors.push(t);
    }
    init() {
      (this._isEnabled() ||
        this._options.integrations.some(({ name: t }) => t.startsWith('Spotlight'))) &&
        this._setupIntegrations();
    }
    getIntegrationByName(t) {
      return this._integrations[t];
    }
    addIntegration(t) {
      let n = this._integrations[t.name];
      (Oc(this, t, this._integrations), n || Mc(this, [t]));
    }
    sendEvent(t, n = {}) {
      this.emit('beforeSendEvent', t, n);
      let r = zd(t, this._dsn, this._options._metadata, this._options.tunnel);
      for (let o of n.attachments || []) r = uc(r, fc(o));
      this.sendEnvelope(r).then((o) => this.emit('afterSendEvent', t, o));
    }
    sendSession(t) {
      let { release: n, environment: r = nn } = this._options;
      if ('aggregates' in t) {
        let i = t.attrs || {};
        if (!i.release && !n) {
          y && h.warn(hf);
          return;
        }
        ((i.release = i.release || n), (i.environment = i.environment || r), (t.attrs = i));
      } else {
        if (!t.release && !n) {
          y && h.warn(hf);
          return;
        }
        ((t.release = t.release || n), (t.environment = t.environment || r));
      }
      this.emit('beforeSendSession', t);
      let o = Gd(t, this._dsn, this._options._metadata, this._options.tunnel);
      this.sendEnvelope(o);
    }
    recordDroppedEvent(t, n, r = 1) {
      if (this._options.sendClientReports) {
        let o = `${t}:${n}`;
        (y && h.log(`Recording outcome: "${o}"${r > 1 ? ` (${r} times)` : ''}`),
          (this._outcomes[o] = (this._outcomes[o] || 0) + r));
      }
    }
    on(t, n) {
      let r = (this._hooks[t] = this._hooks[t] || new Set()),
        o = (...i) => n(...i);
      return (
        r.add(o),
        () => {
          r.delete(o);
        }
      );
    }
    emit(t, ...n) {
      let r = this._hooks[t];
      r && r.forEach((o) => o(...n));
    }
    async sendEnvelope(t) {
      if ((this.emit('beforeEnvelope', t), this._isEnabled() && this._transport))
        try {
          return await this._transport.send(t);
        } catch (n) {
          return (y && h.error('Error while sending envelope:', n), {});
        }
      return (y && h.error('Transport disabled'), {});
    }
    _setupIntegrations() {
      let { integrations: t } = this._options;
      ((this._integrations = lf(this, t)), Mc(this, t));
    }
    _updateSessionFromEvent(t, n) {
      let r = n.level === 'fatal',
        o = !1,
        i = n.exception?.values;
      if (i) {
        o = !0;
        for (let c of i)
          if (c.mechanism?.handled === !1) {
            r = !0;
            break;
          }
      }
      let s = t.status === 'ok';
      ((s && t.errors === 0) || (s && r)) &&
        (Qt(t, { ...(r && { status: 'crashed' }), errors: t.errors || Number(o || r) }),
        this.captureSession(t));
    }
    async _isClientDoneProcessing(t) {
      let n = 0;
      for (; !t || n < t; ) {
        if ((await new Promise((r) => setTimeout(r, 1)), !this._numProcessing)) return !0;
        n++;
      }
      return !1;
    }
    _isEnabled() {
      return this.getOptions().enabled !== !1 && this._transport !== void 0;
    }
    _prepareEvent(t, n, r, o) {
      let i = this.getOptions(),
        s = Object.keys(this._integrations);
      return (
        !n.integrations && s?.length && (n.integrations = s),
        this.emit('preprocessEvent', t, n),
        t.type || o.setLastEventId(t.event_id || n.event_id),
        vo(i, t, n, r, this, o).then((a) => {
          if (a === null) return a;
          (this.emit('postprocessEvent', a, n), (a.contexts = { trace: Ai(r), ...a.contexts }));
          let c = hr(this, r);
          return (
            (a.sdkProcessingMetadata = { dynamicSamplingContext: c, ...a.sdkProcessingMetadata }),
            a
          );
        })
      );
    }
    _captureEvent(t, n = {}, r = M(), o = se()) {
      return (
        y && Dc(t) && h.log(`Captured error event \`${es(t)[0] || '<unknown>'}\``),
        this._processEvent(t, n, r, o).then(
          (i) => i.event_id,
          (i) => {
            y && (_f(i) ? h.log(i.message) : gf(i) ? h.warn(i.message) : h.warn(i));
          }
        )
      );
    }
    _processEvent(t, n, r, o) {
      let i = this.getOptions(),
        { sampleRate: s } = i,
        a = Ef(t),
        c = Dc(t),
        u = t.type || 'error',
        d = `before send for type \`${u}\``,
        l = typeof s > 'u' ? void 0 : ft(s);
      if (c && typeof l == 'number' && Math.random() > l)
        return (
          this.recordDroppedEvent('sample_rate', 'error'),
          $n(
            Lc(
              `Discarding event because it's not included in the random sample (sampling rate = ${s})`
            )
          )
        );
      let p = u === 'replay_event' ? 'replay' : u;
      return this._prepareEvent(t, n, r, o)
        .then((f) => {
          if (f === null)
            throw (
              this.recordDroppedEvent('event_processor', p),
              Lc('An event processor returned `null`, will not send event.')
            );
          if (n.data && n.data.__sentry__ === !0) return f;
          let _ = pS(this, i, f, n);
          return fS(_, d);
        })
        .then((f) => {
          if (f === null) {
            if ((this.recordDroppedEvent('before_send', p), a)) {
              let S = 1 + (t.spans || []).length;
              this.recordDroppedEvent('before_send', 'span', S);
            }
            throw Lc(`${d} returned \`null\`, will not send event.`);
          }
          let m = r.getSession() || o.getSession();
          if ((c && m && this._updateSessionFromEvent(m, f), a)) {
            let g = f.sdkProcessingMetadata?.spanCountBeforeProcessing || 0,
              S = f.spans ? f.spans.length : 0,
              E = g - S;
            E > 0 && this.recordDroppedEvent('before_send', 'span', E);
          }
          let _ = f.transaction_info;
          if (a && _ && f.transaction !== t.transaction) {
            let g = 'custom';
            f.transaction_info = { ..._, source: g };
          }
          return (this.sendEvent(f, n), f);
        })
        .then(null, (f) => {
          throw _f(f) || gf(f)
            ? f
            : (this.captureException(f, {
                mechanism: { handled: !1, type: 'internal' },
                data: { __sentry__: !0 },
                originalException: f,
              }),
              ts(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${f}`));
        });
    }
    _process(t) {
      (this._numProcessing++,
        t.then(
          (n) => (this._numProcessing--, n),
          (n) => (this._numProcessing--, n)
        ));
    }
    _clearOutcomes() {
      let t = this._outcomes;
      return (
        (this._outcomes = {}),
        Object.entries(t).map(([n, r]) => {
          let [o, i] = n.split(':');
          return { reason: o, category: i, quantity: r };
        })
      );
    }
    _flushOutcomes() {
      y && h.log('Flushing outcomes...');
      let t = this._clearOutcomes();
      if (t.length === 0) {
        y && h.log('No outcomes to send');
        return;
      }
      if (!this._dsn) {
        y && h.log('No dsn provided, will not send outcomes');
        return;
      }
      y && h.log('Sending outcomes:', t);
      let n = df(t, this._options.tunnel && Ve(this._dsn));
      this.sendEnvelope(n);
    }
  };
  function fS(e, t) {
    let n = `${t} must return \`null\` or a valid event.`;
    if (Tt(e))
      return e.then(
        (r) => {
          if (!Ge(r) && r !== null) throw ts(n);
          return r;
        },
        (r) => {
          throw ts(`${t} rejected with ${r}`);
        }
      );
    if (!Ge(e) && e !== null) throw ts(n);
    return e;
  }
  function pS(e, t, n, r) {
    let { beforeSend: o, beforeSendTransaction: i, beforeSendSpan: s, ignoreSpans: a } = t,
      c = n;
    if (Dc(c) && o) return o(c, r);
    if (Ef(c)) {
      if (s || a) {
        let u = ff(c);
        if (a?.length && Hn(u, a)) return null;
        if (s) {
          let d = s(u);
          d ? (c = yn(n, pf(d))) : _o();
        }
        if (c.spans) {
          let d = [],
            l = c.spans;
          for (let f of l) {
            if (a?.length && Hn(f, a)) {
              $d(l, f);
              continue;
            }
            if (s) {
              let m = s(f);
              m ? d.push(m) : (_o(), d.push(f));
            } else d.push(f);
          }
          let p = c.spans.length - d.length;
          (p && e.recordDroppedEvent('before_send', 'span', p), (c.spans = d));
        }
      }
      if (i) {
        if (c.spans) {
          let u = c.spans.length;
          c.sdkProcessingMetadata = { ...n.sdkProcessingMetadata, spanCountBeforeProcessing: u };
        }
        return i(c, r);
      }
    }
    return c;
  }
  function Dc(e) {
    return e.type === void 0;
  }
  function Ef(e) {
    return e.type === 'transaction';
  }
  function ns(e, t) {
    return t
      ? ke(t, () => {
          let n = Z(),
            r = n ? ho(n) : Ai(t);
          return [n ? Re(n) : hr(e, t), r];
        })
      : [void 0, void 0];
  }
  var bf = { trace: 1, debug: 5, info: 9, warn: 13, error: 17, fatal: 21 };
  function mS(e) {
    return [
      { type: 'log', item_count: e.length, content_type: 'application/vnd.sentry.items.log+json' },
      { items: e },
    ];
  }
  function Tf(e, t, n, r) {
    let o = {};
    return (
      t?.sdk && (o.sdk = { name: t.sdk.name, version: t.sdk.version }),
      n && r && (o.dsn = Ve(r)),
      Oe(o, [mS(e)])
    );
  }
  var hS = 100;
  function gS(e) {
    switch (typeof e) {
      case 'number':
        return Number.isInteger(e) ? { value: e, type: 'integer' } : { value: e, type: 'double' };
      case 'boolean':
        return { value: e, type: 'boolean' };
      case 'string':
        return { value: e, type: 'string' };
      default: {
        let t = '';
        try {
          t = JSON.stringify(e) ?? '';
        } catch {}
        return { value: t, type: 'string' };
      }
    }
  }
  function Jt(e, t, n, r = !0) {
    n && (!e[t] || r) && (e[t] = n);
  }
  function If(e, t) {
    let n = Pc(),
      r = vf(e);
    r === void 0 ? n.set(e, [t]) : (n.set(e, [...r, t]), r.length >= hS && br(e, r));
  }
  function xn(e, t = M(), n = If) {
    let r = t?.getClient() ?? b();
    if (!r) {
      y && h.warn('No client available to capture log.');
      return;
    }
    let { release: o, environment: i, enableLogs: s = !1, beforeSendLog: a } = r.getOptions();
    if (!s) {
      y && h.warn('logging option not enabled, log will not be captured.');
      return;
    }
    let [, c] = ns(r, t),
      u = { ...e.attributes },
      {
        user: { id: d, email: l, username: p },
      } = _S(t);
    (Jt(u, 'user.id', d, !1),
      Jt(u, 'user.email', l, !1),
      Jt(u, 'user.name', p, !1),
      Jt(u, 'sentry.release', o),
      Jt(u, 'sentry.environment', i));
    let { name: f, version: m } = r.getSdkMetadata()?.sdk ?? {};
    (Jt(u, 'sentry.sdk.name', f), Jt(u, 'sentry.sdk.version', m));
    let _ = r.getIntegrationByName('Replay'),
      g = _?.getReplayId(!0);
    (Jt(u, 'sentry.replay_id', g),
      g && _?.getRecordingMode() === 'buffer' && Jt(u, 'sentry._internal.replay_is_buffering', !0));
    let S = e.message;
    if (Sn(S)) {
      let { __sentry_template_string__: k, __sentry_template_values__: H = [] } = S;
      (H?.length && (u['sentry.message.template'] = k),
        H.forEach((x, L) => {
          u[`sentry.message.parameter.${L}`] = x;
        }));
    }
    let E = Lt(t);
    Jt(u, 'sentry.trace.parent_span_id', E?.spanContext().spanId);
    let P = { ...e, attributes: u };
    r.emit('beforeCaptureLog', P);
    let w = a ? Le(() => a(P)) : P;
    if (!w) {
      (r.recordDroppedEvent('before_send', 'log_item', 1),
        y && h.warn('beforeSendLog returned null, log will not be captured.'));
      return;
    }
    let { level: F, message: A, attributes: T = {}, severityNumber: R } = w,
      I = {
        timestamp: K(),
        level: F,
        body: A,
        trace_id: c?.trace_id,
        severity_number: R ?? bf[F],
        attributes: Object.keys(T).reduce((k, H) => ((k[H] = gS(T[H])), k), {}),
      };
    (n(r, I), r.emit('afterCaptureLog', w));
  }
  function br(e, t) {
    let n = t ?? vf(e) ?? [];
    if (n.length === 0) return;
    let r = e.getOptions(),
      o = Tf(n, r._metadata, r.tunnel, e.getDsn());
    (Pc().set(e, []), e.emit('flushLogs'), e.sendEnvelope(o));
  }
  function vf(e) {
    return Pc().get(e);
  }
  function _S(e) {
    let t = Dt().getScopeData();
    return (rn(t, se().getScopeData()), rn(t, e.getScopeData()), t);
  }
  function Pc() {
    return Ot('clientToLogBufferMap', () => new WeakMap());
  }
  function SS(e) {
    return [
      {
        type: 'trace_metric',
        item_count: e.length,
        content_type: 'application/vnd.sentry.items.trace-metric+json',
      },
      { items: e },
    ];
  }
  function wf(e, t, n, r) {
    let o = {};
    return (
      t?.sdk && (o.sdk = { name: t.sdk.name, version: t.sdk.version }),
      n && r && (o.dsn = Ve(r)),
      Oe(o, [SS(e)])
    );
  }
  var yS = 100;
  function ES(e) {
    switch (typeof e) {
      case 'number':
        return Number.isInteger(e) ? { value: e, type: 'integer' } : { value: e, type: 'double' };
      case 'boolean':
        return { value: e, type: 'boolean' };
      case 'string':
        return { value: e, type: 'string' };
      default: {
        let t = '';
        try {
          t = JSON.stringify(e) ?? '';
        } catch {}
        return { value: t, type: 'string' };
      }
    }
  }
  function sn(e, t, n, r = !0) {
    n && (r || !(t in e)) && (e[t] = n);
  }
  function Rf(e, t) {
    let n = Uc(),
      r = xf(e);
    r === void 0 ? n.set(e, [t]) : (n.set(e, [...r, t]), r.length >= yS && Tr(e, r));
  }
  function Fc(e, t) {
    let n = t?.scope ?? M(),
      r = t?.captureSerializedMetric ?? Rf,
      o = n?.getClient() ?? b();
    if (!o) {
      y && h.warn('No client available to capture metric.');
      return;
    }
    let { release: i, environment: s, _experiments: a } = o.getOptions();
    if (!a?.enableMetrics) {
      y && h.warn('metrics option not enabled, metric will not be captured.');
      return;
    }
    let [, c] = ns(o, n),
      u = { ...e.attributes },
      {
        user: { id: d, email: l, username: p },
      } = bS(n);
    (sn(u, 'user.id', d, !1),
      sn(u, 'user.email', l, !1),
      sn(u, 'user.name', p, !1),
      sn(u, 'sentry.release', i),
      sn(u, 'sentry.environment', s));
    let { name: f, version: m } = o.getSdkMetadata()?.sdk ?? {};
    (sn(u, 'sentry.sdk.name', f), sn(u, 'sentry.sdk.version', m));
    let _ = o.getIntegrationByName('Replay'),
      g = _?.getReplayId(!0);
    (sn(u, 'sentry.replay_id', g),
      g && _?.getRecordingMode() === 'buffer' && sn(u, 'sentry._internal.replay_is_buffering', g));
    let S = { ...e, attributes: u },
      E = a?.beforeSendMetric ? a.beforeSendMetric(S) : S;
    if (!E) {
      y && h.log('`beforeSendMetric` returned `null`, will not send metric.');
      return;
    }
    let P = {};
    for (let R in E.attributes) E.attributes[R] !== void 0 && (P[R] = ES(E.attributes[R]));
    let w = Lt(n),
      F = w ? w.spanContext().traceId : c?.trace_id,
      A = w ? w.spanContext().spanId : void 0,
      T = {
        timestamp: K(),
        trace_id: F,
        span_id: A,
        name: E.name,
        type: E.type,
        unit: E.unit,
        value: E.value,
        attributes: P,
      };
    (Le(() => {
      y && console.log('[Metric]', T);
    }),
      r(o, T),
      o.emit('afterCaptureMetric', S));
  }
  function Tr(e, t) {
    let n = t ?? xf(e) ?? [];
    if (n.length === 0) return;
    let r = e.getOptions(),
      o = wf(n, r._metadata, r.tunnel, e.getDsn());
    (Uc().set(e, []), e.emit('flushMetrics'), e.sendEnvelope(o));
  }
  function xf(e) {
    return Uc().get(e);
  }
  function bS(e) {
    let t = Dt().getScopeData();
    return (rn(t, se().getScopeData()), rn(t, e.getScopeData()), t);
  }
  function Uc() {
    return Ot('clientToMetricBufferMap', () => new WeakMap());
  }
  function Bc(e, t) {
    (t.debug === !0 &&
      (y
        ? h.enable()
        : Le(() => {
            console.warn(
              '[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.'
            );
          })),
      M().update(t.initialScope));
    let r = new e(t);
    return (rs(r), r.init(), r);
  }
  function rs(e) {
    M().setClient(e);
  }
  var Hc = Symbol.for('SentryBufferFullError');
  function Cf(e = 100) {
    let t = new Set();
    function n() {
      return t.size < e;
    }
    function r(s) {
      t.delete(s);
    }
    function o(s) {
      if (!n()) return $n(Hc);
      let a = s();
      return (
        t.add(a),
        a.then(
          () => r(a),
          () => r(a)
        ),
        a
      );
    }
    function i(s) {
      if (!t.size) return wn(!0);
      let a = Promise.allSettled(Array.from(t)).then(() => !0);
      if (!s) return a;
      let c = [a, new Promise((u) => setTimeout(() => u(!1), s))];
      return Promise.race(c);
    }
    return {
      get $() {
        return Array.from(t);
      },
      add: o,
      drain: i,
    };
  }
  function os(e, t = Date.now()) {
    let n = parseInt(`${e}`, 10);
    if (!isNaN(n)) return n * 1e3;
    let r = Date.parse(`${e}`);
    return isNaN(r) ? 6e4 : r - t;
  }
  function Af(e, t) {
    return e[t] || e.all || 0;
  }
  function Mo(e, t, n = Date.now()) {
    return Af(e, t) > n;
  }
  function Oo(e, { statusCode: t, headers: n }, r = Date.now()) {
    let o = { ...e },
      i = n?.['x-sentry-rate-limits'],
      s = n?.['retry-after'];
    if (i)
      for (let a of i.trim().split(',')) {
        let [c, u, , , d] = a.split(':', 5),
          l = parseInt(c, 10),
          p = (isNaN(l) ? 60 : l) * 1e3;
        if (!u) o.all = r + p;
        else
          for (let f of u.split(';'))
            f === 'metric_bucket'
              ? (!d || d.split(';').includes('custom')) && (o[f] = r + p)
              : (o[f] = r + p);
      }
    else s ? (o.all = r + os(s, r)) : t === 429 && (o.all = r + 60 * 1e3);
    return o;
  }
  var TS = 64;
  function Lo(e, t, n = Cf(e.bufferSize || TS)) {
    let r = {},
      o = (s) => n.drain(s);
    function i(s) {
      let a = [];
      if (
        (mt(s, (l, p) => {
          let f = ji(p);
          Mo(r, f) ? e.recordDroppedEvent('ratelimit_backoff', f) : a.push(l);
        }),
        a.length === 0)
      )
        return Promise.resolve({});
      let c = Oe(s[0], a),
        u = (l) => {
          mt(c, (p, f) => {
            e.recordDroppedEvent(l, ji(f));
          });
        },
        d = () =>
          t({ body: bn(c) }).then(
            (l) => (
              l.statusCode !== void 0 &&
                (l.statusCode < 200 || l.statusCode >= 300) &&
                y &&
                h.warn(`Sentry responded with status code ${l.statusCode} to sent event.`),
              (r = Oo(r, l)),
              l
            ),
            (l) => {
              throw (
                u('network_error'),
                y && h.error('Encountered error running transport request:', l),
                l
              );
            }
          );
      return n.add(d).then(
        (l) => l,
        (l) => {
          if (l === Hc)
            return (
              y && h.error('Skipped sending event because buffer is full.'),
              u('queue_overflow'),
              Promise.resolve({})
            );
          throw l;
        }
      );
    }
    return { send: i, flush: o };
  }
  var $c = 100,
    Wc = 5e3,
    IS = 36e5;
  function Gc(e) {
    function t(...n) {
      y && h.log('[Offline]:', ...n);
    }
    return (n) => {
      let r = e(n);
      if (!n.createStore) throw new Error('No `createStore` function was provided');
      let o = n.createStore(n),
        i = Wc,
        s;
      function a(l, p, f) {
        return zi(l, ['client_report']) ? !1 : n.shouldStore ? n.shouldStore(l, p, f) : !0;
      }
      function c(l) {
        (s && clearTimeout(s),
          (s = setTimeout(async () => {
            s = void 0;
            let p = await o.shift();
            p &&
              (t('Attempting to send previously queued event'),
              (p[0].sent_at = new Date().toISOString()),
              d(p, !0).catch((f) => {
                t('Failed to retry sending', f);
              }));
          }, l)),
          typeof s != 'number' && s.unref && s.unref());
      }
      function u() {
        s || (c(i), (i = Math.min(i * 2, IS)));
      }
      async function d(l, p = !1) {
        if (!p && zi(l, ['replay_event', 'replay_recording'])) return (await o.push(l), c($c), {});
        try {
          if (n.shouldSend && (await n.shouldSend(l)) === !1)
            throw new Error('Envelope not sent because `shouldSend` callback returned false');
          let f = await r.send(l),
            m = $c;
          if (f) {
            if (f.headers?.['retry-after']) m = os(f.headers['retry-after']);
            else if (f.headers?.['x-sentry-rate-limits']) m = 6e4;
            else if ((f.statusCode || 0) >= 400) return f;
          }
          return (c(m), (i = Wc), f);
        } catch (f) {
          if (await a(l, f, i))
            return (
              p ? await o.unshift(l) : await o.push(l),
              u(),
              t('Error sending. Event queued.', f),
              {}
            );
          throw f;
        }
      }
      return (
        n.flushAtStartup && u(),
        { send: d, flush: (l) => (l === void 0 && ((i = Wc), c($c)), r.flush(l)) }
      );
    };
  }
  function kf(e, t) {
    let n;
    return (mt(e, (r, o) => (t.includes(o) && (n = Array.isArray(r) ? r[1] : void 0), !!n)), n);
  }
  function vS(e, t) {
    return (n) => {
      let r = e(n);
      return {
        ...r,
        send: async (o) => {
          let i = kf(o, ['event', 'transaction', 'profile', 'replay_event']);
          return (i && (i.release = t), r.send(o));
        },
      };
    };
  }
  function wS(e, t) {
    return Oe(t ? { ...e[0], dsn: t } : e[0], e[1]);
  }
  function zc(e, t) {
    return (n) => {
      let r = e(n),
        o = new Map();
      function i(c, u) {
        let d = u ? `${c}:${u}` : c,
          l = o.get(d);
        if (!l) {
          let p = Oi(c);
          if (!p) return;
          let f = ko(p, n.tunnel);
          ((l = u ? vS(e, u)({ ...n, url: f }) : e({ ...n, url: f })), o.set(d, l));
        }
        return [c, l];
      }
      async function s(c) {
        function u(f) {
          let m = f?.length ? f : ['event'];
          return kf(c, m);
        }
        let d = t({ envelope: c, getEvent: u })
            .map((f) => (typeof f == 'string' ? i(f, void 0) : i(f.dsn, f.release)))
            .filter((f) => !!f),
          l = d.length ? d : [['', r]];
        return (await Promise.all(l.map(([f, m]) => m.send(wS(c, f)))))[0];
      }
      async function a(c) {
        let u = [...o.values(), r];
        return (await Promise.all(u.map((l) => l.flush(c)))).every((l) => l);
      }
      return { send: s, flush: a };
    };
  }
  var RS = 'thismessage:/';
  function Ir(e) {
    return 'isRelative' in e;
  }
  function Wn(e, t) {
    let n = e.indexOf('://') <= 0 && e.indexOf('//') !== 0,
      r = t ?? (n ? RS : void 0);
    try {
      if ('canParse' in URL && !URL.canParse(e, r)) return;
      let o = new URL(e, r);
      return n ? { isRelative: n, pathname: o.pathname, search: o.search, hash: o.hash } : o;
    } catch {}
  }
  function jc(e) {
    if (Ir(e)) return e.pathname;
    let t = new URL(e);
    return (
      (t.search = ''),
      (t.hash = ''),
      ['80', '443'].includes(t.port) && (t.port = ''),
      t.password && (t.password = '%filtered%'),
      t.username && (t.username = '%filtered%'),
      t.toString()
    );
  }
  function Ft(e) {
    if (!e) return {};
    let t = e.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!t) return {};
    let n = t[6] || '',
      r = t[8] || '';
    return { host: t[4], path: t[5], protocol: t[2], search: n, hash: r, relative: t[5] + n + r };
  }
  function Do(e) {
    return e.split(/[?#]/, 1)[0];
  }
  function Po(e, t) {
    let n = t?.getDsn(),
      r = t?.getOptions().tunnel;
    return CS(e, n) || xS(e, r);
  }
  function xS(e, t) {
    return t ? Nf(e) === Nf(t) : !1;
  }
  function CS(e, t) {
    let n = Wn(e);
    return !n || Ir(n)
      ? !1
      : t
        ? n.host.includes(t.host) && /(^|&|\?)sentry_key=/.test(n.search)
        : !1;
  }
  function Nf(e) {
    return e[e.length - 1] === '/' ? e.slice(0, -1) : e;
  }
  function is(e, ...t) {
    let n = new String(String.raw(e, ...t));
    return (
      (n.__sentry_template_string__ = e.join('\0').replace(/%/g, '%%').replace(/\0/g, '%s')),
      (n.__sentry_template_values__ = t),
      n
    );
  }
  var qc = is;
  function Vc(e) {
    'aggregates' in e
      ? e.attrs?.ip_address === void 0 && (e.attrs = { ...e.attrs, ip_address: '{{auto}}' })
      : e.ipAddress === void 0 && (e.ipAddress = '{{auto}}');
  }
  function Yc(e, t, n = [t], r = 'npm') {
    let o = e._metadata || {};
    (o.sdk ||
      (o.sdk = {
        name: `sentry.javascript.${t}`,
        packages: n.map((i) => ({ name: `${r}:@sentry/${i}`, version: nt })),
        version: nt,
      }),
      (e._metadata = o));
  }
  function Gn(e = {}) {
    let t = e.client || b();
    if (!xo() || !t) return {};
    let n = Ke(),
      r = vt(n);
    if (r.getTraceData) return r.getTraceData(e);
    let o = e.scope || M(),
      i = e.span || Z(),
      s = i ? go(i) : AS(o),
      a = i ? Re(i) : hr(t, o),
      c = Mi(a);
    if (!Di.test(s)) return (h.warn('Invalid sentry-trace data. Cannot generate trace data'), {});
    let d = { 'sentry-trace': s, baggage: c };
    if (e.propagateTraceparent) {
      let l = i ? Fd(i) : kS(o);
      l && (d.traceparent = l);
    }
    return d;
  }
  function AS(e) {
    let { traceId: t, sampled: n, propagationSpanId: r } = e.getPropagationContext();
    return mo(t, r, n);
  }
  function kS(e) {
    let { traceId: t, sampled: n, propagationSpanId: r } = e.getPropagationContext();
    return Pi(t, r, n);
  }
  function Jc(e, t, n) {
    let r,
      o,
      i,
      s = n?.maxWait ? Math.max(n.maxWait, t) : 0,
      a = n?.setTimeoutImpl || setTimeout;
    function c() {
      return (u(), (r = e()), r);
    }
    function u() {
      (o !== void 0 && clearTimeout(o), i !== void 0 && clearTimeout(i), (o = i = void 0));
    }
    function d() {
      return o !== void 0 || i !== void 0 ? c() : r;
    }
    function l() {
      return (o && clearTimeout(o), (o = a(c, t)), s && i === void 0 && (i = a(c, s)), r);
    }
    return ((l.cancel = u), (l.flush = d), l);
  }
  var NS = 100;
  function Ze(e, t) {
    let n = b(),
      r = se();
    if (!n) return;
    let { beforeBreadcrumb: o = null, maxBreadcrumbs: i = NS } = n.getOptions();
    if (i <= 0) return;
    let a = { timestamp: dt(), ...e },
      c = o ? Le(() => o(a, t)) : a;
    c !== null && (n.emit && n.emit('beforeAddBreadcrumb', c, t), r.addBreadcrumb(c, i));
  }
  var Mf,
    MS = 'FunctionToString',
    Of = new WeakMap(),
    OS = () => ({
      name: MS,
      setupOnce() {
        Mf = Function.prototype.toString;
        try {
          Function.prototype.toString = function (...e) {
            let t = Fn(this),
              n = Of.has(b()) && t !== void 0 ? t : this;
            return Mf.apply(n, e);
          };
        } catch {}
      },
      setup(e) {
        Of.set(e, !0);
      },
    }),
    Fo = OS;
  var LS = [
      /^Script error\.?$/,
      /^Javascript error: Script error\.? on line 0$/,
      /^ResizeObserver loop completed with undelivered notifications.$/,
      /^Cannot redefine property: googletag$/,
      /^Can't find variable: gmo$/,
      /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
      `can't redefine non-configurable property "solana"`,
      "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)",
      "Can't find variable: _AutofillCallbackHandler",
      /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/,
      /^Java exception was raised during method invocation$/,
    ],
    DS = 'EventFilters',
    as = (e = {}) => {
      let t;
      return {
        name: DS,
        setup(n) {
          let r = n.getOptions();
          t = Lf(e, r);
        },
        processEvent(n, r, o) {
          if (!t) {
            let i = o.getOptions();
            t = Lf(e, i);
          }
          return PS(n, t) ? null : n;
        },
      };
    },
    Uo = (e = {}) => ({ ...as(e), name: 'InboundFilters' });
  function Lf(e = {}, t = {}) {
    return {
      allowUrls: [...(e.allowUrls || []), ...(t.allowUrls || [])],
      denyUrls: [...(e.denyUrls || []), ...(t.denyUrls || [])],
      ignoreErrors: [
        ...(e.ignoreErrors || []),
        ...(t.ignoreErrors || []),
        ...(e.disableErrorDefaults ? [] : LS),
      ],
      ignoreTransactions: [...(e.ignoreTransactions || []), ...(t.ignoreTransactions || [])],
    };
  }
  function PS(e, t) {
    if (e.type) {
      if (e.type === 'transaction' && US(e, t.ignoreTransactions))
        return (
          y &&
            h.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${jt(e)}`),
          !0
        );
    } else {
      if (FS(e, t.ignoreErrors))
        return (
          y &&
            h.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${jt(e)}`),
          !0
        );
      if (WS(e))
        return (
          y &&
            h.warn(`Event dropped due to not having an error message, error type or stacktrace.
Event: ${jt(e)}`),
          !0
        );
      if (BS(e, t.denyUrls))
        return (
          y &&
            h.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${jt(e)}.
Url: ${ss(e)}`),
          !0
        );
      if (!HS(e, t.allowUrls))
        return (
          y &&
            h.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${jt(e)}.
Url: ${ss(e)}`),
          !0
        );
    }
    return !1;
  }
  function FS(e, t) {
    return t?.length ? es(e).some((n) => Ue(n, t)) : !1;
  }
  function US(e, t) {
    if (!t?.length) return !1;
    let n = e.transaction;
    return n ? Ue(n, t) : !1;
  }
  function BS(e, t) {
    if (!t?.length) return !1;
    let n = ss(e);
    return n ? Ue(n, t) : !1;
  }
  function HS(e, t) {
    if (!t?.length) return !0;
    let n = ss(e);
    return n ? Ue(n, t) : !0;
  }
  function $S(e = []) {
    for (let t = e.length - 1; t >= 0; t--) {
      let n = e[t];
      if (n && n.filename !== '<anonymous>' && n.filename !== '[native code]')
        return n.filename || null;
    }
    return null;
  }
  function ss(e) {
    try {
      let n = [...(e.exception?.values ?? [])]
        .reverse()
        .find((r) => r.mechanism?.parent_id === void 0 && r.stacktrace?.frames?.length)
        ?.stacktrace?.frames;
      return n ? $S(n) : null;
    } catch {
      return (y && h.error(`Cannot extract url for event ${jt(e)}`), null);
    }
  }
  function WS(e) {
    return e.exception?.values?.length
      ? !e.message &&
          !e.exception.values.some((t) => t.stacktrace || (t.type && t.type !== 'Error') || t.value)
      : !1;
  }
  function Xc(e, t, n, r, o, i) {
    if (!o.exception?.values || !i || !lt(i.originalException, Error)) return;
    let s =
      o.exception.values.length > 0 ? o.exception.values[o.exception.values.length - 1] : void 0;
    s && (o.exception.values = Kc(e, t, r, i.originalException, n, o.exception.values, s, 0));
  }
  function Kc(e, t, n, r, o, i, s, a) {
    if (i.length >= n + 1) return i;
    let c = [...i];
    if (lt(r[o], Error)) {
      Df(s, a);
      let u = e(t, r[o]),
        d = c.length;
      (Pf(u, o, d, a), (c = Kc(e, t, n, r[o], o, [u, ...c], u, d)));
    }
    return (
      Array.isArray(r.errors) &&
        r.errors.forEach((u, d) => {
          if (lt(u, Error)) {
            Df(s, a);
            let l = e(t, u),
              p = c.length;
            (Pf(l, `errors[${d}]`, p, a), (c = Kc(e, t, n, u, o, [l, ...c], l, p)));
          }
        }),
      c
    );
  }
  function Df(e, t) {
    e.mechanism = {
      handled: !0,
      type: 'auto.core.linked_errors',
      ...e.mechanism,
      ...(e.type === 'AggregateError' && { is_exception_group: !0 }),
      exception_id: t,
    };
  }
  function Pf(e, t, n, r) {
    e.mechanism = {
      handled: !0,
      ...e.mechanism,
      type: 'chained',
      source: t,
      exception_id: n,
      parent_id: r,
    };
  }
  var Uf = new Map(),
    Ff = new Set();
  function GS(e) {
    if (v._sentryModuleMetadata)
      for (let t of Object.keys(v._sentryModuleMetadata)) {
        let n = v._sentryModuleMetadata[t];
        if (Ff.has(t)) continue;
        Ff.add(t);
        let r = e(t);
        for (let o of r.reverse())
          if (o.filename) {
            Uf.set(o.filename, n);
            break;
          }
      }
  }
  function zS(e, t) {
    return (GS(e), Uf.get(t));
  }
  function cs(e, t) {
    t.exception?.values?.forEach((n) => {
      n.stacktrace?.frames?.forEach((r) => {
        if (!r.filename || r.module_metadata) return;
        let o = zS(e, r.filename);
        o && (r.module_metadata = o);
      });
    });
  }
  function us(e) {
    e.exception?.values?.forEach((t) => {
      t.stacktrace?.frames?.forEach((n) => {
        delete n.module_metadata;
      });
    });
  }
  var Zc = () => ({
    name: 'ModuleMetadata',
    setup(e) {
      (e.on('beforeEnvelope', (t) => {
        mt(t, (n, r) => {
          if (r === 'event') {
            let o = Array.isArray(n) ? n[1] : void 0;
            o && (us(o), (n[1] = o));
          }
        });
      }),
        e.on('applyFrameMetadata', (t) => {
          if (t.type) return;
          let n = e.getOptions().stackParser;
          cs(n, t);
        }));
    },
  });
  function zn(e) {
    let t = 'console';
    ($e(t, e), We(t, jS));
  }
  function jS() {
    'console' in v &&
      Ln.forEach(function (e) {
        e in v.console &&
          be(v.console, e, function (t) {
            return (
              (ir[e] = t),
              function (...n) {
                (xe('console', { args: n, level: e }), ir[e]?.apply(v.console, n));
              }
            );
          });
      });
  }
  function jn(e) {
    return e === 'warn'
      ? 'warning'
      : ['fatal', 'error', 'warning', 'log', 'info', 'debug'].includes(e)
        ? e
        : 'log';
  }
  var qS = 'CaptureConsole',
    VS = (e = {}) => {
      let t = e.levels || Ln,
        n = e.handled ?? !0;
      return {
        name: qS,
        setup(r) {
          'console' in v &&
            zn(({ args: o, level: i }) => {
              b() !== r || !t.includes(i) || YS(o, i, n);
            });
        },
      };
    },
    Qc = VS;
  function YS(e, t, n) {
    let r = { level: jn(t), extra: { arguments: e } };
    ke((o) => {
      if (
        (o.addEventProcessor(
          (a) => (
            (a.logger = 'console'),
            ze(a, { handled: n, type: 'auto.core.capture_console' }),
            a
          )
        ),
        t === 'assert')
      ) {
        if (!e[0]) {
          let a = `Assertion failed: ${Pn(e.slice(1), ' ') || 'console.assert'}`;
          (o.setExtra('arguments', e.slice(1)), Rn(a, r));
        }
        return;
      }
      let i = e.find((a) => a instanceof Error);
      if (i) {
        ht(i, r);
        return;
      }
      let s = Pn(e, ' ');
      Rn(s, r);
    });
  }
  var JS = 'Dedupe',
    KS = () => {
      let e;
      return {
        name: JS,
        processEvent(t) {
          if (t.type) return t;
          try {
            if (XS(t, e))
              return (
                y && h.warn('Event dropped due to being a duplicate of previously captured event.'),
                null
              );
          } catch {}
          return (e = t);
        },
      };
    },
    Bo = KS;
  function XS(e, t) {
    return t ? !!(ZS(e, t) || QS(e, t)) : !1;
  }
  function ZS(e, t) {
    let n = e.message,
      r = t.message;
    return !((!n && !r) || (n && !r) || (!n && r) || n !== r || !$f(e, t) || !Hf(e, t));
  }
  function QS(e, t) {
    let n = Bf(t),
      r = Bf(e);
    return !(!n || !r || n.type !== r.type || n.value !== r.value || !$f(e, t) || !Hf(e, t));
  }
  function Hf(e, t) {
    let n = sr(e),
      r = sr(t);
    if (!n && !r) return !0;
    if ((n && !r) || (!n && r) || ((n = n), (r = r), r.length !== n.length)) return !1;
    for (let o = 0; o < r.length; o++) {
      let i = r[o],
        s = n[o];
      if (
        i.filename !== s.filename ||
        i.lineno !== s.lineno ||
        i.colno !== s.colno ||
        i.function !== s.function
      )
        return !1;
    }
    return !0;
  }
  function $f(e, t) {
    let n = e.fingerprint,
      r = t.fingerprint;
    if (!n && !r) return !0;
    if ((n && !r) || (!n && r)) return !1;
    ((n = n), (r = r));
    try {
      return n.join('') === r.join('');
    } catch {
      return !1;
    }
  }
  function Bf(e) {
    return e.exception?.values?.[0];
  }
  var ey = 'ExtraErrorData',
    ty = (e = {}) => {
      let { depth: t = 3, captureErrorCause: n = !0 } = e;
      return {
        name: ey,
        processEvent(r, o, i) {
          let { maxValueLength: s = 250 } = i.getOptions();
          return ny(r, o, t, n, s);
        },
      };
    },
    eu = ty;
  function ny(e, t = {}, n, r, o) {
    if (!t.originalException || !ot(t.originalException)) return e;
    let i = t.originalException.name || t.originalException.constructor.name,
      s = Wf(t.originalException, r, o);
    if (s) {
      let a = { ...e.contexts },
        c = Me(s, n);
      return (
        Ge(c) && (he(c, '__sentry_skip_normalization__', !0), (a[i] = c)),
        { ...e, contexts: a }
      );
    }
    return e;
  }
  function Wf(e, t, n) {
    try {
      let r = [
          'name',
          'message',
          'stack',
          'line',
          'column',
          'fileName',
          'lineNumber',
          'columnNumber',
          'toJSON',
        ],
        o = {};
      for (let i of Object.keys(e)) {
        if (r.indexOf(i) !== -1) continue;
        let s = e[i];
        o[i] = ot(s) || typeof s == 'string' ? It(`${s}`, n) : s;
      }
      if (t && e.cause !== void 0)
        if (ot(e.cause)) {
          let i = e.cause.name || e.cause.constructor.name;
          o.cause = { [i]: Wf(e.cause, !1, n) };
        } else o.cause = e.cause;
      if (typeof e.toJSON == 'function') {
        let i = e.toJSON();
        for (let s of Object.keys(i)) {
          let a = i[s];
          o[s] = ot(a) ? a.toString() : a;
        }
      }
      return o;
    } catch (r) {
      y && h.error('Unable to extract extra data from the Error object:', r);
    }
    return null;
  }
  function ry(e, t) {
    let n = 0;
    for (let r = e.length - 1; r >= 0; r--) {
      let o = e[r];
      o === '.' ? e.splice(r, 1) : o === '..' ? (e.splice(r, 1), n++) : n && (e.splice(r, 1), n--);
    }
    if (t) for (; n--; n) e.unshift('..');
    return e;
  }
  var oy = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
  function iy(e) {
    let t = e.length > 1024 ? `<truncated>${e.slice(-1024)}` : e,
      n = oy.exec(t);
    return n ? n.slice(1) : [];
  }
  function Gf(...e) {
    let t = '',
      n = !1;
    for (let r = e.length - 1; r >= -1 && !n; r--) {
      let o = r >= 0 ? e[r] : '/';
      o && ((t = `${o}/${t}`), (n = o.charAt(0) === '/'));
    }
    return (
      (t = ry(
        t.split('/').filter((r) => !!r),
        !n
      ).join('/')),
      (n ? '/' : '') + t || '.'
    );
  }
  function zf(e) {
    let t = 0;
    for (; t < e.length && e[t] === ''; t++);
    let n = e.length - 1;
    for (; n >= 0 && e[n] === ''; n--);
    return t > n ? [] : e.slice(t, n - t + 1);
  }
  function jf(e, t) {
    ((e = Gf(e).slice(1)), (t = Gf(t).slice(1)));
    let n = zf(e.split('/')),
      r = zf(t.split('/')),
      o = Math.min(n.length, r.length),
      i = o;
    for (let a = 0; a < o; a++)
      if (n[a] !== r[a]) {
        i = a;
        break;
      }
    let s = [];
    for (let a = i; a < n.length; a++) s.push('..');
    return ((s = s.concat(r.slice(i))), s.join('/'));
  }
  function qf(e, t) {
    let n = iy(e)[2] || '';
    return (t && n.slice(t.length * -1) === t && (n = n.slice(0, n.length - t.length)), n);
  }
  var sy = 'RewriteFrames',
    tu = (e = {}) => {
      let t = e.root,
        n = e.prefix || 'app:///',
        r = 'window' in v && !!v.window,
        o = e.iteratee || ay({ isBrowser: r, root: t, prefix: n });
      function i(a) {
        try {
          return {
            ...a,
            exception: {
              ...a.exception,
              values: a.exception.values.map((c) => ({
                ...c,
                ...(c.stacktrace && { stacktrace: s(c.stacktrace) }),
              })),
            },
          };
        } catch {
          return a;
        }
      }
      function s(a) {
        return { ...a, frames: a?.frames?.map((c) => o(c)) };
      }
      return {
        name: sy,
        processEvent(a) {
          let c = a;
          return (a.exception && Array.isArray(a.exception.values) && (c = i(c)), c);
        },
      };
    };
  function ay({ isBrowser: e, root: t, prefix: n }) {
    return (r) => {
      if (!r.filename) return r;
      let o =
          /^[a-zA-Z]:\\/.test(r.filename) ||
          (r.filename.includes('\\') && !r.filename.includes('/')),
        i = /^\//.test(r.filename);
      if (e) {
        if (t) {
          let s = r.filename;
          s.indexOf(t) === 0 && (r.filename = s.replace(t, n));
        }
      } else if (o || i) {
        let s = o ? r.filename.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/') : r.filename,
          a = t ? jf(t, s) : qf(s);
        r.filename = `${n}${a}`;
      }
      return r;
    };
  }
  var cy = [
      'reauthenticate',
      'signInAnonymously',
      'signInWithOAuth',
      'signInWithIdToken',
      'signInWithOtp',
      'signInWithPassword',
      'signInWithSSO',
      'signOut',
      'signUp',
      'verifyOtp',
    ],
    uy = [
      'createUser',
      'deleteUser',
      'listUsers',
      'getUserById',
      'updateUserById',
      'inviteUserByEmail',
    ],
    ly = {
      eq: 'eq',
      neq: 'neq',
      gt: 'gt',
      gte: 'gte',
      lt: 'lt',
      lte: 'lte',
      like: 'like',
      'like(all)': 'likeAllOf',
      'like(any)': 'likeAnyOf',
      ilike: 'ilike',
      'ilike(all)': 'ilikeAllOf',
      'ilike(any)': 'ilikeAnyOf',
      is: 'is',
      in: 'in',
      cs: 'contains',
      cd: 'containedBy',
      sr: 'rangeGt',
      nxl: 'rangeGte',
      sl: 'rangeLt',
      nxr: 'rangeLte',
      adj: 'rangeAdjacent',
      ov: 'overlaps',
      fts: '',
      plfts: 'plain',
      phfts: 'phrase',
      wfts: 'websearch',
      not: 'not',
    },
    Yf = ['select', 'insert', 'upsert', 'update', 'delete'];
  function ls(e) {
    try {
      e.__SENTRY_INSTRUMENTED__ = !0;
    } catch {}
  }
  function ds(e) {
    try {
      return e.__SENTRY_INSTRUMENTED__;
    } catch {
      return !1;
    }
  }
  function dy(e, t = {}) {
    switch (e) {
      case 'GET':
        return 'select';
      case 'POST':
        return t.Prefer?.includes('resolution=') ? 'upsert' : 'insert';
      case 'PATCH':
        return 'update';
      case 'DELETE':
        return 'delete';
      default:
        return '<unknown-op>';
    }
  }
  function fy(e, t) {
    if (t === '' || t === '*') return 'select(*)';
    if (e === 'select') return `select(${t})`;
    if (e === 'or' || e.endsWith('.or')) return `${e}${t}`;
    let [n, ...r] = t.split('.'),
      o;
    return (
      n?.startsWith('fts')
        ? (o = 'textSearch')
        : n?.startsWith('plfts')
          ? (o = 'textSearch[plain]')
          : n?.startsWith('phfts')
            ? (o = 'textSearch[phrase]')
            : n?.startsWith('wfts')
              ? (o = 'textSearch[websearch]')
              : (o = (n && ly[n]) || 'filter'),
      `${o}(${e}, ${r.join('.')})`
    );
  }
  function Vf(e, t = !1) {
    return new Proxy(e, {
      apply(n, r, o) {
        return In(
          {
            name: `auth ${t ? '(admin) ' : ''}${e.name}`,
            attributes: {
              [X]: 'auto.db.supabase',
              [Se]: 'db',
              'db.system': 'postgresql',
              'db.operation': `auth.${t ? 'admin.' : ''}${e.name}`,
            },
          },
          (i) =>
            Reflect.apply(n, r, o)
              .then(
                (s) => (
                  s && typeof s == 'object' && 'error' in s && s.error
                    ? (i.setStatus({ code: 2 }),
                      ht(s.error, { mechanism: { handled: !1, type: 'auto.db.supabase.auth' } }))
                    : i.setStatus({ code: 1 }),
                  i.end(),
                  s
                )
              )
              .catch((s) => {
                throw (
                  i.setStatus({ code: 2 }),
                  i.end(),
                  ht(s, { mechanism: { handled: !1, type: 'auto.db.supabase.auth' } }),
                  s
                );
              })
              .then(...o)
        );
      },
    });
  }
  function py(e) {
    let t = e.auth;
    if (!(!t || ds(e.auth))) {
      for (let n of cy) {
        let r = t[n];
        r && typeof e.auth[n] == 'function' && (e.auth[n] = Vf(r));
      }
      for (let n of uy) {
        let r = t.admin[n];
        r && typeof e.auth.admin[n] == 'function' && (e.auth.admin[n] = Vf(r, !0));
      }
      ls(e.auth);
    }
  }
  function my(e) {
    ds(e.prototype.from) ||
      ((e.prototype.from = new Proxy(e.prototype.from, {
        apply(t, n, r) {
          let o = Reflect.apply(t, n, r),
            i = o.constructor;
          return (gy(i), o);
        },
      })),
      ls(e.prototype.from));
  }
  function hy(e) {
    ds(e.prototype.then) ||
      ((e.prototype.then = new Proxy(e.prototype.then, {
        apply(t, n, r) {
          let o = Yf,
            i = n,
            s = dy(i.method, i.headers);
          if (!o.includes(s) || !i?.url?.pathname || typeof i.url.pathname != 'string')
            return Reflect.apply(t, n, r);
          let a = i.url.pathname.split('/'),
            c = a.length > 0 ? a[a.length - 1] : '',
            u = [];
          for (let [f, m] of i.url.searchParams.entries()) u.push(fy(f, m));
          let d = Object.create(null);
          if (Ge(i.body)) for (let [f, m] of Object.entries(i.body)) d[f] = m;
          let l = `${s === 'select' ? '' : `${s}${d ? '(...) ' : ''}`}${u.join(' ')} from(${c})`,
            p = {
              'db.table': c,
              'db.schema': i.schema,
              'db.url': i.url.origin,
              'db.sdk': i.headers['X-Client-Info'],
              'db.system': 'postgresql',
              'db.operation': s,
              [X]: 'auto.db.supabase',
              [Se]: 'db',
            };
          return (
            u.length && (p['db.query'] = u),
            Object.keys(d).length && (p['db.body'] = d),
            In({ name: l, attributes: p }, (f) =>
              Reflect.apply(t, n, [])
                .then(
                  (m) => {
                    if (
                      (f &&
                        (m && typeof m == 'object' && 'status' in m && Yt(f, m.status || 500),
                        f.end()),
                      m.error)
                    ) {
                      let S = new Error(m.error.message);
                      (m.error.code && (S.code = m.error.code),
                        m.error.details && (S.details = m.error.details));
                      let E = {};
                      (u.length && (E.query = u),
                        Object.keys(d).length && (E.body = d),
                        ht(
                          S,
                          (P) => (
                            P.addEventProcessor(
                              (w) => (ze(w, { handled: !1, type: 'auto.db.supabase.postgres' }), w)
                            ),
                            P.setContext('supabase', E),
                            P
                          )
                        ));
                    }
                    let _ = { type: 'supabase', category: `db.${s}`, message: l },
                      g = {};
                    return (
                      u.length && (g.query = u),
                      Object.keys(d).length && (g.body = d),
                      Object.keys(g).length && (_.data = g),
                      Ze(_),
                      m
                    );
                  },
                  (m) => {
                    throw (f && (Yt(f, 500), f.end()), m);
                  }
                )
                .then(...r)
            )
          );
        },
      })),
      ls(e.prototype.then));
  }
  function gy(e) {
    for (let t of Yf)
      ds(e.prototype[t]) ||
        ((e.prototype[t] = new Proxy(e.prototype[t], {
          apply(n, r, o) {
            let i = Reflect.apply(n, r, o),
              s = i.constructor;
            return (y && h.log(`Instrumenting ${t} operation's PostgRESTFilterBuilder`), hy(s), i);
          },
        })),
        ls(e.prototype[t]));
  }
  var fs = (e) => {
      if (!e) {
        y &&
          h.warn('Supabase integration was not installed because no Supabase client was provided.');
        return;
      }
      let t = e.constructor === Function ? e : e.constructor;
      (my(t), py(e));
    },
    _y = 'Supabase',
    Sy = (e) => ({
      setupOnce() {
        fs(e);
      },
      name: _y,
    }),
    nu = (e) => Sy(e.supabaseClient);
  var yy = 10,
    Ey = 'ZodErrors';
  function by(e) {
    return ot(e) && e.name === 'ZodError' && Array.isArray(e.issues);
  }
  function Ty(e) {
    return {
      ...e,
      path: 'path' in e && Array.isArray(e.path) ? e.path.join('.') : void 0,
      keys: 'keys' in e ? JSON.stringify(e.keys) : void 0,
      unionErrors: 'unionErrors' in e ? JSON.stringify(e.unionErrors) : void 0,
    };
  }
  function Iy(e) {
    return e.map((t) => (typeof t == 'number' ? '<array>' : t)).join('.');
  }
  function vy(e) {
    let t = new Set();
    for (let r of e.issues) {
      let o = Iy(r.path);
      o.length > 0 && t.add(o);
    }
    let n = Array.from(t);
    if (n.length === 0) {
      let r = 'variable';
      if (e.issues.length > 0) {
        let o = e.issues[0];
        o !== void 0 && 'expected' in o && typeof o.expected == 'string' && (r = o.expected);
      }
      return `Failed to validate ${r}`;
    }
    return `Failed to validate keys: ${It(n.join(', '), 100)}`;
  }
  function wy(e, t = !1, n, r) {
    if (
      !n.exception?.values ||
      !r.originalException ||
      !by(r.originalException) ||
      r.originalException.issues.length === 0
    )
      return n;
    try {
      let i = (t ? r.originalException.issues : r.originalException.issues.slice(0, e)).map(Ty);
      return (
        t &&
          (Array.isArray(r.attachments) || (r.attachments = []),
          r.attachments.push({ filename: 'zod_issues.json', data: JSON.stringify({ issues: i }) })),
        {
          ...n,
          exception: {
            ...n.exception,
            values: [
              { ...n.exception.values[0], value: vy(r.originalException) },
              ...n.exception.values.slice(1),
            ],
          },
          extra: { ...n.extra, 'zoderror.issues': i.slice(0, e) },
        }
      );
    } catch (o) {
      return {
        ...n,
        extra: {
          ...n.extra,
          'zoderrors sentry integration parse error': {
            message:
              'an exception was thrown while processing ZodError within applyZodErrorsToEvent()',
            error:
              o instanceof Error
                ? `${o.name}: ${o.message}
${o.stack}`
                : 'unknown',
          },
        },
      };
    }
  }
  var Ry = (e = {}) => {
      let t = e.limit ?? yy;
      return {
        name: Ey,
        processEvent(n, r) {
          return wy(t, e.saveZodIssuesAsAttachment, n, r);
        },
      };
    },
    ru = Ry;
  var ou = (e) => ({
    name: 'ThirdPartyErrorsFilter',
    setup(t) {
      (t.on('beforeEnvelope', (n) => {
        mt(n, (r, o) => {
          if (o === 'event') {
            let i = Array.isArray(r) ? r[1] : void 0;
            i && (us(i), (r[1] = i));
          }
        });
      }),
        t.on('applyFrameMetadata', (n) => {
          if (n.type) return;
          let r = t.getOptions().stackParser;
          cs(r, n);
        }));
    },
    processEvent(t) {
      let n = xy(t);
      if (n) {
        let r =
          e.behaviour === 'drop-error-if-contains-third-party-frames' ||
          e.behaviour === 'apply-tag-if-contains-third-party-frames'
            ? 'some'
            : 'every';
        if (n[r]((i) => !i.some((s) => e.filterKeys.includes(s)))) {
          if (
            e.behaviour === 'drop-error-if-contains-third-party-frames' ||
            e.behaviour === 'drop-error-if-exclusively-contains-third-party-frames'
          )
            return null;
          t.tags = { ...t.tags, third_party_code: !0 };
        }
      }
      return t;
    },
  });
  function xy(e) {
    let t = sr(e);
    if (t)
      return t
        .filter((n) => !!n.filename && (n.lineno ?? n.colno) != null)
        .map((n) =>
          n.module_metadata
            ? Object.keys(n.module_metadata)
                .filter((r) => r.startsWith(Jf))
                .map((r) => r.slice(Jf.length))
            : []
        );
  }
  var Jf = '_sentryBundlerPluginAppKey:';
  var Kf = 100,
    Xf = 10,
    ps = 'flag.evaluation.';
  function Ut(e) {
    let n = M().getScopeData().contexts.flags,
      r = n ? n.values : [];
    return (
      r.length &&
        (e.contexts === void 0 && (e.contexts = {}), (e.contexts.flags = { values: [...r] })),
      e
    );
  }
  function xt(e, t, n = Kf) {
    let r = M().getScopeData().contexts;
    r.flags || (r.flags = { values: [] });
    let o = r.flags.values;
    Cy(o, e, t, n);
  }
  function Cy(e, t, n, r) {
    if (typeof n != 'boolean') return;
    if (e.length > r) {
      y &&
        h.error(`[Feature Flags] insertToFlagBuffer called on a buffer larger than maxSize=${r}`);
      return;
    }
    let o = e.findIndex((i) => i.flag === t);
    (o !== -1 && e.splice(o, 1), e.length === r && e.shift(), e.push({ flag: t, result: n }));
  }
  function Ct(e, t, n = Xf) {
    if (typeof t != 'boolean') return;
    let r = Z();
    if (!r) return;
    let o = D(r).data;
    if (`${ps}${e}` in o) {
      r.setAttribute(`${ps}${e}`, t);
      return;
    }
    Object.keys(o).filter((s) => s.startsWith(ps)).length < n && r.setAttribute(`${ps}${e}`, t);
  }
  var iu = () => ({
    name: 'FeatureFlags',
    processEvent(e, t, n) {
      return Ut(e);
    },
    addFeatureFlag(e, t) {
      (xt(e, t), Ct(e, t));
    },
  });
  function su(e, t, n, r, o) {
    if (!e.fetchData) return;
    let { method: i, url: s } = e.fetchData,
      a = Ne() && t(s);
    if (e.endTimestamp && a) {
      let f = e.fetchData.__span;
      if (!f) return;
      let m = r[f];
      m && (ky(m, e), delete r[f]);
      return;
    }
    let { spanOrigin: c = 'auto.http.browser', propagateTraceparent: u = !1 } =
        typeof o == 'object' ? o : { spanOrigin: o },
      d = !!Z(),
      l = a && d ? st(My(s, i, c)) : new Ye();
    if (
      ((e.fetchData.__span = l.spanContext().spanId),
      (r[l.spanContext().spanId] = l),
      n(e.fetchData.url))
    ) {
      let f = e.args[0],
        m = e.args[1] || {},
        _ = Ay(f, m, Ne() && d ? l : void 0, u);
      _ && ((e.args[1] = m), (m.headers = _));
    }
    let p = b();
    if (p) {
      let f = {
        input: e.args,
        response: e.response,
        startTimestamp: e.startTimestamp,
        endTimestamp: e.endTimestamp,
      };
      p.emit('beforeOutgoingRequestSpan', l, f);
    }
    return l;
  }
  function Ay(e, t, n, r) {
    let o = Gn({ span: n, propagateTraceparent: r }),
      i = o['sentry-trace'],
      s = o.baggage,
      a = o.traceparent;
    if (!i) return;
    let c = t.headers || (vi(e) ? e.headers : void 0);
    if (c)
      if (Ny(c)) {
        let u = new Headers(c);
        if (
          (u.get('sentry-trace') || u.set('sentry-trace', i),
          r && a && !u.get('traceparent') && u.set('traceparent', a),
          s)
        ) {
          let d = u.get('baggage');
          d ? ms(d) || u.set('baggage', `${d},${s}`) : u.set('baggage', s);
        }
        return u;
      } else if (Array.isArray(c)) {
        let u = [...c];
        (c.find((l) => l[0] === 'sentry-trace') || u.push(['sentry-trace', i]),
          r && a && !c.find((l) => l[0] === 'traceparent') && u.push(['traceparent', a]));
        let d = c.find((l) => l[0] === 'baggage' && ms(l[1]));
        return (s && !d && u.push(['baggage', s]), u);
      } else {
        let u = 'sentry-trace' in c ? c['sentry-trace'] : void 0,
          d = 'traceparent' in c ? c.traceparent : void 0,
          l = 'baggage' in c ? c.baggage : void 0,
          p = l ? (Array.isArray(l) ? [...l] : [l]) : [],
          f = l && (Array.isArray(l) ? l.find((_) => ms(_)) : ms(l));
        s && !f && p.push(s);
        let m = { ...c, 'sentry-trace': u ?? i, baggage: p.length > 0 ? p.join(',') : void 0 };
        return (r && a && !d && (m.traceparent = a), m);
      }
    else return { ...o };
  }
  function ky(e, t) {
    if (t.response) {
      Yt(e, t.response.status);
      let n = t.response?.headers?.get('content-length');
      if (n) {
        let r = parseInt(n);
        r > 0 && e.setAttribute('http.response_content_length', r);
      }
    } else t.error && e.setStatus({ code: 2, message: 'internal_error' });
    e.end();
  }
  function ms(e) {
    return e.split(',').some((t) => t.trim().startsWith(Ni));
  }
  function Ny(e) {
    return typeof Headers < 'u' && lt(e, Headers);
  }
  function My(e, t, n) {
    let r = Wn(e);
    return { name: r ? `${t} ${jc(r)}` : t, attributes: Oy(e, r, t, n) };
  }
  function Oy(e, t, n, r) {
    let o = { url: e, type: 'fetch', 'http.method': n, [X]: r, [Se]: 'http.client' };
    return (
      t &&
        (Ir(t) || ((o['http.url'] = t.href), (o['server.address'] = t.host)),
        t.search && (o['http.query'] = t.search),
        t.hash && (o['http.fragment'] = t.hash)),
      o
    );
  }
  function Ho(e, t = {}, n = M()) {
    let { message: r, name: o, email: i, url: s, source: a, associatedEventId: c, tags: u } = e,
      d = {
        contexts: {
          feedback: {
            contact_email: i,
            name: o,
            message: r,
            url: s,
            source: a,
            associated_event_id: c,
          },
        },
        type: 'feedback',
        level: 'info',
        tags: u,
      },
      l = n?.getClient() || b();
    return (l && l.emit('beforeSendFeedback', d, t), n.captureEvent(d, t));
  }
  var hs = {};
  Pa(hs, {
    debug: () => Dy,
    error: () => Uy,
    fatal: () => By,
    fmt: () => qc,
    info: () => Py,
    trace: () => Ly,
    warn: () => Fy,
  });
  function vr(e, t, n, r, o) {
    xn({ level: e, message: t, attributes: n, severityNumber: o }, r);
  }
  function Ly(e, t, { scope: n } = {}) {
    vr('trace', e, t, n);
  }
  function Dy(e, t, { scope: n } = {}) {
    vr('debug', e, t, n);
  }
  function Py(e, t, { scope: n } = {}) {
    vr('info', e, t, n);
  }
  function Fy(e, t, { scope: n } = {}) {
    vr('warn', e, t, n);
  }
  function Uy(e, t, { scope: n } = {}) {
    vr('error', e, t, n);
  }
  function By(e, t, { scope: n } = {}) {
    vr('fatal', e, t, n);
  }
  function $o(e, t, n) {
    return 'util' in v && typeof v.util.format == 'function' ? v.util.format(...e) : Hy(e, t, n);
  }
  function Hy(e, t, n) {
    return e.map((r) => (bt(r) ? String(r) : JSON.stringify(Me(r, t, n)))).join(' ');
  }
  function Zf(e) {
    return /%[sdifocO]/.test(e);
  }
  function Qf(e, t) {
    let n = {},
      r = new Array(t.length).fill('{}').join(' ');
    return (
      (n['sentry.message.template'] = `${e} ${r}`),
      t.forEach((o, i) => {
        n[`sentry.message.parameter.${i}`] = o;
      }),
      n
    );
  }
  var $y = 'ConsoleLogs',
    ep = { [X]: 'auto.console.logging' },
    Wy = (e = {}) => {
      let t = e.levels || Ln;
      return {
        name: $y,
        setup(n) {
          let {
            enableLogs: r,
            normalizeDepth: o = 3,
            normalizeMaxBreadth: i = 1e3,
          } = n.getOptions();
          if (!r) {
            y && h.warn('`enableLogs` is not enabled, ConsoleLogs integration disabled');
            return;
          }
          zn(({ args: s, level: a }) => {
            if (b() !== n || !t.includes(a)) return;
            let c = s[0],
              u = s.slice(1);
            if (a === 'assert') {
              if (!c) {
                let f = u.length > 0 ? `Assertion failed: ${$o(u, o, i)}` : 'Assertion failed';
                xn({ level: 'error', message: f, attributes: ep });
              }
              return;
            }
            let d = a === 'log',
              l = s.length > 1 && typeof s[0] == 'string' && !Zf(s[0]),
              p = { ...ep, ...(l ? Qf(c, u) : {}) };
            xn({
              level: d ? 'info' : a,
              message: $o(s, o, i),
              severityNumber: d ? 10 : void 0,
              attributes: p,
            });
          });
        },
      };
    },
    au = Wy;
  var gs = {};
  Pa(gs, { count: () => Gy, distribution: () => jy, gauge: () => zy });
  function cu(e, t, n, r) {
    Fc(
      { type: e, name: t, value: n, unit: r?.unit, attributes: r?.attributes },
      { scope: r?.scope }
    );
  }
  function Gy(e, t = 1, n) {
    cu('counter', e, t, n);
  }
  function zy(e, t, n) {
    cu('gauge', e, t, n);
  }
  function jy(e, t, n) {
    cu('distribution', e, t, n);
  }
  var qy = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
  function uu(e = {}) {
    let t = new Set(e.levels ?? qy),
      n = e.client;
    return {
      log(r) {
        let { type: o, level: i, message: s, args: a, tag: c, date: u, ...d } = r,
          l = n || b();
        if (!l) return;
        let p = Jy(o, i);
        if (!t.has(p)) return;
        let { normalizeDepth: f = 3, normalizeMaxBreadth: m = 1e3 } = l.getOptions(),
          _ = [];
        (s && _.push(s), a && a.length > 0 && _.push($o(a, f, m)));
        let g = _.join(' ');
        ((d['sentry.origin'] = 'auto.logging.consola'),
          c && (d['consola.tag'] = c),
          o && (d['consola.type'] = o),
          i != null && typeof i == 'number' && (d['consola.level'] = i),
          xn({ level: p, message: g, attributes: d }));
      },
    };
  }
  var Vy = {
      silent: 'trace',
      fatal: 'fatal',
      error: 'error',
      warn: 'warn',
      log: 'info',
      info: 'info',
      success: 'info',
      fail: 'error',
      ready: 'info',
      start: 'info',
      box: 'info',
      debug: 'debug',
      trace: 'trace',
      verbose: 'debug',
      critical: 'fatal',
      notice: 'info',
    },
    Yy = { 0: 'fatal', 1: 'warn', 2: 'info', 3: 'info', 4: 'debug', 5: 'trace' };
  function Jy(e, t) {
    if (e === 'verbose') return 'debug';
    if (e === 'silent') return 'trace';
    if (e) {
      let n = Vy[e];
      if (n) return n;
    }
    if (typeof t == 'number') {
      let n = Yy[t];
      if (n) return n;
    }
    return 'info';
  }
  function _s(e) {
    if (e !== void 0) return e >= 400 && e < 500 ? 'warning' : e >= 500 ? 'error' : void 0;
  }
  var wr = v;
  function lu() {
    return 'history' in wr && !!wr.history;
  }
  function Ky() {
    if (!('fetch' in wr)) return !1;
    try {
      return (new Headers(), new Request('http://www.example.com'), new Response(), !0);
    } catch {
      return !1;
    }
  }
  function Wo(e) {
    return e && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(e.toString());
  }
  function Go() {
    if (typeof EdgeRuntime == 'string') return !0;
    if (!Ky()) return !1;
    if (Wo(wr.fetch)) return !0;
    let e = !1,
      t = wr.document;
    if (t && typeof t.createElement == 'function')
      try {
        let n = t.createElement('iframe');
        ((n.hidden = !0),
          t.head.appendChild(n),
          n.contentWindow?.fetch && (e = Wo(n.contentWindow.fetch)),
          t.head.removeChild(n));
      } catch (n) {
        y &&
          h.warn(
            'Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ',
            n
          );
      }
    return e;
  }
  function du() {
    return 'ReportingObserver' in wr;
  }
  function qn(e, t) {
    let n = 'fetch';
    ($e(n, e), We(n, () => np(void 0, t)));
  }
  function pu(e) {
    let t = 'fetch-body-resolved';
    ($e(t, e), We(t, () => np(Zy)));
  }
  function np(e, t = !1) {
    (t && !Go()) ||
      be(v, 'fetch', function (n) {
        return function (...r) {
          let o = new Error(),
            { method: i, url: s } = Qy(r),
            a = {
              args: r,
              fetchData: { method: i, url: s },
              startTimestamp: K() * 1e3,
              virtualError: o,
              headers: eE(r),
            };
          return (
            e || xe('fetch', { ...a }),
            n.apply(v, r).then(
              async (c) => (
                e ? e(c) : xe('fetch', { ...a, endTimestamp: K() * 1e3, response: c }),
                c
              ),
              (c) => {
                if (
                  (xe('fetch', { ...a, endTimestamp: K() * 1e3, error: c }),
                  ot(c) && c.stack === void 0 && ((c.stack = o.stack), he(c, 'framesToPop', 1)),
                  c instanceof TypeError &&
                    (c.message === 'Failed to fetch' ||
                      c.message === 'Load failed' ||
                      c.message === 'NetworkError when attempting to fetch resource.'))
                )
                  try {
                    let u = new URL(a.fetchData.url);
                    c.message = `${c.message} (${u.host})`;
                  } catch {}
                throw c;
              }
            )
          );
        };
      });
  }
  async function Xy(e, t) {
    if (e?.body) {
      let n = e.body,
        r = n.getReader(),
        o = setTimeout(() => {
          n.cancel().then(null, () => {});
        }, 90 * 1e3),
        i = !0;
      for (; i; ) {
        let s;
        try {
          s = setTimeout(() => {
            n.cancel().then(null, () => {});
          }, 5e3);
          let { done: a } = await r.read();
          (clearTimeout(s), a && (t(), (i = !1)));
        } catch {
          i = !1;
        } finally {
          clearTimeout(s);
        }
      }
      (clearTimeout(o), r.releaseLock(), n.cancel().then(null, () => {}));
    }
  }
  function Zy(e) {
    let t;
    try {
      t = e.clone();
    } catch {
      return;
    }
    Xy(t, () => {
      xe('fetch-body-resolved', { endTimestamp: K() * 1e3, response: e });
    });
  }
  function fu(e, t) {
    return !!e && typeof e == 'object' && !!e[t];
  }
  function tp(e) {
    return typeof e == 'string'
      ? e
      : e
        ? fu(e, 'url')
          ? e.url
          : e.toString
            ? e.toString()
            : ''
        : '';
  }
  function Qy(e) {
    if (e.length === 0) return { method: 'GET', url: '' };
    if (e.length === 2) {
      let [n, r] = e;
      return { url: tp(n), method: fu(r, 'method') ? String(r.method).toUpperCase() : 'GET' };
    }
    let t = e[0];
    return { url: tp(t), method: fu(t, 'method') ? String(t.method).toUpperCase() : 'GET' };
  }
  function eE(e) {
    let [t, n] = e;
    try {
      if (typeof n == 'object' && n !== null && 'headers' in n && n.headers)
        return new Headers(n.headers);
      if (vi(t)) return new Headers(t.headers);
    } catch {}
  }
  function mu() {
    return typeof __SENTRY_BROWSER_BUNDLE__ < 'u' && !!__SENTRY_BROWSER_BUNDLE__;
  }
  function hu() {
    return 'npm';
  }
  function rp() {
    return (
      !mu() &&
      Object.prototype.toString.call(typeof process < 'u' ? process : 0) === '[object process]'
    );
  }
  function Rr() {
    return typeof window < 'u' && (!rp() || tE());
  }
  function tE() {
    return v.process?.type === 'renderer';
  }
  var Ht = v,
    ue = Ht.document,
    zo = Ht.navigator,
    Ep = 'Report a Bug',
    nE = 'Cancel',
    rE = 'Send Bug Report',
    oE = 'Confirm',
    iE = 'Report a Bug',
    sE = 'your.email@example.org',
    aE = 'Email',
    cE = "What's the bug? What did you expect?",
    uE = 'Description',
    lE = 'Your Name',
    dE = 'Name',
    fE = 'Thank you for your report!',
    pE = '(required)',
    mE = 'Add a screenshot',
    hE = 'Remove screenshot',
    gE = 'Highlight',
    _E = 'Hide',
    SE = 'Remove',
    yE = 'widget',
    EE = 'api',
    bE = 5e3,
    wu = (e, t = { includeReplay: !0 }) => {
      if (!e.message) throw new Error('Unable to submit feedback with empty message');
      let n = b();
      if (!n) throw new Error('No client setup, cannot send feedback.');
      e.tags && Object.keys(e.tags).length && M().setTags(e.tags);
      let r = Ho({ source: EE, url: Xe(), ...e }, t);
      return new Promise((o, i) => {
        let s = setTimeout(() => i('Unable to determine if Feedback was correctly sent.'), 3e4),
          a = n.on('afterSendEvent', (c, u) => {
            if (c.event_id === r)
              return (
                clearTimeout(s),
                a(),
                u?.statusCode && u.statusCode >= 200 && u.statusCode < 300
                  ? o(r)
                  : u?.statusCode === 403
                    ? i(
                        'Unable to send feedback. This could be because this domain is not in your list of allowed domains.'
                      )
                    : i(
                        'Unable to send feedback. This could be because of network issues, or because you are using an ad-blocker.'
                      )
              );
          });
      });
    },
    bs = typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__;
  function TE() {
    return !(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(zo.userAgent) ||
      (/Macintosh/i.test(zo.userAgent) && zo.maxTouchPoints && zo.maxTouchPoints > 1) ||
      !isSecureContext
    );
  }
  function Ss(e, t) {
    return {
      ...e,
      ...t,
      tags: { ...e.tags, ...t.tags },
      onFormOpen: () => {
        (t.onFormOpen?.(), e.onFormOpen?.());
      },
      onFormClose: () => {
        (t.onFormClose?.(), e.onFormClose?.());
      },
      onSubmitSuccess: (n, r) => {
        (t.onSubmitSuccess?.(n, r), e.onSubmitSuccess?.(n, r));
      },
      onSubmitError: (n) => {
        (t.onSubmitError?.(n), e.onSubmitError?.(n));
      },
      onFormSubmitted: () => {
        (t.onFormSubmitted?.(), e.onFormSubmitted?.());
      },
      themeDark: { ...e.themeDark, ...t.themeDark },
      themeLight: { ...e.themeLight, ...t.themeLight },
    };
  }
  function IE(e) {
    let t = ue.createElement('style');
    return (
      (t.textContent = `
.widget__actor {
  position: fixed;
  z-index: var(--z-index);
  margin: var(--page-margin);
  inset: var(--actor-inset);

  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;

  font-family: inherit;
  font-size: var(--font-size);
  font-weight: 600;
  line-height: 1.14em;
  text-decoration: none;

  background: var(--actor-background, var(--background));
  border-radius: var(--actor-border-radius, 1.7em/50%);
  border: var(--actor-border, var(--border));
  box-shadow: var(--actor-box-shadow, var(--box-shadow));
  color: var(--actor-color, var(--foreground));
  fill: var(--actor-color, var(--foreground));
  cursor: pointer;
  opacity: 1;
  transition: transform 0.2s ease-in-out;
  transform: translate(0, 0) scale(1);
}
.widget__actor[aria-hidden="true"] {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translate(0, 16px) scale(0.98);
}

.widget__actor:hover {
  background: var(--actor-hover-background, var(--background));
  filter: var(--interactive-filter);
}

.widget__actor svg {
  width: 1.14em;
  height: 1.14em;
}

@media (max-width: 600px) {
  .widget__actor span {
    display: none;
  }
}
`),
      e && t.setAttribute('nonce', e),
      t
    );
  }
  function gt(e, t) {
    return (
      Object.entries(t).forEach(([n, r]) => {
        e.setAttributeNS(null, n, r);
      }),
      e
    );
  }
  var xr = 20,
    vE = 'http://www.w3.org/2000/svg';
  function wE() {
    let e = (a) => Ht.document.createElementNS(vE, a),
      t = gt(e('svg'), {
        width: `${xr}`,
        height: `${xr}`,
        viewBox: `0 0 ${xr} ${xr}`,
        fill: 'var(--actor-color, var(--foreground))',
      }),
      n = gt(e('g'), { clipPath: 'url(#clip0_57_80)' }),
      r = gt(e('path'), {
        'fill-rule': 'evenodd',
        'clip-rule': 'evenodd',
        d: 'M15.6622 15H12.3997C12.2129 14.9959 12.031 14.9396 11.8747 14.8375L8.04965 12.2H7.49956V19.1C7.4875 19.3348 7.3888 19.5568 7.22256 19.723C7.05632 19.8892 6.83435 19.9879 6.59956 20H2.04956C1.80193 19.9968 1.56535 19.8969 1.39023 19.7218C1.21511 19.5467 1.1153 19.3101 1.11206 19.0625V12.2H0.949652C0.824431 12.2017 0.700142 12.1783 0.584123 12.1311C0.468104 12.084 0.362708 12.014 0.274155 11.9255C0.185602 11.8369 0.115689 11.7315 0.0685419 11.6155C0.0213952 11.4995 -0.00202913 11.3752 -0.00034808 11.25V3.75C-0.00900498 3.62067 0.0092504 3.49095 0.0532651 3.36904C0.0972798 3.24712 0.166097 3.13566 0.255372 3.04168C0.344646 2.94771 0.452437 2.87327 0.571937 2.82307C0.691437 2.77286 0.82005 2.74798 0.949652 2.75H8.04965L11.8747 0.1625C12.031 0.0603649 12.2129 0.00407221 12.3997 0H15.6622C15.9098 0.00323746 16.1464 0.103049 16.3215 0.278167C16.4966 0.453286 16.5964 0.689866 16.5997 0.9375V3.25269C17.3969 3.42959 18.1345 3.83026 18.7211 4.41679C19.5322 5.22788 19.9878 6.32796 19.9878 7.47502C19.9878 8.62209 19.5322 9.72217 18.7211 10.5333C18.1345 11.1198 17.3969 11.5205 16.5997 11.6974V14.0125C16.6047 14.1393 16.5842 14.2659 16.5395 14.3847C16.4948 14.5035 16.4268 14.6121 16.3394 14.7042C16.252 14.7962 16.147 14.8698 16.0307 14.9206C15.9144 14.9714 15.7891 14.9984 15.6622 15ZM1.89695 10.325H1.88715V4.625H8.33715C8.52423 4.62301 8.70666 4.56654 8.86215 4.4625L12.6872 1.875H14.7247V13.125H12.6872L8.86215 10.4875C8.70666 10.3835 8.52423 10.327 8.33715 10.325H2.20217C2.15205 10.3167 2.10102 10.3125 2.04956 10.3125C1.9981 10.3125 1.94708 10.3167 1.89695 10.325ZM2.98706 12.2V18.1625H5.66206V12.2H2.98706ZM16.5997 9.93612V5.01393C16.6536 5.02355 16.7072 5.03495 16.7605 5.04814C17.1202 5.13709 17.4556 5.30487 17.7425 5.53934C18.0293 5.77381 18.2605 6.06912 18.4192 6.40389C18.578 6.73866 18.6603 7.10452 18.6603 7.47502C18.6603 7.84552 18.578 8.21139 18.4192 8.54616C18.2605 8.88093 18.0293 9.17624 17.7425 9.41071C17.4556 9.64518 17.1202 9.81296 16.7605 9.90191C16.7072 9.91509 16.6536 9.9265 16.5997 9.93612Z',
      });
    t.appendChild(n).appendChild(r);
    let o = e('defs'),
      i = gt(e('clipPath'), { id: 'clip0_57_80' }),
      s = gt(e('rect'), { width: `${xr}`, height: `${xr}`, fill: 'white' });
    return (i.appendChild(s), o.appendChild(i), t.appendChild(o).appendChild(i).appendChild(s), t);
  }
  function RE({ triggerLabel: e, triggerAriaLabel: t, shadow: n, styleNonce: r }) {
    let o = ue.createElement('button');
    if (
      ((o.type = 'button'),
      (o.className = 'widget__actor'),
      (o.ariaHidden = 'false'),
      (o.ariaLabel = t || e || Ep),
      o.appendChild(wE()),
      e)
    ) {
      let s = ue.createElement('span');
      (s.appendChild(ue.createTextNode(e)), o.appendChild(s));
    }
    let i = IE(r);
    return {
      el: o,
      appendToDom() {
        (n.appendChild(i), n.appendChild(o));
      },
      removeFromDom() {
        (o.remove(), i.remove());
      },
      show() {
        o.ariaHidden = 'false';
      },
      hide() {
        o.ariaHidden = 'true';
      },
    };
  }
  var bp = 'rgba(88, 74, 192, 1)',
    xE = {
      foreground: '#2b2233',
      background: '#ffffff',
      accentForeground: 'white',
      accentBackground: bp,
      successColor: '#268d75',
      errorColor: '#df3338',
      border: '1.5px solid rgba(41, 35, 47, 0.13)',
      boxShadow: '0px 4px 24px 0px rgba(43, 34, 51, 0.12)',
      outline: '1px auto var(--accent-background)',
      interactiveFilter: 'brightness(95%)',
    },
    op = {
      foreground: '#ebe6ef',
      background: '#29232f',
      accentForeground: 'white',
      accentBackground: bp,
      successColor: '#2da98c',
      errorColor: '#f55459',
      border: '1.5px solid rgba(235, 230, 239, 0.15)',
      boxShadow: '0px 4px 24px 0px rgba(43, 34, 51, 0.12)',
      outline: '1px auto var(--accent-background)',
      interactiveFilter: 'brightness(150%)',
    };
  function ip(e) {
    return `
  --foreground: ${e.foreground};
  --background: ${e.background};
  --accent-foreground: ${e.accentForeground};
  --accent-background: ${e.accentBackground};
  --success-color: ${e.successColor};
  --error-color: ${e.errorColor};
  --border: ${e.border};
  --box-shadow: ${e.boxShadow};
  --outline: ${e.outline};
  --interactive-filter: ${e.interactiveFilter};
  `;
  }
  function CE({ colorScheme: e, themeDark: t, themeLight: n, styleNonce: r }) {
    let o = ue.createElement('style');
    return (
      (o.textContent = `
:host {
  --font-family: system-ui, 'Helvetica Neue', Arial, sans-serif;
  --font-size: 14px;
  --z-index: 100000;

  --page-margin: 16px;
  --inset: auto 0 0 auto;
  --actor-inset: var(--inset);

  font-family: var(--font-family);
  font-size: var(--font-size);

  ${e !== 'system' ? 'color-scheme: only light;' : ''}

  ${ip(e === 'dark' ? { ...op, ...t } : { ...xE, ...n })}
}

${
  e === 'system'
    ? `
@media (prefers-color-scheme: dark) {
  :host {
    ${ip({ ...op, ...t })}
  }
}`
    : ''
}
}
`),
      r && o.setAttribute('nonce', r),
      o
    );
  }
  var xs =
    ({ lazyLoadIntegration: e, getModalIntegration: t, getScreenshotIntegration: n }) =>
    ({
      id: o = 'sentry-feedback',
      autoInject: i = !0,
      showBranding: s = !0,
      isEmailRequired: a = !1,
      isNameRequired: c = !1,
      showEmail: u = !0,
      showName: d = !0,
      enableScreenshot: l = !0,
      useSentryUser: p = { email: 'email', name: 'username' },
      tags: f,
      styleNonce: m,
      scriptNonce: _,
      colorScheme: g = 'system',
      themeLight: S = {},
      themeDark: E = {},
      addScreenshotButtonLabel: P = mE,
      cancelButtonLabel: w = nE,
      confirmButtonLabel: F = oE,
      emailLabel: A = aE,
      emailPlaceholder: T = sE,
      formTitle: R = iE,
      isRequiredLabel: I = pE,
      messageLabel: k = uE,
      messagePlaceholder: H = cE,
      nameLabel: x = dE,
      namePlaceholder: L = lE,
      removeScreenshotButtonLabel: q = hE,
      submitButtonLabel: J = rE,
      successMessageText: ne = fE,
      triggerLabel: C = Ep,
      triggerAriaLabel: z = '',
      highlightToolText: N = gE,
      hideToolText: $ = _E,
      removeHighlightText: Q = SE,
      onFormOpen: ae,
      onFormClose: we,
      onSubmitSuccess: ye,
      onSubmitError: mn,
      onFormSubmitted: Mt,
    } = {}) => {
      let yt = {
          id: o,
          autoInject: i,
          showBranding: s,
          isEmailRequired: a,
          isNameRequired: c,
          showEmail: u,
          showName: d,
          enableScreenshot: l,
          useSentryUser: p,
          tags: f,
          styleNonce: m,
          scriptNonce: _,
          colorScheme: g,
          themeDark: E,
          themeLight: S,
          triggerLabel: C,
          triggerAriaLabel: z,
          cancelButtonLabel: w,
          submitButtonLabel: J,
          confirmButtonLabel: F,
          formTitle: R,
          emailLabel: A,
          emailPlaceholder: T,
          messageLabel: k,
          messagePlaceholder: H,
          nameLabel: x,
          namePlaceholder: L,
          successMessageText: ne,
          isRequiredLabel: I,
          addScreenshotButtonLabel: P,
          removeScreenshotButtonLabel: q,
          highlightToolText: N,
          hideToolText: $,
          removeHighlightText: Q,
          onFormClose: we,
          onFormOpen: ae,
          onSubmitError: mn,
          onSubmitSuccess: ye,
          onFormSubmitted: Mt,
        },
        ct = null,
        hn = [],
        gn = (ce) => {
          if (!ct) {
            let Ee = ue.createElement('div');
            ((Ee.id = String(ce.id)),
              ue.body.appendChild(Ee),
              (ct = Ee.attachShadow({ mode: 'open' })),
              ct.appendChild(CE(ce)));
          }
          return ct;
        },
        no = async (ce) => {
          let Ee = ce.enableScreenshot && TE(),
            Et,
            Pe;
          try {
            ((Et = (t ? t() : await e('feedbackModalIntegration', _))()), Er(Et));
          } catch {
            throw (
              bs &&
                h.error(
                  '[Feedback] Error when trying to load feedback integrations. Try using `feedbackSyncIntegration` in your `Sentry.init`.'
                ),
              new Error('[Feedback] Missing feedback modal integration!')
            );
          }
          try {
            let zt = Ee ? (n ? n() : await e('feedbackScreenshotIntegration', _)) : void 0;
            zt && ((Pe = zt()), Er(Pe));
          } catch {
            bs &&
              h.error(
                '[Feedback] Missing feedback screenshot integration. Proceeding without screenshots.'
              );
          }
          let He = Et.createDialog({
            options: {
              ...ce,
              onFormClose: () => {
                (He?.close(), ce.onFormClose?.());
              },
              onFormSubmitted: () => {
                (He?.close(), ce.onFormSubmitted?.());
              },
            },
            screenshotIntegration: Pe,
            sendFeedback: wu,
            shadow: gn(ce),
          });
          return He;
        },
        Si = (ce, Ee = {}) => {
          let Et = Ss(yt, Ee),
            Pe =
              typeof ce == 'string'
                ? ue.querySelector(ce)
                : typeof ce.addEventListener == 'function'
                  ? ce
                  : null;
          if (!Pe)
            throw (
              bs && h.error('[Feedback] Unable to attach to target element'),
              new Error('Unable to attach to target element')
            );
          let He = null,
            zt = async () => {
              (He ||
                (He = await no({
                  ...Et,
                  onFormSubmitted: () => {
                    (He?.removeFromDom(), Et.onFormSubmitted?.());
                  },
                })),
                He.appendToDom(),
                He.open());
            };
          Pe.addEventListener('click', zt);
          let ee = () => {
            ((hn = hn.filter((ut) => ut !== ee)),
              He?.removeFromDom(),
              (He = null),
              Pe.removeEventListener('click', zt));
          };
          return (hn.push(ee), ee);
        },
        ro = (ce = {}) => {
          let Ee = Ss(yt, ce),
            Et = gn(Ee),
            Pe = RE({
              triggerLabel: Ee.triggerLabel,
              triggerAriaLabel: Ee.triggerAriaLabel,
              shadow: Et,
              styleNonce: m,
            });
          return (
            Si(Pe.el, {
              ...Ee,
              onFormOpen() {
                Pe.hide();
              },
              onFormClose() {
                Pe.show();
              },
              onFormSubmitted() {
                Pe.show();
              },
            }),
            Pe
          );
        };
      return {
        name: 'Feedback',
        setupOnce() {
          !Rr() ||
            !yt.autoInject ||
            (ue.readyState === 'loading'
              ? ue.addEventListener('DOMContentLoaded', () => ro().appendToDom())
              : ro().appendToDom());
        },
        attachTo: Si,
        createWidget(ce = {}) {
          let Ee = ro(Ss(yt, ce));
          return (Ee.appendToDom(), Ee);
        },
        async createForm(ce = {}) {
          return no(Ss(yt, ce));
        },
        remove() {
          (ct && (ct.parentElement?.remove(), (ct = null)), hn.forEach((ce) => ce()), (hn = []));
        },
      };
    };
  function Tp() {
    return b()?.getIntegrationByName('Feedback');
  }
  var Cs,
    de,
    Ip,
    Vn,
    sp,
    vp,
    bu,
    jo = {},
    Ru = [],
    AE = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
    xu = Array.isArray;
  function An(e, t) {
    for (var n in t) e[n] = t[n];
    return e;
  }
  function wp(e) {
    var t = e.parentNode;
    t && t.removeChild(e);
  }
  function V(e, t, n) {
    var r,
      o,
      i,
      s = {};
    for (i in t) i == 'key' ? (r = t[i]) : i == 'ref' ? (o = t[i]) : (s[i] = t[i]);
    if (
      (arguments.length > 2 && (s.children = arguments.length > 3 ? Cs.call(arguments, 2) : n),
      typeof e == 'function' && e.defaultProps != null)
    )
      for (i in e.defaultProps) s[i] === void 0 && (s[i] = e.defaultProps[i]);
    return Ts(e, s, r, o, null);
  }
  function Ts(e, t, n, r, o) {
    var i = {
      type: e,
      props: t,
      key: n,
      ref: r,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: void 0,
      __c: null,
      constructor: void 0,
      __v: o ?? ++Ip,
      __i: -1,
      __u: 0,
    };
    return (o == null && de.vnode != null && de.vnode(i), i);
  }
  function qo(e) {
    return e.children;
  }
  function Is(e, t) {
    ((this.props = e), (this.context = t));
  }
  function Ar(e, t) {
    if (t == null) return e.__ ? Ar(e.__, e.__i + 1) : null;
    for (var n; t < e.__k.length; t++) if ((n = e.__k[t]) != null && n.__e != null) return n.__e;
    return typeof e.type == 'function' ? Ar(e) : null;
  }
  function kE(e, t, n) {
    var r,
      o = e.__v,
      i = o.__e,
      s = e.__P;
    if (s)
      return (
        ((r = An({}, o)).__v = o.__v + 1),
        de.vnode && de.vnode(r),
        Cu(
          s,
          r,
          o,
          e.__n,
          s.ownerSVGElement !== void 0,
          32 & o.__u ? [i] : null,
          t,
          i ?? Ar(o),
          !!(32 & o.__u),
          n
        ),
        (r.__.__k[r.__i] = r),
        (r.__d = void 0),
        r.__e != i && Rp(r),
        r
      );
  }
  function Rp(e) {
    var t, n;
    if ((e = e.__) != null && e.__c != null) {
      for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
        if ((n = e.__k[t]) != null && n.__e != null) {
          e.__e = e.__c.base = n.__e;
          break;
        }
      return Rp(e);
    }
  }
  function ap(e) {
    ((!e.__d && (e.__d = !0) && Vn.push(e) && !Rs.__r++) || sp !== de.debounceRendering) &&
      ((sp = de.debounceRendering) || vp)(Rs);
  }
  function Rs() {
    var e,
      t,
      n,
      r = [],
      o = [];
    for (Vn.sort(bu); (e = Vn.shift()); )
      e.__d &&
        ((n = Vn.length),
        (t = kE(e, r, o) || t),
        n === 0 || Vn.length > n
          ? (Tu(r, t, o), (o.length = r.length = 0), (t = void 0), Vn.sort(bu))
          : t && de.__c && de.__c(t, Ru));
    (t && Tu(r, t, o), (Rs.__r = 0));
  }
  function xp(e, t, n, r, o, i, s, a, c, u, d) {
    var l,
      p,
      f,
      m,
      _,
      g = (r && r.__k) || Ru,
      S = t.length;
    for (n.__d = c, NE(n, t, g), c = n.__d, l = 0; l < S; l++)
      (f = n.__k[l]) != null &&
        typeof f != 'boolean' &&
        typeof f != 'function' &&
        ((p = f.__i === -1 ? jo : g[f.__i] || jo),
        (f.__i = l),
        Cu(e, f, p, o, i, s, a, c, u, d),
        (m = f.__e),
        f.ref && p.ref != f.ref && (p.ref && Au(p.ref, null, f), d.push(f.ref, f.__c || m, f)),
        _ == null && m != null && (_ = m),
        65536 & f.__u || p.__k === f.__k
          ? (c = Cp(f, c, e))
          : typeof f.type == 'function' && f.__d !== void 0
            ? (c = f.__d)
            : m && (c = m.nextSibling),
        (f.__d = void 0),
        (f.__u &= -196609));
    ((n.__d = c), (n.__e = _));
  }
  function NE(e, t, n) {
    var r,
      o,
      i,
      s,
      a,
      c = t.length,
      u = n.length,
      d = u,
      l = 0;
    for (e.__k = [], r = 0; r < c; r++)
      (o = e.__k[r] =
        (o = t[r]) == null || typeof o == 'boolean' || typeof o == 'function'
          ? null
          : typeof o == 'string' ||
              typeof o == 'number' ||
              typeof o == 'bigint' ||
              o.constructor == String
            ? Ts(null, o, null, null, o)
            : xu(o)
              ? Ts(qo, { children: o }, null, null, null)
              : o.constructor === void 0 && o.__b > 0
                ? Ts(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v)
                : o) != null
        ? ((o.__ = e),
          (o.__b = e.__b + 1),
          (a = ME(o, n, (s = r + l), d)),
          (o.__i = a),
          (i = null),
          a !== -1 && (d--, (i = n[a]) && (i.__u |= 131072)),
          i == null || i.__v === null
            ? (a == -1 && l--, typeof o.type != 'function' && (o.__u |= 65536))
            : a !== s &&
              (a === s + 1
                ? l++
                : a > s
                  ? d > c - s
                    ? (l += a - s)
                    : l--
                  : (l = a < s && a == s - 1 ? a - s : 0),
              a !== r + l && (o.__u |= 65536)))
        : (i = n[r]) &&
          i.key == null &&
          i.__e &&
          (i.__e == e.__d && (e.__d = Ar(i)), Iu(i, i, !1), (n[r] = null), d--);
    if (d)
      for (r = 0; r < u; r++)
        (i = n[r]) != null &&
          (131072 & i.__u) == 0 &&
          (i.__e == e.__d && (e.__d = Ar(i)), Iu(i, i));
  }
  function Cp(e, t, n) {
    var r, o;
    if (typeof e.type == 'function') {
      for (r = e.__k, o = 0; r && o < r.length; o++) r[o] && ((r[o].__ = e), (t = Cp(r[o], t, n)));
      return t;
    }
    e.__e != t && (n.insertBefore(e.__e, t || null), (t = e.__e));
    do t = t && t.nextSibling;
    while (t != null && t.nodeType === 8);
    return t;
  }
  function ME(e, t, n, r) {
    var o = e.key,
      i = e.type,
      s = n - 1,
      a = n + 1,
      c = t[n];
    if (c === null || (c && o == c.key && i === c.type)) return n;
    if (r > (c != null && (131072 & c.__u) == 0 ? 1 : 0))
      for (; s >= 0 || a < t.length; ) {
        if (s >= 0) {
          if ((c = t[s]) && (131072 & c.__u) == 0 && o == c.key && i === c.type) return s;
          s--;
        }
        if (a < t.length) {
          if ((c = t[a]) && (131072 & c.__u) == 0 && o == c.key && i === c.type) return a;
          a++;
        }
      }
    return -1;
  }
  function cp(e, t, n) {
    t[0] === '-'
      ? e.setProperty(t, n ?? '')
      : (e[t] = n == null ? '' : typeof n != 'number' || AE.test(t) ? n : n + 'px');
  }
  function ys(e, t, n, r, o) {
    var i;
    e: if (t === 'style')
      if (typeof n == 'string') e.style.cssText = n;
      else {
        if ((typeof r == 'string' && (e.style.cssText = r = ''), r))
          for (t in r) (n && t in n) || cp(e.style, t, '');
        if (n) for (t in n) (r && n[t] === r[t]) || cp(e.style, t, n[t]);
      }
    else if (t[0] === 'o' && t[1] === 'n')
      ((i = t !== (t = t.replace(/(PointerCapture)$|Capture$/i, '$1'))),
        (t = t.toLowerCase() in e ? t.toLowerCase().slice(2) : t.slice(2)),
        e.l || (e.l = {}),
        (e.l[t + i] = n),
        n
          ? r
            ? (n.u = r.u)
            : ((n.u = Date.now()), e.addEventListener(t, i ? lp : up, i))
          : e.removeEventListener(t, i ? lp : up, i));
    else {
      if (o) t = t.replace(/xlink(H|:h)/, 'h').replace(/sName$/, 's');
      else if (
        t !== 'width' &&
        t !== 'height' &&
        t !== 'href' &&
        t !== 'list' &&
        t !== 'form' &&
        t !== 'tabIndex' &&
        t !== 'download' &&
        t !== 'rowSpan' &&
        t !== 'colSpan' &&
        t !== 'role' &&
        t in e
      )
        try {
          e[t] = n ?? '';
          break e;
        } catch {}
      typeof n == 'function' ||
        (n == null || (n === !1 && t[4] !== '-') ? e.removeAttribute(t) : e.setAttribute(t, n));
    }
  }
  function up(e) {
    if (this.l) {
      var t = this.l[e.type + !1];
      if (e.t) {
        if (e.t <= t.u) return;
      } else e.t = Date.now();
      return t(de.event ? de.event(e) : e);
    }
  }
  function lp(e) {
    if (this.l) return this.l[e.type + !0](de.event ? de.event(e) : e);
  }
  function Cu(e, t, n, r, o, i, s, a, c, u) {
    var d,
      l,
      p,
      f,
      m,
      _,
      g,
      S,
      E,
      P,
      w,
      F,
      A,
      T,
      R,
      I = t.type;
    if (t.constructor !== void 0) return null;
    (128 & n.__u && ((c = !!(32 & n.__u)), (i = [(a = t.__e = n.__e)])), (d = de.__b) && d(t));
    e: if (typeof I == 'function')
      try {
        if (
          ((S = t.props),
          (E = (d = I.contextType) && r[d.__c]),
          (P = d ? (E ? E.props.value : d.__) : r),
          n.__c
            ? (g = (l = t.__c = n.__c).__ = l.__E)
            : ('prototype' in I && I.prototype.render
                ? (t.__c = l = new I(S, P))
                : ((t.__c = l = new Is(S, P)), (l.constructor = I), (l.render = LE)),
              E && E.sub(l),
              (l.props = S),
              l.state || (l.state = {}),
              (l.context = P),
              (l.__n = r),
              (p = l.__d = !0),
              (l.__h = []),
              (l._sb = [])),
          l.__s == null && (l.__s = l.state),
          I.getDerivedStateFromProps != null &&
            (l.__s == l.state && (l.__s = An({}, l.__s)),
            An(l.__s, I.getDerivedStateFromProps(S, l.__s))),
          (f = l.props),
          (m = l.state),
          (l.__v = t),
          p)
        )
          (I.getDerivedStateFromProps == null &&
            l.componentWillMount != null &&
            l.componentWillMount(),
            l.componentDidMount != null && l.__h.push(l.componentDidMount));
        else {
          if (
            (I.getDerivedStateFromProps == null &&
              S !== f &&
              l.componentWillReceiveProps != null &&
              l.componentWillReceiveProps(S, P),
            !l.__e &&
              ((l.shouldComponentUpdate != null && l.shouldComponentUpdate(S, l.__s, P) === !1) ||
                t.__v === n.__v))
          ) {
            for (
              t.__v !== n.__v && ((l.props = S), (l.state = l.__s), (l.__d = !1)),
                t.__e = n.__e,
                t.__k = n.__k,
                t.__k.forEach(function (k) {
                  k && (k.__ = t);
                }),
                w = 0;
              w < l._sb.length;
              w++
            )
              l.__h.push(l._sb[w]);
            ((l._sb = []), l.__h.length && s.push(l));
            break e;
          }
          (l.componentWillUpdate != null && l.componentWillUpdate(S, l.__s, P),
            l.componentDidUpdate != null &&
              l.__h.push(function () {
                l.componentDidUpdate(f, m, _);
              }));
        }
        if (
          ((l.context = P),
          (l.props = S),
          (l.__P = e),
          (l.__e = !1),
          (F = de.__r),
          (A = 0),
          'prototype' in I && I.prototype.render)
        ) {
          for (
            l.state = l.__s,
              l.__d = !1,
              F && F(t),
              d = l.render(l.props, l.state, l.context),
              T = 0;
            T < l._sb.length;
            T++
          )
            l.__h.push(l._sb[T]);
          l._sb = [];
        } else
          do
            ((l.__d = !1),
              F && F(t),
              (d = l.render(l.props, l.state, l.context)),
              (l.state = l.__s));
          while (l.__d && ++A < 25);
        ((l.state = l.__s),
          l.getChildContext != null && (r = An(An({}, r), l.getChildContext())),
          p || l.getSnapshotBeforeUpdate == null || (_ = l.getSnapshotBeforeUpdate(f, m)),
          xp(
            e,
            xu((R = d != null && d.type === qo && d.key == null ? d.props.children : d)) ? R : [R],
            t,
            n,
            r,
            o,
            i,
            s,
            a,
            c,
            u
          ),
          (l.base = t.__e),
          (t.__u &= -161),
          l.__h.length && s.push(l),
          g && (l.__E = l.__ = null));
      } catch (k) {
        ((t.__v = null),
          c || i != null
            ? ((t.__e = a), (t.__u |= c ? 160 : 32), (i[i.indexOf(a)] = null))
            : ((t.__e = n.__e), (t.__k = n.__k)),
          de.__e(k, t, n));
      }
    else
      i == null && t.__v === n.__v
        ? ((t.__k = n.__k), (t.__e = n.__e))
        : (t.__e = OE(n.__e, t, n, r, o, i, s, c, u));
    (d = de.diffed) && d(t);
  }
  function Tu(e, t, n) {
    for (var r = 0; r < n.length; r++) Au(n[r], n[++r], n[++r]);
    (de.__c && de.__c(t, e),
      e.some(function (o) {
        try {
          ((e = o.__h),
            (o.__h = []),
            e.some(function (i) {
              i.call(o);
            }));
        } catch (i) {
          de.__e(i, o.__v);
        }
      }));
  }
  function OE(e, t, n, r, o, i, s, a, c) {
    var u,
      d,
      l,
      p,
      f,
      m,
      _,
      g = n.props,
      S = t.props,
      E = t.type;
    if ((E === 'svg' && (o = !0), i != null)) {
      for (u = 0; u < i.length; u++)
        if (
          (f = i[u]) &&
          'setAttribute' in f == !!E &&
          (E ? f.localName === E : f.nodeType === 3)
        ) {
          ((e = f), (i[u] = null));
          break;
        }
    }
    if (e == null) {
      if (E === null) return document.createTextNode(S);
      ((e = o
        ? document.createElementNS('http://www.w3.org/2000/svg', E)
        : document.createElement(E, S.is && S)),
        (i = null),
        (a = !1));
    }
    if (E === null) g === S || (a && e.data === S) || (e.data = S);
    else {
      if (((i = i && Cs.call(e.childNodes)), (g = n.props || jo), !a && i != null))
        for (g = {}, u = 0; u < e.attributes.length; u++) g[(f = e.attributes[u]).name] = f.value;
      for (u in g)
        ((f = g[u]),
          u == 'children' ||
            (u == 'dangerouslySetInnerHTML'
              ? (l = f)
              : u === 'key' || u in S || ys(e, u, null, f, o)));
      for (u in S)
        ((f = S[u]),
          u == 'children'
            ? (p = f)
            : u == 'dangerouslySetInnerHTML'
              ? (d = f)
              : u == 'value'
                ? (m = f)
                : u == 'checked'
                  ? (_ = f)
                  : u === 'key' ||
                    (a && typeof f != 'function') ||
                    g[u] === f ||
                    ys(e, u, f, g[u], o));
      if (d)
        (a ||
          (l && (d.__html === l.__html || d.__html === e.innerHTML)) ||
          (e.innerHTML = d.__html),
          (t.__k = []));
      else if (
        (l && (e.innerHTML = ''),
        xp(
          e,
          xu(p) ? p : [p],
          t,
          n,
          r,
          o && E !== 'foreignObject',
          i,
          s,
          i ? i[0] : n.__k && Ar(n, 0),
          a,
          c
        ),
        i != null)
      )
        for (u = i.length; u--; ) i[u] != null && wp(i[u]);
      a ||
        ((u = 'value'),
        m !== void 0 &&
          (m !== e[u] || (E === 'progress' && !m) || (E === 'option' && m !== g[u])) &&
          ys(e, u, m, g[u], !1),
        (u = 'checked'),
        _ !== void 0 && _ !== e[u] && ys(e, u, _, g[u], !1));
    }
    return e;
  }
  function Au(e, t, n) {
    try {
      typeof e == 'function' ? e(t) : (e.current = t);
    } catch (r) {
      de.__e(r, n);
    }
  }
  function Iu(e, t, n) {
    var r, o;
    if (
      (de.unmount && de.unmount(e),
      (r = e.ref) && ((r.current && r.current !== e.__e) || Au(r, null, t)),
      (r = e.__c) != null)
    ) {
      if (r.componentWillUnmount)
        try {
          r.componentWillUnmount();
        } catch (i) {
          de.__e(i, t);
        }
      ((r.base = r.__P = null), (e.__c = void 0));
    }
    if ((r = e.__k))
      for (o = 0; o < r.length; o++) r[o] && Iu(r[o], t, n || typeof e.type != 'function');
    (n || e.__e == null || wp(e.__e), (e.__ = e.__e = e.__d = void 0));
  }
  function LE(e, t, n) {
    return this.constructor(e, n);
  }
  function DE(e, t, n) {
    var r, o, i, s;
    (de.__ && de.__(e, t),
      (o = (r = !1) ? null : t.__k),
      (i = []),
      (s = []),
      Cu(
        t,
        (e = t.__k = V(qo, null, [e])),
        o || jo,
        jo,
        t.ownerSVGElement !== void 0,
        o ? null : t.firstChild ? Cs.call(t.childNodes) : null,
        i,
        o ? o.__e : t.firstChild,
        r,
        s
      ),
      (e.__d = void 0),
      Tu(i, e, s));
  }
  ((Cs = Ru.slice),
    (de = {
      __e: function (e, t, n, r) {
        for (var o, i, s; (t = t.__); )
          if ((o = t.__c) && !o.__)
            try {
              if (
                ((i = o.constructor) &&
                  i.getDerivedStateFromError != null &&
                  (o.setState(i.getDerivedStateFromError(e)), (s = o.__d)),
                o.componentDidCatch != null && (o.componentDidCatch(e, r || {}), (s = o.__d)),
                s)
              )
                return (o.__E = o);
            } catch (a) {
              e = a;
            }
        throw e;
      },
    }),
    (Ip = 0),
    (Is.prototype.setState = function (e, t) {
      var n;
      ((n =
        this.__s != null && this.__s !== this.state ? this.__s : (this.__s = An({}, this.state))),
        typeof e == 'function' && (e = e(An({}, n), this.props)),
        e && An(n, e),
        e != null && this.__v && (t && this._sb.push(t), ap(this)));
    }),
    (Is.prototype.forceUpdate = function (e) {
      this.__v && ((this.__e = !0), e && this.__h.push(e), ap(this));
    }),
    (Is.prototype.render = qo),
    (Vn = []),
    (vp =
      typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout),
    (bu = function (e, t) {
      return e.__v.__b - t.__v.__b;
    }),
    (Rs.__r = 0));
  var an,
    le,
    gu,
    dp,
    kr = 0,
    Ap = [],
    vs = [],
    Te = de,
    fp = Te.__b,
    pp = Te.__r,
    mp = Te.diffed,
    hp = Te.__c,
    gp = Te.unmount,
    _p = Te.__;
  function Jn(e, t) {
    (Te.__h && Te.__h(le, e, kr || t), (kr = 0));
    var n = le.__H || (le.__H = { __: [], __h: [] });
    return (e >= n.__.length && n.__.push({ __V: vs }), n.__[e]);
  }
  function Yn(e) {
    return ((kr = 1), kp(Mp, e));
  }
  function kp(e, t, n) {
    var r = Jn(an++, 2);
    if (
      ((r.t = e),
      !r.__c &&
        ((r.__ = [
          n ? n(t) : Mp(void 0, t),
          function (a) {
            var c = r.__N ? r.__N[0] : r.__[0],
              u = r.t(c, a);
            c !== u && ((r.__N = [u, r.__[1]]), r.__c.setState({}));
          },
        ]),
        (r.__c = le),
        !le.u))
    ) {
      var o = function (a, c, u) {
        if (!r.__c.__H) return !0;
        var d = r.__c.__H.__.filter(function (p) {
          return !!p.__c;
        });
        if (
          d.every(function (p) {
            return !p.__N;
          })
        )
          return !i || i.call(this, a, c, u);
        var l = !1;
        return (
          d.forEach(function (p) {
            if (p.__N) {
              var f = p.__[0];
              ((p.__ = p.__N), (p.__N = void 0), f !== p.__[0] && (l = !0));
            }
          }),
          !(!l && r.__c.props === a) && (!i || i.call(this, a, c, u))
        );
      };
      le.u = !0;
      var i = le.shouldComponentUpdate,
        s = le.componentWillUpdate;
      ((le.componentWillUpdate = function (a, c, u) {
        if (this.__e) {
          var d = i;
          ((i = void 0), o(a, c, u), (i = d));
        }
        s && s.call(this, a, c, u);
      }),
        (le.shouldComponentUpdate = o));
    }
    return r.__N || r.__;
  }
  function PE(e, t) {
    var n = Jn(an++, 3);
    !Te.__s && ku(n.__H, t) && ((n.__ = e), (n.i = t), le.__H.__h.push(n));
  }
  function Np(e, t) {
    var n = Jn(an++, 4);
    !Te.__s && ku(n.__H, t) && ((n.__ = e), (n.i = t), le.__h.push(n));
  }
  function FE(e) {
    return (
      (kr = 5),
      Vo(function () {
        return { current: e };
      }, [])
    );
  }
  function UE(e, t, n) {
    ((kr = 6),
      Np(
        function () {
          return typeof e == 'function'
            ? (e(t()),
              function () {
                return e(null);
              })
            : e
              ? ((e.current = t()),
                function () {
                  return (e.current = null);
                })
              : void 0;
        },
        n == null ? n : n.concat(e)
      ));
  }
  function Vo(e, t) {
    var n = Jn(an++, 7);
    return ku(n.__H, t) ? ((n.__V = e()), (n.i = t), (n.__h = e), n.__V) : n.__;
  }
  function Cr(e, t) {
    return (
      (kr = 8),
      Vo(function () {
        return e;
      }, t)
    );
  }
  function BE(e) {
    var t = le.context[e.__c],
      n = Jn(an++, 9);
    return ((n.c = e), t ? (n.__ == null && ((n.__ = !0), t.sub(le)), t.props.value) : e.__);
  }
  function HE(e, t) {
    Te.useDebugValue && Te.useDebugValue(t ? t(e) : e);
  }
  function $E(e) {
    var t = Jn(an++, 10),
      n = Yn();
    return (
      (t.__ = e),
      le.componentDidCatch ||
        (le.componentDidCatch = function (r, o) {
          (t.__ && t.__(r, o), n[1](r));
        }),
      [
        n[0],
        function () {
          n[1](void 0);
        },
      ]
    );
  }
  function WE() {
    var e = Jn(an++, 11);
    if (!e.__) {
      for (var t = le.__v; t !== null && !t.__m && t.__ !== null; ) t = t.__;
      var n = t.__m || (t.__m = [0, 0]);
      e.__ = 'P' + n[0] + '-' + n[1]++;
    }
    return e.__;
  }
  function GE() {
    for (var e; (e = Ap.shift()); )
      if (e.__P && e.__H)
        try {
          (e.__H.__h.forEach(ws), e.__H.__h.forEach(vu), (e.__H.__h = []));
        } catch (t) {
          ((e.__H.__h = []), Te.__e(t, e.__v));
        }
  }
  ((Te.__b = function (e) {
    ((le = null), fp && fp(e));
  }),
    (Te.__ = function (e, t) {
      (t.__k && t.__k.__m && (e.__m = t.__k.__m), _p && _p(e, t));
    }),
    (Te.__r = function (e) {
      (pp && pp(e), (an = 0));
      var t = (le = e.__c).__H;
      (t &&
        (gu === le
          ? ((t.__h = []),
            (le.__h = []),
            t.__.forEach(function (n) {
              (n.__N && (n.__ = n.__N), (n.__V = vs), (n.__N = n.i = void 0));
            }))
          : (t.__h.forEach(ws), t.__h.forEach(vu), (t.__h = []), (an = 0))),
        (gu = le));
    }),
    (Te.diffed = function (e) {
      mp && mp(e);
      var t = e.__c;
      (t &&
        t.__H &&
        (t.__H.__h.length &&
          ((Ap.push(t) !== 1 && dp === Te.requestAnimationFrame) ||
            ((dp = Te.requestAnimationFrame) || zE)(GE)),
        t.__H.__.forEach(function (n) {
          (n.i && (n.__H = n.i), n.__V !== vs && (n.__ = n.__V), (n.i = void 0), (n.__V = vs));
        })),
        (gu = le = null));
    }),
    (Te.__c = function (e, t) {
      (t.some(function (n) {
        try {
          (n.__h.forEach(ws),
            (n.__h = n.__h.filter(function (r) {
              return !r.__ || vu(r);
            })));
        } catch (r) {
          (t.some(function (o) {
            o.__h && (o.__h = []);
          }),
            (t = []),
            Te.__e(r, n.__v));
        }
      }),
        hp && hp(e, t));
    }),
    (Te.unmount = function (e) {
      gp && gp(e);
      var t,
        n = e.__c;
      n &&
        n.__H &&
        (n.__H.__.forEach(function (r) {
          try {
            ws(r);
          } catch (o) {
            t = o;
          }
        }),
        (n.__H = void 0),
        t && Te.__e(t, n.__v));
    }));
  var Sp = typeof requestAnimationFrame == 'function';
  function zE(e) {
    var t,
      n = function () {
        (clearTimeout(r), Sp && cancelAnimationFrame(t), setTimeout(e));
      },
      r = setTimeout(n, 100);
    Sp && (t = requestAnimationFrame(n));
  }
  function ws(e) {
    var t = le,
      n = e.__c;
    (typeof n == 'function' && ((e.__c = void 0), n()), (le = t));
  }
  function vu(e) {
    var t = le;
    ((e.__c = e.__()), (le = t));
  }
  function ku(e, t) {
    return (
      !e ||
      e.length !== t.length ||
      t.some(function (n, r) {
        return n !== e[r];
      })
    );
  }
  function Mp(e, t) {
    return typeof t == 'function' ? t(e) : t;
  }
  var jE = Object.defineProperty(
      {
        __proto__: null,
        useCallback: Cr,
        useContext: BE,
        useDebugValue: HE,
        useEffect: PE,
        useErrorBoundary: $E,
        useId: WE,
        useImperativeHandle: UE,
        useLayoutEffect: Np,
        useMemo: Vo,
        useReducer: kp,
        useRef: FE,
        useState: Yn,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    ),
    qE = 'http://www.w3.org/2000/svg';
  function VE() {
    let e = (r) => ue.createElementNS(qE, r),
      t = gt(e('svg'), { width: '32', height: '30', viewBox: '0 0 72 66', fill: 'inherit' }),
      n = gt(e('path'), {
        transform: 'translate(11, 11)',
        d: 'M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z',
      });
    return (t.appendChild(n), t);
  }
  function YE({ options: e }) {
    let t = Vo(() => ({ __html: VE().outerHTML }), []);
    return V(
      'h2',
      { class: 'dialog__header' },
      V('span', { class: 'dialog__title' }, e.formTitle),
      e.showBranding
        ? V('a', {
            class: 'brand-link',
            target: '_blank',
            href: 'https://sentry.io/welcome/',
            title: 'Powered by Sentry',
            rel: 'noopener noreferrer',
            dangerouslySetInnerHTML: t,
          })
        : null
    );
  }
  function JE(e, t) {
    let n = [];
    return (
      t.isNameRequired && !e.name && n.push(t.nameLabel),
      t.isEmailRequired && !e.email && n.push(t.emailLabel),
      e.message || n.push(t.messageLabel),
      n
    );
  }
  function _u(e, t) {
    let n = e.get(t);
    return typeof n == 'string' ? n.trim() : '';
  }
  function KE({
    options: e,
    defaultEmail: t,
    defaultName: n,
    onFormClose: r,
    onSubmit: o,
    onSubmitSuccess: i,
    onSubmitError: s,
    showEmail: a,
    showName: c,
    screenshotInput: u,
  }) {
    let {
        tags: d,
        addScreenshotButtonLabel: l,
        removeScreenshotButtonLabel: p,
        cancelButtonLabel: f,
        emailLabel: m,
        emailPlaceholder: _,
        isEmailRequired: g,
        isNameRequired: S,
        messageLabel: E,
        messagePlaceholder: P,
        nameLabel: w,
        namePlaceholder: F,
        submitButtonLabel: A,
        isRequiredLabel: T,
      } = e,
      [R, I] = Yn(!1),
      [k, H] = Yn(null),
      [x, L] = Yn(!1),
      q = u?.input,
      [J, ne] = Yn(null),
      C = Cr(($) => {
        (ne($), L(!1));
      }, []),
      z = Cr(
        ($) => {
          let Q = JE($, {
            emailLabel: m,
            isEmailRequired: g,
            isNameRequired: S,
            messageLabel: E,
            nameLabel: w,
          });
          return (
            Q.length > 0
              ? H(`Please enter in the following required fields: ${Q.join(', ')}`)
              : H(null),
            Q.length === 0
          );
        },
        [m, g, S, E, w]
      ),
      N = Cr(
        async ($) => {
          I(!0);
          try {
            if (($.preventDefault(), !($.target instanceof HTMLFormElement))) return;
            let Q = new FormData($.target),
              ae = await (u && x ? u.value() : void 0),
              we = {
                name: _u(Q, 'name'),
                email: _u(Q, 'email'),
                message: _u(Q, 'message'),
                attachments: ae ? [ae] : void 0,
              };
            if (!z(we)) return;
            try {
              let ye = await o(
                { name: we.name, email: we.email, message: we.message, source: yE, tags: d },
                { attachments: we.attachments }
              );
              i(we, ye);
            } catch (ye) {
              (bs && h.error(ye), H(ye), s(ye));
            }
          } finally {
            I(!1);
          }
        },
        [u && x, i, s]
      );
    return V(
      'form',
      { class: 'form', onSubmit: N },
      q && x ? V(q, { onError: C }) : null,
      V(
        'fieldset',
        { class: 'form__right', 'data-sentry-feedback': !0, disabled: R },
        V(
          'div',
          { class: 'form__top' },
          k ? V('div', { class: 'form__error-container' }, k) : null,
          c
            ? V(
                'label',
                { for: 'name', class: 'form__label' },
                V(Su, { label: w, isRequiredLabel: T, isRequired: S }),
                V('input', {
                  class: 'form__input',
                  defaultValue: n,
                  id: 'name',
                  name: 'name',
                  placeholder: F,
                  required: S,
                  type: 'text',
                })
              )
            : V('input', { 'aria-hidden': !0, value: n, name: 'name', type: 'hidden' }),
          a
            ? V(
                'label',
                { for: 'email', class: 'form__label' },
                V(Su, { label: m, isRequiredLabel: T, isRequired: g }),
                V('input', {
                  class: 'form__input',
                  defaultValue: t,
                  id: 'email',
                  name: 'email',
                  placeholder: _,
                  required: g,
                  type: 'email',
                })
              )
            : V('input', { 'aria-hidden': !0, value: t, name: 'email', type: 'hidden' }),
          V(
            'label',
            { for: 'message', class: 'form__label' },
            V(Su, { label: E, isRequiredLabel: T, isRequired: !0 }),
            V('textarea', {
              autoFocus: !0,
              class: 'form__input form__input--textarea',
              id: 'message',
              name: 'message',
              placeholder: P,
              required: !0,
              rows: 5,
            })
          ),
          q
            ? V(
                'label',
                { for: 'screenshot', class: 'form__label' },
                V(
                  'button',
                  {
                    class: 'btn btn--default',
                    disabled: R,
                    type: 'button',
                    onClick: () => {
                      (ne(null), L(($) => !$));
                    },
                  },
                  x ? p : l
                ),
                J ? V('div', { class: 'form__error-container' }, J.message) : null
              )
            : null
        ),
        V(
          'div',
          { class: 'btn-group' },
          V('button', { class: 'btn btn--primary', disabled: R, type: 'submit' }, A),
          V('button', { class: 'btn btn--default', disabled: R, type: 'button', onClick: r }, f)
        )
      )
    );
  }
  function Su({ label: e, isRequired: t, isRequiredLabel: n }) {
    return V(
      'span',
      { class: 'form__label__text' },
      e,
      t && V('span', { class: 'form__label__text--required' }, n)
    );
  }
  var Es = 16,
    yp = 17,
    XE = 'http://www.w3.org/2000/svg';
  function ZE() {
    let e = (c) => Ht.document.createElementNS(XE, c),
      t = gt(e('svg'), {
        width: `${Es}`,
        height: `${yp}`,
        viewBox: `0 0 ${Es} ${yp}`,
        fill: 'inherit',
      }),
      n = gt(e('g'), { clipPath: 'url(#clip0_57_156)' }),
      r = gt(e('path'), {
        'fill-rule': 'evenodd',
        'clip-rule': 'evenodd',
        d: 'M3.55544 15.1518C4.87103 16.0308 6.41775 16.5 8 16.5C10.1217 16.5 12.1566 15.6571 13.6569 14.1569C15.1571 12.6566 16 10.6217 16 8.5C16 6.91775 15.5308 5.37103 14.6518 4.05544C13.7727 2.73985 12.5233 1.71447 11.0615 1.10897C9.59966 0.503466 7.99113 0.34504 6.43928 0.653721C4.88743 0.962403 3.46197 1.72433 2.34315 2.84315C1.22433 3.96197 0.462403 5.38743 0.153721 6.93928C-0.15496 8.49113 0.00346625 10.0997 0.608967 11.5615C1.21447 13.0233 2.23985 14.2727 3.55544 15.1518ZM4.40546 3.1204C5.46945 2.40946 6.72036 2.03 8 2.03C9.71595 2.03 11.3616 2.71166 12.575 3.92502C13.7883 5.13838 14.47 6.78405 14.47 8.5C14.47 9.77965 14.0905 11.0306 13.3796 12.0945C12.6687 13.1585 11.6582 13.9878 10.476 14.4775C9.29373 14.9672 7.99283 15.0953 6.73777 14.8457C5.48271 14.596 4.32987 13.9798 3.42502 13.075C2.52018 12.1701 1.90397 11.0173 1.65432 9.76224C1.40468 8.50718 1.5328 7.20628 2.0225 6.02404C2.5122 4.8418 3.34148 3.83133 4.40546 3.1204Z',
      }),
      o = gt(e('path'), {
        d: 'M6.68775 12.4297C6.78586 12.4745 6.89218 12.4984 7 12.5C7.11275 12.4955 7.22315 12.4664 7.32337 12.4145C7.4236 12.3627 7.51121 12.2894 7.58 12.2L12 5.63999C12.0848 5.47724 12.1071 5.28902 12.0625 5.11098C12.0178 4.93294 11.9095 4.77744 11.7579 4.67392C11.6064 4.57041 11.4221 4.52608 11.24 4.54931C11.0579 4.57254 10.8907 4.66173 10.77 4.79999L6.88 10.57L5.13 8.56999C5.06508 8.49566 4.98613 8.43488 4.89768 8.39111C4.80922 8.34735 4.713 8.32148 4.61453 8.31498C4.51605 8.30847 4.41727 8.32147 4.32382 8.35322C4.23038 8.38497 4.14413 8.43484 4.07 8.49999C3.92511 8.63217 3.83692 8.81523 3.82387 9.01092C3.81083 9.2066 3.87393 9.39976 4 9.54999L6.43 12.24C6.50187 12.3204 6.58964 12.385 6.68775 12.4297Z',
      });
    t.appendChild(n).append(o, r);
    let i = e('defs'),
      s = gt(e('clipPath'), { id: 'clip0_57_156' }),
      a = gt(e('rect'), {
        width: `${Es}`,
        height: `${Es}`,
        fill: 'white',
        transform: 'translate(0 0.5)',
      });
    return (s.appendChild(a), i.appendChild(s), t.appendChild(i).appendChild(s).appendChild(a), t);
  }
  function QE({ open: e, onFormSubmitted: t, ...n }) {
    let r = n.options,
      o = Vo(() => ({ __html: ZE().outerHTML }), []),
      [i, s] = Yn(null),
      a = Cr(() => {
        (i && (clearTimeout(i), s(null)), t());
      }, [i]),
      c = Cr(
        (u, d) => {
          (n.onSubmitSuccess(u, d),
            s(
              setTimeout(() => {
                (t(), s(null));
              }, bE)
            ));
        },
        [t]
      );
    return V(
      qo,
      null,
      i
        ? V(
            'div',
            { class: 'success__position', onClick: a },
            V(
              'div',
              { class: 'success__content' },
              r.successMessageText,
              V('span', { class: 'success__icon', dangerouslySetInnerHTML: o })
            )
          )
        : V(
            'dialog',
            { class: 'dialog', onClick: r.onFormClose, open: e },
            V(
              'div',
              { class: 'dialog__position' },
              V(
                'div',
                {
                  class: 'dialog__content',
                  onClick: (u) => {
                    u.stopPropagation();
                  },
                },
                V(YE, { options: r }),
                V(KE, { ...n, onSubmitSuccess: c })
              )
            )
          )
    );
  }
  var eb = `
.dialog {
  position: fixed;
  z-index: var(--z-index);
  margin: 0;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 100vh;
  width: 100vw;

  color: var(--dialog-color, var(--foreground));
  fill: var(--dialog-color, var(--foreground));
  line-height: 1.75em;

  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  inset: 0;
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.dialog__position {
  position: fixed;
  z-index: var(--z-index);
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  display: flex;
  max-height: calc(100vh - (2 * var(--page-margin)));
}
@media (max-width: 600px) {
  .dialog__position {
    inset: var(--page-margin);
    padding: 0;
  }
}

.dialog__position:has(.editor) {
  inset: var(--page-margin);
  padding: 0;
}

.dialog:not([open]) {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
.dialog:not([open]) .dialog__content {
  transform: translate(0, -16px) scale(0.98);
}

.dialog__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: var(--dialog-padding, 24px);
  max-width: 100%;
  width: 100%;
  max-height: 100%;
  overflow: auto;

  background: var(--dialog-background, var(--background));
  border-radius: var(--dialog-border-radius, 20px);
  border: var(--dialog-border, var(--border));
  box-shadow: var(--dialog-box-shadow, var(--box-shadow));
  transform: translate(0, 0) scale(1);
  transition: transform 0.2s ease-in-out;
}

`,
    tb = `
.dialog__header {
  display: flex;
  gap: 4px;
  justify-content: space-between;
  font-weight: var(--dialog-header-weight, 600);
  margin: 0;
}
.dialog__title {
  align-self: center;
  width: var(--form-width, 272px);
}

@media (max-width: 600px) {
  .dialog__title {
    width: auto;
  }
}

.dialog__position:has(.editor) .dialog__title {
  width: auto;
}


.brand-link {
  display: inline-flex;
}
.brand-link:focus-visible {
  outline: var(--outline);
}
`,
    nb = `
.form {
  display: flex;
  overflow: auto;
  flex-direction: row;
  gap: 16px;
  flex: 1 0;
}

.form fieldset {
  border: none;
  margin: 0;
  padding: 0;
}

.form__right {
  flex: 0 0 auto;
  display: flex;
  overflow: auto;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  width: var(--form-width, 100%);
}

.dialog__position:has(.editor) .form__right {
  width: var(--form-width, 272px);
}

.form__top {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form__error-container {
  color: var(--error-color);
  fill: var(--error-color);
}

.form__label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0px;
}

.form__label__text {
  display: flex;
  gap: 4px;
  align-items: center;
}

.form__label__text--required {
  font-size: 0.85em;
}

.form__input {
  font-family: inherit;
  line-height: inherit;
  background: transparent;
  box-sizing: border-box;
  border: var(--input-border, var(--border));
  border-radius: var(--input-border-radius, 6px);
  color: var(--input-color, inherit);
  fill: var(--input-color, inherit);
  font-size: var(--input-font-size, inherit);
  font-weight: var(--input-font-weight, 500);
  padding: 6px 12px;
}

.form__input::placeholder {
  opacity: 0.65;
  color: var(--input-placeholder-color, inherit);
  filter: var(--interactive-filter);
}

.form__input:focus-visible {
  outline: var(--input-focus-outline, var(--outline));
}

.form__input--textarea {
  font-family: inherit;
  resize: vertical;
}

.error {
  color: var(--error-color);
  fill: var(--error-color);
}
`,
    rb = `
.btn-group {
  display: grid;
  gap: 8px;
}

.btn {
  line-height: inherit;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--button-font-size, inherit);
  font-weight: var(--button-font-weight, 600);
  padding: var(--button-padding, 6px 16px);
}
.btn[disabled] {
  opacity: 0.6;
  pointer-events: none;
}

.btn--primary {
  color: var(--button-primary-color, var(--accent-foreground));
  fill: var(--button-primary-color, var(--accent-foreground));
  background: var(--button-primary-background, var(--accent-background));
  border: var(--button-primary-border, var(--border));
  border-radius: var(--button-primary-border-radius, 6px);
  font-weight: var(--button-primary-font-weight, 500);
}
.btn--primary:hover {
  color: var(--button-primary-hover-color, var(--accent-foreground));
  fill: var(--button-primary-hover-color, var(--accent-foreground));
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
}
.btn--primary:focus-visible {
  background: var(--button-primary-hover-background, var(--accent-background));
  filter: var(--interactive-filter);
  outline: var(--button-primary-focus-outline, var(--outline));
}

.btn--default {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-background, var(--background));
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  font-weight: var(--button-font-weight, 500);
}
.btn--default:hover {
  color: var(--button-color, var(--foreground));
  fill: var(--button-color, var(--foreground));
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
}
.btn--default:focus-visible {
  background: var(--button-hover-background, var(--background));
  filter: var(--interactive-filter);
  outline: var(--button-focus-outline, var(--outline));
}
`,
    ob = `
.success__position {
  position: fixed;
  inset: var(--dialog-inset);
  padding: var(--page-margin);
  z-index: var(--z-index);
}
.success__content {
  background: var(--success-background, var(--background));
  border: var(--success-border, var(--border));
  border-radius: var(--success-border-radius, 1.7em/50%);
  box-shadow: var(--success-box-shadow, var(--box-shadow));
  font-weight: var(--success-font-weight, 600);
  color: var(--success-color);
  fill: var(--success-color);
  padding: 12px 24px;
  line-height: 1.75em;

  display: grid;
  align-items: center;
  grid-auto-flow: column;
  gap: 6px;
  cursor: default;
}

.success__icon {
  display: flex;
}
`;
  function ib(e) {
    let t = ue.createElement('style');
    return (
      (t.textContent = `
:host {
  --dialog-inset: var(--inset);
}

${eb}
${tb}
${nb}
${rb}
${ob}
`),
      e && t.setAttribute('nonce', e),
      t
    );
  }
  function sb() {
    let e = M().getUser(),
      t = se().getUser(),
      n = Dt().getUser();
    return e && Object.keys(e).length ? e : t && Object.keys(t).length ? t : n;
  }
  var Op = () => ({
    name: 'FeedbackModal',
    setupOnce() {},
    createDialog: ({ options: e, screenshotIntegration: t, sendFeedback: n, shadow: r }) => {
      let o = r,
        i = e.useSentryUser,
        s = sb(),
        a = ue.createElement('div'),
        c = ib(e.styleNonce),
        u = '',
        d = {
          get el() {
            return a;
          },
          appendToDom() {
            !o.contains(c) && !o.contains(a) && (o.appendChild(c), o.appendChild(a));
          },
          removeFromDom() {
            (a.remove(), c.remove(), (ue.body.style.overflow = u));
          },
          open() {
            (p(!0),
              e.onFormOpen?.(),
              b()?.emit('openFeedbackWidget'),
              (u = ue.body.style.overflow),
              (ue.body.style.overflow = 'hidden'));
          },
          close() {
            (p(!1), (ue.body.style.overflow = u));
          },
        },
        l = t?.createInput({ h: V, hooks: jE, dialog: d, options: e }),
        p = (f) => {
          DE(
            V(QE, {
              options: e,
              screenshotInput: l,
              showName: e.showName || e.isNameRequired,
              showEmail: e.showEmail || e.isEmailRequired,
              defaultName: (i && s?.[i.name]) || '',
              defaultEmail: (i && s?.[i.email]) || '',
              onFormClose: () => {
                (p(!1), e.onFormClose?.());
              },
              onSubmit: n,
              onSubmitSuccess: (m, _) => {
                (p(!1), e.onSubmitSuccess?.(m, _));
              },
              onSubmitError: (m) => {
                e.onSubmitError?.(m);
              },
              onFormSubmitted: () => {
                e.onFormSubmitted?.();
              },
              open: f,
            }),
            a
          );
        };
      return d;
    },
  });
  function ab({ h: e }) {
    return function () {
      return e(
        'svg',
        {
          'data-test-id': 'icon-close',
          viewBox: '0 0 16 16',
          fill: '#2B2233',
          height: '25px',
          width: '25px',
        },
        e('circle', { r: '7', cx: '8', cy: '8', fill: 'white' }),
        e('path', {
          strokeWidth: '1.5',
          d: 'M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM8,1.53A6.47,6.47,0,1,0,14.47,8,6.47,6.47,0,0,0,8,1.53Z',
        }),
        e('path', {
          strokeWidth: '1.5',
          d: 'M5.34,11.41a.71.71,0,0,1-.53-.22.74.74,0,0,1,0-1.06l5.32-5.32a.75.75,0,0,1,1.06,1.06L5.87,11.19A.74.74,0,0,1,5.34,11.41Z',
        }),
        e('path', {
          strokeWidth: '1.5',
          d: 'M10.66,11.41a.74.74,0,0,1-.53-.22L4.81,5.87A.75.75,0,0,1,5.87,4.81l5.32,5.32a.74.74,0,0,1,0,1.06A.71.71,0,0,1,10.66,11.41Z',
        })
      );
    };
  }
  function cb(e) {
    let t = ue.createElement('style'),
      n = '#1A141F',
      r = '#302735';
    return (
      (t.textContent = `
.editor {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}

.editor__image-container {
  justify-items: center;
  padding: 15px;
  position: relative;
  height: 100%;
  border-radius: var(--menu-border-radius, 6px);

  background-color: ${n};
  background-image: repeating-linear-gradient(
      -145deg,
      transparent,
      transparent 8px,
      ${n} 8px,
      ${n} 11px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 15px,
      ${r} 15px,
      ${r} 16px
    );
}

.editor__canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor__canvas-container > * {
  object-fit: contain;
  position: absolute;
}

.editor__tool-container {
  padding-top: 8px;
  display: flex;
  justify-content: center;
}

.editor__tool-bar {
  display: flex;
  gap: 8px;
}

.editor__tool {
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  border: var(--button-border, var(--border));
  border-radius: var(--button-border-radius, 6px);
  background: var(--button-background, var(--background));
  color: var(--button-color, var(--foreground));
}

.editor__tool--active {
  background: var(--button-primary-background, var(--accent-background));
  color: var(--button-primary-color, var(--accent-foreground));
}

.editor__rect {
  position: absolute;
  z-index: 2;
}

.editor__rect button {
  opacity: 0;
  position: absolute;
  top: -12px;
  right: -12px;
  cursor: pointer;
  padding: 0;
  z-index: 3;
  border: none;
  background: none;
}

.editor__rect:hover button {
  opacity: 1;
}
`),
      e && t.setAttribute('nonce', e),
      t
    );
  }
  function ub({ h: e }) {
    return function ({ action: n, setAction: r, options: o }) {
      return e(
        'div',
        { class: 'editor__tool-container' },
        e(
          'div',
          { class: 'editor__tool-bar' },
          e(
            'button',
            {
              type: 'button',
              class: `editor__tool ${n === 'highlight' ? 'editor__tool--active' : ''}`,
              onClick: () => {
                r(n === 'highlight' ? '' : 'highlight');
              },
            },
            o.highlightToolText
          ),
          e(
            'button',
            {
              type: 'button',
              class: `editor__tool ${n === 'hide' ? 'editor__tool--active' : ''}`,
              onClick: () => {
                r(n === 'hide' ? '' : 'hide');
              },
            },
            o.hideToolText
          )
        )
      );
    };
  }
  function lb({ hooks: e }) {
    function t() {
      let [n, r] = e.useState(Ht.devicePixelRatio ?? 1);
      return (
        e.useEffect(() => {
          let o = () => {
              r(Ht.devicePixelRatio);
            },
            i = matchMedia(`(resolution: ${Ht.devicePixelRatio}dppx)`);
          return (
            i.addEventListener('change', o),
            () => {
              i.removeEventListener('change', o);
            }
          );
        }, []),
        n
      );
    }
    return function ({ onBeforeScreenshot: r, onScreenshot: o, onAfterScreenshot: i, onError: s }) {
      let a = t();
      e.useEffect(() => {
        (async () => {
          r();
          let u = await zo.mediaDevices.getDisplayMedia({
              video: { width: Ht.innerWidth * a, height: Ht.innerHeight * a },
              audio: !1,
              monitorTypeSurfaces: 'exclude',
              preferCurrentTab: !0,
              selfBrowserSurface: 'include',
              surfaceSwitching: 'exclude',
            }),
            d = ue.createElement('video');
          (await new Promise((l, p) => {
            ((d.srcObject = u),
              (d.onloadedmetadata = () => {
                (o(d, a), u.getTracks().forEach((f) => f.stop()), l());
              }),
              d.play().catch(p));
          }),
            i());
        })().catch(s);
      }, []);
    };
  }
  function db(e, t, n) {
    switch (e.type) {
      case 'highlight': {
        ((t.shadowColor = 'rgba(0, 0, 0, 0.7)'),
          (t.shadowBlur = 50),
          (t.fillStyle = n),
          t.fillRect(e.x - 1, e.y - 1, e.w + 2, e.h + 2),
          t.clearRect(e.x, e.y, e.w, e.h));
        break;
      }
      case 'hide':
        ((t.fillStyle = 'rgb(0, 0, 0)'), t.fillRect(e.x, e.y, e.w, e.h));
        break;
    }
  }
  function Cn(e, t, n) {
    if (!e) return;
    let r = e.getContext('2d', t);
    r && n(e, r);
  }
  function yu(e, t) {
    Cn(e, { alpha: !0 }, (n, r) => {
      r.drawImage(t, 0, 0, t.width, t.height, 0, 0, n.width, n.height);
    });
  }
  function Eu(e, t, n) {
    Cn(e, { alpha: !0 }, (r, o) => {
      (n.length && ((o.fillStyle = 'rgba(0, 0, 0, 0.25)'), o.fillRect(0, 0, r.width, r.height)),
        n.forEach((i) => {
          db(i, o, t);
        }));
    });
  }
  function fb({ h: e, hooks: t, outputBuffer: n, dialog: r, options: o }) {
    let i = lb({ hooks: t }),
      s = ub({ h: e }),
      a = ab({ h: e }),
      c = { __html: cb(o.styleNonce).innerText },
      u = r.el.style,
      d = ({ screenshot: l }) => {
        let [p, f] = t.useState('highlight'),
          [m, _] = t.useState([]),
          g = t.useRef(null),
          S = t.useRef(null),
          E = t.useRef(null),
          P = t.useRef(null),
          [w, F] = t.useState(1),
          A = t.useMemo(() => {
            let x = ue.getElementById(o.id);
            if (!x) return 'white';
            let L = getComputedStyle(x);
            return (
              L.getPropertyValue('--button-primary-background') ||
              L.getPropertyValue('--accent-background')
            );
          }, [o.id]);
        t.useLayoutEffect(() => {
          let x = () => {
            let L = g.current;
            L &&
              (Cn(l.canvas, { alpha: !1 }, (q) => {
                let J = Math.min(L.clientWidth / q.width, L.clientHeight / q.height);
                F(J);
              }),
              (L.clientHeight === 0 || L.clientWidth === 0) && setTimeout(x, 0));
          };
          return (
            x(),
            Ht.addEventListener('resize', x),
            () => {
              Ht.removeEventListener('resize', x);
            }
          );
        }, [l]);
        let T = t.useCallback(
          (x, L) => {
            Cn(x, { alpha: !0 }, (q, J) => {
              (J.scale(L, L), (q.width = l.canvas.width), (q.height = l.canvas.height));
            });
          },
          [l]
        );
        (t.useEffect(() => {
          (T(S.current, l.dpi), yu(S.current, l.canvas));
        }, [l]),
          t.useEffect(() => {
            (T(E.current, l.dpi),
              Cn(E.current, { alpha: !0 }, (x, L) => {
                L.clearRect(0, 0, x.width, x.height);
              }),
              Eu(E.current, A, m));
          }, [m, A]),
          t.useEffect(() => {
            (T(n, l.dpi),
              yu(n, l.canvas),
              Cn(ue.createElement('canvas'), { alpha: !0 }, (x, L) => {
                (L.scale(l.dpi, l.dpi),
                  (x.width = l.canvas.width),
                  (x.height = l.canvas.height),
                  Eu(x, A, m),
                  yu(n, x));
              }));
          }, [m, l, A]));
        let R = (x) => {
            if (!p || !P.current) return;
            let L = P.current.getBoundingClientRect(),
              q = { type: p, x: x.offsetX / w, y: x.offsetY / w },
              J = (z, N) => {
                let $ = (N.clientX - L.x) / w,
                  Q = (N.clientY - L.y) / w;
                return {
                  type: z.type,
                  x: Math.min(z.x, $),
                  y: Math.min(z.y, Q),
                  w: Math.abs($ - z.x),
                  h: Math.abs(Q - z.y),
                };
              },
              ne = (z) => {
                (Cn(E.current, { alpha: !0 }, (N, $) => {
                  $.clearRect(0, 0, N.width, N.height);
                }),
                  Eu(E.current, A, [...m, J(q, z)]));
              },
              C = (z) => {
                let N = J(q, z);
                (N.w * w >= 1 && N.h * w >= 1 && _(($) => [...$, N]),
                  ue.removeEventListener('mousemove', ne),
                  ue.removeEventListener('mouseup', C));
              };
            (ue.addEventListener('mousemove', ne), ue.addEventListener('mouseup', C));
          },
          I = t.useCallback(
            (x) => (L) => {
              (L.preventDefault(),
                L.stopPropagation(),
                _((q) => {
                  let J = [...q];
                  return (J.splice(x, 1), J);
                }));
            },
            []
          ),
          k = { width: `${l.canvas.width * w}px`, height: `${l.canvas.height * w}px` },
          H = (x) => {
            x.stopPropagation();
          };
        return e(
          'div',
          { class: 'editor' },
          e('style', { nonce: o.styleNonce, dangerouslySetInnerHTML: c }),
          e(
            'div',
            { class: 'editor__image-container' },
            e(
              'div',
              { class: 'editor__canvas-container', ref: g },
              e('canvas', { ref: S, id: 'background', style: k }),
              e('canvas', { ref: E, id: 'foreground', style: k }),
              e(
                'div',
                { ref: P, onMouseDown: R, style: k },
                m.map((x, L) =>
                  e(
                    'div',
                    {
                      key: L,
                      class: 'editor__rect',
                      style: {
                        top: `${x.y * w}px`,
                        left: `${x.x * w}px`,
                        width: `${x.w * w}px`,
                        height: `${x.h * w}px`,
                      },
                    },
                    e(
                      'button',
                      {
                        'aria-label': o.removeHighlightText,
                        onClick: I(L),
                        onMouseDown: H,
                        onMouseUp: H,
                        type: 'button',
                      },
                      e(a, null)
                    )
                  )
                )
              )
            )
          ),
          e(s, { options: o, action: p, setAction: f })
        );
      };
    return function ({ onError: p }) {
      let [f, m] = t.useState();
      return (
        i({
          onBeforeScreenshot: t.useCallback(() => {
            u.display = 'none';
          }, []),
          onScreenshot: t.useCallback((_, g) => {
            (Cn(ue.createElement('canvas'), { alpha: !1 }, (S, E) => {
              (E.scale(g, g),
                (S.width = _.videoWidth),
                (S.height = _.videoHeight),
                E.drawImage(_, 0, 0, S.width, S.height),
                m({ canvas: S, dpi: g }));
            }),
              (n.width = _.videoWidth),
              (n.height = _.videoHeight));
          }, []),
          onAfterScreenshot: t.useCallback(() => {
            u.display = 'block';
          }, []),
          onError: t.useCallback((_) => {
            ((u.display = 'block'), p(_));
          }, []),
        }),
        f ? e(d, { screenshot: f }) : e('div', null)
      );
    };
  }
  var Lp = () => ({
    name: 'FeedbackScreenshot',
    setupOnce() {},
    createInput: ({ h: e, hooks: t, dialog: n, options: r }) => {
      let o = ue.createElement('canvas');
      return {
        input: fb({ h: e, hooks: t, outputBuffer: o, dialog: n, options: r }),
        value: async () => {
          let i = await new Promise((s) => {
            o.toBlob(s, 'image/png');
          });
          if (i)
            return {
              data: new Uint8Array(await i.arrayBuffer()),
              filename: 'screenshot.png',
              contentType: 'application/png',
            };
        },
      };
    },
  });
  var O = v,
    Nu = 0;
  function Mu() {
    return Nu > 0;
  }
  function pb() {
    (Nu++,
      setTimeout(() => {
        Nu--;
      }));
  }
  function Kn(e, t = {}) {
    function n(o) {
      return typeof o == 'function';
    }
    if (!n(e)) return e;
    try {
      let o = e.__sentry_wrapped__;
      if (o) return typeof o == 'function' ? o : e;
      if (Fn(e)) return e;
    } catch {
      return e;
    }
    let r = function (...o) {
      try {
        let i = o.map((s) => Kn(s, t));
        return e.apply(this, i);
      } catch (i) {
        throw (
          pb(),
          ke((s) => {
            (s.addEventProcessor(
              (a) => (
                t.mechanism && (ur(a, void 0, void 0), ze(a, t.mechanism)),
                (a.extra = { ...a.extra, arguments: o }),
                a
              )
            ),
              ht(i));
          }),
          i
        );
      }
    };
    try {
      for (let o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    } catch {}
    (wi(r, e), he(e, '__sentry_wrapped__', r));
    try {
      Object.getOwnPropertyDescriptor(r, 'name').configurable &&
        Object.defineProperty(r, 'name', {
          get() {
            return e.name;
          },
        });
    } catch {}
    return r;
  }
  function Yo() {
    let e = Xe(),
      { referrer: t } = O.document || {},
      { userAgent: n } = O.navigator || {},
      r = { ...(t && { Referer: t }), ...(n && { 'User-Agent': n }) };
    return { url: e, headers: r };
  }
  var mb = {
      replayIntegration: 'replay',
      replayCanvasIntegration: 'replay-canvas',
      feedbackIntegration: 'feedback',
      feedbackModalIntegration: 'feedback-modal',
      feedbackScreenshotIntegration: 'feedback-screenshot',
      captureConsoleIntegration: 'captureconsole',
      contextLinesIntegration: 'contextlines',
      linkedErrorsIntegration: 'linkederrors',
      dedupeIntegration: 'dedupe',
      extraErrorDataIntegration: 'extraerrordata',
      graphqlClientIntegration: 'graphqlclient',
      httpClientIntegration: 'httpclient',
      reportingObserverIntegration: 'reportingobserver',
      rewriteFramesIntegration: 'rewriteframes',
      browserProfilingIntegration: 'browserprofiling',
      moduleMetadataIntegration: 'modulemetadata',
    },
    Dp = O;
  async function As(e, t) {
    let n = mb[e],
      r = (Dp.Sentry = Dp.Sentry || {});
    if (!n) throw new Error(`Cannot lazy load integration: ${e}`);
    let o = r[e];
    if (typeof o == 'function' && !('_isShim' in o)) return o;
    let i = hb(n),
      s = O.document.createElement('script');
    ((s.src = i),
      (s.crossOrigin = 'anonymous'),
      (s.referrerPolicy = 'strict-origin'),
      t && s.setAttribute('nonce', t));
    let a = new Promise((l, p) => {
        (s.addEventListener('load', () => l()), s.addEventListener('error', p));
      }),
      c = O.document.currentScript,
      u = O.document.body || O.document.head || c?.parentElement;
    if (u) u.appendChild(s);
    else throw new Error(`Could not find parent element to insert lazy-loaded ${e} script`);
    try {
      await a;
    } catch {
      throw new Error(`Error when loading integration: ${e}`);
    }
    let d = r[e];
    if (typeof d != 'function') throw new Error(`Could not load integration: ${e}`);
    return d;
  }
  function hb(e) {
    let n = b()?.getOptions()?.cdnBaseUrl || 'https://browser.sentry-cdn.com';
    return new URL(`/${nt}/${e}.min.js`, n).toString();
  }
  var Pp = xs({ lazyLoadIntegration: As });
  var Ou = xs({ getModalIntegration: () => Op, getScreenshotIntegration: () => Lp });
  function Nr(e, t) {
    let n = Pu(e, t),
      r = { type: Eb(t), value: bb(t) };
    return (
      n.length && (r.stacktrace = { frames: n }),
      r.type === void 0 && r.value === '' && (r.value = 'Unrecoverable error caught'),
      r
    );
  }
  function gb(e, t, n, r) {
    let i = b()?.getOptions().normalizeDepth,
      s = vb(t),
      a = { __serialized__: Wi(t, i) };
    if (s) return { exception: { values: [Nr(e, s)] }, extra: a };
    let c = {
      exception: {
        values: [
          {
            type: Dn(t) ? t.constructor.name : r ? 'UnhandledRejection' : 'Error',
            value: Tb(t, { isUnhandledRejection: r }),
          },
        ],
      },
      extra: a,
    };
    if (n) {
      let u = Pu(e, n);
      u.length && (c.exception.values[0].stacktrace = { frames: u });
    }
    return c;
  }
  function Lu(e, t) {
    return { exception: { values: [Nr(e, t)] } };
  }
  function Pu(e, t) {
    let n = t.stacktrace || t.stack || '',
      r = Sb(t),
      o = yb(t);
    try {
      return e(n, r, o);
    } catch {}
    return [];
  }
  var _b = /Minified React error #\d+;/i;
  function Sb(e) {
    return e && _b.test(e.message) ? 1 : 0;
  }
  function yb(e) {
    return typeof e.framesToPop == 'number' ? e.framesToPop : 0;
  }
  function Fp(e) {
    return typeof WebAssembly < 'u' && typeof WebAssembly.Exception < 'u'
      ? e instanceof WebAssembly.Exception
      : !1;
  }
  function Eb(e) {
    let t = e?.name;
    return !t && Fp(e)
      ? e.message && Array.isArray(e.message) && e.message.length == 2
        ? e.message[0]
        : 'WebAssembly.Exception'
      : t;
  }
  function bb(e) {
    let t = e?.message;
    return Fp(e)
      ? Array.isArray(e.message) && e.message.length == 2
        ? e.message[1]
        : 'wasm exception'
      : t
        ? t.error && typeof t.error.message == 'string'
          ? t.error.message
          : t
        : 'No error message';
  }
  function ks(e, t, n, r) {
    let o = n?.syntheticException || void 0,
      i = Ms(e, t, o, r);
    return (ze(i), (i.level = 'error'), n?.event_id && (i.event_id = n.event_id), wn(i));
  }
  function Ns(e, t, n = 'info', r, o) {
    let i = r?.syntheticException || void 0,
      s = Du(e, t, i, o);
    return ((s.level = n), r?.event_id && (s.event_id = r.event_id), wn(s));
  }
  function Ms(e, t, n, r, o) {
    let i;
    if (Ti(t) && t.error) return Lu(e, t.error);
    if (Ii(t) || Ga(t)) {
      let s = t;
      if ('stack' in t) i = Lu(e, t);
      else {
        let a = s.name || (Ii(s) ? 'DOMError' : 'DOMException'),
          c = s.message ? `${a}: ${s.message}` : a;
        ((i = Du(e, c, n, r)), ur(i, c));
      }
      return ('code' in s && (i.tags = { ...i.tags, 'DOMException.code': `${s.code}` }), i);
    }
    return ot(t)
      ? Lu(e, t)
      : Ge(t) || Dn(t)
        ? ((i = gb(e, t, n, o)), ze(i, { synthetic: !0 }), i)
        : ((i = Du(e, t, n, r)), ur(i, `${t}`, void 0), ze(i, { synthetic: !0 }), i);
  }
  function Du(e, t, n, r) {
    let o = {};
    if (r && n) {
      let i = Pu(e, n);
      (i.length && (o.exception = { values: [{ value: t, stacktrace: { frames: i } }] }),
        ze(o, { synthetic: !0 }));
    }
    if (Sn(t)) {
      let { __sentry_template_string__: i, __sentry_template_values__: s } = t;
      return ((o.logentry = { message: i, params: s }), o);
    }
    return ((o.message = t), o);
  }
  function Tb(e, { isUnhandledRejection: t }) {
    let n = Ya(e),
      r = t ? 'promise rejection' : 'exception';
    return Ti(e)
      ? `Event \`ErrorEvent\` captured as ${r} with message \`${e.message}\``
      : Dn(e)
        ? `Event \`${Ib(e)}\` (type=${e.type}) captured as ${r}`
        : `Object captured as ${r} with keys: ${n}`;
  }
  function Ib(e) {
    try {
      let t = Object.getPrototypeOf(e);
      return t ? t.constructor.name : void 0;
    } catch {}
  }
  function vb(e) {
    for (let t in e)
      if (Object.prototype.hasOwnProperty.call(e, t)) {
        let n = e[t];
        if (n instanceof Error) return n;
      }
  }
  var Up = 5e3,
    Mr = class extends No {
      constructor(t) {
        let n = wb(t),
          r = O.SENTRY_SDK_SOURCE || hu();
        (Yc(n, 'browser', ['browser'], r),
          n._metadata?.sdk &&
            (n._metadata.sdk.settings = {
              infer_ip: n.sendDefaultPii ? 'auto' : 'never',
              ...n._metadata.sdk.settings,
            }),
          super(n));
        let {
          sendDefaultPii: o,
          sendClientReports: i,
          enableLogs: s,
          _experiments: a,
        } = this._options;
        (O.document &&
          (i || s || a?.enableMetrics) &&
          O.document.addEventListener('visibilitychange', () => {
            O.document.visibilityState === 'hidden' &&
              (i && this._flushOutcomes(), s && br(this), a?.enableMetrics && Tr(this));
          }),
          s &&
            (this.on('flush', () => {
              br(this);
            }),
            this.on('afterCaptureLog', () => {
              (this._logFlushIdleTimeout && clearTimeout(this._logFlushIdleTimeout),
                (this._logFlushIdleTimeout = setTimeout(() => {
                  br(this);
                }, Up)));
            })),
          a?.enableMetrics &&
            (this.on('flush', () => {
              Tr(this);
            }),
            this.on('afterCaptureMetric', () => {
              (this._metricFlushIdleTimeout && clearTimeout(this._metricFlushIdleTimeout),
                (this._metricFlushIdleTimeout = setTimeout(() => {
                  Tr(this);
                }, Up)));
            })),
          o && this.on('beforeSendSession', Vc));
      }
      eventFromException(t, n) {
        return ks(this._options.stackParser, t, n, this._options.attachStacktrace);
      }
      eventFromMessage(t, n = 'info', r) {
        return Ns(this._options.stackParser, t, n, r, this._options.attachStacktrace);
      }
      _prepareEvent(t, n, r, o) {
        return ((t.platform = t.platform || 'javascript'), super._prepareEvent(t, n, r, o));
      }
    };
  function wb(e) {
    return {
      release: typeof __SENTRY_RELEASE__ == 'string' ? __SENTRY_RELEASE__ : O.SENTRY_RELEASE?.id,
      sendClientReports: !0,
      parentSpanIsAlwaysRootSpan: !0,
      ...e,
    };
  }
  var $t = typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__;
  var U = v;
  var Rb = (e, t) => (e > t[1] ? 'poor' : e > t[0] ? 'needs-improvement' : 'good'),
    Kt = (e, t, n, r) => {
      let o, i;
      return (s) => {
        t.value >= 0 &&
          (s || r) &&
          ((i = t.value - (o ?? 0)),
          (i || o === void 0) && ((o = t.value), (t.delta = i), (t.rating = Rb(t.value, n)), e(t)));
      };
    };
  var Bp = () => `v5-${Date.now()}-${Math.floor(Math.random() * 8999999999999) + 1e12}`;
  var cn = (e = !0) => {
    let t = U.performance?.getEntriesByType?.('navigation')[0];
    if (!e || (t && t.responseStart > 0 && t.responseStart < performance.now())) return t;
  };
  var At = () => cn()?.activationStart ?? 0;
  var Xt = (e, t = -1) => {
    let n = cn(),
      r = 'navigate';
    return (
      n &&
        (U.document?.prerendering || At() > 0
          ? (r = 'prerender')
          : U.document?.wasDiscarded
            ? (r = 'restore')
            : n.type && (r = n.type.replace(/_/g, '-'))),
      { name: e, value: t, rating: 'good', delta: 0, entries: [], id: Bp(), navigationType: r }
    );
  };
  var Fu = new WeakMap();
  function Or(e, t) {
    return (Fu.get(e) || Fu.set(e, new t()), Fu.get(e));
  }
  var Os = class e {
    constructor() {
      (e.prototype.__init.call(this), e.prototype.__init2.call(this));
    }
    __init() {
      this._sessionValue = 0;
    }
    __init2() {
      this._sessionEntries = [];
    }
    _processEntry(t) {
      if (t.hadRecentInput) return;
      let n = this._sessionEntries[0],
        r = this._sessionEntries[this._sessionEntries.length - 1];
      (this._sessionValue &&
      n &&
      r &&
      t.startTime - r.startTime < 1e3 &&
      t.startTime - n.startTime < 5e3
        ? ((this._sessionValue += t.value), this._sessionEntries.push(t))
        : ((this._sessionValue = t.value), (this._sessionEntries = [t])),
        this._onAfterProcessingUnexpectedShift?.(t));
    }
  };
  var kt = (e, t, n = {}) => {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(e)) {
        let r = new PerformanceObserver((o) => {
          Promise.resolve().then(() => {
            t(o.getEntries());
          });
        });
        return (r.observe({ type: e, buffered: !0, ...n }), r);
      }
    } catch {}
  };
  var Lr = (e) => {
    let t = !1;
    return () => {
      t || (e(), (t = !0));
    };
  };
  var Jo = -1,
    xb = () => (U.document?.visibilityState === 'hidden' && !U.document?.prerendering ? 0 : 1 / 0),
    Ls = (e) => {
      U.document.visibilityState === 'hidden' &&
        Jo > -1 &&
        ((Jo = e.type === 'visibilitychange' ? e.timeStamp : 0), Ab());
    },
    Cb = () => {
      (addEventListener('visibilitychange', Ls, !0),
        addEventListener('prerenderingchange', Ls, !0));
    },
    Ab = () => {
      (removeEventListener('visibilitychange', Ls, !0),
        removeEventListener('prerenderingchange', Ls, !0));
    },
    Dr = () => {
      if (U.document && Jo < 0) {
        let e = At();
        ((Jo =
          (U.document.prerendering
            ? void 0
            : globalThis.performance
                .getEntriesByType('visibility-state')
                .filter((n) => n.name === 'hidden' && n.startTime > e)[0]?.startTime) ?? xb()),
          Cb());
      }
      return {
        get firstHiddenTime() {
          return Jo;
        },
      };
    };
  var kn = (e) => {
    U.document?.prerendering ? addEventListener('prerenderingchange', () => e(), !0) : e();
  };
  var kb = [1800, 3e3],
    Hp = (e, t = {}) => {
      kn(() => {
        let n = Dr(),
          r = Xt('FCP'),
          o,
          s = kt('paint', (a) => {
            for (let c of a)
              c.name === 'first-contentful-paint' &&
                (s.disconnect(),
                c.startTime < n.firstHiddenTime &&
                  ((r.value = Math.max(c.startTime - At(), 0)), r.entries.push(c), o(!0)));
          });
        s && (o = Kt(e, r, kb, t.reportAllChanges));
      });
    };
  var Nb = [0.1, 0.25],
    $p = (e, t = {}) => {
      Hp(
        Lr(() => {
          let n = Xt('CLS', 0),
            r,
            o = Or(t, Os),
            i = (a) => {
              for (let c of a) o._processEntry(c);
              o._sessionValue > n.value &&
                ((n.value = o._sessionValue), (n.entries = o._sessionEntries), r());
            },
            s = kt('layout-shift', i);
          s &&
            ((r = Kt(e, n, Nb, t.reportAllChanges)),
            U.document?.addEventListener('visibilitychange', () => {
              U.document?.visibilityState === 'hidden' && (i(s.takeRecords()), r(!0));
            }),
            U?.setTimeout?.(r));
        })
      );
    };
  var Wp = 0,
    Uu = 1 / 0,
    Ds = 0,
    Mb = (e) => {
      e.forEach((t) => {
        t.interactionId &&
          ((Uu = Math.min(Uu, t.interactionId)),
          (Ds = Math.max(Ds, t.interactionId)),
          (Wp = Ds ? (Ds - Uu) / 7 + 1 : 0));
      });
    },
    Bu,
    Hu = () => (Bu ? Wp : performance.interactionCount || 0),
    Gp = () => {
      'interactionCount' in performance ||
        Bu ||
        (Bu = kt('event', Mb, { type: 'event', buffered: !0, durationThreshold: 0 }));
    };
  var $u = 10,
    zp = 0,
    Ob = () => Hu() - zp,
    Ps = class e {
      constructor() {
        (e.prototype.__init.call(this), e.prototype.__init2.call(this));
      }
      __init() {
        this._longestInteractionList = [];
      }
      __init2() {
        this._longestInteractionMap = new Map();
      }
      _resetInteractions() {
        ((zp = Hu()),
          (this._longestInteractionList.length = 0),
          this._longestInteractionMap.clear());
      }
      _estimateP98LongestInteraction() {
        let t = Math.min(this._longestInteractionList.length - 1, Math.floor(Ob() / 50));
        return this._longestInteractionList[t];
      }
      _processEntry(t) {
        if (
          (this._onBeforeProcessingEntry?.(t), !(t.interactionId || t.entryType === 'first-input'))
        )
          return;
        let n = this._longestInteractionList.at(-1),
          r = this._longestInteractionMap.get(t.interactionId);
        if (r || this._longestInteractionList.length < $u || t.duration > n._latency) {
          if (
            (r
              ? t.duration > r._latency
                ? ((r.entries = [t]), (r._latency = t.duration))
                : t.duration === r._latency &&
                  t.startTime === r.entries[0].startTime &&
                  r.entries.push(t)
              : ((r = { id: t.interactionId, entries: [t], _latency: t.duration }),
                this._longestInteractionMap.set(r.id, r),
                this._longestInteractionList.push(r)),
            this._longestInteractionList.sort((o, i) => i._latency - o._latency),
            this._longestInteractionList.length > $u)
          ) {
            let o = this._longestInteractionList.splice($u);
            for (let i of o) this._longestInteractionMap.delete(i.id);
          }
          this._onAfterProcessingINPCandidate?.(r);
        }
      }
    };
  var Pr = (e) => {
    let t = (n) => {
      (n.type === 'pagehide' || U.document?.visibilityState === 'hidden') && e(n);
    };
    U.document &&
      (addEventListener('visibilitychange', t, !0), addEventListener('pagehide', t, !0));
  };
  var Fs = (e) => {
    let t = U.requestIdleCallback || U.setTimeout;
    U.document?.visibilityState === 'hidden' ? e() : ((e = Lr(e)), t(e), Pr(e));
  };
  var Lb = [200, 500],
    Db = 40,
    jp = (e, t = {}) => {
      globalThis.PerformanceEventTiming &&
        'interactionId' in PerformanceEventTiming.prototype &&
        kn(() => {
          Gp();
          let n = Xt('INP'),
            r,
            o = Or(t, Ps),
            i = (a) => {
              Fs(() => {
                for (let u of a) o._processEntry(u);
                let c = o._estimateP98LongestInteraction();
                c &&
                  c._latency !== n.value &&
                  ((n.value = c._latency), (n.entries = c.entries), r());
              });
            },
            s = kt('event', i, { durationThreshold: t.durationThreshold ?? Db });
          ((r = Kt(e, n, Lb, t.reportAllChanges)),
            s &&
              (s.observe({ type: 'first-input', buffered: !0 }),
              Pr(() => {
                (i(s.takeRecords()), r(!0));
              })));
        });
    };
  var Us = class {
    _processEntry(t) {
      this._onBeforeProcessingEntry?.(t);
    }
  };
  var Pb = [2500, 4e3],
    qp = (e, t = {}) => {
      kn(() => {
        let n = Dr(),
          r = Xt('LCP'),
          o,
          i = Or(t, Us),
          s = (c) => {
            t.reportAllChanges || (c = c.slice(-1));
            for (let u of c)
              (i._processEntry(u),
                u.startTime < n.firstHiddenTime &&
                  ((r.value = Math.max(u.startTime - At(), 0)), (r.entries = [u]), o()));
          },
          a = kt('largest-contentful-paint', s);
        if (a) {
          o = Kt(e, r, Pb, t.reportAllChanges);
          let c = Lr(() => {
            (s(a.takeRecords()), a.disconnect(), o(!0));
          });
          for (let u of ['keydown', 'click', 'visibilitychange'])
            U.document && addEventListener(u, () => Fs(c), { capture: !0, once: !0 });
        }
      });
    };
  var Fb = [800, 1800],
    Wu = (e) => {
      U.document?.prerendering
        ? kn(() => Wu(e))
        : U.document?.readyState !== 'complete'
          ? addEventListener('load', () => Wu(e), !0)
          : setTimeout(e);
    },
    Vp = (e, t = {}) => {
      let n = Xt('TTFB'),
        r = Kt(e, n, Fb, t.reportAllChanges);
      Wu(() => {
        let o = cn();
        o && ((n.value = Math.max(o.responseStart - At(), 0)), (n.entries = [o]), r(!0));
      });
    };
  var Ko = {},
    Bs = {},
    Yp,
    Jp,
    Kp,
    Xp;
  function Xn(e, t = !1) {
    return Hs('cls', e, Ub, Yp, t);
  }
  function Zn(e, t = !1) {
    return Hs('lcp', e, Bb, Jp, t);
  }
  function Gu(e) {
    return Hs('ttfb', e, Hb, Kp);
  }
  function Xo(e) {
    return Hs('inp', e, $b, Xp);
  }
  function _t(e, t) {
    return (Zp(e, t), Bs[e] || (Wb(e), (Bs[e] = !0)), Qp(e, t));
  }
  function Zo(e, t) {
    let n = Ko[e];
    if (n?.length)
      for (let r of n)
        try {
          r(t);
        } catch (o) {
          $t &&
            h.error(
              `Error while triggering instrumentation handler.
Type: ${e}
Name: ${rt(r)}
Error:`,
              o
            );
        }
  }
  function Ub() {
    return $p(
      (e) => {
        (Zo('cls', { metric: e }), (Yp = e));
      },
      { reportAllChanges: !0 }
    );
  }
  function Bb() {
    return qp(
      (e) => {
        (Zo('lcp', { metric: e }), (Jp = e));
      },
      { reportAllChanges: !0 }
    );
  }
  function Hb() {
    return Vp((e) => {
      (Zo('ttfb', { metric: e }), (Kp = e));
    });
  }
  function $b() {
    return jp((e) => {
      (Zo('inp', { metric: e }), (Xp = e));
    });
  }
  function Hs(e, t, n, r, o = !1) {
    Zp(e, t);
    let i;
    return (Bs[e] || ((i = n()), (Bs[e] = !0)), r && t({ metric: r }), Qp(e, t, o ? i : void 0));
  }
  function Wb(e) {
    let t = {};
    (e === 'event' && (t.durationThreshold = 0),
      kt(
        e,
        (n) => {
          Zo(e, { entries: n });
        },
        t
      ));
  }
  function Zp(e, t) {
    ((Ko[e] = Ko[e] || []), Ko[e].push(t));
  }
  function Qp(e, t, n) {
    return () => {
      n && n();
      let r = Ko[e];
      if (!r) return;
      let o = r.indexOf(t);
      o !== -1 && r.splice(o, 1);
    };
  }
  function em(e) {
    return 'duration' in e;
  }
  function $s(e) {
    return typeof e == 'number' && isFinite(e);
  }
  function un(e, t, n, { ...r }) {
    let o = D(e).start_timestamp;
    return (
      o && o > t && typeof e.updateStartTime == 'function' && e.updateStartTime(t),
      vn(e, () => {
        let i = st({ startTime: t, ...r });
        return (i && i.end(n), i);
      })
    );
  }
  function Fr(e) {
    let t = b();
    if (!t) return;
    let { name: n, transaction: r, attributes: o, startTime: i } = e,
      { release: s, environment: a, sendDefaultPii: c } = t.getOptions(),
      d = t.getIntegrationByName('Replay')?.getReplayId(),
      l = M(),
      p = l.getUser(),
      f = p !== void 0 ? p.email || p.id || p.ip_address : void 0,
      m;
    try {
      m = l.getScopeData().contexts.profile.profile_id;
    } catch {}
    let _ = {
      release: s,
      environment: a,
      user: f || void 0,
      profile_id: m || void 0,
      replay_id: d || void 0,
      transaction: r,
      'user_agent.original': U.navigator?.userAgent,
      'client.address': c ? '{{auto}}' : void 0,
      ...o,
    };
    return st({ name: n, attributes: _, startTime: i, experimental: { standalone: !0 } });
  }
  function ln() {
    return U.addEventListener && U.performance;
  }
  function fe(e) {
    return e / 1e3;
  }
  function tm(e) {
    let t = 'unknown',
      n = 'unknown',
      r = '';
    for (let o of e) {
      if (o === '/') {
        [t, n] = e.split('/');
        break;
      }
      if (!isNaN(Number(o))) {
        ((t = r === 'h' ? 'http' : r), (n = e.split(r)[1]));
        break;
      }
      r += o;
    }
    return (r === e && (t = r), { name: t, version: n });
  }
  function Ws(e) {
    try {
      return PerformanceObserver.supportedEntryTypes.includes(e);
    } catch {
      return !1;
    }
  }
  function Gs(e, t) {
    let n,
      r = !1;
    function o(a) {
      (!r && n && t(a, n), (r = !0));
    }
    Pr(() => {
      o('pagehide');
    });
    let i = e.on('beforeStartNavigationSpan', (a, c) => {
        c?.isRedirect || (o('navigation'), i(), s());
      }),
      s = e.on('afterStartPageLoadSpan', (a) => {
        ((n = a.spanContext().spanId), s());
      });
  }
  function nm(e) {
    let t = 0,
      n;
    if (!Ws('layout-shift')) return;
    let r = Xn(({ metric: o }) => {
      let i = o.entries[o.entries.length - 1];
      i && ((t = o.value), (n = i));
    }, !0);
    Gs(e, (o, i) => {
      (Gb(t, n, i, o), r());
    });
  }
  function Gb(e, t, n, r) {
    $t && h.log(`Sending CLS span (${e})`);
    let o = t ? fe((_e() || 0) + t.startTime) : K(),
      i = M().getScopeData().transactionName,
      s = t ? Ce(t.sources[0]?.node) : 'Layout shift',
      a = {
        [X]: 'auto.http.browser.cls',
        [Se]: 'ui.webvital.cls',
        [wt]: 0,
        'sentry.pageload.span_id': n,
        'sentry.report_event': r,
      };
    t?.sources &&
      t.sources.forEach((u, d) => {
        a[`cls.source.${d + 1}`] = Ce(u.node);
      });
    let c = Fr({ name: s, transaction: i, attributes: a, startTime: o });
    c && (c.addEvent('cls', { [qt]: '', [Vt]: e }), c.end(o));
  }
  function rm(e) {
    let t = 0,
      n;
    if (!Ws('largest-contentful-paint')) return;
    let r = Zn(({ metric: o }) => {
      let i = o.entries[o.entries.length - 1];
      i && ((t = o.value), (n = i));
    }, !0);
    Gs(e, (o, i) => {
      (zb(t, n, i, o), r());
    });
  }
  function zb(e, t, n, r) {
    $t && h.log(`Sending LCP span (${e})`);
    let o = fe((_e() || 0) + (t?.startTime || 0)),
      i = M().getScopeData().transactionName,
      s = t ? Ce(t.element) : 'Largest contentful paint',
      a = {
        [X]: 'auto.http.browser.lcp',
        [Se]: 'ui.webvital.lcp',
        [wt]: 0,
        'sentry.pageload.span_id': n,
        'sentry.report_event': r,
      };
    t &&
      (t.element && (a['lcp.element'] = Ce(t.element)),
      t.id && (a['lcp.id'] = t.id),
      t.url && (a['lcp.url'] = t.url.trim().slice(0, 200)),
      t.loadTime != null && (a['lcp.loadTime'] = t.loadTime),
      t.renderTime != null && (a['lcp.renderTime'] = t.renderTime),
      t.size != null && (a['lcp.size'] = t.size));
    let c = Fr({ name: s, transaction: i, attributes: a, startTime: o });
    c && (c.addEvent('lcp', { [qt]: 'millisecond', [Vt]: e }), c.end(o));
  }
  function Nt(e) {
    return e && ((_e() || performance.timeOrigin) + e) / 1e3;
  }
  function Qo(e) {
    let t = {};
    if (e.nextHopProtocol != null) {
      let { name: n, version: r } = tm(e.nextHopProtocol);
      ((t['network.protocol.version'] = r), (t['network.protocol.name'] = n));
    }
    return _e() || ln()?.timeOrigin
      ? jb({
          ...t,
          'http.request.redirect_start': Nt(e.redirectStart),
          'http.request.redirect_end': Nt(e.redirectEnd),
          'http.request.worker_start': Nt(e.workerStart),
          'http.request.fetch_start': Nt(e.fetchStart),
          'http.request.domain_lookup_start': Nt(e.domainLookupStart),
          'http.request.domain_lookup_end': Nt(e.domainLookupEnd),
          'http.request.connect_start': Nt(e.connectStart),
          'http.request.secure_connection_start': Nt(e.secureConnectionStart),
          'http.request.connection_end': Nt(e.connectEnd),
          'http.request.request_start': Nt(e.requestStart),
          'http.request.response_start': Nt(e.responseStart),
          'http.request.response_end': Nt(e.responseEnd),
          'http.request.time_to_first_byte':
            e.responseStart != null ? e.responseStart / 1e3 : void 0,
        })
      : t;
  }
  function jb(e) {
    return Object.fromEntries(Object.entries(e).filter(([, t]) => t != null));
  }
  var qb = 2147483647,
    om = 0,
    Wt = {},
    at,
    js;
  function zu({ recordClsStandaloneSpans: e, recordLcpStandaloneSpans: t, client: n }) {
    let r = ln();
    if (r && _e()) {
      r.mark && U.performance.mark('sentry-tracing-init');
      let o = t ? rm(n) : Yb(),
        i = Jb(),
        s = e ? nm(n) : Vb();
      return () => {
        (o?.(), i(), s?.());
      };
    }
    return () => {};
  }
  function ju() {
    _t('longtask', ({ entries: e }) => {
      let t = Z();
      if (!t) return;
      let { op: n, start_timestamp: r } = D(t);
      for (let o of e) {
        let i = fe(_e() + o.startTime),
          s = fe(o.duration);
        (n === 'navigation' && r && i < r) ||
          un(t, i, i + s, {
            name: 'Main UI thread blocked',
            op: 'ui.long-task',
            attributes: { [X]: 'auto.ui.browser.metrics' },
          });
      }
    });
  }
  function qu() {
    new PerformanceObserver((t) => {
      let n = Z();
      if (n)
        for (let r of t.getEntries()) {
          if (!r.scripts[0]) continue;
          let o = fe(_e() + r.startTime),
            { start_timestamp: i, op: s } = D(n);
          if (s === 'navigation' && i && o < i) continue;
          let a = fe(r.duration),
            c = { [X]: 'auto.ui.browser.metrics' },
            u = r.scripts[0],
            {
              invoker: d,
              invokerType: l,
              sourceURL: p,
              sourceFunctionName: f,
              sourceCharPosition: m,
            } = u;
          ((c['browser.script.invoker'] = d),
            (c['browser.script.invoker_type'] = l),
            p && (c['code.filepath'] = p),
            f && (c['code.function'] = f),
            m !== -1 && (c['browser.script.source_char_position'] = m),
            un(n, o, o + a, {
              name: 'Main UI thread blocked',
              op: 'ui.long-animation-frame',
              attributes: c,
            }));
        }
    }).observe({ type: 'long-animation-frame', buffered: !0 });
  }
  function Vu() {
    _t('event', ({ entries: e }) => {
      let t = Z();
      if (t) {
        for (let n of e)
          if (n.name === 'click') {
            let r = fe(_e() + n.startTime),
              o = fe(n.duration),
              i = {
                name: Ce(n.target),
                op: `ui.interaction.${n.name}`,
                startTime: r,
                attributes: { [X]: 'auto.ui.browser.metrics' },
              },
              s = co(n.target);
            (s && (i.attributes['ui.component_name'] = s), un(t, r, r + o, i));
          }
      }
    });
  }
  function Vb() {
    return Xn(({ metric: e }) => {
      let t = e.entries[e.entries.length - 1];
      t && ((Wt.cls = { value: e.value, unit: '' }), (js = t));
    }, !0);
  }
  function Yb() {
    return Zn(({ metric: e }) => {
      let t = e.entries[e.entries.length - 1];
      t && ((Wt.lcp = { value: e.value, unit: 'millisecond' }), (at = t));
    }, !0);
  }
  function Jb() {
    return Gu(({ metric: e }) => {
      e.entries[e.entries.length - 1] && (Wt.ttfb = { value: e.value, unit: 'millisecond' });
    });
  }
  function Yu(e, t) {
    let n = ln(),
      r = _e();
    if (!n?.getEntries || !r) return;
    let o = fe(r),
      i = n.getEntries(),
      { op: s, start_timestamp: a } = D(e);
    (i.slice(om).forEach((c) => {
      let u = fe(c.startTime),
        d = fe(Math.max(0, c.duration));
      if (!(s === 'navigation' && a && o + u < a))
        switch (c.entryType) {
          case 'navigation': {
            Zb(e, c, o);
            break;
          }
          case 'mark':
          case 'paint':
          case 'measure': {
            Kb(e, c, u, d, o, t.ignorePerformanceApiSpans);
            let l = Dr(),
              p = c.startTime < l.firstHiddenTime;
            (c.name === 'first-paint' && p && (Wt.fp = { value: c.startTime, unit: 'millisecond' }),
              c.name === 'first-contentful-paint' &&
                p &&
                (Wt.fcp = { value: c.startTime, unit: 'millisecond' }));
            break;
          }
          case 'resource': {
            tT(e, c, c.name, u, d, o, t.ignoreResourceSpans);
            break;
          }
        }
    }),
      (om = Math.max(i.length - 1, 0)),
      nT(e),
      s === 'pageload' &&
        (iT(Wt),
        t.recordClsOnPageloadSpan || delete Wt.cls,
        t.recordLcpOnPageloadSpan || delete Wt.lcp,
        Object.entries(Wt).forEach(([c, u]) => {
          Eo(c, u.value, u.unit);
        }),
        e.setAttribute('performance.timeOrigin', o),
        e.setAttribute('performance.activationStart', At()),
        rT(e, t)),
      (at = void 0),
      (js = void 0),
      (Wt = {}));
  }
  function Kb(e, t, n, r, o, i) {
    if (['mark', 'measure'].includes(t.entryType) && Ue(t.name, i)) return;
    let s = cn(!1),
      a = fe(s ? s.requestStart : 0),
      c = o + Math.max(n, a),
      u = o + n,
      d = u + r,
      l = { [X]: 'auto.resource.browser.metrics' };
    (c !== u &&
      ((l['sentry.browser.measure_happened_before_request'] = !0),
      (l['sentry.browser.measure_start_time'] = c)),
      Xb(l, t),
      c <= d && un(e, c, d, { name: t.name, op: t.entryType, attributes: l }));
  }
  function Xb(e, t) {
    try {
      let n = t.detail;
      if (!n) return;
      if (typeof n == 'object') {
        for (let [r, o] of Object.entries(n))
          if (o && bt(o)) e[`sentry.browser.measure.detail.${r}`] = o;
          else if (o !== void 0)
            try {
              e[`sentry.browser.measure.detail.${r}`] = JSON.stringify(o);
            } catch {}
        return;
      }
      if (bt(n)) {
        e['sentry.browser.measure.detail'] = n;
        return;
      }
      try {
        e['sentry.browser.measure.detail'] = JSON.stringify(n);
      } catch {}
    } catch {}
  }
  function Zb(e, t, n) {
    (['unloadEvent', 'redirect', 'domContentLoadedEvent', 'loadEvent', 'connect'].forEach((r) => {
      zs(e, t, r, n);
    }),
      zs(e, t, 'secureConnection', n, 'TLS/SSL'),
      zs(e, t, 'fetch', n, 'cache'),
      zs(e, t, 'domainLookup', n, 'DNS'),
      eT(e, t, n));
  }
  function zs(e, t, n, r, o = n) {
    let i = Qb(n),
      s = t[i],
      a = t[`${n}Start`];
    !a ||
      !s ||
      un(e, r + fe(a), r + fe(s), {
        op: `browser.${o}`,
        name: t.name,
        attributes: {
          [X]: 'auto.ui.browser.metrics',
          ...(n === 'redirect' && t.redirectCount != null
            ? { 'http.redirect_count': t.redirectCount }
            : {}),
        },
      });
  }
  function Qb(e) {
    return e === 'secureConnection'
      ? 'connectEnd'
      : e === 'fetch'
        ? 'domainLookupStart'
        : `${e}End`;
  }
  function eT(e, t, n) {
    let r = n + fe(t.requestStart),
      o = n + fe(t.responseEnd),
      i = n + fe(t.responseStart);
    t.responseEnd &&
      (un(e, r, o, {
        op: 'browser.request',
        name: t.name,
        attributes: { [X]: 'auto.ui.browser.metrics' },
      }),
      un(e, i, o, {
        op: 'browser.response',
        name: t.name,
        attributes: { [X]: 'auto.ui.browser.metrics' },
      }));
  }
  function tT(e, t, n, r, o, i, s) {
    if (t.initiatorType === 'xmlhttprequest' || t.initiatorType === 'fetch') return;
    let a = t.initiatorType ? `resource.${t.initiatorType}` : 'resource.other';
    if (s?.includes(a)) return;
    let c = { [X]: 'auto.resource.browser.metrics' },
      u = Ft(n);
    (u.protocol && (c['url.scheme'] = u.protocol.split(':').pop()),
      u.host && (c['server.address'] = u.host),
      (c['url.same_origin'] = n.includes(U.location.origin)),
      oT(t, c, [
        ['responseStatus', 'http.response.status_code'],
        ['transferSize', 'http.response_transfer_size'],
        ['encodedBodySize', 'http.response_content_length'],
        ['decodedBodySize', 'http.decoded_response_content_length'],
        ['renderBlockingStatus', 'resource.render_blocking_status'],
        ['deliveryType', 'http.response_delivery_type'],
      ]));
    let d = { ...c, ...Qo(t) },
      l = i + r,
      p = l + o;
    un(e, l, p, { name: n.replace(U.location.origin, ''), op: a, attributes: d });
  }
  function nT(e) {
    let t = U.navigator;
    if (!t) return;
    let n = t.connection;
    (n &&
      (n.effectiveType && e.setAttribute('effectiveConnectionType', n.effectiveType),
      n.type && e.setAttribute('connectionType', n.type),
      $s(n.rtt) && (Wt['connection.rtt'] = { value: n.rtt, unit: 'millisecond' })),
      $s(t.deviceMemory) && e.setAttribute('deviceMemory', `${t.deviceMemory} GB`),
      $s(t.hardwareConcurrency) &&
        e.setAttribute('hardwareConcurrency', String(t.hardwareConcurrency)));
  }
  function rT(e, t) {
    (at &&
      t.recordLcpOnPageloadSpan &&
      (at.element && e.setAttribute('lcp.element', Ce(at.element)),
      at.id && e.setAttribute('lcp.id', at.id),
      at.url && e.setAttribute('lcp.url', at.url.trim().slice(0, 200)),
      at.loadTime != null && e.setAttribute('lcp.loadTime', at.loadTime),
      at.renderTime != null && e.setAttribute('lcp.renderTime', at.renderTime),
      e.setAttribute('lcp.size', at.size)),
      js?.sources &&
        t.recordClsOnPageloadSpan &&
        js.sources.forEach((n, r) => e.setAttribute(`cls.source.${r + 1}`, Ce(n.node))));
  }
  function oT(e, t, n) {
    n.forEach(([r, o]) => {
      let i = e[r];
      i != null && ((typeof i == 'number' && i < qb) || typeof i == 'string') && (t[o] = i);
    });
  }
  function iT(e) {
    let t = cn(!1);
    if (!t) return;
    let { responseStart: n, requestStart: r } = t;
    r <= n && (e['ttfb.requestTime'] = { value: n - r, unit: 'millisecond' });
  }
  function Ju() {
    return ln() && _e() ? _t('element', sT) : () => {};
  }
  var sT = ({ entries: e }) => {
    let t = Z(),
      n = t ? re(t) : void 0,
      r = n ? D(n).description : M().getScopeData().transactionName;
    e.forEach((o) => {
      let i = o;
      if (!i.identifier) return;
      let s = i.name,
        a = i.renderTime,
        c = i.loadTime,
        [u, d] = c ? [fe(c), 'load-time'] : a ? [fe(a), 'render-time'] : [K(), 'entry-emission'],
        l = s === 'image-paint' ? fe(Math.max(0, (a ?? 0) - (c ?? 0))) : 0,
        p = {
          [X]: 'auto.ui.browser.elementtiming',
          [Se]: 'ui.elementtiming',
          [Ie]: 'component',
          'sentry.span_start_time_source': d,
          'sentry.transaction_name': r,
          'element.id': i.id,
          'element.type': i.element?.tagName?.toLowerCase() || 'unknown',
          'element.size':
            i.naturalWidth && i.naturalHeight ? `${i.naturalWidth}x${i.naturalHeight}` : void 0,
          'element.render_time': a,
          'element.load_time': c,
          'element.url': i.url || void 0,
          'element.identifier': i.identifier,
          'element.paint_type': s,
        };
      In(
        { name: `element[${i.identifier}]`, attributes: p, startTime: u, onlyIfParent: !0 },
        (f) => {
          f.end(u + l);
        }
      );
    });
  };
  var aT = 1e3,
    im,
    Ku,
    Xu;
  function ei(e) {
    ($e('dom', e), We('dom', cT));
  }
  function cT() {
    if (!U.document) return;
    let e = xe.bind(null, 'dom'),
      t = sm(e, !0);
    (U.document.addEventListener('click', t, !1),
      U.document.addEventListener('keypress', t, !1),
      ['EventTarget', 'Node'].forEach((n) => {
        let o = U[n]?.prototype;
        o?.hasOwnProperty?.('addEventListener') &&
          (be(o, 'addEventListener', function (i) {
            return function (s, a, c) {
              if (s === 'click' || s == 'keypress')
                try {
                  let u = (this.__sentry_instrumentation_handlers__ =
                      this.__sentry_instrumentation_handlers__ || {}),
                    d = (u[s] = u[s] || { refCount: 0 });
                  if (!d.handler) {
                    let l = sm(e);
                    ((d.handler = l), i.call(this, s, l, c));
                  }
                  d.refCount++;
                } catch {}
              return i.call(this, s, a, c);
            };
          }),
          be(o, 'removeEventListener', function (i) {
            return function (s, a, c) {
              if (s === 'click' || s == 'keypress')
                try {
                  let u = this.__sentry_instrumentation_handlers__ || {},
                    d = u[s];
                  d &&
                    (d.refCount--,
                    d.refCount <= 0 &&
                      (i.call(this, s, d.handler, c), (d.handler = void 0), delete u[s]),
                    Object.keys(u).length === 0 && delete this.__sentry_instrumentation_handlers__);
                } catch {}
              return i.call(this, s, a, c);
            };
          }));
      }));
  }
  function uT(e) {
    if (e.type !== Ku) return !1;
    try {
      if (!e.target || e.target._sentryId !== Xu) return !1;
    } catch {}
    return !0;
  }
  function lT(e, t) {
    return e !== 'keypress'
      ? !1
      : t?.tagName
        ? !(t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
        : !0;
  }
  function sm(e, t = !1) {
    return (n) => {
      if (!n || n._sentryCaptured) return;
      let r = dT(n);
      if (lT(n.type, r)) return;
      (he(n, '_sentryCaptured', !0), r && !r._sentryId && he(r, '_sentryId', ge()));
      let o = n.type === 'keypress' ? 'input' : n.type;
      (uT(n) ||
        (e({ event: n, name: o, global: t }), (Ku = n.type), (Xu = r ? r._sentryId : void 0)),
        clearTimeout(im),
        (im = U.setTimeout(() => {
          ((Xu = void 0), (Ku = void 0));
        }, aT)));
    };
  }
  function dT(e) {
    try {
      return e.target;
    } catch {
      return null;
    }
  }
  var qs;
  function dn(e) {
    let t = 'history';
    ($e(t, e), We(t, fT));
  }
  function fT() {
    if (
      (U.addEventListener('popstate', () => {
        let t = U.location.href,
          n = qs;
        if (((qs = t), n === t)) return;
        xe('history', { from: n, to: t });
      }),
      !lu())
    )
      return;
    function e(t) {
      return function (...n) {
        let r = n.length > 2 ? n[2] : void 0;
        if (r) {
          let o = qs,
            i = pT(String(r));
          if (((qs = i), o === i)) return t.apply(this, n);
          xe('history', { from: o, to: i });
        }
        return t.apply(this, n);
      };
    }
    (be(U.history, 'pushState', e), be(U.history, 'replaceState', e));
  }
  function pT(e) {
    try {
      return new URL(e, U.location.origin).toString();
    } catch {
      return e;
    }
  }
  var Vs = {};
  function Ur(e) {
    let t = Vs[e];
    if (t) return t;
    let n = U[e];
    if (Wo(n)) return (Vs[e] = n.bind(U));
    let r = U.document;
    if (r && typeof r.createElement == 'function')
      try {
        let o = r.createElement('iframe');
        ((o.hidden = !0), r.head.appendChild(o));
        let i = o.contentWindow;
        (i?.[e] && (n = i[e]), r.head.removeChild(o));
      } catch (o) {
        $t && h.warn(`Could not create sandbox iframe for ${e} check, bailing to window.${e}: `, o);
      }
    return n && (Vs[e] = n.bind(U));
  }
  function Zu(e) {
    Vs[e] = void 0;
  }
  function Qn(...e) {
    return Ur('setTimeout')(...e);
  }
  var Qe = '__sentry_xhr_v3__';
  function er(e) {
    ($e('xhr', e), We('xhr', mT));
  }
  function mT() {
    if (!U.XMLHttpRequest) return;
    let e = XMLHttpRequest.prototype;
    ((e.open = new Proxy(e.open, {
      apply(t, n, r) {
        let o = new Error(),
          i = K() * 1e3,
          s = De(r[0]) ? r[0].toUpperCase() : void 0,
          a = hT(r[1]);
        if (!s || !a) return t.apply(n, r);
        ((n[Qe] = { method: s, url: a, request_headers: {} }),
          s === 'POST' && a.match(/sentry_key/) && (n.__sentry_own_request__ = !0));
        let c = () => {
          let u = n[Qe];
          if (u && n.readyState === 4) {
            try {
              u.status_code = n.status;
            } catch {}
            let d = { endTimestamp: K() * 1e3, startTimestamp: i, xhr: n, virtualError: o };
            xe('xhr', d);
          }
        };
        return (
          'onreadystatechange' in n && typeof n.onreadystatechange == 'function'
            ? (n.onreadystatechange = new Proxy(n.onreadystatechange, {
                apply(u, d, l) {
                  return (c(), u.apply(d, l));
                },
              }))
            : n.addEventListener('readystatechange', c),
          (n.setRequestHeader = new Proxy(n.setRequestHeader, {
            apply(u, d, l) {
              let [p, f] = l,
                m = d[Qe];
              return (
                m && De(p) && De(f) && (m.request_headers[p.toLowerCase()] = f),
                u.apply(d, l)
              );
            },
          })),
          t.apply(n, r)
        );
      },
    })),
      (e.send = new Proxy(e.send, {
        apply(t, n, r) {
          let o = n[Qe];
          if (!o) return t.apply(n, r);
          r[0] !== void 0 && (o.body = r[0]);
          let i = { startTimestamp: K() * 1e3, xhr: n };
          return (xe('xhr', i), t.apply(n, r));
        },
      })));
  }
  function hT(e) {
    if (De(e)) return e;
    try {
      return e.toString();
    } catch {}
  }
  function Ys(e) {
    return new URLSearchParams(e).toString();
  }
  function tr(e, t = h) {
    try {
      if (typeof e == 'string') return [e];
      if (e instanceof URLSearchParams) return [e.toString()];
      if (e instanceof FormData) return [Ys(e)];
      if (!e) return [void 0];
    } catch (n) {
      return ($t && t.error(n, 'Failed to serialize body', e), [void 0, 'BODY_PARSE_ERROR']);
    }
    return (
      $t && t.log('Skipping network body because of body type', e),
      [void 0, 'UNPARSEABLE_BODY_TYPE']
    );
  }
  function Br(e = []) {
    if (!(e.length !== 2 || typeof e[1] != 'object')) return e[1].body;
  }
  var Qu = [],
    Js = new Map(),
    gT = 60;
  function el() {
    if (ln() && _e()) {
      let t = _T();
      return () => {
        t();
      };
    }
    return () => {};
  }
  var am = {
    click: 'click',
    pointerdown: 'click',
    pointerup: 'click',
    mousedown: 'click',
    mouseup: 'click',
    touchstart: 'click',
    touchend: 'click',
    mouseover: 'hover',
    mouseout: 'hover',
    mouseenter: 'hover',
    mouseleave: 'hover',
    pointerover: 'hover',
    pointerout: 'hover',
    pointerenter: 'hover',
    pointerleave: 'hover',
    dragstart: 'drag',
    dragend: 'drag',
    drag: 'drag',
    dragenter: 'drag',
    dragleave: 'drag',
    dragover: 'drag',
    drop: 'drag',
    keydown: 'press',
    keyup: 'press',
    keypress: 'press',
    input: 'press',
  };
  function _T() {
    return Xo(ST);
  }
  var ST = ({ metric: e }) => {
    if (e.value == null) return;
    let t = fe(e.value);
    if (t > gT) return;
    let n = e.entries.find((m) => m.duration === e.value && am[m.name]);
    if (!n) return;
    let { interactionId: r } = n,
      o = am[n.name],
      i = fe(_e() + n.startTime),
      s = Z(),
      a = s ? re(s) : void 0,
      u = (r != null ? Js.get(r) : void 0) || a,
      d = u ? D(u).description : M().getScopeData().transactionName,
      l = Ce(n.target),
      p = { [X]: 'auto.http.browser.inp', [Se]: `ui.interaction.${o}`, [wt]: n.duration },
      f = Fr({ name: l, transaction: d, attributes: p, startTime: i });
    f && (f.addEvent('inp', { [qt]: 'millisecond', [Vt]: e.value }), f.end(i + t));
  };
  function tl() {
    let e = ({ entries: t }) => {
      let n = Z(),
        r = n && re(n);
      t.forEach((o) => {
        if (!em(o) || !r) return;
        let i = o.interactionId;
        if (i != null && !Js.has(i)) {
          if (Qu.length > 10) {
            let s = Qu.shift();
            Js.delete(s);
          }
          (Qu.push(i), Js.set(i, r));
        }
      });
    };
    (_t('event', e), _t('first-input', e));
  }
  function Hr(e, t = Ur('fetch')) {
    let n = 0,
      r = 0;
    async function o(i) {
      let s = i.body.length;
      ((n += s), r++);
      let a = {
        body: i.body,
        method: 'POST',
        referrerPolicy: 'strict-origin',
        headers: e.headers,
        keepalive: n <= 6e4 && r < 15,
        ...e.fetchOptions,
      };
      try {
        let c = await t(e.url, a);
        return {
          statusCode: c.status,
          headers: {
            'x-sentry-rate-limits': c.headers.get('X-Sentry-Rate-Limits'),
            'retry-after': c.headers.get('Retry-After'),
          },
        };
      } catch (c) {
        throw (Zu('fetch'), c);
      } finally {
        ((n -= s), r--);
      }
    }
    return Lo(e, o);
  }
  var yT = 10,
    ET = 20,
    bT = 30,
    TT = 40,
    IT = 50;
  function $r(e, t, n, r) {
    let o = { filename: e, function: t === '<anonymous>' ? '?' : t, in_app: !0 };
    return (n !== void 0 && (o.lineno = n), r !== void 0 && (o.colno = r), o);
  }
  var vT = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i,
    wT =
      /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
    RT = /\((\S*)(?::(\d+))(?::(\d+))\)/,
    xT = /at (.+?) ?\(data:(.+?),/,
    CT = (e) => {
      let t = e.match(xT);
      if (t) return { filename: `<data:${t[2]}>`, function: t[1] };
      let n = vT.exec(e);
      if (n) {
        let [, o, i, s] = n;
        return $r(o, '?', +i, +s);
      }
      let r = wT.exec(e);
      if (r) {
        if (r[2] && r[2].indexOf('eval') === 0) {
          let a = RT.exec(r[2]);
          a && ((r[2] = a[1]), (r[3] = a[2]), (r[4] = a[3]));
        }
        let [i, s] = dm(r[1] || '?', r[2]);
        return $r(s, i, r[3] ? +r[3] : void 0, r[4] ? +r[4] : void 0);
      }
    },
    nl = [bT, CT],
    AT =
      /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
    kT = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
    NT = (e) => {
      let t = AT.exec(e);
      if (t) {
        if (t[3] && t[3].indexOf(' > eval') > -1) {
          let i = kT.exec(t[3]);
          i && ((t[1] = t[1] || 'eval'), (t[3] = i[1]), (t[4] = i[2]), (t[5] = ''));
        }
        let r = t[3],
          o = t[1] || '?';
        return (([o, r] = dm(o, r)), $r(r, o, t[4] ? +t[4] : void 0, t[5] ? +t[5] : void 0));
      }
    },
    rl = [IT, NT],
    MT = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
    OT = (e) => {
      let t = MT.exec(e);
      return t ? $r(t[2], t[1] || '?', +t[3], t[4] ? +t[4] : void 0) : void 0;
    },
    cm = [TT, OT],
    LT = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i,
    DT = (e) => {
      let t = LT.exec(e);
      return t ? $r(t[2], t[3] || '?', +t[1]) : void 0;
    },
    um = [yT, DT],
    PT =
      / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i,
    FT = (e) => {
      let t = PT.exec(e);
      return t ? $r(t[5], t[3] || t[4] || '?', +t[1], +t[2]) : void 0;
    },
    lm = [ET, FT],
    ol = [nl, rl],
    Ks = Ei(...ol),
    dm = (e, t) => {
      let n = e.indexOf('safari-extension') !== -1,
        r = e.indexOf('safari-web-extension') !== -1;
      return n || r
        ? [
            e.indexOf('@') !== -1 ? e.split('@')[0] : '?',
            n ? `safari-extension:${t}` : `safari-web-extension:${t}`,
          ]
        : [e, t];
    };
  function fm(e, { metadata: t, tunnel: n, dsn: r }) {
    let o = {
        event_id: e.event_id,
        sent_at: new Date().toISOString(),
        ...(t?.sdk && { sdk: { name: t.sdk.name, version: t.sdk.version } }),
        ...(!!n && !!r && { dsn: Ve(r) }),
      },
      i = UT(e);
    return Oe(o, [i]);
  }
  function UT(e) {
    return [{ type: 'user_report' }, e];
  }
  var B = typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__;
  var Xs = 1024,
    BT = 'Breadcrumbs',
    HT = (e = {}) => {
      let t = { console: !0, dom: !0, fetch: !0, history: !0, sentry: !0, xhr: !0, ...e };
      return {
        name: BT,
        setup(n) {
          (t.console && zn(GT(n)),
            t.dom && ei(WT(n, t.dom)),
            t.xhr && er(zT(n)),
            t.fetch && qn(jT(n)),
            t.history && dn(qT(n)),
            t.sentry && n.on('beforeSendEvent', $T(n)));
        },
      };
    },
    Zs = HT;
  function $T(e) {
    return function (n) {
      b() === e &&
        Ze(
          {
            category: `sentry.${n.type === 'transaction' ? 'transaction' : 'event'}`,
            event_id: n.event_id,
            level: n.level,
            message: jt(n),
          },
          { event: n }
        );
    };
  }
  function WT(e, t) {
    return function (r) {
      if (b() !== e) return;
      let o,
        i,
        s = typeof t == 'object' ? t.serializeAttribute : void 0,
        a =
          typeof t == 'object' && typeof t.maxStringLength == 'number' ? t.maxStringLength : void 0;
      (a &&
        a > Xs &&
        (B &&
          h.warn(
            `\`dom.maxStringLength\` cannot exceed ${Xs}, but a value of ${a} was configured. Sentry will use ${Xs} instead.`
          ),
        (a = Xs)),
        typeof s == 'string' && (s = [s]));
      try {
        let u = r.event,
          d = VT(u) ? u.target : u;
        ((o = Ce(d, { keyAttrs: s, maxStringLength: a })), (i = co(d)));
      } catch {
        o = '<unknown>';
      }
      if (o.length === 0) return;
      let c = { category: `ui.${r.name}`, message: o };
      (i && (c.data = { 'ui.component_name': i }),
        Ze(c, { event: r.event, name: r.name, global: r.global }));
    };
  }
  function GT(e) {
    return function (n) {
      if (b() !== e) return;
      let r = {
        category: 'console',
        data: { arguments: n.args, logger: 'console' },
        level: jn(n.level),
        message: Pn(n.args, ' '),
      };
      if (n.level === 'assert')
        if (n.args[0] === !1)
          ((r.message = `Assertion failed: ${Pn(n.args.slice(1), ' ') || 'console.assert'}`),
            (r.data.arguments = n.args.slice(1)));
        else return;
      Ze(r, { input: n.args, level: n.level });
    };
  }
  function zT(e) {
    return function (n) {
      if (b() !== e) return;
      let { startTimestamp: r, endTimestamp: o } = n,
        i = n.xhr[Qe];
      if (!r || !o || !i) return;
      let { method: s, url: a, status_code: c, body: u } = i,
        d = { method: s, url: a, status_code: c },
        l = { xhr: n.xhr, input: u, startTimestamp: r, endTimestamp: o },
        p = { category: 'xhr', data: d, type: 'http', level: _s(c) };
      (e.emit('beforeOutgoingRequestBreadcrumb', p, l), Ze(p, l));
    };
  }
  function jT(e) {
    return function (n) {
      if (b() !== e) return;
      let { startTimestamp: r, endTimestamp: o } = n;
      if (o && !(n.fetchData.url.match(/sentry_key/) && n.fetchData.method === 'POST'))
        if ((n.fetchData.method, n.fetchData.url, n.error)) {
          let i = n.fetchData,
            s = { data: n.error, input: n.args, startTimestamp: r, endTimestamp: o },
            a = { category: 'fetch', data: i, level: 'error', type: 'http' };
          (e.emit('beforeOutgoingRequestBreadcrumb', a, s), Ze(a, s));
        } else {
          let i = n.response,
            s = { ...n.fetchData, status_code: i?.status };
          (n.fetchData.request_body_size, n.fetchData.response_body_size, i?.status);
          let a = { input: n.args, response: i, startTimestamp: r, endTimestamp: o },
            c = { category: 'fetch', data: s, type: 'http', level: _s(s.status_code) };
          (e.emit('beforeOutgoingRequestBreadcrumb', c, a), Ze(c, a));
        }
    };
  }
  function qT(e) {
    return function (n) {
      if (b() !== e) return;
      let r = n.from,
        o = n.to,
        i = Ft(O.location.href),
        s = r ? Ft(r) : void 0,
        a = Ft(o);
      (s?.path || (s = i),
        i.protocol === a.protocol && i.host === a.host && (o = a.relative),
        i.protocol === s.protocol && i.host === s.host && (r = s.relative),
        Ze({ category: 'navigation', data: { from: r, to: o } }));
    };
  }
  function VT(e) {
    return !!e && !!e.target;
  }
  var YT = [
      'EventTarget',
      'Window',
      'Node',
      'ApplicationCache',
      'AudioTrackList',
      'BroadcastChannel',
      'ChannelMergerNode',
      'CryptoOperation',
      'EventSource',
      'FileReader',
      'HTMLUnknownElement',
      'IDBDatabase',
      'IDBRequest',
      'IDBTransaction',
      'KeyOperation',
      'MediaController',
      'MessagePort',
      'ModalWindow',
      'Notification',
      'SVGElementInstance',
      'Screen',
      'SharedWorker',
      'TextTrack',
      'TextTrackCue',
      'TextTrackList',
      'WebSocket',
      'WebSocketWorker',
      'Worker',
      'XMLHttpRequest',
      'XMLHttpRequestEventTarget',
      'XMLHttpRequestUpload',
    ],
    JT = 'BrowserApiErrors',
    KT = (e = {}) => {
      let t = {
        XMLHttpRequest: !0,
        eventTarget: !0,
        requestAnimationFrame: !0,
        setInterval: !0,
        setTimeout: !0,
        unregisterOriginalCallbacks: !1,
        ...e,
      };
      return {
        name: JT,
        setupOnce() {
          (t.setTimeout && be(O, 'setTimeout', pm),
            t.setInterval && be(O, 'setInterval', pm),
            t.requestAnimationFrame && be(O, 'requestAnimationFrame', XT),
            t.XMLHttpRequest && 'XMLHttpRequest' in O && be(XMLHttpRequest.prototype, 'send', ZT));
          let n = t.eventTarget;
          n && (Array.isArray(n) ? n : YT).forEach((o) => QT(o, t));
        },
      };
    },
    Qs = KT;
  function pm(e) {
    return function (...t) {
      let n = t[0];
      return (
        (t[0] = Kn(n, {
          mechanism: { handled: !1, type: `auto.browser.browserapierrors.${rt(e)}` },
        })),
        e.apply(this, t)
      );
    };
  }
  function XT(e) {
    return function (t) {
      return e.apply(this, [
        Kn(t, {
          mechanism: {
            data: { handler: rt(e) },
            handled: !1,
            type: 'auto.browser.browserapierrors.requestAnimationFrame',
          },
        }),
      ]);
    };
  }
  function ZT(e) {
    return function (...t) {
      let n = this;
      return (
        ['onload', 'onerror', 'onprogress', 'onreadystatechange'].forEach((o) => {
          o in n &&
            typeof n[o] == 'function' &&
            be(n, o, function (i) {
              let s = {
                  mechanism: {
                    data: { handler: rt(i) },
                    handled: !1,
                    type: `auto.browser.browserapierrors.xhr.${o}`,
                  },
                },
                a = Fn(i);
              return (a && (s.mechanism.data.handler = rt(a)), Kn(i, s));
            });
        }),
        e.apply(this, t)
      );
    };
  }
  function QT(e, t) {
    let r = O[e]?.prototype;
    r?.hasOwnProperty?.('addEventListener') &&
      (be(r, 'addEventListener', function (o) {
        return function (i, s, a) {
          try {
            eI(s) &&
              (s.handleEvent = Kn(s.handleEvent, {
                mechanism: {
                  data: { handler: rt(s), target: e },
                  handled: !1,
                  type: 'auto.browser.browserapierrors.handleEvent',
                },
              }));
          } catch {}
          return (
            t.unregisterOriginalCallbacks && tI(this, i, s),
            o.apply(this, [
              i,
              Kn(s, {
                mechanism: {
                  data: { handler: rt(s), target: e },
                  handled: !1,
                  type: 'auto.browser.browserapierrors.addEventListener',
                },
              }),
              a,
            ])
          );
        };
      }),
      be(r, 'removeEventListener', function (o) {
        return function (i, s, a) {
          try {
            let c = s.__sentry_wrapped__;
            c && o.call(this, i, c, a);
          } catch {}
          return o.call(this, i, s, a);
        };
      }));
  }
  function eI(e) {
    return typeof e.handleEvent == 'function';
  }
  function tI(e, t, n) {
    e &&
      typeof e == 'object' &&
      'removeEventListener' in e &&
      typeof e.removeEventListener == 'function' &&
      e.removeEventListener(t, n);
  }
  var ea = () => ({
    name: 'BrowserSession',
    setupOnce() {
      if (typeof O.document > 'u') {
        B &&
          h.warn(
            'Using the `browserSessionIntegration` in non-browser environments is not supported.'
          );
        return;
      }
      (Sr({ ignoreDuration: !0 }),
        yr(),
        dn(({ from: e, to: t }) => {
          e !== void 0 && e !== t && (Sr({ ignoreDuration: !0 }), yr());
        }));
    },
  });
  var nI = 'GlobalHandlers',
    rI = (e = {}) => {
      let t = { onerror: !0, onunhandledrejection: !0, ...e };
      return {
        name: nI,
        setupOnce() {
          Error.stackTraceLimit = 50;
        },
        setup(n) {
          (t.onerror && (oI(n), mm('onerror')),
            t.onunhandledrejection && (iI(n), mm('onunhandledrejection')));
        },
      };
    },
    ta = rI;
  function oI(e) {
    io((t) => {
      let { stackParser: n, attachStacktrace: r } = hm();
      if (b() !== e || Mu()) return;
      let { msg: o, url: i, line: s, column: a, error: c } = t,
        u = cI(Ms(n, c || o, void 0, r, !1), i, s, a);
      ((u.level = 'error'),
        on(u, {
          originalException: c,
          mechanism: { handled: !1, type: 'auto.browser.global_handlers.onerror' },
        }));
    });
  }
  function iI(e) {
    so((t) => {
      let { stackParser: n, attachStacktrace: r } = hm();
      if (b() !== e || Mu()) return;
      let o = sI(t),
        i = bt(o) ? aI(o) : Ms(n, o, void 0, r, !0);
      ((i.level = 'error'),
        on(i, {
          originalException: o,
          mechanism: { handled: !1, type: 'auto.browser.global_handlers.onunhandledrejection' },
        }));
    });
  }
  function sI(e) {
    if (bt(e)) return e;
    try {
      if ('reason' in e) return e.reason;
      if ('detail' in e && 'reason' in e.detail) return e.detail.reason;
    } catch {}
    return e;
  }
  function aI(e) {
    return {
      exception: {
        values: [
          {
            type: 'UnhandledRejection',
            value: `Non-Error promise rejection captured with value: ${String(e)}`,
          },
        ],
      },
    };
  }
  function cI(e, t, n, r) {
    let o = (e.exception = e.exception || {}),
      i = (o.values = o.values || []),
      s = (i[0] = i[0] || {}),
      a = (s.stacktrace = s.stacktrace || {}),
      c = (a.frames = a.frames || []),
      u = r,
      d = n,
      l = uI(t) ?? Xe();
    return (
      c.length === 0 && c.push({ colno: u, filename: l, function: '?', in_app: !0, lineno: d }),
      e
    );
  }
  function mm(e) {
    B && h.log(`Global Handler attached: ${e}`);
  }
  function hm() {
    return b()?.getOptions() || { stackParser: () => [], attachStacktrace: !1 };
  }
  function uI(e) {
    if (!(!De(e) || e.length === 0)) {
      if (e.startsWith('data:')) {
        let t = e.match(/^data:([^;]+)/),
          n = t ? t[1] : 'text/javascript',
          r = e.includes('base64,');
        return `<data:${n}${r ? ',base64' : ''}>`;
      }
      return e.slice(0, 1024);
    }
  }
  var na = () => ({
    name: 'HttpContext',
    preprocessEvent(e) {
      if (!O.navigator && !O.location && !O.document) return;
      let t = Yo(),
        n = { ...t.headers, ...e.request?.headers };
      e.request = { ...t, ...e.request, headers: n };
    },
  });
  var lI = 'cause',
    dI = 5,
    fI = 'LinkedErrors',
    pI = (e = {}) => {
      let t = e.limit || dI,
        n = e.key || lI;
      return {
        name: fI,
        preprocessEvent(r, o, i) {
          let s = i.getOptions();
          Xc(Nr, s.stackParser, n, t, r, o);
        },
      };
    },
    ra = pI;
  function gm() {
    return mI()
      ? (B &&
          Le(() => {
            console.error(
              '[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/'
            );
          }),
        !0)
      : !1;
  }
  function mI() {
    if (typeof O.window > 'u') return !1;
    let e = O;
    if (e.nw || !(e.chrome || e.browser)?.runtime?.id) return !1;
    let n = Xe(),
      r = ['chrome-extension', 'moz-extension', 'ms-browser-extension', 'safari-web-extension'];
    return !(O === O.top && r.some((i) => n.startsWith(`${i}://`)));
  }
  function il(e) {
    return [Uo(), Fo(), Qs(), Zs(), ta(), ra(), Bo(), na(), ea()];
  }
  function _m(e = {}) {
    let t = !e.skipBrowserExtensionCheck && gm(),
      n = {
        ...e,
        enabled: t ? !1 : e.enabled,
        stackParser: Ha(e.stackParser || Ks),
        integrations: Nc({
          integrations: e.integrations,
          defaultIntegrations: e.defaultIntegrations == null ? il() : e.defaultIntegrations,
        }),
        transport: e.transport || Hr,
      };
    return Bc(Mr, n);
  }
  function Sm() {}
  function ym(e) {
    e();
  }
  function Em(e = {}) {
    let t = O.document,
      n = t?.head || t?.body;
    if (!n) {
      B && h.error('[showReportDialog] Global document not defined');
      return;
    }
    let r = M(),
      i = b()?.getDsn();
    if (!i) {
      B && h.error('[showReportDialog] DSN not configured');
      return;
    }
    let s = { ...e, user: { ...r.getUser(), ...e.user }, eventId: e.eventId || Ro() },
      a = O.document.createElement('script');
    ((a.async = !0), (a.crossOrigin = 'anonymous'), (a.src = kc(i, s)));
    let { onLoad: c, onClose: u } = s;
    if ((c && (a.onload = c), u)) {
      let d = (l) => {
        if (l.data === '__sentry_reportdialog_closed__')
          try {
            u();
          } finally {
            O.removeEventListener('message', d);
          }
      };
      O.addEventListener('message', d);
    }
    n.appendChild(a);
  }
  var hI = v,
    gI = 'ReportingObserver',
    bm = new WeakMap(),
    _I = (e = {}) => {
      let t = e.types || ['crash', 'deprecation', 'intervention'];
      function n(r) {
        if (bm.has(b()))
          for (let o of r)
            ke((i) => {
              i.setExtra('url', o.url);
              let s = `ReportingObserver [${o.type}]`,
                a = 'No details available';
              if (o.body) {
                let c = {};
                for (let u in o.body) c[u] = o.body[u];
                if ((i.setExtra('body', c), o.type === 'crash')) {
                  let u = o.body;
                  a = [u.crashId || '', u.reason || ''].join(' ').trim() || a;
                } else a = o.body.message || a;
              }
              Rn(`${s}: ${a}`);
            });
      }
      return {
        name: gI,
        setupOnce() {
          if (!du()) return;
          new hI.ReportingObserver(n, { buffered: !0, types: t }).observe();
        },
        setup(r) {
          bm.set(r, !0);
        },
      };
    },
    Tm = _I;
  var SI = 'HttpClient',
    yI = (e = {}) => {
      let t = { failedRequestStatusCodes: [[500, 599]], failedRequestTargets: [/.*/], ...e };
      return {
        name: SI,
        setup(n) {
          (xI(n, t), CI(n, t));
        },
      };
    },
    vm = yI;
  function EI(e, t, n, r, o) {
    if (Rm(e, n.status, n.url)) {
      let i = AI(t, r),
        s,
        a,
        c,
        u;
      Cm() && (([s, c] = Im('Cookie', i)), ([a, u] = Im('Set-Cookie', n)));
      let d = xm({
        url: i.url,
        method: i.method,
        status: n.status,
        requestHeaders: s,
        responseHeaders: a,
        requestCookies: c,
        responseCookies: u,
        error: o,
        type: 'fetch',
      });
      on(d);
    }
  }
  function Im(e, t) {
    let n = II(t.headers),
      r;
    try {
      let o = n[e] || n[e.toLowerCase()] || void 0;
      o && (r = wm(o));
    } catch {}
    return [n, r];
  }
  function bI(e, t, n, r, o) {
    if (Rm(e, t.status, t.responseURL)) {
      let i, s, a;
      if (Cm()) {
        try {
          let u = t.getResponseHeader('Set-Cookie') || t.getResponseHeader('set-cookie') || void 0;
          u && (s = wm(u));
        } catch {}
        try {
          a = vI(t);
        } catch {}
        i = r;
      }
      let c = xm({
        url: t.responseURL,
        method: n,
        status: t.status,
        requestHeaders: i,
        responseHeaders: a,
        responseCookies: s,
        error: o,
        type: 'xhr',
      });
      on(c);
    }
  }
  function TI(e) {
    if (e) {
      let t = e['Content-Length'] || e['content-length'];
      if (t) return parseInt(t, 10);
    }
  }
  function wm(e) {
    return e.split('; ').reduce((t, n) => {
      let [r, o] = n.split('=');
      return (r && o && (t[r] = o), t);
    }, {});
  }
  function II(e) {
    let t = {};
    return (
      e.forEach((n, r) => {
        t[r] = n;
      }),
      t
    );
  }
  function vI(e) {
    let t = e.getAllResponseHeaders();
    return t
      ? t
          .split(
            `\r
`
          )
          .reduce((n, r) => {
            let [o, i] = r.split(': ');
            return (o && i && (n[o] = i), n);
          }, {})
      : {};
  }
  function wI(e, t) {
    return e.some((n) => (typeof n == 'string' ? t.includes(n) : n.test(t)));
  }
  function RI(e, t) {
    return e.some((n) => (typeof n == 'number' ? n === t : t >= n[0] && t <= n[1]));
  }
  function xI(e, t) {
    Go() &&
      qn((n) => {
        if (b() !== e) return;
        let { response: r, args: o, error: i, virtualError: s } = n,
          [a, c] = o;
        r && EI(t, a, r, c, i || s);
      }, !1);
  }
  function CI(e, t) {
    'XMLHttpRequest' in v &&
      er((n) => {
        if (b() !== e) return;
        let { error: r, virtualError: o } = n,
          i = n.xhr,
          s = i[Qe];
        if (!s) return;
        let { method: a, request_headers: c } = s;
        try {
          bI(t, i, a, c, r || o);
        } catch (u) {
          B && h.warn('Error while extracting response event form XHR response', u);
        }
      });
  }
  function Rm(e, t, n) {
    return RI(e.failedRequestStatusCodes, t) && wI(e.failedRequestTargets, n) && !Po(n, b());
  }
  function xm(e) {
    let t = b(),
      n = t && e.error && e.error instanceof Error ? e.error.stack : void 0,
      r = n && t ? t.getOptions().stackParser(n, 0, 1) : void 0,
      o = `HTTP Client Error with status code: ${e.status}`,
      i = {
        message: o,
        exception: {
          values: [{ type: 'Error', value: o, stacktrace: r ? { frames: r } : void 0 }],
        },
        request: {
          url: e.url,
          method: e.method,
          headers: e.requestHeaders,
          cookies: e.requestCookies,
        },
        contexts: {
          response: {
            status_code: e.status,
            headers: e.responseHeaders,
            cookies: e.responseCookies,
            body_size: TI(e.responseHeaders),
          },
        },
      };
    return (ze(i, { type: `auto.http.client.${e.type}`, handled: !1 }), i);
  }
  function AI(e, t) {
    return (!t && e instanceof Request) || (e instanceof Request && e.bodyUsed)
      ? e
      : new Request(e, t);
  }
  function Cm() {
    let e = b();
    return e ? !!e.getOptions().sendDefaultPii : !1;
  }
  var sl = v,
    kI = 7,
    NI = 'ContextLines',
    MI = (e = {}) => {
      let t = e.frameContextLines != null ? e.frameContextLines : kI;
      return {
        name: NI,
        processEvent(n) {
          return OI(n, t);
        },
      };
    },
    Am = MI;
  function OI(e, t) {
    let n = sl.document,
      r = sl.location && Do(sl.location.href);
    if (!n || !r) return e;
    let o = e.exception?.values;
    if (!o?.length) return e;
    let i = n.documentElement.innerHTML;
    if (!i) return e;
    let s = [
      '<!DOCTYPE html>',
      '<html>',
      ...i.split(`
`),
      '</html>',
    ];
    return (
      o.forEach((a) => {
        let c = a.stacktrace;
        c?.frames && (c.frames = c.frames.map((u) => LI(u, s, r, t)));
      }),
      e
    );
  }
  function LI(e, t, n, r) {
    return (e.filename !== n || !e.lineno || !t.length || Ja(t, e, r), e);
  }
  var DI = 'GraphQLClient',
    PI = (e) => ({
      name: DI,
      setup(t) {
        (FI(t, e), UI(t, e));
      },
    });
  function FI(e, t) {
    e.on('beforeOutgoingRequestSpan', (n, r) => {
      let i = D(n).data || {};
      if (!(i[Se] === 'http.client')) return;
      let c = i[ec] || i['http.url'],
        u = i[Qa] || i['http.method'];
      if (!De(c) || !De(u)) return;
      let { endpoints: d } = t,
        l = Ue(c, d),
        p = Nm(r);
      if (l && p) {
        let f = Mm(p);
        if (f) {
          let m = km(f);
          (n.updateName(`${u} ${c} (${m})`), n.setAttribute('graphql.document', p));
        }
      }
    });
  }
  function UI(e, t) {
    e.on('beforeOutgoingRequestBreadcrumb', (n, r) => {
      let { category: o, type: i, data: s } = n;
      if (i === 'http' && (o === 'fetch' || o === 'xhr')) {
        let d = s?.url,
          { endpoints: l } = t,
          p = Ue(d, l),
          f = Nm(r);
        if (p && s && f) {
          let m = Mm(f);
          if (!s.graphql && m) {
            let _ = km(m);
            ((s['graphql.document'] = m.query), (s['graphql.operation'] = _));
          }
        }
      }
    });
  }
  function km(e) {
    let { query: t, operationName: n } = e,
      { operationName: r = n, operationType: o } = BI(t);
    return r ? `${o} ${r}` : `${o}`;
  }
  function Nm(e) {
    let t = 'xhr' in e,
      n;
    if (t) {
      let r = e.xhr[Qe];
      n = r && tr(r.body)[0];
    } else {
      let r = Br(e.input);
      n = tr(r)[0];
    }
    return n;
  }
  function BI(e) {
    let t = /^(?:\s*)(query|mutation|subscription)(?:\s*)(\w+)(?:\s*)[{(]/,
      n = /^(?:\s*)(query|mutation|subscription)(?:\s*)[{(]/,
      r = e.match(t);
    if (r) return { operationType: r[1], operationName: r[2] };
    let o = e.match(n);
    return o
      ? { operationType: o[1], operationName: void 0 }
      : { operationType: void 0, operationName: void 0 };
  }
  function Mm(e) {
    let t;
    try {
      let n = JSON.parse(e);
      !!n.query && (t = n);
    } finally {
      return t;
    }
  }
  var Om = PI;
  var me = v,
    Dl = 'sentryReplaySession',
    HI = 'replay_event',
    Pl = 'Unable to send Replay',
    $I = 3e5,
    WI = 9e5,
    GI = 5e3,
    zI = 5500,
    jI = 6e4,
    qI = 5e3,
    VI = 3,
    Lm = 15e4,
    oa = 5e3,
    YI = 3e3,
    JI = 300,
    Fl = 2e7,
    KI = 4999,
    XI = 15e3,
    Dm = 36e5,
    ZI = Object.defineProperty,
    QI = (e, t, n) =>
      t in e ? ZI(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n),
    Pm = (e, t, n) => QI(e, typeof t != 'symbol' ? t + '' : t, n),
    Ae = ((e) => (
      (e[(e.Document = 0)] = 'Document'),
      (e[(e.DocumentType = 1)] = 'DocumentType'),
      (e[(e.Element = 2)] = 'Element'),
      (e[(e.Text = 3)] = 'Text'),
      (e[(e.CDATA = 4)] = 'CDATA'),
      (e[(e.Comment = 5)] = 'Comment'),
      e
    ))(Ae || {});
  function ev(e) {
    return e.nodeType === e.ELEMENT_NODE;
  }
  function ri(e) {
    return e?.host?.shadowRoot === e;
  }
  function oi(e) {
    return Object.prototype.toString.call(e) === '[object ShadowRoot]';
  }
  function tv(e) {
    return (
      e.includes(' background-clip: text;') &&
        !e.includes(' -webkit-background-clip: text;') &&
        (e = e.replace(
          /\sbackground-clip:\s*text;/g,
          ' -webkit-background-clip: text; background-clip: text;'
        )),
      e
    );
  }
  function nv(e) {
    let { cssText: t } = e;
    if (t.split('"').length < 3) return t;
    let n = ['@import', `url(${JSON.stringify(e.href)})`];
    return (
      e.layerName === '' ? n.push('layer') : e.layerName && n.push(`layer(${e.layerName})`),
      e.supportsText && n.push(`supports(${e.supportsText})`),
      e.media.length && n.push(e.media.mediaText),
      n.join(' ') + ';'
    );
  }
  function ua(e) {
    try {
      let t = e.rules || e.cssRules;
      return t ? tv(Array.from(t, oh).join('')) : null;
    } catch {
      return null;
    }
  }
  function rv(e) {
    let t = '';
    for (let n = 0; n < e.style.length; n++) {
      let r = e.style,
        o = r[n],
        i = r.getPropertyPriority(o);
      t += `${o}:${r.getPropertyValue(o)}${i ? ' !important' : ''};`;
    }
    return `${e.selectorText} { ${t} }`;
  }
  function oh(e) {
    let t;
    if (iv(e))
      try {
        t = ua(e.styleSheet) || nv(e);
      } catch {}
    else if (sv(e)) {
      let n = e.cssText,
        r = e.selectorText.includes(':'),
        o = typeof e.style.all == 'string' && e.style.all;
      if ((o && (n = rv(e)), r && (n = ov(n)), r || o)) return n;
    }
    return t || e.cssText;
  }
  function ov(e) {
    let t = /(\[(?:[\w-]+)[^\\])(:(?:[\w-]+)\])/gm;
    return e.replace(t, '$1\\$2');
  }
  function iv(e) {
    return 'styleSheet' in e;
  }
  function sv(e) {
    return 'selectorText' in e;
  }
  var la = class {
    constructor() {
      (Pm(this, 'idNodeMap', new Map()), Pm(this, 'nodeMetaMap', new WeakMap()));
    }
    getId(t) {
      return t ? (this.getMeta(t)?.id ?? -1) : -1;
    }
    getNode(t) {
      return this.idNodeMap.get(t) || null;
    }
    getIds() {
      return Array.from(this.idNodeMap.keys());
    }
    getMeta(t) {
      return this.nodeMetaMap.get(t) || null;
    }
    removeNodeFromMap(t) {
      let n = this.getId(t);
      (this.idNodeMap.delete(n),
        t.childNodes && t.childNodes.forEach((r) => this.removeNodeFromMap(r)));
    }
    has(t) {
      return this.idNodeMap.has(t);
    }
    hasNode(t) {
      return this.nodeMetaMap.has(t);
    }
    add(t, n) {
      let r = n.id;
      (this.idNodeMap.set(r, t), this.nodeMetaMap.set(t, n));
    }
    replace(t, n) {
      let r = this.getNode(t);
      if (r) {
        let o = this.nodeMetaMap.get(r);
        o && this.nodeMetaMap.set(n, o);
      }
      this.idNodeMap.set(t, n);
    }
    reset() {
      ((this.idNodeMap = new Map()), (this.nodeMetaMap = new WeakMap()));
    }
  };
  function av() {
    return new la();
  }
  function ba({ maskInputOptions: e, tagName: t, type: n }) {
    return (
      t === 'OPTION' && (t = 'SELECT'),
      !!(e[t.toLowerCase()] || (n && e[n]) || n === 'password' || (t === 'INPUT' && !n && e.text))
    );
  }
  function si({ isMasked: e, element: t, value: n, maskInputFn: r }) {
    let o = n || '';
    return e ? (r && (o = r(o, t)), '*'.repeat(o.length)) : o;
  }
  function Jr(e) {
    return e.toLowerCase();
  }
  function fl(e) {
    return e.toUpperCase();
  }
  var Fm = '__rrweb_original__';
  function cv(e) {
    let t = e.getContext('2d');
    if (!t) return !0;
    let n = 50;
    for (let r = 0; r < e.width; r += n)
      for (let o = 0; o < e.height; o += n) {
        let i = t.getImageData,
          s = Fm in i ? i[Fm] : i;
        if (
          new Uint32Array(
            s.call(t, r, o, Math.min(n, e.width - r), Math.min(n, e.height - o)).data.buffer
          ).some((c) => c !== 0)
        )
          return !1;
      }
    return !0;
  }
  function Ul(e) {
    let t = e.type;
    return e.hasAttribute('data-rr-is-password') ? 'password' : t ? Jr(t) : null;
  }
  function da(e, t, n) {
    return t === 'INPUT' && (n === 'radio' || n === 'checkbox')
      ? e.getAttribute('value') || ''
      : e.value;
  }
  function ih(e, t) {
    let n;
    try {
      n = new URL(e, t ?? window.location.href);
    } catch {
      return null;
    }
    let r = /\.([0-9a-z]+)(?:$)/i;
    return n.pathname.match(r)?.[1] ?? null;
  }
  var Um = {};
  function sh(e) {
    let t = Um[e];
    if (t) return t;
    let n = window.document,
      r = window[e];
    if (n && typeof n.createElement == 'function')
      try {
        let o = n.createElement('iframe');
        ((o.hidden = !0), n.head.appendChild(o));
        let i = o.contentWindow;
        (i && i[e] && (r = i[e]), n.head.removeChild(o));
      } catch {}
    return (Um[e] = r.bind(window));
  }
  function pl(...e) {
    return sh('setTimeout')(...e);
  }
  function ah(...e) {
    return sh('clearTimeout')(...e);
  }
  function ch(e) {
    try {
      return e.contentDocument;
    } catch {}
  }
  var uv = 1,
    lv = new RegExp('[^a-z0-9-_:]'),
    ai = -2;
  function Bl() {
    return uv++;
  }
  function dv(e) {
    if (e instanceof HTMLFormElement) return 'form';
    let t = Jr(e.tagName);
    return lv.test(t) ? 'div' : t;
  }
  function fv(e) {
    let t = '';
    return (
      e.indexOf('//') > -1 ? (t = e.split('/').slice(0, 3).join('/')) : (t = e.split('/')[0]),
      (t = t.split('?')[0]),
      t
    );
  }
  var Wr,
    Bm,
    pv = /url\((?:(')([^']*)'|(")(.*?)"|([^)]*))\)/gm,
    mv = /^(?:[a-z+]+:)?\/\//i,
    hv = /^www\..*/i,
    gv = /^(data:)([^,]*),(.*)/i;
  function fa(e, t) {
    return (e || '').replace(pv, (n, r, o, i, s, a) => {
      let c = o || s || a,
        u = r || i || '';
      if (!c) return n;
      if (mv.test(c) || hv.test(c)) return `url(${u}${c}${u})`;
      if (gv.test(c)) return `url(${u}${c}${u})`;
      if (c[0] === '/') return `url(${u}${fv(t) + c}${u})`;
      let d = t.split('/'),
        l = c.split('/');
      d.pop();
      for (let p of l) p !== '.' && (p === '..' ? d.pop() : d.push(p));
      return `url(${u}${d.join('/')}${u})`;
    });
  }
  var _v = /^[^ \t\n\r\u000c]+/,
    Sv = /^[, \t\n\r\u000c]+/;
  function yv(e, t) {
    if (t.trim() === '') return t;
    let n = 0;
    function r(i) {
      let s,
        a = i.exec(t.substring(n));
      return a ? ((s = a[0]), (n += s.length), s) : '';
    }
    let o = [];
    for (; r(Sv), !(n >= t.length); ) {
      let i = r(_v);
      if (i.slice(-1) === ',') ((i = jr(e, i.substring(0, i.length - 1))), o.push(i));
      else {
        let s = '';
        i = jr(e, i);
        let a = !1;
        for (;;) {
          let c = t.charAt(n);
          if (c === '') {
            o.push((i + s).trim());
            break;
          } else if (a) c === ')' && (a = !1);
          else if (c === ',') {
            ((n += 1), o.push((i + s).trim()));
            break;
          } else c === '(' && (a = !0);
          ((s += c), (n += 1));
        }
      }
    }
    return o.join(', ');
  }
  var Hm = new WeakMap();
  function jr(e, t) {
    return !t || t.trim() === '' ? t : Ta(e, t);
  }
  function Ev(e) {
    return !!(e.tagName === 'svg' || e.ownerSVGElement);
  }
  function Ta(e, t) {
    let n = Hm.get(e);
    if ((n || ((n = e.createElement('a')), Hm.set(e, n)), !t)) t = '';
    else if (t.startsWith('blob:') || t.startsWith('data:')) return t;
    return (n.setAttribute('href', t), n.href);
  }
  function uh(e, t, n, r, o, i) {
    return (
      r &&
      (n === 'src' ||
      (n === 'href' && !(t === 'use' && r[0] === '#')) ||
      (n === 'xlink:href' && r[0] !== '#') ||
      (n === 'background' && (t === 'table' || t === 'td' || t === 'th'))
        ? jr(e, r)
        : n === 'srcset'
          ? yv(e, r)
          : n === 'style'
            ? fa(r, Ta(e))
            : t === 'object' && n === 'data'
              ? jr(e, r)
              : typeof i == 'function'
                ? i(n, r, o)
                : r)
    );
  }
  function lh(e, t, n) {
    return (e === 'video' || e === 'audio') && t === 'autoplay';
  }
  function bv(e, t, n, r) {
    try {
      if (r && e.matches(r)) return !1;
      if (typeof t == 'string') {
        if (e.classList.contains(t)) return !0;
      } else
        for (let o = e.classList.length; o--; ) {
          let i = e.classList[o];
          if (t.test(i)) return !0;
        }
      if (n) return e.matches(n);
    } catch {}
    return !1;
  }
  function Tv(e, t) {
    for (let n = e.classList.length; n--; ) {
      let r = e.classList[n];
      if (t.test(r)) return !0;
    }
    return !1;
  }
  function nr(e, t, n = 1 / 0, r = 0) {
    return !e || e.nodeType !== e.ELEMENT_NODE || r > n
      ? -1
      : t(e)
        ? r
        : nr(e.parentNode, t, n, r + 1);
  }
  function qr(e, t) {
    return (n) => {
      let r = n;
      if (r === null) return !1;
      try {
        if (e) {
          if (typeof e == 'string') {
            if (r.matches(`.${e}`)) return !0;
          } else if (Tv(r, e)) return !0;
        }
        return !!(t && r.matches(t));
      } catch {
        return !1;
      }
    };
  }
  function Kr(e, t, n, r, o, i) {
    try {
      let s = e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
      if (s === null) return !1;
      if (s.tagName === 'INPUT') {
        let u = s.getAttribute('autocomplete');
        if (
          [
            'current-password',
            'new-password',
            'cc-number',
            'cc-exp',
            'cc-exp-month',
            'cc-exp-year',
            'cc-csc',
          ].includes(u)
        )
          return !0;
      }
      let a = -1,
        c = -1;
      if (i) {
        if (((c = nr(s, qr(r, o))), c < 0)) return !0;
        a = nr(s, qr(t, n), c >= 0 ? c : 1 / 0);
      } else {
        if (((a = nr(s, qr(t, n))), a < 0)) return !1;
        c = nr(s, qr(r, o), a >= 0 ? a : 1 / 0);
      }
      return a >= 0 ? (c >= 0 ? a <= c : !0) : c >= 0 ? !1 : !!i;
    } catch {}
    return !!i;
  }
  function Iv(e, t, n) {
    let r = e.contentWindow;
    if (!r) return;
    let o = !1,
      i;
    try {
      i = r.document.readyState;
    } catch {
      return;
    }
    if (i !== 'complete') {
      let a = pl(() => {
        o || (t(), (o = !0));
      }, n);
      e.addEventListener('load', () => {
        (ah(a), (o = !0), t());
      });
      return;
    }
    let s = 'about:blank';
    if (r.location.href !== s || e.src === s || e.src === '')
      return (pl(t, 0), e.addEventListener('load', t));
    e.addEventListener('load', t);
  }
  function vv(e, t, n) {
    let r = !1,
      o;
    try {
      o = e.sheet;
    } catch {
      return;
    }
    if (o) return;
    let i = pl(() => {
      r || (t(), (r = !0));
    }, n);
    e.addEventListener('load', () => {
      (ah(i), (r = !0), t());
    });
  }
  function wv(e, t) {
    let {
        doc: n,
        mirror: r,
        blockClass: o,
        blockSelector: i,
        unblockSelector: s,
        maskAllText: a,
        maskAttributeFn: c,
        maskTextClass: u,
        unmaskTextClass: d,
        maskTextSelector: l,
        unmaskTextSelector: p,
        inlineStylesheet: f,
        maskInputOptions: m = {},
        maskTextFn: _,
        maskInputFn: g,
        dataURLOptions: S = {},
        inlineImages: E,
        recordCanvas: P,
        keepIframeSrcFn: w,
        newlyAddedElement: F = !1,
      } = t,
      A = Rv(n, r);
    switch (e.nodeType) {
      case e.DOCUMENT_NODE:
        return e.compatMode !== 'CSS1Compat'
          ? { type: Ae.Document, childNodes: [], compatMode: e.compatMode }
          : { type: Ae.Document, childNodes: [] };
      case e.DOCUMENT_TYPE_NODE:
        return {
          type: Ae.DocumentType,
          name: e.name,
          publicId: e.publicId,
          systemId: e.systemId,
          rootId: A,
        };
      case e.ELEMENT_NODE:
        return Cv(e, {
          doc: n,
          blockClass: o,
          blockSelector: i,
          unblockSelector: s,
          inlineStylesheet: f,
          maskAttributeFn: c,
          maskInputOptions: m,
          maskInputFn: g,
          dataURLOptions: S,
          inlineImages: E,
          recordCanvas: P,
          keepIframeSrcFn: w,
          newlyAddedElement: F,
          rootId: A,
          maskTextClass: u,
          unmaskTextClass: d,
          maskTextSelector: l,
          unmaskTextSelector: p,
        });
      case e.TEXT_NODE:
        return xv(e, {
          doc: n,
          maskAllText: a,
          maskTextClass: u,
          unmaskTextClass: d,
          maskTextSelector: l,
          unmaskTextSelector: p,
          maskTextFn: _,
          maskInputOptions: m,
          maskInputFn: g,
          rootId: A,
        });
      case e.CDATA_SECTION_NODE:
        return { type: Ae.CDATA, textContent: '', rootId: A };
      case e.COMMENT_NODE:
        return { type: Ae.Comment, textContent: e.textContent || '', rootId: A };
      default:
        return !1;
    }
  }
  function Rv(e, t) {
    if (!t.hasNode(e)) return;
    let n = t.getId(e);
    return n === 1 ? void 0 : n;
  }
  function xv(e, t) {
    let {
        maskAllText: n,
        maskTextClass: r,
        unmaskTextClass: o,
        maskTextSelector: i,
        unmaskTextSelector: s,
        maskTextFn: a,
        maskInputOptions: c,
        maskInputFn: u,
        rootId: d,
      } = t,
      l = e.parentNode && e.parentNode.tagName,
      p = e.textContent,
      f = l === 'STYLE' ? !0 : void 0,
      m = l === 'SCRIPT' ? !0 : void 0,
      _ = l === 'TEXTAREA' ? !0 : void 0;
    if (f && p) {
      try {
        e.nextSibling ||
          e.previousSibling ||
          (e.parentNode.sheet?.cssRules && (p = ua(e.parentNode.sheet)));
      } catch (S) {
        console.warn(`Cannot get CSS styles from text's parentNode. Error: ${S}`, e);
      }
      p = fa(p, Ta(t.doc));
    }
    m && (p = 'SCRIPT_PLACEHOLDER');
    let g = Kr(e, r, i, o, s, n);
    if (
      (!f && !m && !_ && p && g && (p = a ? a(p, e.parentElement) : p.replace(/[\S]/g, '*')),
      _ && p && (c.textarea || g) && (p = u ? u(p, e.parentNode) : p.replace(/[\S]/g, '*')),
      l === 'OPTION' && p)
    ) {
      let S = ba({ type: null, tagName: l, maskInputOptions: c });
      p = si({ isMasked: Kr(e, r, i, o, s, S), element: e, value: p, maskInputFn: u });
    }
    return { type: Ae.Text, textContent: p || '', isStyle: f, rootId: d };
  }
  function Cv(e, t) {
    let {
        doc: n,
        blockClass: r,
        blockSelector: o,
        unblockSelector: i,
        inlineStylesheet: s,
        maskInputOptions: a = {},
        maskAttributeFn: c,
        maskInputFn: u,
        dataURLOptions: d = {},
        inlineImages: l,
        recordCanvas: p,
        keepIframeSrcFn: f,
        newlyAddedElement: m = !1,
        rootId: _,
        maskTextClass: g,
        unmaskTextClass: S,
        maskTextSelector: E,
        unmaskTextSelector: P,
      } = t,
      w = bv(e, r, o, i),
      F = dv(e),
      A = {},
      T = e.attributes.length;
    for (let I = 0; I < T; I++) {
      let k = e.attributes[I];
      k.name && !lh(F, k.name, k.value) && (A[k.name] = uh(n, F, Jr(k.name), k.value, e, c));
    }
    if (F === 'link' && s) {
      let I = Array.from(n.styleSheets).find((H) => H.href === e.href),
        k = null;
      (I && (k = ua(I)),
        k &&
          ((A.rel = null), (A.href = null), (A.crossorigin = null), (A._cssText = fa(k, I.href))));
    }
    if (F === 'style' && e.sheet && !(e.innerText || e.textContent || '').trim().length) {
      let I = ua(e.sheet);
      I && (A._cssText = fa(I, Ta(n)));
    }
    if (F === 'input' || F === 'textarea' || F === 'select' || F === 'option') {
      let I = e,
        k = Ul(I),
        H = da(I, fl(F), k),
        x = I.checked;
      if (k !== 'submit' && k !== 'button' && H) {
        let L = Kr(I, g, E, S, P, ba({ type: k, tagName: fl(F), maskInputOptions: a }));
        A.value = si({ isMasked: L, element: I, value: H, maskInputFn: u });
      }
      x && (A.checked = x);
    }
    if (
      (F === 'option' && (e.selected && !a.select ? (A.selected = !0) : delete A.selected),
      F === 'canvas' && p)
    ) {
      if (e.__context === '2d') cv(e) || (A.rr_dataURL = e.toDataURL(d.type, d.quality));
      else if (!('__context' in e)) {
        let I = e.toDataURL(d.type, d.quality),
          k = n.createElement('canvas');
        ((k.width = e.width), (k.height = e.height));
        let H = k.toDataURL(d.type, d.quality);
        I !== H && (A.rr_dataURL = I);
      }
    }
    if (F === 'img' && l) {
      Wr || ((Wr = n.createElement('canvas')), (Bm = Wr.getContext('2d')));
      let I = e,
        k = I.currentSrc || I.getAttribute('src') || '<unknown-src>',
        H = I.crossOrigin,
        x = () => {
          I.removeEventListener('load', x);
          try {
            ((Wr.width = I.naturalWidth),
              (Wr.height = I.naturalHeight),
              Bm.drawImage(I, 0, 0),
              (A.rr_dataURL = Wr.toDataURL(d.type, d.quality)));
          } catch (L) {
            if (I.crossOrigin !== 'anonymous') {
              ((I.crossOrigin = 'anonymous'),
                I.complete && I.naturalWidth !== 0 ? x() : I.addEventListener('load', x));
              return;
            } else console.warn(`Cannot inline img src=${k}! Error: ${L}`);
          }
          I.crossOrigin === 'anonymous' &&
            (H ? (A.crossOrigin = H) : I.removeAttribute('crossorigin'));
        };
      I.complete && I.naturalWidth !== 0 ? x() : I.addEventListener('load', x);
    }
    if (
      ((F === 'audio' || F === 'video') &&
        ((A.rr_mediaState = e.paused ? 'paused' : 'played'),
        (A.rr_mediaCurrentTime = e.currentTime)),
      m ||
        (e.scrollLeft && (A.rr_scrollLeft = e.scrollLeft),
        e.scrollTop && (A.rr_scrollTop = e.scrollTop)),
      w)
    ) {
      let { width: I, height: k } = e.getBoundingClientRect();
      A = { class: A.class, rr_width: `${I}px`, rr_height: `${k}px` };
    }
    F === 'iframe' && !f(A.src) && (!w && !ch(e) && (A.rr_src = A.src), delete A.src);
    let R;
    try {
      customElements.get(F) && (R = !0);
    } catch {}
    return {
      type: Ae.Element,
      tagName: F,
      attributes: A,
      childNodes: [],
      isSVG: Ev(e) || void 0,
      needBlock: w,
      rootId: _,
      isCustom: R,
    };
  }
  function pe(e) {
    return e == null ? '' : e.toLowerCase();
  }
  function Av(e, t) {
    if (t.comment && e.type === Ae.Comment) return !0;
    if (e.type === Ae.Element) {
      if (
        t.script &&
        (e.tagName === 'script' ||
          (e.tagName === 'link' &&
            (e.attributes.rel === 'preload' || e.attributes.rel === 'modulepreload')) ||
          (e.tagName === 'link' &&
            e.attributes.rel === 'prefetch' &&
            typeof e.attributes.href == 'string' &&
            ih(e.attributes.href) === 'js'))
      )
        return !0;
      if (
        t.headFavicon &&
        ((e.tagName === 'link' && e.attributes.rel === 'shortcut icon') ||
          (e.tagName === 'meta' &&
            (pe(e.attributes.name).match(/^msapplication-tile(image|color)$/) ||
              pe(e.attributes.name) === 'application-name' ||
              pe(e.attributes.rel) === 'icon' ||
              pe(e.attributes.rel) === 'apple-touch-icon' ||
              pe(e.attributes.rel) === 'shortcut icon')))
      )
        return !0;
      if (e.tagName === 'meta') {
        if (t.headMetaDescKeywords && pe(e.attributes.name).match(/^description|keywords$/))
          return !0;
        if (
          t.headMetaSocial &&
          (pe(e.attributes.property).match(/^(og|twitter|fb):/) ||
            pe(e.attributes.name).match(/^(og|twitter):/) ||
            pe(e.attributes.name) === 'pinterest')
        )
          return !0;
        if (
          t.headMetaRobots &&
          (pe(e.attributes.name) === 'robots' ||
            pe(e.attributes.name) === 'googlebot' ||
            pe(e.attributes.name) === 'bingbot')
        )
          return !0;
        if (t.headMetaHttpEquiv && e.attributes['http-equiv'] !== void 0) return !0;
        if (
          t.headMetaAuthorship &&
          (pe(e.attributes.name) === 'author' ||
            pe(e.attributes.name) === 'generator' ||
            pe(e.attributes.name) === 'framework' ||
            pe(e.attributes.name) === 'publisher' ||
            pe(e.attributes.name) === 'progid' ||
            pe(e.attributes.property).match(/^article:/) ||
            pe(e.attributes.property).match(/^product:/))
        )
          return !0;
        if (
          t.headMetaVerification &&
          (pe(e.attributes.name) === 'google-site-verification' ||
            pe(e.attributes.name) === 'yandex-verification' ||
            pe(e.attributes.name) === 'csrf-token' ||
            pe(e.attributes.name) === 'p:domain_verify' ||
            pe(e.attributes.name) === 'verify-v1' ||
            pe(e.attributes.name) === 'verification' ||
            pe(e.attributes.name) === 'shopify-checkout-api-token')
        )
          return !0;
      }
    }
    return !1;
  }
  function Vr(e, t) {
    let {
        doc: n,
        mirror: r,
        blockClass: o,
        blockSelector: i,
        unblockSelector: s,
        maskAllText: a,
        maskTextClass: c,
        unmaskTextClass: u,
        maskTextSelector: d,
        unmaskTextSelector: l,
        skipChild: p = !1,
        inlineStylesheet: f = !0,
        maskInputOptions: m = {},
        maskAttributeFn: _,
        maskTextFn: g,
        maskInputFn: S,
        slimDOMOptions: E,
        dataURLOptions: P = {},
        inlineImages: w = !1,
        recordCanvas: F = !1,
        onSerialize: A,
        onIframeLoad: T,
        iframeLoadTimeout: R = 5e3,
        onBlockedImageLoad: I,
        onStylesheetLoad: k,
        stylesheetLoadTimeout: H = 5e3,
        keepIframeSrcFn: x = () => !1,
        newlyAddedElement: L = !1,
      } = t,
      { preserveWhiteSpace: q = !0 } = t,
      J = wv(e, {
        doc: n,
        mirror: r,
        blockClass: o,
        blockSelector: i,
        maskAllText: a,
        unblockSelector: s,
        maskTextClass: c,
        unmaskTextClass: u,
        maskTextSelector: d,
        unmaskTextSelector: l,
        inlineStylesheet: f,
        maskInputOptions: m,
        maskAttributeFn: _,
        maskTextFn: g,
        maskInputFn: S,
        dataURLOptions: P,
        inlineImages: w,
        recordCanvas: F,
        keepIframeSrcFn: x,
        newlyAddedElement: L,
      });
    if (!J) return (console.warn(e, 'not serialized'), null);
    let ne;
    r.hasNode(e)
      ? (ne = r.getId(e))
      : Av(J, E) ||
          (!q &&
            J.type === Ae.Text &&
            !J.isStyle &&
            !J.textContent.replace(/^\s+|\s+$/gm, '').length)
        ? (ne = ai)
        : (ne = Bl());
    let C = Object.assign(J, { id: ne });
    if ((r.add(e, C), ne === ai)) return null;
    A && A(e);
    let z = !p;
    if (C.type === Ae.Element) {
      z = z && !C.needBlock;
      let N = e.shadowRoot;
      N && oi(N) && (C.isShadowHost = !0);
    }
    if ((C.type === Ae.Document || C.type === Ae.Element) && z) {
      E.headWhitespace && C.type === Ae.Element && C.tagName === 'head' && (q = !1);
      let N = {
          doc: n,
          mirror: r,
          blockClass: o,
          blockSelector: i,
          maskAllText: a,
          unblockSelector: s,
          maskTextClass: c,
          unmaskTextClass: u,
          maskTextSelector: d,
          unmaskTextSelector: l,
          skipChild: p,
          inlineStylesheet: f,
          maskInputOptions: m,
          maskAttributeFn: _,
          maskTextFn: g,
          maskInputFn: S,
          slimDOMOptions: E,
          dataURLOptions: P,
          inlineImages: w,
          recordCanvas: F,
          preserveWhiteSpace: q,
          onSerialize: A,
          onIframeLoad: T,
          iframeLoadTimeout: R,
          onBlockedImageLoad: I,
          onStylesheetLoad: k,
          stylesheetLoadTimeout: H,
          keepIframeSrcFn: x,
        },
        $ = e.childNodes ? Array.from(e.childNodes) : [];
      for (let Q of $) {
        let ae = Vr(Q, N);
        ae && C.childNodes.push(ae);
      }
      if (ev(e) && e.shadowRoot)
        for (let Q of Array.from(e.shadowRoot.childNodes)) {
          let ae = Vr(Q, N);
          ae && (oi(e.shadowRoot) && (ae.isShadow = !0), C.childNodes.push(ae));
        }
    }
    if (
      (e.parentNode && ri(e.parentNode) && oi(e.parentNode) && (C.isShadow = !0),
      C.type === Ae.Element &&
        C.tagName === 'iframe' &&
        !C.needBlock &&
        Iv(
          e,
          () => {
            let N = ch(e);
            if (N && T) {
              let $ = Vr(N, {
                doc: N,
                mirror: r,
                blockClass: o,
                blockSelector: i,
                unblockSelector: s,
                maskAllText: a,
                maskTextClass: c,
                unmaskTextClass: u,
                maskTextSelector: d,
                unmaskTextSelector: l,
                skipChild: !1,
                inlineStylesheet: f,
                maskInputOptions: m,
                maskAttributeFn: _,
                maskTextFn: g,
                maskInputFn: S,
                slimDOMOptions: E,
                dataURLOptions: P,
                inlineImages: w,
                recordCanvas: F,
                preserveWhiteSpace: q,
                onSerialize: A,
                onIframeLoad: T,
                iframeLoadTimeout: R,
                onStylesheetLoad: k,
                stylesheetLoadTimeout: H,
                keepIframeSrcFn: x,
              });
              $ && T(e, $);
            }
          },
          R
        ),
      C.type === Ae.Element && C.tagName === 'img' && !e.complete && C.needBlock)
    ) {
      let N = e,
        $ = () => {
          if (N.isConnected && !N.complete && I)
            try {
              let Q = N.getBoundingClientRect();
              Q.width > 0 && Q.height > 0 && I(N, C, Q);
            } catch {}
          N.removeEventListener('load', $);
        };
      N.isConnected && N.addEventListener('load', $);
    }
    return (
      C.type === Ae.Element &&
        C.tagName === 'link' &&
        typeof C.attributes.rel == 'string' &&
        (C.attributes.rel === 'stylesheet' ||
          (C.attributes.rel === 'preload' &&
            typeof C.attributes.href == 'string' &&
            ih(C.attributes.href) === 'css')) &&
        vv(
          e,
          () => {
            if (k) {
              let N = Vr(e, {
                doc: n,
                mirror: r,
                blockClass: o,
                blockSelector: i,
                unblockSelector: s,
                maskAllText: a,
                maskTextClass: c,
                unmaskTextClass: u,
                maskTextSelector: d,
                unmaskTextSelector: l,
                skipChild: !1,
                inlineStylesheet: f,
                maskInputOptions: m,
                maskAttributeFn: _,
                maskTextFn: g,
                maskInputFn: S,
                slimDOMOptions: E,
                dataURLOptions: P,
                inlineImages: w,
                recordCanvas: F,
                preserveWhiteSpace: q,
                onSerialize: A,
                onIframeLoad: T,
                iframeLoadTimeout: R,
                onStylesheetLoad: k,
                stylesheetLoadTimeout: H,
                keepIframeSrcFn: x,
              });
              N && k(e, N);
            }
          },
          H
        ),
      C.type === Ae.Element && delete C.needBlock,
      C
    );
  }
  function kv(e, t) {
    let {
      mirror: n = new la(),
      blockClass: r = 'rr-block',
      blockSelector: o = null,
      unblockSelector: i = null,
      maskAllText: s = !1,
      maskTextClass: a = 'rr-mask',
      unmaskTextClass: c = null,
      maskTextSelector: u = null,
      unmaskTextSelector: d = null,
      inlineStylesheet: l = !0,
      inlineImages: p = !1,
      recordCanvas: f = !1,
      maskAllInputs: m = !1,
      maskAttributeFn: _,
      maskTextFn: g,
      maskInputFn: S,
      slimDOM: E = !1,
      dataURLOptions: P,
      preserveWhiteSpace: w,
      onSerialize: F,
      onIframeLoad: A,
      iframeLoadTimeout: T,
      onBlockedImageLoad: R,
      onStylesheetLoad: I,
      stylesheetLoadTimeout: k,
      keepIframeSrcFn: H = () => !1,
    } = t || {};
    return Vr(e, {
      doc: e,
      mirror: n,
      blockClass: r,
      blockSelector: o,
      unblockSelector: i,
      maskAllText: s,
      maskTextClass: a,
      unmaskTextClass: c,
      maskTextSelector: u,
      unmaskTextSelector: d,
      skipChild: !1,
      inlineStylesheet: l,
      maskInputOptions:
        m === !0
          ? {
              color: !0,
              date: !0,
              'datetime-local': !0,
              email: !0,
              month: !0,
              number: !0,
              range: !0,
              search: !0,
              tel: !0,
              text: !0,
              time: !0,
              url: !0,
              week: !0,
              textarea: !0,
              select: !0,
            }
          : m === !1
            ? {}
            : m,
      maskAttributeFn: _,
      maskTextFn: g,
      maskInputFn: S,
      slimDOMOptions:
        E === !0 || E === 'all'
          ? {
              script: !0,
              comment: !0,
              headFavicon: !0,
              headWhitespace: !0,
              headMetaDescKeywords: E === 'all',
              headMetaSocial: !0,
              headMetaRobots: !0,
              headMetaHttpEquiv: !0,
              headMetaAuthorship: !0,
              headMetaVerification: !0,
            }
          : E === !1
            ? {}
            : E,
      dataURLOptions: P,
      inlineImages: p,
      recordCanvas: f,
      preserveWhiteSpace: w,
      onSerialize: F,
      onIframeLoad: A,
      iframeLoadTimeout: T,
      onBlockedImageLoad: R,
      onStylesheetLoad: I,
      stylesheetLoadTimeout: k,
      keepIframeSrcFn: H,
      newlyAddedElement: !1,
    });
  }
  function tt(e, t, n = document) {
    let r = { capture: !0, passive: !0 };
    return (n.addEventListener(e, t, r), () => n.removeEventListener(e, t, r));
  }
  var Gr = `Please stop import mirror directly. Instead of that,\r
now you can use replayer.getMirror() to access the mirror instance of a replayer,\r
or you can use record.mirror to access the mirror instance during recording.`,
    $m = {
      map: {},
      getId() {
        return (console.error(Gr), -1);
      },
      getNode() {
        return (console.error(Gr), null);
      },
      removeNodeFromMap() {
        console.error(Gr);
      },
      has() {
        return (console.error(Gr), !1);
      },
      reset() {
        console.error(Gr);
      },
    };
  typeof window < 'u' &&
    window.Proxy &&
    window.Reflect &&
    ($m = new Proxy($m, {
      get(e, t, n) {
        return (t === 'map' && console.error(Gr), Reflect.get(e, t, n));
      },
    }));
  function ci(e, t, n = {}) {
    let r = null,
      o = 0;
    return function (...i) {
      let s = Date.now();
      !o && n.leading === !1 && (o = s);
      let a = t - (s - o),
        c = this;
      a <= 0 || a > t
        ? (r && (Pv(r), (r = null)), (o = s), e.apply(c, i))
        : !r &&
          n.trailing !== !1 &&
          (r = Ia(() => {
            ((o = n.leading === !1 ? 0 : Date.now()), (r = null), e.apply(c, i));
          }, a));
    };
  }
  function dh(e, t, n, r, o = window) {
    let i = o.Object.getOwnPropertyDescriptor(e, t);
    return (
      o.Object.defineProperty(
        e,
        t,
        r
          ? n
          : {
              set(s) {
                (Ia(() => {
                  n.set.call(this, s);
                }, 0),
                  i && i.set && i.set.call(this, s));
              },
            }
      ),
      () => dh(e, t, i || {}, !0)
    );
  }
  function Hl(e, t, n) {
    try {
      if (!(t in e)) return () => {};
      let r = e[t],
        o = n(r);
      return (
        typeof o == 'function' &&
          ((o.prototype = o.prototype || {}),
          Object.defineProperties(o, { __rrweb_original__: { enumerable: !1, value: r } })),
        (e[t] = o),
        () => {
          e[t] = r;
        }
      );
    } catch {
      return () => {};
    }
  }
  var pa = Date.now;
  /[1-9][0-9]{12}/.test(Date.now().toString()) || (pa = () => new Date().getTime());
  function fh(e) {
    let t = e.document;
    return {
      left: t.scrollingElement
        ? t.scrollingElement.scrollLeft
        : e.pageXOffset !== void 0
          ? e.pageXOffset
          : t?.documentElement.scrollLeft ||
            t?.body?.parentElement?.scrollLeft ||
            t?.body?.scrollLeft ||
            0,
      top: t.scrollingElement
        ? t.scrollingElement.scrollTop
        : e.pageYOffset !== void 0
          ? e.pageYOffset
          : t?.documentElement.scrollTop ||
            t?.body?.parentElement?.scrollTop ||
            t?.body?.scrollTop ||
            0,
    };
  }
  function ph() {
    return (
      window.innerHeight ||
      (document.documentElement && document.documentElement.clientHeight) ||
      (document.body && document.body.clientHeight)
    );
  }
  function mh() {
    return (
      window.innerWidth ||
      (document.documentElement && document.documentElement.clientWidth) ||
      (document.body && document.body.clientWidth)
    );
  }
  function hh(e) {
    if (!e) return null;
    try {
      return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
    } catch {
      return null;
    }
  }
  function St(e, t, n, r, o) {
    if (!e) return !1;
    let i = hh(e);
    if (!i) return !1;
    let s = qr(t, n);
    if (!o) {
      let u = r && i.matches(r);
      return s(i) && !u;
    }
    let a = nr(i, s),
      c = -1;
    return a < 0 ? !1 : (r && (c = nr(i, qr(null, r))), a > -1 && c < 0 ? !0 : a < c);
  }
  function Nv(e, t) {
    return t.getId(e) !== -1;
  }
  function al(e, t) {
    return t.getId(e) === ai;
  }
  function gh(e, t) {
    if (ri(e)) return !1;
    let n = t.getId(e);
    return t.has(n)
      ? e.parentNode && e.parentNode.nodeType === e.DOCUMENT_NODE
        ? !1
        : e.parentNode
          ? gh(e.parentNode, t)
          : !0
      : !0;
  }
  function ml(e) {
    return !!e.changedTouches;
  }
  function Mv(e = window) {
    ('NodeList' in e &&
      !e.NodeList.prototype.forEach &&
      (e.NodeList.prototype.forEach = Array.prototype.forEach),
      'DOMTokenList' in e &&
        !e.DOMTokenList.prototype.forEach &&
        (e.DOMTokenList.prototype.forEach = Array.prototype.forEach),
      Node.prototype.contains ||
        (Node.prototype.contains = (...t) => {
          let n = t[0];
          if (!(0 in t)) throw new TypeError('1 argument is required');
          do if (this === n) return !0;
          while ((n = n && n.parentNode));
          return !1;
        }));
  }
  function _h(e, t) {
    return !!(e.nodeName === 'IFRAME' && t.getMeta(e));
  }
  function Sh(e, t) {
    return !!(
      e.nodeName === 'LINK' &&
      e.nodeType === e.ELEMENT_NODE &&
      e.getAttribute &&
      e.getAttribute('rel') === 'stylesheet' &&
      t.getMeta(e)
    );
  }
  function hl(e) {
    return !!e?.shadowRoot;
  }
  var gl = class {
    constructor() {
      ((this.id = 1), (this.styleIDMap = new WeakMap()), (this.idStyleMap = new Map()));
    }
    getId(t) {
      return this.styleIDMap.get(t) ?? -1;
    }
    has(t) {
      return this.styleIDMap.has(t);
    }
    add(t, n) {
      if (this.has(t)) return this.getId(t);
      let r;
      return (
        n === void 0 ? (r = this.id++) : (r = n),
        this.styleIDMap.set(t, r),
        this.idStyleMap.set(r, t),
        r
      );
    }
    getStyle(t) {
      return this.idStyleMap.get(t) || null;
    }
    reset() {
      ((this.styleIDMap = new WeakMap()), (this.idStyleMap = new Map()), (this.id = 1));
    }
    generateId() {
      return this.id++;
    }
  };
  function yh(e) {
    let t = null;
    return (
      e.getRootNode?.()?.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
        e.getRootNode().host &&
        (t = e.getRootNode().host),
      t
    );
  }
  function Ov(e) {
    let t = e,
      n;
    for (; (n = yh(t)); ) t = n;
    return t;
  }
  function Lv(e) {
    let t = e.ownerDocument;
    if (!t) return !1;
    let n = Ov(e);
    return t.contains(n);
  }
  function Eh(e) {
    let t = e.ownerDocument;
    return t ? t.contains(e) || Lv(e) : !1;
  }
  var Wm = {};
  function $l(e) {
    let t = Wm[e];
    if (t) return t;
    let n = window.document,
      r = window[e];
    if (n && typeof n.createElement == 'function')
      try {
        let o = n.createElement('iframe');
        ((o.hidden = !0), n.head.appendChild(o));
        let i = o.contentWindow;
        (i && i[e] && (r = i[e]), n.head.removeChild(o));
      } catch {}
    return (Wm[e] = r.bind(window));
  }
  function Dv(...e) {
    return $l('requestAnimationFrame')(...e);
  }
  function Ia(...e) {
    return $l('setTimeout')(...e);
  }
  function Pv(...e) {
    return $l('clearTimeout')(...e);
  }
  var Y = ((e) => (
      (e[(e.DomContentLoaded = 0)] = 'DomContentLoaded'),
      (e[(e.Load = 1)] = 'Load'),
      (e[(e.FullSnapshot = 2)] = 'FullSnapshot'),
      (e[(e.IncrementalSnapshot = 3)] = 'IncrementalSnapshot'),
      (e[(e.Meta = 4)] = 'Meta'),
      (e[(e.Custom = 5)] = 'Custom'),
      (e[(e.Plugin = 6)] = 'Plugin'),
      e
    ))(Y || {}),
    j = ((e) => (
      (e[(e.Mutation = 0)] = 'Mutation'),
      (e[(e.MouseMove = 1)] = 'MouseMove'),
      (e[(e.MouseInteraction = 2)] = 'MouseInteraction'),
      (e[(e.Scroll = 3)] = 'Scroll'),
      (e[(e.ViewportResize = 4)] = 'ViewportResize'),
      (e[(e.Input = 5)] = 'Input'),
      (e[(e.TouchMove = 6)] = 'TouchMove'),
      (e[(e.MediaInteraction = 7)] = 'MediaInteraction'),
      (e[(e.StyleSheetRule = 8)] = 'StyleSheetRule'),
      (e[(e.CanvasMutation = 9)] = 'CanvasMutation'),
      (e[(e.Font = 10)] = 'Font'),
      (e[(e.Log = 11)] = 'Log'),
      (e[(e.Drag = 12)] = 'Drag'),
      (e[(e.StyleDeclaration = 13)] = 'StyleDeclaration'),
      (e[(e.Selection = 14)] = 'Selection'),
      (e[(e.AdoptedStyleSheet = 15)] = 'AdoptedStyleSheet'),
      (e[(e.CustomElement = 16)] = 'CustomElement'),
      e
    ))(j || {}),
    et = ((e) => (
      (e[(e.MouseUp = 0)] = 'MouseUp'),
      (e[(e.MouseDown = 1)] = 'MouseDown'),
      (e[(e.Click = 2)] = 'Click'),
      (e[(e.ContextMenu = 3)] = 'ContextMenu'),
      (e[(e.DblClick = 4)] = 'DblClick'),
      (e[(e.Focus = 5)] = 'Focus'),
      (e[(e.Blur = 6)] = 'Blur'),
      (e[(e.TouchStart = 7)] = 'TouchStart'),
      (e[(e.TouchMove_Departed = 8)] = 'TouchMove_Departed'),
      (e[(e.TouchEnd = 9)] = 'TouchEnd'),
      (e[(e.TouchCancel = 10)] = 'TouchCancel'),
      e
    ))(et || {}),
    fn = ((e) => (
      (e[(e.Mouse = 0)] = 'Mouse'),
      (e[(e.Pen = 1)] = 'Pen'),
      (e[(e.Touch = 2)] = 'Touch'),
      e
    ))(fn || {}),
    zr = ((e) => (
      (e[(e.Play = 0)] = 'Play'),
      (e[(e.Pause = 1)] = 'Pause'),
      (e[(e.Seeked = 2)] = 'Seeked'),
      (e[(e.VolumeChange = 3)] = 'VolumeChange'),
      (e[(e.RateChange = 4)] = 'RateChange'),
      e
    ))(zr || {});
  function Wl(e) {
    try {
      return e.contentDocument;
    } catch {}
  }
  function Fv(e) {
    try {
      return e.contentWindow;
    } catch {}
  }
  function Gm(e) {
    return '__ln' in e;
  }
  var _l = class {
      constructor() {
        ((this.length = 0), (this.head = null), (this.tail = null));
      }
      get(t) {
        if (t >= this.length) throw new Error('Position outside of list range');
        let n = this.head;
        for (let r = 0; r < t; r++) n = n?.next || null;
        return n;
      }
      addNode(t) {
        let n = { value: t, previous: null, next: null };
        if (((t.__ln = n), t.previousSibling && Gm(t.previousSibling))) {
          let r = t.previousSibling.__ln.next;
          ((n.next = r),
            (n.previous = t.previousSibling.__ln),
            (t.previousSibling.__ln.next = n),
            r && (r.previous = n));
        } else if (t.nextSibling && Gm(t.nextSibling) && t.nextSibling.__ln.previous) {
          let r = t.nextSibling.__ln.previous;
          ((n.previous = r),
            (n.next = t.nextSibling.__ln),
            (t.nextSibling.__ln.previous = n),
            r && (r.next = n));
        } else (this.head && (this.head.previous = n), (n.next = this.head), (this.head = n));
        (n.next === null && (this.tail = n), this.length++);
      }
      removeNode(t) {
        let n = t.__ln;
        this.head &&
          (n.previous
            ? ((n.previous.next = n.next),
              n.next ? (n.next.previous = n.previous) : (this.tail = n.previous))
            : ((this.head = n.next), this.head ? (this.head.previous = null) : (this.tail = null)),
          t.__ln && delete t.__ln,
          this.length--);
      }
    },
    zm = (e, t) => `${e}@${t}`,
    Sl = class {
      constructor() {
        ((this.frozen = !1),
          (this.locked = !1),
          (this.texts = []),
          (this.attributes = []),
          (this.attributeMap = new WeakMap()),
          (this.removes = []),
          (this.mapRemoves = []),
          (this.movedMap = {}),
          (this.addedSet = new Set()),
          (this.movedSet = new Set()),
          (this.droppedSet = new Set()),
          (this.processMutations = (t) => {
            (t.forEach(this.processMutation), this.emit());
          }),
          (this.emit = () => {
            if (this.frozen || this.locked) return;
            let t = [],
              n = new Set(),
              r = new _l(),
              o = (c) => {
                let u = c,
                  d = ai;
                for (; d === ai; ) ((u = u && u.nextSibling), (d = u && this.mirror.getId(u)));
                return d;
              },
              i = (c) => {
                if (!c.parentNode || !Eh(c)) return;
                let u = ri(c.parentNode)
                    ? this.mirror.getId(yh(c))
                    : this.mirror.getId(c.parentNode),
                  d = o(c);
                if (u === -1 || d === -1) return r.addNode(c);
                let l = Vr(c, {
                  doc: this.doc,
                  mirror: this.mirror,
                  blockClass: this.blockClass,
                  blockSelector: this.blockSelector,
                  maskAllText: this.maskAllText,
                  unblockSelector: this.unblockSelector,
                  maskTextClass: this.maskTextClass,
                  unmaskTextClass: this.unmaskTextClass,
                  maskTextSelector: this.maskTextSelector,
                  unmaskTextSelector: this.unmaskTextSelector,
                  skipChild: !0,
                  newlyAddedElement: !0,
                  inlineStylesheet: this.inlineStylesheet,
                  maskInputOptions: this.maskInputOptions,
                  maskAttributeFn: this.maskAttributeFn,
                  maskTextFn: this.maskTextFn,
                  maskInputFn: this.maskInputFn,
                  slimDOMOptions: this.slimDOMOptions,
                  dataURLOptions: this.dataURLOptions,
                  recordCanvas: this.recordCanvas,
                  inlineImages: this.inlineImages,
                  onSerialize: (p) => {
                    (_h(p, this.mirror) &&
                      !St(p, this.blockClass, this.blockSelector, this.unblockSelector, !1) &&
                      this.iframeManager.addIframe(p),
                      Sh(p, this.mirror) && this.stylesheetManager.trackLinkElement(p),
                      hl(c) && this.shadowDomManager.addShadowRoot(c.shadowRoot, this.doc));
                  },
                  onIframeLoad: (p, f) => {
                    St(p, this.blockClass, this.blockSelector, this.unblockSelector, !1) ||
                      (this.iframeManager.attachIframe(p, f),
                      p.contentWindow && this.canvasManager.addWindow(p.contentWindow),
                      this.shadowDomManager.observeAttachShadow(p));
                  },
                  onStylesheetLoad: (p, f) => {
                    this.stylesheetManager.attachLinkElement(p, f);
                  },
                  onBlockedImageLoad: (p, f, { width: m, height: _ }) => {
                    this.mutationCb({
                      adds: [],
                      removes: [],
                      texts: [],
                      attributes: [
                        { id: f.id, attributes: { style: { width: `${m}px`, height: `${_}px` } } },
                      ],
                    });
                  },
                });
                l && (t.push({ parentId: u, nextId: d, node: l }), n.add(l.id));
              };
            for (; this.mapRemoves.length; ) this.mirror.removeNodeFromMap(this.mapRemoves.shift());
            for (let c of this.movedSet)
              (jm(this.removes, c, this.mirror) && !this.movedSet.has(c.parentNode)) || i(c);
            for (let c of this.addedSet)
              (!qm(this.droppedSet, c) && !jm(this.removes, c, this.mirror)) || qm(this.movedSet, c)
                ? i(c)
                : this.droppedSet.add(c);
            let s = null;
            for (; r.length; ) {
              let c = null;
              if (s) {
                let u = this.mirror.getId(s.value.parentNode),
                  d = o(s.value);
                u !== -1 && d !== -1 && (c = s);
              }
              if (!c) {
                let u = r.tail;
                for (; u; ) {
                  let d = u;
                  if (((u = u.previous), d)) {
                    let l = this.mirror.getId(d.value.parentNode);
                    if (o(d.value) === -1) continue;
                    if (l !== -1) {
                      c = d;
                      break;
                    } else {
                      let f = d.value;
                      if (f.parentNode && f.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        let m = f.parentNode.host;
                        if (this.mirror.getId(m) !== -1) {
                          c = d;
                          break;
                        }
                      }
                    }
                  }
                }
              }
              if (!c) {
                for (; r.head; ) r.removeNode(r.head.value);
                break;
              }
              ((s = c.previous), r.removeNode(c.value), i(c.value));
            }
            let a = {
              texts: this.texts
                .map((c) => ({ id: this.mirror.getId(c.node), value: c.value }))
                .filter((c) => !n.has(c.id))
                .filter((c) => this.mirror.has(c.id)),
              attributes: this.attributes
                .map((c) => {
                  let { attributes: u } = c;
                  if (typeof u.style == 'string') {
                    let d = JSON.stringify(c.styleDiff),
                      l = JSON.stringify(c._unchangedStyles);
                    d.length < u.style.length &&
                      (d + l).split('var(').length === u.style.split('var(').length &&
                      (u.style = c.styleDiff);
                  }
                  return { id: this.mirror.getId(c.node), attributes: u };
                })
                .filter((c) => !n.has(c.id))
                .filter((c) => this.mirror.has(c.id)),
              removes: this.removes,
              adds: t,
            };
            (!a.texts.length && !a.attributes.length && !a.removes.length && !a.adds.length) ||
              ((this.texts = []),
              (this.attributes = []),
              (this.attributeMap = new WeakMap()),
              (this.removes = []),
              (this.addedSet = new Set()),
              (this.movedSet = new Set()),
              (this.droppedSet = new Set()),
              (this.movedMap = {}),
              this.mutationCb(a));
          }),
          (this.processMutation = (t) => {
            if (!al(t.target, this.mirror))
              switch (t.type) {
                case 'characterData': {
                  let n = t.target.textContent;
                  !St(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) &&
                    n !== t.oldValue &&
                    this.texts.push({
                      value:
                        Kr(
                          t.target,
                          this.maskTextClass,
                          this.maskTextSelector,
                          this.unmaskTextClass,
                          this.unmaskTextSelector,
                          this.maskAllText
                        ) && n
                          ? this.maskTextFn
                            ? this.maskTextFn(n, hh(t.target))
                            : n.replace(/[\S]/g, '*')
                          : n,
                      node: t.target,
                    });
                  break;
                }
                case 'attributes': {
                  let n = t.target,
                    r = t.attributeName,
                    o = t.target.getAttribute(r);
                  if (r === 'value') {
                    let s = Ul(n),
                      a = n.tagName;
                    o = da(n, a, s);
                    let c = ba({ maskInputOptions: this.maskInputOptions, tagName: a, type: s }),
                      u = Kr(
                        t.target,
                        this.maskTextClass,
                        this.maskTextSelector,
                        this.unmaskTextClass,
                        this.unmaskTextSelector,
                        c
                      );
                    o = si({ isMasked: u, element: n, value: o, maskInputFn: this.maskInputFn });
                  }
                  if (
                    St(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) ||
                    o === t.oldValue
                  )
                    return;
                  let i = this.attributeMap.get(t.target);
                  if (n.tagName === 'IFRAME' && r === 'src' && !this.keepIframeSrcFn(o))
                    if (!Wl(n)) r = 'rr_src';
                    else return;
                  if (
                    (i ||
                      ((i = {
                        node: t.target,
                        attributes: {},
                        styleDiff: {},
                        _unchangedStyles: {},
                      }),
                      this.attributes.push(i),
                      this.attributeMap.set(t.target, i)),
                    r === 'type' &&
                      n.tagName === 'INPUT' &&
                      (t.oldValue || '').toLowerCase() === 'password' &&
                      n.setAttribute('data-rr-is-password', 'true'),
                    !lh(n.tagName, r) &&
                      ((i.attributes[r] = uh(
                        this.doc,
                        Jr(n.tagName),
                        Jr(r),
                        o,
                        n,
                        this.maskAttributeFn
                      )),
                      r === 'style'))
                  ) {
                    if (!this.unattachedDoc)
                      try {
                        this.unattachedDoc = document.implementation.createHTMLDocument();
                      } catch {
                        this.unattachedDoc = this.doc;
                      }
                    let s = this.unattachedDoc.createElement('span');
                    t.oldValue && s.setAttribute('style', t.oldValue);
                    for (let a of Array.from(n.style)) {
                      let c = n.style.getPropertyValue(a),
                        u = n.style.getPropertyPriority(a);
                      c !== s.style.getPropertyValue(a) || u !== s.style.getPropertyPriority(a)
                        ? u === ''
                          ? (i.styleDiff[a] = c)
                          : (i.styleDiff[a] = [c, u])
                        : (i._unchangedStyles[a] = [c, u]);
                    }
                    for (let a of Array.from(s.style))
                      n.style.getPropertyValue(a) === '' && (i.styleDiff[a] = !1);
                  }
                  break;
                }
                case 'childList': {
                  if (St(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !0))
                    return;
                  (t.addedNodes.forEach((n) => this.genAdds(n, t.target)),
                    t.removedNodes.forEach((n) => {
                      let r = this.mirror.getId(n),
                        o = ri(t.target)
                          ? this.mirror.getId(t.target.host)
                          : this.mirror.getId(t.target);
                      St(t.target, this.blockClass, this.blockSelector, this.unblockSelector, !1) ||
                        al(n, this.mirror) ||
                        !Nv(n, this.mirror) ||
                        (this.addedSet.has(n)
                          ? (yl(this.addedSet, n), this.droppedSet.add(n))
                          : (this.addedSet.has(t.target) && r === -1) ||
                            gh(t.target, this.mirror) ||
                            (this.movedSet.has(n) && this.movedMap[zm(r, o)]
                              ? yl(this.movedSet, n)
                              : this.removes.push({
                                  parentId: o,
                                  id: r,
                                  isShadow: ri(t.target) && oi(t.target) ? !0 : void 0,
                                })),
                        this.mapRemoves.push(n));
                    }));
                  break;
                }
              }
          }),
          (this.genAdds = (t, n) => {
            if (
              !this.processedNodeManager.inOtherBuffer(t, this) &&
              !(this.addedSet.has(t) || this.movedSet.has(t))
            ) {
              if (this.mirror.hasNode(t)) {
                if (al(t, this.mirror)) return;
                this.movedSet.add(t);
                let r = null;
                (n && this.mirror.hasNode(n) && (r = this.mirror.getId(n)),
                  r && r !== -1 && (this.movedMap[zm(this.mirror.getId(t), r)] = !0));
              } else (this.addedSet.add(t), this.droppedSet.delete(t));
              St(t, this.blockClass, this.blockSelector, this.unblockSelector, !1) ||
                (t.childNodes && t.childNodes.forEach((r) => this.genAdds(r)),
                hl(t) &&
                  t.shadowRoot.childNodes.forEach((r) => {
                    (this.processedNodeManager.add(r, this), this.genAdds(r, t));
                  }));
            }
          }));
      }
      init(t) {
        [
          'mutationCb',
          'blockClass',
          'blockSelector',
          'unblockSelector',
          'maskAllText',
          'maskTextClass',
          'unmaskTextClass',
          'maskTextSelector',
          'unmaskTextSelector',
          'inlineStylesheet',
          'maskInputOptions',
          'maskAttributeFn',
          'maskTextFn',
          'maskInputFn',
          'keepIframeSrcFn',
          'recordCanvas',
          'inlineImages',
          'slimDOMOptions',
          'dataURLOptions',
          'doc',
          'mirror',
          'iframeManager',
          'stylesheetManager',
          'shadowDomManager',
          'canvasManager',
          'processedNodeManager',
        ].forEach((n) => {
          this[n] = t[n];
        });
      }
      freeze() {
        ((this.frozen = !0), this.canvasManager.freeze());
      }
      unfreeze() {
        ((this.frozen = !1), this.canvasManager.unfreeze(), this.emit());
      }
      isFrozen() {
        return this.frozen;
      }
      lock() {
        ((this.locked = !0), this.canvasManager.lock());
      }
      unlock() {
        ((this.locked = !1), this.canvasManager.unlock(), this.emit());
      }
      reset() {
        (this.shadowDomManager.reset(), this.canvasManager.reset());
      }
    };
  function yl(e, t) {
    (e.delete(t), t.childNodes?.forEach((n) => yl(e, n)));
  }
  function jm(e, t, n) {
    return e.length === 0 ? !1 : Uv(e, t, n);
  }
  function Uv(e, t, n) {
    let r = t.parentNode;
    for (; r; ) {
      let o = n.getId(r);
      if (e.some((i) => i.id === o)) return !0;
      r = r.parentNode;
    }
    return !1;
  }
  function qm(e, t) {
    return e.size === 0 ? !1 : bh(e, t);
  }
  function bh(e, t) {
    let { parentNode: n } = t;
    return n ? (e.has(n) ? !0 : bh(e, n)) : !1;
  }
  var ii;
  function Bv(e) {
    ii = e;
  }
  function Hv() {
    ii = void 0;
  }
  var oe = (e) =>
      ii
        ? (...n) => {
            try {
              return e(...n);
            } catch (r) {
              if (ii && ii(r) === !0) return () => {};
              throw r;
            }
          }
        : e,
    Yr = [];
  function pi(e) {
    try {
      if ('composedPath' in e) {
        let t = e.composedPath();
        if (t.length) return t[0];
      } else if ('path' in e && e.path.length) return e.path[0];
    } catch {}
    return e && e.target;
  }
  function Th(e, t) {
    let n = new Sl();
    (Yr.push(n), n.init(e));
    let r = window.MutationObserver || window.__rrMutationObserver,
      o = window?.Zone?.__symbol__?.('MutationObserver');
    o && window[o] && (r = window[o]);
    let i = new r(
      oe((s) => {
        (e.onMutation && e.onMutation(s) === !1) || n.processMutations.bind(n)(s);
      })
    );
    return (
      i.observe(t, {
        attributes: !0,
        attributeOldValue: !0,
        characterData: !0,
        characterDataOldValue: !0,
        childList: !0,
        subtree: !0,
      }),
      i
    );
  }
  function $v({ mousemoveCb: e, sampling: t, doc: n, mirror: r }) {
    if (t.mousemove === !1) return () => {};
    let o = typeof t.mousemove == 'number' ? t.mousemove : 50,
      i = typeof t.mousemoveCallback == 'number' ? t.mousemoveCallback : 500,
      s = [],
      a,
      c = ci(
        oe((l) => {
          let p = Date.now() - a;
          (e(
            s.map((f) => ((f.timeOffset -= p), f)),
            l
          ),
            (s = []),
            (a = null));
        }),
        i
      ),
      u = oe(
        ci(
          oe((l) => {
            let p = pi(l),
              { clientX: f, clientY: m } = ml(l) ? l.changedTouches[0] : l;
            (a || (a = pa()),
              s.push({ x: f, y: m, id: r.getId(p), timeOffset: pa() - a }),
              c(
                typeof DragEvent < 'u' && l instanceof DragEvent
                  ? j.Drag
                  : l instanceof MouseEvent
                    ? j.MouseMove
                    : j.TouchMove
              ));
          }),
          o,
          { trailing: !1 }
        )
      ),
      d = [tt('mousemove', u, n), tt('touchmove', u, n), tt('drag', u, n)];
    return oe(() => {
      d.forEach((l) => l());
    });
  }
  function Wv({
    mouseInteractionCb: e,
    doc: t,
    mirror: n,
    blockClass: r,
    blockSelector: o,
    unblockSelector: i,
    sampling: s,
  }) {
    if (s.mouseInteraction === !1) return () => {};
    let a = s.mouseInteraction === !0 || s.mouseInteraction === void 0 ? {} : s.mouseInteraction,
      c = [],
      u = null,
      d = (l) => (p) => {
        let f = pi(p);
        if (St(f, r, o, i, !0)) return;
        let m = null,
          _ = l;
        if ('pointerType' in p) {
          switch (p.pointerType) {
            case 'mouse':
              m = fn.Mouse;
              break;
            case 'touch':
              m = fn.Touch;
              break;
            case 'pen':
              m = fn.Pen;
              break;
          }
          m === fn.Touch
            ? et[l] === et.MouseDown
              ? (_ = 'TouchStart')
              : et[l] === et.MouseUp && (_ = 'TouchEnd')
            : fn.Pen;
        } else ml(p) && (m = fn.Touch);
        m !== null
          ? ((u = m),
            ((_.startsWith('Touch') && m === fn.Touch) ||
              (_.startsWith('Mouse') && m === fn.Mouse)) &&
              (m = null))
          : et[l] === et.Click && ((m = u), (u = null));
        let g = ml(p) ? p.changedTouches[0] : p;
        if (!g) return;
        let S = n.getId(f),
          { clientX: E, clientY: P } = g;
        oe(e)({ type: et[_], id: S, x: E, y: P, ...(m !== null && { pointerType: m }) });
      };
    return (
      Object.keys(et)
        .filter((l) => Number.isNaN(Number(l)) && !l.endsWith('_Departed') && a[l] !== !1)
        .forEach((l) => {
          let p = Jr(l),
            f = d(l);
          if (window.PointerEvent)
            switch (et[l]) {
              case et.MouseDown:
              case et.MouseUp:
                p = p.replace('mouse', 'pointer');
                break;
              case et.TouchStart:
              case et.TouchEnd:
                return;
            }
          c.push(tt(p, f, t));
        }),
      oe(() => {
        c.forEach((l) => l());
      })
    );
  }
  function Ih({
    scrollCb: e,
    doc: t,
    mirror: n,
    blockClass: r,
    blockSelector: o,
    unblockSelector: i,
    sampling: s,
  }) {
    let a = oe(
      ci(
        oe((c) => {
          let u = pi(c);
          if (!u || St(u, r, o, i, !0)) return;
          let d = n.getId(u);
          if (u === t && t.defaultView) {
            let l = fh(t.defaultView);
            e({ id: d, x: l.left, y: l.top });
          } else e({ id: d, x: u.scrollLeft, y: u.scrollTop });
        }),
        s.scroll || 100
      )
    );
    return tt('scroll', a, t);
  }
  function Gv({ viewportResizeCb: e }, { win: t }) {
    let n = -1,
      r = -1,
      o = oe(
        ci(
          oe(() => {
            let i = ph(),
              s = mh();
            (n !== i || r !== s) && (e({ width: Number(s), height: Number(i) }), (n = i), (r = s));
          }),
          200
        )
      );
    return tt('resize', o, t);
  }
  var zv = ['INPUT', 'TEXTAREA', 'SELECT'],
    Vm = new WeakMap();
  function jv({
    inputCb: e,
    doc: t,
    mirror: n,
    blockClass: r,
    blockSelector: o,
    unblockSelector: i,
    ignoreClass: s,
    ignoreSelector: a,
    maskInputOptions: c,
    maskInputFn: u,
    sampling: d,
    userTriggeredOnInput: l,
    maskTextClass: p,
    unmaskTextClass: f,
    maskTextSelector: m,
    unmaskTextSelector: _,
  }) {
    function g(T) {
      let R = pi(T),
        I = T.isTrusted,
        k = R && fl(R.tagName);
      if (
        (k === 'OPTION' && (R = R.parentElement),
        !R || !k || zv.indexOf(k) < 0 || St(R, r, o, i, !0))
      )
        return;
      let H = R;
      if (H.classList.contains(s) || (a && H.matches(a))) return;
      let x = Ul(R),
        L = da(H, k, x),
        q = !1,
        J = ba({ maskInputOptions: c, tagName: k, type: x }),
        ne = Kr(R, p, m, f, _, J);
      ((x === 'radio' || x === 'checkbox') && (q = R.checked),
        (L = si({ isMasked: ne, element: R, value: L, maskInputFn: u })),
        S(R, l ? { text: L, isChecked: q, userTriggered: I } : { text: L, isChecked: q }));
      let C = R.name;
      x === 'radio' &&
        C &&
        q &&
        t.querySelectorAll(`input[type="radio"][name="${C}"]`).forEach((z) => {
          if (z !== R) {
            let N = si({ isMasked: ne, element: z, value: da(z, k, x), maskInputFn: u });
            S(z, l ? { text: N, isChecked: !q, userTriggered: !1 } : { text: N, isChecked: !q });
          }
        });
    }
    function S(T, R) {
      let I = Vm.get(T);
      if (!I || I.text !== R.text || I.isChecked !== R.isChecked) {
        Vm.set(T, R);
        let k = n.getId(T);
        oe(e)({ ...R, id: k });
      }
    }
    let P = (d.input === 'last' ? ['change'] : ['input', 'change']).map((T) => tt(T, oe(g), t)),
      w = t.defaultView;
    if (!w)
      return () => {
        P.forEach((T) => T());
      };
    let F = w.Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, 'value'),
      A = [
        [w.HTMLInputElement.prototype, 'value'],
        [w.HTMLInputElement.prototype, 'checked'],
        [w.HTMLSelectElement.prototype, 'value'],
        [w.HTMLTextAreaElement.prototype, 'value'],
        [w.HTMLSelectElement.prototype, 'selectedIndex'],
        [w.HTMLOptionElement.prototype, 'selected'],
      ];
    return (
      F &&
        F.set &&
        P.push(
          ...A.map((T) =>
            dh(
              T[0],
              T[1],
              {
                set() {
                  oe(g)({ target: this, isTrusted: !1 });
                },
              },
              !1,
              w
            )
          )
        ),
      oe(() => {
        P.forEach((T) => T());
      })
    );
  }
  function ma(e) {
    let t = [];
    function n(r, o) {
      if (
        (ia('CSSGroupingRule') && r.parentRule instanceof CSSGroupingRule) ||
        (ia('CSSMediaRule') && r.parentRule instanceof CSSMediaRule) ||
        (ia('CSSSupportsRule') && r.parentRule instanceof CSSSupportsRule) ||
        (ia('CSSConditionRule') && r.parentRule instanceof CSSConditionRule)
      ) {
        let s = Array.from(r.parentRule.cssRules).indexOf(r);
        o.unshift(s);
      } else if (r.parentStyleSheet) {
        let s = Array.from(r.parentStyleSheet.cssRules).indexOf(r);
        o.unshift(s);
      }
      return o;
    }
    return n(e, t);
  }
  function Nn(e, t, n) {
    let r, o;
    return e
      ? (e.ownerNode ? (r = t.getId(e.ownerNode)) : (o = n.getId(e)), { styleId: o, id: r })
      : {};
  }
  function qv({ styleSheetRuleCb: e, mirror: t, stylesheetManager: n }, { win: r }) {
    if (!r.CSSStyleSheet || !r.CSSStyleSheet.prototype) return () => {};
    let o = r.CSSStyleSheet.prototype.insertRule;
    r.CSSStyleSheet.prototype.insertRule = new Proxy(o, {
      apply: oe((d, l, p) => {
        let [f, m] = p,
          { id: _, styleId: g } = Nn(l, t, n.styleMirror);
        return (
          ((_ && _ !== -1) || (g && g !== -1)) &&
            e({ id: _, styleId: g, adds: [{ rule: f, index: m }] }),
          d.apply(l, p)
        );
      }),
    });
    let i = r.CSSStyleSheet.prototype.deleteRule;
    r.CSSStyleSheet.prototype.deleteRule = new Proxy(i, {
      apply: oe((d, l, p) => {
        let [f] = p,
          { id: m, styleId: _ } = Nn(l, t, n.styleMirror);
        return (
          ((m && m !== -1) || (_ && _ !== -1)) && e({ id: m, styleId: _, removes: [{ index: f }] }),
          d.apply(l, p)
        );
      }),
    });
    let s;
    r.CSSStyleSheet.prototype.replace &&
      ((s = r.CSSStyleSheet.prototype.replace),
      (r.CSSStyleSheet.prototype.replace = new Proxy(s, {
        apply: oe((d, l, p) => {
          let [f] = p,
            { id: m, styleId: _ } = Nn(l, t, n.styleMirror);
          return (
            ((m && m !== -1) || (_ && _ !== -1)) && e({ id: m, styleId: _, replace: f }),
            d.apply(l, p)
          );
        }),
      })));
    let a;
    r.CSSStyleSheet.prototype.replaceSync &&
      ((a = r.CSSStyleSheet.prototype.replaceSync),
      (r.CSSStyleSheet.prototype.replaceSync = new Proxy(a, {
        apply: oe((d, l, p) => {
          let [f] = p,
            { id: m, styleId: _ } = Nn(l, t, n.styleMirror);
          return (
            ((m && m !== -1) || (_ && _ !== -1)) && e({ id: m, styleId: _, replaceSync: f }),
            d.apply(l, p)
          );
        }),
      })));
    let c = {};
    sa('CSSGroupingRule')
      ? (c.CSSGroupingRule = r.CSSGroupingRule)
      : (sa('CSSMediaRule') && (c.CSSMediaRule = r.CSSMediaRule),
        sa('CSSConditionRule') && (c.CSSConditionRule = r.CSSConditionRule),
        sa('CSSSupportsRule') && (c.CSSSupportsRule = r.CSSSupportsRule));
    let u = {};
    return (
      Object.entries(c).forEach(([d, l]) => {
        ((u[d] = { insertRule: l.prototype.insertRule, deleteRule: l.prototype.deleteRule }),
          (l.prototype.insertRule = new Proxy(u[d].insertRule, {
            apply: oe((p, f, m) => {
              let [_, g] = m,
                { id: S, styleId: E } = Nn(f.parentStyleSheet, t, n.styleMirror);
              return (
                ((S && S !== -1) || (E && E !== -1)) &&
                  e({ id: S, styleId: E, adds: [{ rule: _, index: [...ma(f), g || 0] }] }),
                p.apply(f, m)
              );
            }),
          })),
          (l.prototype.deleteRule = new Proxy(u[d].deleteRule, {
            apply: oe((p, f, m) => {
              let [_] = m,
                { id: g, styleId: S } = Nn(f.parentStyleSheet, t, n.styleMirror);
              return (
                ((g && g !== -1) || (S && S !== -1)) &&
                  e({ id: g, styleId: S, removes: [{ index: [...ma(f), _] }] }),
                p.apply(f, m)
              );
            }),
          })));
      }),
      oe(() => {
        ((r.CSSStyleSheet.prototype.insertRule = o),
          (r.CSSStyleSheet.prototype.deleteRule = i),
          s && (r.CSSStyleSheet.prototype.replace = s),
          a && (r.CSSStyleSheet.prototype.replaceSync = a),
          Object.entries(c).forEach(([d, l]) => {
            ((l.prototype.insertRule = u[d].insertRule),
              (l.prototype.deleteRule = u[d].deleteRule));
          }));
      })
    );
  }
  function vh({ mirror: e, stylesheetManager: t }, n) {
    let r = null;
    n.nodeName === '#document' ? (r = e.getId(n)) : (r = e.getId(n.host));
    let o =
        n.nodeName === '#document'
          ? n.defaultView?.Document
          : n.ownerDocument?.defaultView?.ShadowRoot,
      i = o?.prototype
        ? Object.getOwnPropertyDescriptor(o?.prototype, 'adoptedStyleSheets')
        : void 0;
    return r === null || r === -1 || !o || !i
      ? () => {}
      : (Object.defineProperty(n, 'adoptedStyleSheets', {
          configurable: i.configurable,
          enumerable: i.enumerable,
          get() {
            return i.get?.call(this);
          },
          set(s) {
            let a = i.set?.call(this, s);
            if (r !== null && r !== -1)
              try {
                t.adoptStyleSheets(s, r);
              } catch {}
            return a;
          },
        }),
        oe(() => {
          Object.defineProperty(n, 'adoptedStyleSheets', {
            configurable: i.configurable,
            enumerable: i.enumerable,
            get: i.get,
            set: i.set,
          });
        }));
  }
  function Vv(
    { styleDeclarationCb: e, mirror: t, ignoreCSSAttributes: n, stylesheetManager: r },
    { win: o }
  ) {
    let i = o.CSSStyleDeclaration.prototype.setProperty;
    o.CSSStyleDeclaration.prototype.setProperty = new Proxy(i, {
      apply: oe((a, c, u) => {
        let [d, l, p] = u;
        if (n.has(d)) return i.apply(c, [d, l, p]);
        let { id: f, styleId: m } = Nn(c.parentRule?.parentStyleSheet, t, r.styleMirror);
        return (
          ((f && f !== -1) || (m && m !== -1)) &&
            e({
              id: f,
              styleId: m,
              set: { property: d, value: l, priority: p },
              index: ma(c.parentRule),
            }),
          a.apply(c, u)
        );
      }),
    });
    let s = o.CSSStyleDeclaration.prototype.removeProperty;
    return (
      (o.CSSStyleDeclaration.prototype.removeProperty = new Proxy(s, {
        apply: oe((a, c, u) => {
          let [d] = u;
          if (n.has(d)) return s.apply(c, [d]);
          let { id: l, styleId: p } = Nn(c.parentRule?.parentStyleSheet, t, r.styleMirror);
          return (
            ((l && l !== -1) || (p && p !== -1)) &&
              e({ id: l, styleId: p, remove: { property: d }, index: ma(c.parentRule) }),
            a.apply(c, u)
          );
        }),
      })),
      oe(() => {
        ((o.CSSStyleDeclaration.prototype.setProperty = i),
          (o.CSSStyleDeclaration.prototype.removeProperty = s));
      })
    );
  }
  function Yv({
    mediaInteractionCb: e,
    blockClass: t,
    blockSelector: n,
    unblockSelector: r,
    mirror: o,
    sampling: i,
    doc: s,
  }) {
    let a = oe((u) =>
        ci(
          oe((d) => {
            let l = pi(d);
            if (!l || St(l, t, n, r, !0)) return;
            let { currentTime: p, volume: f, muted: m, playbackRate: _ } = l;
            e({ type: u, id: o.getId(l), currentTime: p, volume: f, muted: m, playbackRate: _ });
          }),
          i.media || 500
        )
      ),
      c = [
        tt('play', a(zr.Play), s),
        tt('pause', a(zr.Pause), s),
        tt('seeked', a(zr.Seeked), s),
        tt('volumechange', a(zr.VolumeChange), s),
        tt('ratechange', a(zr.RateChange), s),
      ];
    return oe(() => {
      c.forEach((u) => u());
    });
  }
  function Jv({ fontCb: e, doc: t }) {
    let n = t.defaultView;
    if (!n) return () => {};
    let r = [],
      o = new WeakMap(),
      i = n.FontFace;
    n.FontFace = function (c, u, d) {
      let l = new i(c, u, d);
      return (
        o.set(l, {
          family: c,
          buffer: typeof u != 'string',
          descriptors: d,
          fontSource: typeof u == 'string' ? u : JSON.stringify(Array.from(new Uint8Array(u))),
        }),
        l
      );
    };
    let s = Hl(t.fonts, 'add', function (a) {
      return function (c) {
        return (
          Ia(
            oe(() => {
              let u = o.get(c);
              u && (e(u), o.delete(c));
            }),
            0
          ),
          a.apply(this, [c])
        );
      };
    });
    return (
      r.push(() => {
        n.FontFace = i;
      }),
      r.push(s),
      oe(() => {
        r.forEach((a) => a());
      })
    );
  }
  function Kv(e) {
    let {
        doc: t,
        mirror: n,
        blockClass: r,
        blockSelector: o,
        unblockSelector: i,
        selectionCb: s,
      } = e,
      a = !0,
      c = oe(() => {
        let u = t.getSelection();
        if (!u || (a && u?.isCollapsed)) return;
        a = u.isCollapsed || !1;
        let d = [],
          l = u.rangeCount || 0;
        for (let p = 0; p < l; p++) {
          let f = u.getRangeAt(p),
            { startContainer: m, startOffset: _, endContainer: g, endOffset: S } = f;
          St(m, r, o, i, !0) ||
            St(g, r, o, i, !0) ||
            d.push({ start: n.getId(m), startOffset: _, end: n.getId(g), endOffset: S });
        }
        s({ ranges: d });
      });
    return (c(), tt('selectionchange', c));
  }
  function Xv({ doc: e, customElementCb: t }) {
    let n = e.defaultView;
    return !n || !n.customElements
      ? () => {}
      : Hl(n.customElements, 'define', function (o) {
          return function (i, s, a) {
            try {
              t({ define: { name: i } });
            } catch {}
            return o.apply(this, [i, s, a]);
          };
        });
  }
  function Zv(e, t = {}) {
    let n = e.doc.defaultView;
    if (!n) return () => {};
    let r;
    e.recordDOM && (r = Th(e, e.doc));
    let o = $v(e),
      i = Wv(e),
      s = Ih(e),
      a = Gv(e, { win: n }),
      c = jv(e),
      u = Yv(e),
      d = () => {},
      l = () => {},
      p = () => {},
      f = () => {};
    e.recordDOM &&
      ((d = qv(e, { win: n })),
      (l = vh(e, e.doc)),
      (p = Vv(e, { win: n })),
      e.collectFonts && (f = Jv(e)));
    let m = Kv(e),
      _ = Xv(e),
      g = [];
    for (let S of e.plugins) g.push(S.observer(S.callback, n, S.options));
    return oe(() => {
      (Yr.forEach((S) => S.reset()),
        r?.disconnect(),
        o(),
        i(),
        s(),
        a(),
        c(),
        u(),
        d(),
        l(),
        p(),
        f(),
        m(),
        _(),
        g.forEach((S) => S()));
    });
  }
  function ia(e) {
    return typeof window[e] < 'u';
  }
  function sa(e) {
    return !!(
      typeof window[e] < 'u' &&
      window[e].prototype &&
      'insertRule' in window[e].prototype &&
      'deleteRule' in window[e].prototype
    );
  }
  var ui = class {
      constructor(t) {
        ((this.generateIdFn = t),
          (this.iframeIdToRemoteIdMap = new WeakMap()),
          (this.iframeRemoteIdToIdMap = new WeakMap()));
      }
      getId(t, n, r, o) {
        let i = r || this.getIdToRemoteIdMap(t),
          s = o || this.getRemoteIdToIdMap(t),
          a = i.get(n);
        return (a || ((a = this.generateIdFn()), i.set(n, a), s.set(a, n)), a);
      }
      getIds(t, n) {
        let r = this.getIdToRemoteIdMap(t),
          o = this.getRemoteIdToIdMap(t);
        return n.map((i) => this.getId(t, i, r, o));
      }
      getRemoteId(t, n, r) {
        let o = r || this.getRemoteIdToIdMap(t);
        if (typeof n != 'number') return n;
        let i = o.get(n);
        return i || -1;
      }
      getRemoteIds(t, n) {
        let r = this.getRemoteIdToIdMap(t);
        return n.map((o) => this.getRemoteId(t, o, r));
      }
      reset(t) {
        if (!t) {
          ((this.iframeIdToRemoteIdMap = new WeakMap()),
            (this.iframeRemoteIdToIdMap = new WeakMap()));
          return;
        }
        (this.iframeIdToRemoteIdMap.delete(t), this.iframeRemoteIdToIdMap.delete(t));
      }
      getIdToRemoteIdMap(t) {
        let n = this.iframeIdToRemoteIdMap.get(t);
        return (n || ((n = new Map()), this.iframeIdToRemoteIdMap.set(t, n)), n);
      }
      getRemoteIdToIdMap(t) {
        let n = this.iframeRemoteIdToIdMap.get(t);
        return (n || ((n = new Map()), this.iframeRemoteIdToIdMap.set(t, n)), n);
      }
    },
    El = class {
      constructor() {
        ((this.crossOriginIframeMirror = new ui(Bl)),
          (this.crossOriginIframeRootIdMap = new WeakMap()));
      }
      addIframe() {}
      addLoadListener() {}
      attachIframe() {}
    },
    bl = class {
      constructor(t) {
        ((this.iframes = new WeakMap()),
          (this.crossOriginIframeMap = new WeakMap()),
          (this.crossOriginIframeMirror = new ui(Bl)),
          (this.crossOriginIframeRootIdMap = new WeakMap()),
          (this.mutationCb = t.mutationCb),
          (this.wrappedEmit = t.wrappedEmit),
          (this.stylesheetManager = t.stylesheetManager),
          (this.recordCrossOriginIframes = t.recordCrossOriginIframes),
          (this.crossOriginIframeStyleMirror = new ui(
            this.stylesheetManager.styleMirror.generateId.bind(this.stylesheetManager.styleMirror)
          )),
          (this.mirror = t.mirror),
          this.recordCrossOriginIframes &&
            window.addEventListener('message', this.handleMessage.bind(this)));
      }
      addIframe(t) {
        (this.iframes.set(t, !0),
          t.contentWindow && this.crossOriginIframeMap.set(t.contentWindow, t));
      }
      addLoadListener(t) {
        this.loadListener = t;
      }
      attachIframe(t, n) {
        (this.mutationCb({
          adds: [{ parentId: this.mirror.getId(t), nextId: null, node: n }],
          removes: [],
          texts: [],
          attributes: [],
          isAttachIframe: !0,
        }),
          this.recordCrossOriginIframes &&
            t.contentWindow?.addEventListener('message', this.handleMessage.bind(this)),
          this.loadListener?.(t));
        let r = Wl(t);
        r &&
          r.adoptedStyleSheets &&
          r.adoptedStyleSheets.length > 0 &&
          this.stylesheetManager.adoptStyleSheets(r.adoptedStyleSheets, this.mirror.getId(r));
      }
      handleMessage(t) {
        let n = t;
        if (n.data.type !== 'rrweb' || n.origin !== n.data.origin || !t.source) return;
        let o = this.crossOriginIframeMap.get(t.source);
        if (!o) return;
        let i = this.transformCrossOriginEvent(o, n.data.event);
        i && this.wrappedEmit(i, n.data.isCheckout);
      }
      transformCrossOriginEvent(t, n) {
        switch (n.type) {
          case Y.FullSnapshot: {
            (this.crossOriginIframeMirror.reset(t),
              this.crossOriginIframeStyleMirror.reset(t),
              this.replaceIdOnNode(n.data.node, t));
            let r = n.data.node.id;
            return (
              this.crossOriginIframeRootIdMap.set(t, r),
              this.patchRootIdOnNode(n.data.node, r),
              {
                timestamp: n.timestamp,
                type: Y.IncrementalSnapshot,
                data: {
                  source: j.Mutation,
                  adds: [{ parentId: this.mirror.getId(t), nextId: null, node: n.data.node }],
                  removes: [],
                  texts: [],
                  attributes: [],
                  isAttachIframe: !0,
                },
              }
            );
          }
          case Y.Meta:
          case Y.Load:
          case Y.DomContentLoaded:
            return !1;
          case Y.Plugin:
            return n;
          case Y.Custom:
            return (
              this.replaceIds(n.data.payload, t, ['id', 'parentId', 'previousId', 'nextId']),
              n
            );
          case Y.IncrementalSnapshot:
            switch (n.data.source) {
              case j.Mutation:
                return (
                  n.data.adds.forEach((r) => {
                    (this.replaceIds(r, t, ['parentId', 'nextId', 'previousId']),
                      this.replaceIdOnNode(r.node, t));
                    let o = this.crossOriginIframeRootIdMap.get(t);
                    o && this.patchRootIdOnNode(r.node, o);
                  }),
                  n.data.removes.forEach((r) => {
                    this.replaceIds(r, t, ['parentId', 'id']);
                  }),
                  n.data.attributes.forEach((r) => {
                    this.replaceIds(r, t, ['id']);
                  }),
                  n.data.texts.forEach((r) => {
                    this.replaceIds(r, t, ['id']);
                  }),
                  n
                );
              case j.Drag:
              case j.TouchMove:
              case j.MouseMove:
                return (
                  n.data.positions.forEach((r) => {
                    this.replaceIds(r, t, ['id']);
                  }),
                  n
                );
              case j.ViewportResize:
                return !1;
              case j.MediaInteraction:
              case j.MouseInteraction:
              case j.Scroll:
              case j.CanvasMutation:
              case j.Input:
                return (this.replaceIds(n.data, t, ['id']), n);
              case j.StyleSheetRule:
              case j.StyleDeclaration:
                return (
                  this.replaceIds(n.data, t, ['id']),
                  this.replaceStyleIds(n.data, t, ['styleId']),
                  n
                );
              case j.Font:
                return n;
              case j.Selection:
                return (
                  n.data.ranges.forEach((r) => {
                    this.replaceIds(r, t, ['start', 'end']);
                  }),
                  n
                );
              case j.AdoptedStyleSheet:
                return (
                  this.replaceIds(n.data, t, ['id']),
                  this.replaceStyleIds(n.data, t, ['styleIds']),
                  n.data.styles?.forEach((r) => {
                    this.replaceStyleIds(r, t, ['styleId']);
                  }),
                  n
                );
            }
        }
        return !1;
      }
      replace(t, n, r, o) {
        for (let i of o)
          (!Array.isArray(n[i]) && typeof n[i] != 'number') ||
            (Array.isArray(n[i]) ? (n[i] = t.getIds(r, n[i])) : (n[i] = t.getId(r, n[i])));
        return n;
      }
      replaceIds(t, n, r) {
        return this.replace(this.crossOriginIframeMirror, t, n, r);
      }
      replaceStyleIds(t, n, r) {
        return this.replace(this.crossOriginIframeStyleMirror, t, n, r);
      }
      replaceIdOnNode(t, n) {
        (this.replaceIds(t, n, ['id', 'rootId']),
          'childNodes' in t &&
            t.childNodes.forEach((r) => {
              this.replaceIdOnNode(r, n);
            }));
      }
      patchRootIdOnNode(t, n) {
        (t.type !== Ae.Document && !t.rootId && (t.rootId = n),
          'childNodes' in t &&
            t.childNodes.forEach((r) => {
              this.patchRootIdOnNode(r, n);
            }));
      }
    },
    Tl = class {
      init() {}
      addShadowRoot() {}
      observeAttachShadow() {}
      reset() {}
    },
    Il = class {
      constructor(t) {
        ((this.shadowDoms = new WeakSet()),
          (this.restoreHandlers = []),
          (this.mutationCb = t.mutationCb),
          (this.scrollCb = t.scrollCb),
          (this.bypassOptions = t.bypassOptions),
          (this.mirror = t.mirror),
          this.init());
      }
      init() {
        (this.reset(), this.patchAttachShadow(Element, document));
      }
      addShadowRoot(t, n) {
        if (!oi(t) || this.shadowDoms.has(t)) return;
        (this.shadowDoms.add(t), this.bypassOptions.canvasManager.addShadowRoot(t));
        let r = Th(
          {
            ...this.bypassOptions,
            doc: n,
            mutationCb: this.mutationCb,
            mirror: this.mirror,
            shadowDomManager: this,
          },
          t
        );
        (this.restoreHandlers.push(() => r.disconnect()),
          this.restoreHandlers.push(
            Ih({ ...this.bypassOptions, scrollCb: this.scrollCb, doc: t, mirror: this.mirror })
          ),
          Ia(() => {
            (t.adoptedStyleSheets &&
              t.adoptedStyleSheets.length > 0 &&
              this.bypassOptions.stylesheetManager.adoptStyleSheets(
                t.adoptedStyleSheets,
                this.mirror.getId(t.host)
              ),
              this.restoreHandlers.push(
                vh(
                  { mirror: this.mirror, stylesheetManager: this.bypassOptions.stylesheetManager },
                  t
                )
              ));
          }, 0));
      }
      observeAttachShadow(t) {
        let n = Wl(t),
          r = Fv(t);
        !n || !r || this.patchAttachShadow(r.Element, n);
      }
      patchAttachShadow(t, n) {
        let r = this;
        this.restoreHandlers.push(
          Hl(t.prototype, 'attachShadow', function (o) {
            return function (i) {
              let s = o.call(this, i);
              return (this.shadowRoot && Eh(this) && r.addShadowRoot(this.shadowRoot, n), s);
            };
          })
        );
      }
      reset() {
        (this.restoreHandlers.forEach((t) => {
          try {
            t();
          } catch {}
        }),
          (this.restoreHandlers = []),
          (this.shadowDoms = new WeakSet()),
          this.bypassOptions.canvasManager.resetShadowRoots());
      }
    },
    Ym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    Qv = typeof Uint8Array > 'u' ? [] : new Uint8Array(256);
  for (ti = 0; ti < Ym.length; ti++) Qv[Ym.charCodeAt(ti)] = ti;
  var ti,
    ha = class {
      reset() {}
      freeze() {}
      unfreeze() {}
      lock() {}
      unlock() {}
      snapshot() {}
      addWindow() {}
      addShadowRoot() {}
      resetShadowRoots() {}
    },
    vl = class {
      constructor(t) {
        ((this.trackedLinkElements = new WeakSet()),
          (this.styleMirror = new gl()),
          (this.mutationCb = t.mutationCb),
          (this.adoptedStyleSheetCb = t.adoptedStyleSheetCb));
      }
      attachLinkElement(t, n) {
        ('_cssText' in n.attributes &&
          this.mutationCb({
            adds: [],
            removes: [],
            texts: [],
            attributes: [{ id: n.id, attributes: n.attributes }],
          }),
          this.trackLinkElement(t));
      }
      trackLinkElement(t) {
        this.trackedLinkElements.has(t) ||
          (this.trackedLinkElements.add(t), this.trackStylesheetInLinkElement(t));
      }
      adoptStyleSheets(t, n) {
        if (t.length === 0) return;
        let r = { id: n, styleIds: [] },
          o = [];
        for (let i of t) {
          let s;
          (this.styleMirror.has(i)
            ? (s = this.styleMirror.getId(i))
            : ((s = this.styleMirror.add(i)),
              o.push({
                styleId: s,
                rules: Array.from(i.rules || CSSRule, (a, c) => ({ rule: oh(a), index: c })),
              })),
            r.styleIds.push(s));
        }
        (o.length > 0 && (r.styles = o), this.adoptedStyleSheetCb(r));
      }
      reset() {
        (this.styleMirror.reset(), (this.trackedLinkElements = new WeakSet()));
      }
      trackStylesheetInLinkElement(t) {}
    },
    wl = class {
      constructor() {
        ((this.nodeMap = new WeakMap()), (this.active = !1));
      }
      inOtherBuffer(t, n) {
        let r = this.nodeMap.get(t);
        return r && Array.from(r).some((o) => o !== n);
      }
      add(t, n) {
        (this.active ||
          ((this.active = !0),
          Dv(() => {
            ((this.nodeMap = new WeakMap()), (this.active = !1));
          })),
          this.nodeMap.set(t, (this.nodeMap.get(t) || new Set()).add(n)));
      }
      destroy() {}
    },
    ve,
    ga;
  try {
    if (Array.from([1], (e) => e * 2)[0] !== 2) {
      let e = document.createElement('iframe');
      (document.body.appendChild(e),
        (Array.from = e.contentWindow?.Array.from || Array.from),
        document.body.removeChild(e));
    }
  } catch (e) {
    console.debug('Unable to override Array.from', e);
  }
  var Gt = av();
  function pn(e = {}) {
    let {
      emit: t,
      checkoutEveryNms: n,
      checkoutEveryNth: r,
      blockClass: o = 'rr-block',
      blockSelector: i = null,
      unblockSelector: s = null,
      ignoreClass: a = 'rr-ignore',
      ignoreSelector: c = null,
      maskAllText: u = !1,
      maskTextClass: d = 'rr-mask',
      unmaskTextClass: l = null,
      maskTextSelector: p = null,
      unmaskTextSelector: f = null,
      inlineStylesheet: m = !0,
      maskAllInputs: _,
      maskInputOptions: g,
      slimDOMOptions: S,
      maskAttributeFn: E,
      maskInputFn: P,
      maskTextFn: w,
      maxCanvasSize: F = null,
      packFn: A,
      sampling: T = {},
      dataURLOptions: R = {},
      mousemoveWait: I,
      recordDOM: k = !0,
      recordCanvas: H = !1,
      recordCrossOriginIframes: x = !1,
      recordAfter: L = e.recordAfter === 'DOMContentLoaded' ? e.recordAfter : 'load',
      userTriggeredOnInput: q = !1,
      collectFonts: J = !1,
      inlineImages: ne = !1,
      plugins: C,
      keepIframeSrcFn: z = () => !1,
      ignoreCSSAttributes: N = new Set([]),
      errorHandler: $,
      onMutation: Q,
      getCanvasManager: ae,
    } = e;
    Bv($);
    let we = x ? window.parent === window : !0,
      ye = !1;
    if (!we)
      try {
        window.parent.document && (ye = !1);
      } catch {
        ye = !0;
      }
    if (we && !t) throw new Error('emit function is required');
    if (!we && !ye) return () => {};
    (I !== void 0 && T.mousemove === void 0 && (T.mousemove = I), Gt.reset());
    let mn =
        _ === !0
          ? {
              color: !0,
              date: !0,
              'datetime-local': !0,
              email: !0,
              month: !0,
              number: !0,
              range: !0,
              search: !0,
              tel: !0,
              text: !0,
              time: !0,
              url: !0,
              week: !0,
              textarea: !0,
              select: !0,
              radio: !0,
              checkbox: !0,
            }
          : g !== void 0
            ? g
            : {},
      Mt =
        S === !0 || S === 'all'
          ? {
              script: !0,
              comment: !0,
              headFavicon: !0,
              headWhitespace: !0,
              headMetaSocial: !0,
              headMetaRobots: !0,
              headMetaHttpEquiv: !0,
              headMetaVerification: !0,
              headMetaAuthorship: S === 'all',
              headMetaDescKeywords: S === 'all',
            }
          : S || {};
    Mv();
    let yt,
      ct = 0,
      hn = (ee) => {
        for (let ut of C || []) ut.eventProcessor && (ee = ut.eventProcessor(ee));
        return (A && !ye && (ee = A(ee)), ee);
      };
    ve = (ee, ut) => {
      let te = ee;
      if (
        ((te.timestamp = pa()),
        Yr[0]?.isFrozen() &&
          te.type !== Y.FullSnapshot &&
          !(te.type === Y.IncrementalSnapshot && te.data.source === j.Mutation) &&
          Yr.forEach((Fe) => Fe.unfreeze()),
        we)
      )
        t?.(hn(te), ut);
      else if (ye) {
        let Fe = { type: 'rrweb', event: hn(te), origin: window.location.origin, isCheckout: ut };
        window.parent.postMessage(Fe, '*');
      }
      if (te.type === Y.FullSnapshot) ((yt = te), (ct = 0));
      else if (te.type === Y.IncrementalSnapshot) {
        if (te.data.source === j.Mutation && te.data.isAttachIframe) return;
        ct++;
        let Fe = r && ct >= r,
          ie = n && yt && te.timestamp - yt.timestamp > n;
        (Fe || ie) && zt(!0);
      }
    };
    let gn = (ee) => {
        ve({ type: Y.IncrementalSnapshot, data: { source: j.Mutation, ...ee } });
      },
      no = (ee) => ve({ type: Y.IncrementalSnapshot, data: { source: j.Scroll, ...ee } }),
      Si = (ee) => ve({ type: Y.IncrementalSnapshot, data: { source: j.CanvasMutation, ...ee } }),
      ro = (ee) =>
        ve({ type: Y.IncrementalSnapshot, data: { source: j.AdoptedStyleSheet, ...ee } }),
      ce = new vl({ mutationCb: gn, adoptedStyleSheetCb: ro }),
      Ee =
        typeof __RRWEB_EXCLUDE_IFRAME__ == 'boolean' && __RRWEB_EXCLUDE_IFRAME__
          ? new El()
          : new bl({
              mirror: Gt,
              mutationCb: gn,
              stylesheetManager: ce,
              recordCrossOriginIframes: x,
              wrappedEmit: ve,
            });
    for (let ee of C || [])
      ee.getMirror &&
        ee.getMirror({
          nodeMirror: Gt,
          crossOriginIframeMirror: Ee.crossOriginIframeMirror,
          crossOriginIframeStyleMirror: Ee.crossOriginIframeStyleMirror,
        });
    let Et = new wl(),
      Pe = t0(ae, {
        mirror: Gt,
        win: window,
        mutationCb: (ee) =>
          ve({ type: Y.IncrementalSnapshot, data: { source: j.CanvasMutation, ...ee } }),
        recordCanvas: H,
        blockClass: o,
        blockSelector: i,
        unblockSelector: s,
        maxCanvasSize: F,
        sampling: T.canvas,
        dataURLOptions: R,
        errorHandler: $,
      }),
      He =
        typeof __RRWEB_EXCLUDE_SHADOW_DOM__ == 'boolean' && __RRWEB_EXCLUDE_SHADOW_DOM__
          ? new Tl()
          : new Il({
              mutationCb: gn,
              scrollCb: no,
              bypassOptions: {
                onMutation: Q,
                blockClass: o,
                blockSelector: i,
                unblockSelector: s,
                maskAllText: u,
                maskTextClass: d,
                unmaskTextClass: l,
                maskTextSelector: p,
                unmaskTextSelector: f,
                inlineStylesheet: m,
                maskInputOptions: mn,
                dataURLOptions: R,
                maskAttributeFn: E,
                maskTextFn: w,
                maskInputFn: P,
                recordCanvas: H,
                inlineImages: ne,
                sampling: T,
                slimDOMOptions: Mt,
                iframeManager: Ee,
                stylesheetManager: ce,
                canvasManager: Pe,
                keepIframeSrcFn: z,
                processedNodeManager: Et,
              },
              mirror: Gt,
            }),
      zt = (ee = !1) => {
        if (!k) return;
        (ve({ type: Y.Meta, data: { href: window.location.href, width: mh(), height: ph() } }, ee),
          ce.reset(),
          He.init(),
          Yr.forEach((te) => te.lock()));
        let ut = kv(document, {
          mirror: Gt,
          blockClass: o,
          blockSelector: i,
          unblockSelector: s,
          maskAllText: u,
          maskTextClass: d,
          unmaskTextClass: l,
          maskTextSelector: p,
          unmaskTextSelector: f,
          inlineStylesheet: m,
          maskAllInputs: mn,
          maskAttributeFn: E,
          maskInputFn: P,
          maskTextFn: w,
          slimDOM: Mt,
          dataURLOptions: R,
          recordCanvas: H,
          inlineImages: ne,
          onSerialize: (te) => {
            (_h(te, Gt) && Ee.addIframe(te),
              Sh(te, Gt) && ce.trackLinkElement(te),
              hl(te) && He.addShadowRoot(te.shadowRoot, document));
          },
          onIframeLoad: (te, Fe) => {
            (Ee.attachIframe(te, Fe),
              te.contentWindow && Pe.addWindow(te.contentWindow),
              He.observeAttachShadow(te));
          },
          onStylesheetLoad: (te, Fe) => {
            ce.attachLinkElement(te, Fe);
          },
          onBlockedImageLoad: (te, Fe, { width: ie, height: oo }) => {
            gn({
              adds: [],
              removes: [],
              texts: [],
              attributes: [
                { id: Fe.id, attributes: { style: { width: `${ie}px`, height: `${oo}px` } } },
              ],
            });
          },
          keepIframeSrcFn: z,
        });
        if (!ut) return console.warn('Failed to snapshot the document');
        (ve({ type: Y.FullSnapshot, data: { node: ut, initialOffset: fh(window) } }),
          Yr.forEach((te) => te.unlock()),
          document.adoptedStyleSheets &&
            document.adoptedStyleSheets.length > 0 &&
            ce.adoptStyleSheets(document.adoptedStyleSheets, Gt.getId(document)));
      };
    ga = zt;
    try {
      let ee = [],
        ut = (Fe) =>
          oe(Zv)(
            {
              onMutation: Q,
              mutationCb: gn,
              mousemoveCb: (ie, oo) =>
                ve({ type: Y.IncrementalSnapshot, data: { source: oo, positions: ie } }),
              mouseInteractionCb: (ie) =>
                ve({ type: Y.IncrementalSnapshot, data: { source: j.MouseInteraction, ...ie } }),
              scrollCb: no,
              viewportResizeCb: (ie) =>
                ve({ type: Y.IncrementalSnapshot, data: { source: j.ViewportResize, ...ie } }),
              inputCb: (ie) =>
                ve({ type: Y.IncrementalSnapshot, data: { source: j.Input, ...ie } }),
              mediaInteractionCb: (ie) =>
                ve({ type: Y.IncrementalSnapshot, data: { source: j.MediaInteraction, ...ie } }),
              styleSheetRuleCb: (ie) =>
                ve({ type: Y.IncrementalSnapshot, data: { source: j.StyleSheetRule, ...ie } }),
              styleDeclarationCb: (ie) =>
                ve({ type: Y.IncrementalSnapshot, data: { source: j.StyleDeclaration, ...ie } }),
              canvasMutationCb: Si,
              fontCb: (ie) => ve({ type: Y.IncrementalSnapshot, data: { source: j.Font, ...ie } }),
              selectionCb: (ie) => {
                ve({ type: Y.IncrementalSnapshot, data: { source: j.Selection, ...ie } });
              },
              customElementCb: (ie) => {
                ve({ type: Y.IncrementalSnapshot, data: { source: j.CustomElement, ...ie } });
              },
              blockClass: o,
              ignoreClass: a,
              ignoreSelector: c,
              maskAllText: u,
              maskTextClass: d,
              unmaskTextClass: l,
              maskTextSelector: p,
              unmaskTextSelector: f,
              maskInputOptions: mn,
              inlineStylesheet: m,
              sampling: T,
              recordDOM: k,
              recordCanvas: H,
              inlineImages: ne,
              userTriggeredOnInput: q,
              collectFonts: J,
              doc: Fe,
              maskAttributeFn: E,
              maskInputFn: P,
              maskTextFn: w,
              keepIframeSrcFn: z,
              blockSelector: i,
              unblockSelector: s,
              slimDOMOptions: Mt,
              dataURLOptions: R,
              mirror: Gt,
              iframeManager: Ee,
              stylesheetManager: ce,
              shadowDomManager: He,
              processedNodeManager: Et,
              canvasManager: Pe,
              ignoreCSSAttributes: N,
              plugins:
                C?.filter((ie) => ie.observer)?.map((ie) => ({
                  observer: ie.observer,
                  options: ie.options,
                  callback: (oo) => ve({ type: Y.Plugin, data: { plugin: ie.name, payload: oo } }),
                })) || [],
            },
            {}
          );
      Ee.addLoadListener((Fe) => {
        try {
          ee.push(ut(Fe.contentDocument));
        } catch (ie) {
          console.warn(ie);
        }
      });
      let te = () => {
        (zt(), ee.push(ut(document)));
      };
      return (
        document.readyState === 'interactive' || document.readyState === 'complete'
          ? te()
          : (ee.push(
              tt('DOMContentLoaded', () => {
                (ve({ type: Y.DomContentLoaded, data: {} }), L === 'DOMContentLoaded' && te());
              })
            ),
            ee.push(
              tt(
                'load',
                () => {
                  (ve({ type: Y.Load, data: {} }), L === 'load' && te());
                },
                window
              )
            )),
        () => {
          (ee.forEach((Fe) => Fe()), Et.destroy(), (ga = void 0), Hv());
        }
      );
    } catch (ee) {
      console.warn(ee);
    }
  }
  function e0(e) {
    if (!ga) throw new Error('please take full snapshot after start recording');
    ga(e);
  }
  pn.mirror = Gt;
  pn.takeFullSnapshot = e0;
  function t0(e, t) {
    try {
      return e ? e(t) : new ha();
    } catch {
      return (console.warn('Unable to initialize CanvasManager'), new ha());
    }
  }
  var Jm;
  (function (e) {
    ((e[(e.NotStarted = 0)] = 'NotStarted'),
      (e[(e.Running = 1)] = 'Running'),
      (e[(e.Stopped = 2)] = 'Stopped'));
  })(Jm || (Jm = {}));
  var n0 = 3,
    r0 = 5;
  function Gl(e) {
    return e > 9999999999 ? e : e * 1e3;
  }
  function cl(e) {
    return e > 9999999999 ? e / 1e3 : e;
  }
  function mi(e, t) {
    t.category !== 'sentry.transaction' &&
      (['ui.click', 'ui.input'].includes(t.category)
        ? e.triggerUserActivity()
        : e.checkAndHandleExpiredSession(),
      e.addUpdate(
        () => (
          e.throttledAddEvent({
            type: Y.Custom,
            timestamp: (t.timestamp || 0) * 1e3,
            data: { tag: 'breadcrumb', payload: Me(t, 10, 1e3) },
          }),
          t.category === 'console'
        )
      ));
  }
  var o0 = 'button,a';
  function wh(e) {
    return e.closest(o0) || e;
  }
  function Rh(e) {
    let t = xh(e);
    return !t || !(t instanceof Element) ? t : wh(t);
  }
  function xh(e) {
    return i0(e) ? e.target : e;
  }
  function i0(e) {
    return typeof e == 'object' && !!e && 'target' in e;
  }
  var Mn;
  function s0(e) {
    return (
      Mn || ((Mn = []), a0()),
      Mn.push(e),
      () => {
        let t = Mn ? Mn.indexOf(e) : -1;
        t > -1 && Mn.splice(t, 1);
      }
    );
  }
  function a0() {
    be(me, 'open', function (e) {
      return function (...t) {
        if (Mn)
          try {
            Mn.forEach((n) => n());
          } catch {}
        return e.apply(me, t);
      };
    });
  }
  var c0 = new Set([
    j.Mutation,
    j.StyleSheetRule,
    j.StyleDeclaration,
    j.AdoptedStyleSheet,
    j.CanvasMutation,
    j.Selection,
    j.MediaInteraction,
  ]);
  function u0(e, t, n) {
    e.handleClick(t, n);
  }
  var Rl = class {
      constructor(t, n, r = mi) {
        ((this._lastMutation = 0),
          (this._lastScroll = 0),
          (this._clicks = []),
          (this._timeout = n.timeout / 1e3),
          (this._threshold = n.threshold / 1e3),
          (this._scrollTimeout = n.scrollTimeout / 1e3),
          (this._replay = t),
          (this._ignoreSelector = n.ignoreSelector),
          (this._addBreadcrumbEvent = r));
      }
      addListeners() {
        let t = s0(() => {
          this._lastMutation = Km();
        });
        this._teardown = () => {
          (t(), (this._clicks = []), (this._lastMutation = 0), (this._lastScroll = 0));
        };
      }
      removeListeners() {
        (this._teardown && this._teardown(),
          this._checkClickTimeout && clearTimeout(this._checkClickTimeout));
      }
      handleClick(t, n) {
        if (d0(n, this._ignoreSelector) || !f0(t)) return;
        let r = { timestamp: cl(t.timestamp), clickBreadcrumb: t, clickCount: 0, node: n };
        this._clicks.some((o) => o.node === r.node && Math.abs(o.timestamp - r.timestamp) < 1) ||
          (this._clicks.push(r), this._clicks.length === 1 && this._scheduleCheckClicks());
      }
      registerMutation(t = Date.now()) {
        this._lastMutation = cl(t);
      }
      registerScroll(t = Date.now()) {
        this._lastScroll = cl(t);
      }
      registerClick(t) {
        let n = wh(t);
        this._handleMultiClick(n);
      }
      _handleMultiClick(t) {
        this._getClicks(t).forEach((n) => {
          n.clickCount++;
        });
      }
      _getClicks(t) {
        return this._clicks.filter((n) => n.node === t);
      }
      _checkClicks() {
        let t = [],
          n = Km();
        this._clicks.forEach((r) => {
          (!r.mutationAfter &&
            this._lastMutation &&
            (r.mutationAfter =
              r.timestamp <= this._lastMutation ? this._lastMutation - r.timestamp : void 0),
            !r.scrollAfter &&
              this._lastScroll &&
              (r.scrollAfter =
                r.timestamp <= this._lastScroll ? this._lastScroll - r.timestamp : void 0),
            r.timestamp + this._timeout <= n && t.push(r));
        });
        for (let r of t) {
          let o = this._clicks.indexOf(r);
          o > -1 && (this._generateBreadcrumbs(r), this._clicks.splice(o, 1));
        }
        this._clicks.length && this._scheduleCheckClicks();
      }
      _generateBreadcrumbs(t) {
        let n = this._replay,
          r = t.scrollAfter && t.scrollAfter <= this._scrollTimeout,
          o = t.mutationAfter && t.mutationAfter <= this._threshold,
          i = !r && !o,
          { clickCount: s, clickBreadcrumb: a } = t;
        if (i) {
          let c = Math.min(t.mutationAfter || this._timeout, this._timeout) * 1e3,
            u = c < this._timeout * 1e3 ? 'mutation' : 'timeout',
            d = {
              type: 'default',
              message: a.message,
              timestamp: a.timestamp,
              category: 'ui.slowClickDetected',
              data: {
                ...a.data,
                url: me.location.href,
                route: n.getCurrentRoute(),
                timeAfterClickMs: c,
                endReason: u,
                clickCount: s || 1,
              },
            };
          this._addBreadcrumbEvent(n, d);
          return;
        }
        if (s > 1) {
          let c = {
            type: 'default',
            message: a.message,
            timestamp: a.timestamp,
            category: 'ui.multiClick',
            data: {
              ...a.data,
              url: me.location.href,
              route: n.getCurrentRoute(),
              clickCount: s,
              metric: !0,
            },
          };
          this._addBreadcrumbEvent(n, c);
        }
      }
      _scheduleCheckClicks() {
        (this._checkClickTimeout && clearTimeout(this._checkClickTimeout),
          (this._checkClickTimeout = Qn(() => this._checkClicks(), 1e3)));
      }
    },
    l0 = ['A', 'BUTTON', 'INPUT'];
  function d0(e, t) {
    return !!(
      !l0.includes(e.tagName) ||
      (e.tagName === 'INPUT' && !['submit', 'button'].includes(e.getAttribute('type') || '')) ||
      (e.tagName === 'A' &&
        (e.hasAttribute('download') ||
          (e.hasAttribute('target') && e.getAttribute('target') !== '_self'))) ||
      (t && e.matches(t))
    );
  }
  function f0(e) {
    return !!(e.data && typeof e.data.nodeId == 'number' && e.timestamp);
  }
  function Km() {
    return Date.now() / 1e3;
  }
  function p0(e, t) {
    try {
      if (!m0(t)) return;
      let { source: n } = t.data;
      if (
        (c0.has(n) && e.registerMutation(t.timestamp),
        n === j.Scroll && e.registerScroll(t.timestamp),
        h0(t))
      ) {
        let { type: r, id: o } = t.data,
          i = pn.mirror.getNode(o);
        i instanceof HTMLElement && r === et.Click && e.registerClick(i);
      }
    } catch {}
  }
  function m0(e) {
    return e.type === n0;
  }
  function h0(e) {
    return e.data.source === j.MouseInteraction;
  }
  function Zt(e) {
    return { timestamp: Date.now() / 1e3, type: 'default', ...e };
  }
  var zl = ((e) => (
      (e[(e.Document = 0)] = 'Document'),
      (e[(e.DocumentType = 1)] = 'DocumentType'),
      (e[(e.Element = 2)] = 'Element'),
      (e[(e.Text = 3)] = 'Text'),
      (e[(e.CDATA = 4)] = 'CDATA'),
      (e[(e.Comment = 5)] = 'Comment'),
      e
    ))(zl || {}),
    g0 = new Set([
      'id',
      'class',
      'aria-label',
      'role',
      'name',
      'alt',
      'title',
      'data-test-id',
      'data-testid',
      'disabled',
      'aria-disabled',
      'data-sentry-component',
    ]);
  function _0(e) {
    let t = {};
    !e['data-sentry-component'] &&
      e['data-sentry-element'] &&
      (e['data-sentry-component'] = e['data-sentry-element']);
    for (let n in e)
      if (g0.has(n)) {
        let r = n;
        ((n === 'data-testid' || n === 'data-test-id') && (r = 'testId'), (t[r] = e[n]));
      }
    return t;
  }
  var S0 = (e) => (t) => {
    if (!e.isEnabled()) return;
    let n = y0(t);
    if (!n) return;
    let r = t.name === 'click',
      o = r ? t.event : void 0;
    (r &&
      e.clickDetector &&
      o?.target &&
      !o.altKey &&
      !o.metaKey &&
      !o.ctrlKey &&
      !o.shiftKey &&
      u0(e.clickDetector, n, Rh(t.event)),
      mi(e, n));
  };
  function Ch(e, t) {
    let n = pn.mirror.getId(e),
      r = n && pn.mirror.getNode(n),
      o = r && pn.mirror.getMeta(r),
      i = o && b0(o) ? o : null;
    return {
      message: t,
      data: i
        ? {
            nodeId: n,
            node: {
              id: n,
              tagName: i.tagName,
              textContent: Array.from(i.childNodes)
                .map((s) => s.type === zl.Text && s.textContent)
                .filter(Boolean)
                .map((s) => s.trim())
                .join(''),
              attributes: _0(i.attributes),
            },
          }
        : {},
    };
  }
  function y0(e) {
    let { target: t, message: n } = E0(e);
    return Zt({ category: `ui.${e.name}`, ...Ch(t, n) });
  }
  function E0(e) {
    let t = e.name === 'click',
      n,
      r = null;
    try {
      ((r = t ? Rh(e.event) : xh(e.event)), (n = Ce(r, { maxStringLength: 200 }) || '<unknown>'));
    } catch {
      n = '<unknown>';
    }
    return { target: r, message: n };
  }
  function b0(e) {
    return e.type === zl.Element;
  }
  function T0(e, t) {
    if (!e.isEnabled()) return;
    e.updateUserActivity();
    let n = I0(t);
    n && mi(e, n);
  }
  function I0(e) {
    let { metaKey: t, shiftKey: n, ctrlKey: r, altKey: o, key: i, target: s } = e;
    if (!s || v0(s) || !i) return null;
    let a = t || r || o,
      c = i.length === 1;
    if (!a && c) return null;
    let u = Ce(s, { maxStringLength: 200 }) || '<unknown>',
      d = Ch(s, u);
    return Zt({
      category: 'ui.keyDown',
      message: u,
      data: { ...d.data, metaKey: t, shiftKey: n, ctrlKey: r, altKey: o, key: i },
    });
  }
  function v0(e) {
    return e.tagName === 'INPUT' || e.tagName === 'TEXTAREA' || e.isContentEditable;
  }
  var w0 = { resource: k0, paint: C0, navigation: A0 };
  function ul(e, t) {
    return ({ metric: n }) => void t.replayPerformanceEntries.push(e(n));
  }
  function R0(e) {
    return e.map(x0).filter(Boolean);
  }
  function x0(e) {
    let t = w0[e.entryType];
    return t ? t(e) : null;
  }
  function Xr(e) {
    return ((_e() || me.performance.timeOrigin) + e) / 1e3;
  }
  function C0(e) {
    let { duration: t, entryType: n, name: r, startTime: o } = e,
      i = Xr(o);
    return { type: n, name: r, start: i, end: i + t, data: void 0 };
  }
  function A0(e) {
    let {
      entryType: t,
      name: n,
      decodedBodySize: r,
      duration: o,
      domComplete: i,
      encodedBodySize: s,
      domContentLoadedEventStart: a,
      domContentLoadedEventEnd: c,
      domInteractive: u,
      loadEventStart: d,
      loadEventEnd: l,
      redirectCount: p,
      startTime: f,
      transferSize: m,
      type: _,
    } = e;
    return o === 0
      ? null
      : {
          type: `${t}.${_}`,
          start: Xr(f),
          end: Xr(i),
          name: n,
          data: {
            size: m,
            decodedBodySize: r,
            encodedBodySize: s,
            duration: o,
            domInteractive: u,
            domContentLoadedEventStart: a,
            domContentLoadedEventEnd: c,
            loadEventStart: d,
            loadEventEnd: l,
            domComplete: i,
            redirectCount: p,
          },
        };
  }
  function k0(e) {
    let {
      entryType: t,
      initiatorType: n,
      name: r,
      responseEnd: o,
      startTime: i,
      decodedBodySize: s,
      encodedBodySize: a,
      responseStatus: c,
      transferSize: u,
    } = e;
    return ['fetch', 'xmlhttprequest'].includes(n)
      ? null
      : {
          type: `${t}.${n}`,
          start: Xr(i),
          end: Xr(o),
          name: r,
          data: { size: u, statusCode: c, decodedBodySize: s, encodedBodySize: a },
        };
  }
  function N0(e) {
    let t = e.entries[e.entries.length - 1],
      n = t?.element ? [t.element] : void 0;
    return jl(e, 'largest-contentful-paint', n);
  }
  function M0(e) {
    return e.sources !== void 0;
  }
  function O0(e) {
    let t = [],
      n = [];
    for (let r of e.entries)
      if (M0(r)) {
        let o = [];
        for (let i of r.sources)
          if (i.node) {
            n.push(i.node);
            let s = pn.mirror.getId(i.node);
            s && o.push(s);
          }
        t.push({ value: r.value, nodeIds: o.length ? o : void 0 });
      }
    return jl(e, 'cumulative-layout-shift', n, t);
  }
  function L0(e) {
    let t = e.entries[e.entries.length - 1],
      n = t?.target ? [t.target] : void 0;
    return jl(e, 'interaction-to-next-paint', n);
  }
  function jl(e, t, n, r) {
    let o = e.value,
      i = e.rating,
      s = Xr(o);
    return {
      type: 'web-vital',
      name: t,
      start: s,
      end: s,
      data: {
        value: o,
        size: o,
        rating: i,
        nodeIds: n ? n.map((a) => pn.mirror.getId(a)) : void 0,
        attributions: r,
      },
    };
  }
  function D0(e) {
    function t(o) {
      e.performanceEntries.includes(o) || e.performanceEntries.push(o);
    }
    function n({ entries: o }) {
      o.forEach(t);
    }
    let r = [];
    return (
      ['navigation', 'paint', 'resource'].forEach((o) => {
        r.push(_t(o, n));
      }),
      r.push(Zn(ul(N0, e)), Xn(ul(O0, e)), Xo(ul(L0, e))),
      () => {
        r.forEach((o) => o());
      }
    );
  }
  var W = typeof __SENTRY_DEBUG__ > 'u' || __SENTRY_DEBUG__,
    P0 =
      'var t=Uint8Array,n=Uint16Array,r=Int32Array,e=new t([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),i=new t([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),s=new t([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),a=function(t,e){for(var i=new n(31),s=0;s<31;++s)i[s]=e+=1<<t[s-1];var a=new r(i[30]);for(s=1;s<30;++s)for(var o=i[s];o<i[s+1];++o)a[o]=o-i[s]<<5|s;return{b:i,r:a}},o=a(e,2),h=o.b,f=o.r;h[28]=258,f[258]=28;for(var l=a(i,0).r,u=new n(32768),c=0;c<32768;++c){var v=(43690&c)>>1|(21845&c)<<1;v=(61680&(v=(52428&v)>>2|(13107&v)<<2))>>4|(3855&v)<<4,u[c]=((65280&v)>>8|(255&v)<<8)>>1}var d=function(t,r,e){for(var i=t.length,s=0,a=new n(r);s<i;++s)t[s]&&++a[t[s]-1];var o,h=new n(r);for(s=1;s<r;++s)h[s]=h[s-1]+a[s-1]<<1;if(e){o=new n(1<<r);var f=15-r;for(s=0;s<i;++s)if(t[s])for(var l=s<<4|t[s],c=r-t[s],v=h[t[s]-1]++<<c,d=v|(1<<c)-1;v<=d;++v)o[u[v]>>f]=l}else for(o=new n(i),s=0;s<i;++s)t[s]&&(o[s]=u[h[t[s]-1]++]>>15-t[s]);return o},p=new t(288);for(c=0;c<144;++c)p[c]=8;for(c=144;c<256;++c)p[c]=9;for(c=256;c<280;++c)p[c]=7;for(c=280;c<288;++c)p[c]=8;var g=new t(32);for(c=0;c<32;++c)g[c]=5;var w=d(p,9,0),y=d(g,5,0),m=function(t){return(t+7)/8|0},b=function(n,r,e){return(null==e||e>n.length)&&(e=n.length),new t(n.subarray(r,e))},M=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],E=function(t,n,r){var e=new Error(n||M[t]);if(e.code=t,Error.captureStackTrace&&Error.captureStackTrace(e,E),!r)throw e;return e},z=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8},_=function(t,n,r){r<<=7&n;var e=n/8|0;t[e]|=r,t[e+1]|=r>>8,t[e+2]|=r>>16},x=function(r,e){for(var i=[],s=0;s<r.length;++s)r[s]&&i.push({s:s,f:r[s]});var a=i.length,o=i.slice();if(!a)return{t:F,l:0};if(1==a){var h=new t(i[0].s+1);return h[i[0].s]=1,{t:h,l:1}}i.sort(function(t,n){return t.f-n.f}),i.push({s:-1,f:25001});var f=i[0],l=i[1],u=0,c=1,v=2;for(i[0]={s:-1,f:f.f+l.f,l:f,r:l};c!=a-1;)f=i[i[u].f<i[v].f?u++:v++],l=i[u!=c&&i[u].f<i[v].f?u++:v++],i[c++]={s:-1,f:f.f+l.f,l:f,r:l};var d=o[0].s;for(s=1;s<a;++s)o[s].s>d&&(d=o[s].s);var p=new n(d+1),g=A(i[c-1],p,0);if(g>e){s=0;var w=0,y=g-e,m=1<<y;for(o.sort(function(t,n){return p[n.s]-p[t.s]||t.f-n.f});s<a;++s){var b=o[s].s;if(!(p[b]>e))break;w+=m-(1<<g-p[b]),p[b]=e}for(w>>=y;w>0;){var M=o[s].s;p[M]<e?w-=1<<e-p[M]++-1:++s}for(;s>=0&&w;--s){var E=o[s].s;p[E]==e&&(--p[E],++w)}g=e}return{t:new t(p),l:g}},A=function(t,n,r){return-1==t.s?Math.max(A(t.l,n,r+1),A(t.r,n,r+1)):n[t.s]=r},D=function(t){for(var r=t.length;r&&!t[--r];);for(var e=new n(++r),i=0,s=t[0],a=1,o=function(t){e[i++]=t},h=1;h<=r;++h)if(t[h]==s&&h!=r)++a;else{if(!s&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(s),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(s);a=1,s=t[h]}return{c:e.subarray(0,i),n:r}},T=function(t,n){for(var r=0,e=0;e<n.length;++e)r+=t[e]*n[e];return r},k=function(t,n,r){var e=r.length,i=m(n+2);t[i]=255&e,t[i+1]=e>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var s=0;s<e;++s)t[i+s+4]=r[s];return 8*(i+4+e)},U=function(t,r,a,o,h,f,l,u,c,v,m){z(r,m++,a),++h[256];for(var b=x(h,15),M=b.t,E=b.l,A=x(f,15),U=A.t,C=A.l,F=D(M),I=F.c,S=F.n,L=D(U),O=L.c,j=L.n,q=new n(19),B=0;B<I.length;++B)++q[31&I[B]];for(B=0;B<O.length;++B)++q[31&O[B]];for(var G=x(q,7),H=G.t,J=G.l,K=19;K>4&&!H[s[K-1]];--K);var N,P,Q,R,V=v+5<<3,W=T(h,p)+T(f,g)+l,X=T(h,M)+T(f,U)+l+14+3*K+T(q,H)+2*q[16]+3*q[17]+7*q[18];if(c>=0&&V<=W&&V<=X)return k(r,m,t.subarray(c,c+v));if(z(r,m,1+(X<W)),m+=2,X<W){N=d(M,E,0),P=M,Q=d(U,C,0),R=U;var Y=d(H,J,0);z(r,m,S-257),z(r,m+5,j-1),z(r,m+10,K-4),m+=14;for(B=0;B<K;++B)z(r,m+3*B,H[s[B]]);m+=3*K;for(var Z=[I,O],$=0;$<2;++$){var tt=Z[$];for(B=0;B<tt.length;++B){var nt=31&tt[B];z(r,m,Y[nt]),m+=H[nt],nt>15&&(z(r,m,tt[B]>>5&127),m+=tt[B]>>12)}}}else N=w,P=p,Q=y,R=g;for(B=0;B<u;++B){var rt=o[B];if(rt>255){_(r,m,N[(nt=rt>>18&31)+257]),m+=P[nt+257],nt>7&&(z(r,m,rt>>23&31),m+=e[nt]);var et=31&rt;_(r,m,Q[et]),m+=R[et],et>3&&(_(r,m,rt>>5&8191),m+=i[et])}else _(r,m,N[rt]),m+=P[rt]}return _(r,m,N[256]),m+P[256]},C=new r([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),F=new t(0),I=function(){for(var t=new Int32Array(256),n=0;n<256;++n){for(var r=n,e=9;--e;)r=(1&r&&-306674912)^r>>>1;t[n]=r}return t}(),S=function(){var t=1,n=0;return{p:function(r){for(var e=t,i=n,s=0|r.length,a=0;a!=s;){for(var o=Math.min(a+2655,s);a<o;++a)i+=e+=r[a];e=(65535&e)+15*(e>>16),i=(65535&i)+15*(i>>16)}t=e,n=i},d:function(){return(255&(t%=65521))<<24|(65280&t)<<8|(255&(n%=65521))<<8|n>>8}}},L=function(s,a,o,h,u){if(!u&&(u={l:1},a.dictionary)){var c=a.dictionary.subarray(-32768),v=new t(c.length+s.length);v.set(c),v.set(s,c.length),s=v,u.w=c.length}return function(s,a,o,h,u,c){var v=c.z||s.length,d=new t(h+v+5*(1+Math.ceil(v/7e3))+u),p=d.subarray(h,d.length-u),g=c.l,w=7&(c.r||0);if(a){w&&(p[0]=c.r>>3);for(var y=C[a-1],M=y>>13,E=8191&y,z=(1<<o)-1,_=c.p||new n(32768),x=c.h||new n(z+1),A=Math.ceil(o/3),D=2*A,T=function(t){return(s[t]^s[t+1]<<A^s[t+2]<<D)&z},F=new r(25e3),I=new n(288),S=new n(32),L=0,O=0,j=c.i||0,q=0,B=c.w||0,G=0;j+2<v;++j){var H=T(j),J=32767&j,K=x[H];if(_[J]=K,x[H]=J,B<=j){var N=v-j;if((L>7e3||q>24576)&&(N>423||!g)){w=U(s,p,0,F,I,S,O,q,G,j-G,w),q=L=O=0,G=j;for(var P=0;P<286;++P)I[P]=0;for(P=0;P<30;++P)S[P]=0}var Q=2,R=0,V=E,W=J-K&32767;if(N>2&&H==T(j-W))for(var X=Math.min(M,N)-1,Y=Math.min(32767,j),Z=Math.min(258,N);W<=Y&&--V&&J!=K;){if(s[j+Q]==s[j+Q-W]){for(var $=0;$<Z&&s[j+$]==s[j+$-W];++$);if($>Q){if(Q=$,R=W,$>X)break;var tt=Math.min(W,$-2),nt=0;for(P=0;P<tt;++P){var rt=j-W+P&32767,et=rt-_[rt]&32767;et>nt&&(nt=et,K=rt)}}}W+=(J=K)-(K=_[J])&32767}if(R){F[q++]=268435456|f[Q]<<18|l[R];var it=31&f[Q],st=31&l[R];O+=e[it]+i[st],++I[257+it],++S[st],B=j+Q,++L}else F[q++]=s[j],++I[s[j]]}}for(j=Math.max(j,B);j<v;++j)F[q++]=s[j],++I[s[j]];w=U(s,p,g,F,I,S,O,q,G,j-G,w),g||(c.r=7&w|p[w/8|0]<<3,w-=7,c.h=x,c.p=_,c.i=j,c.w=B)}else{for(j=c.w||0;j<v+g;j+=65535){var at=j+65535;at>=v&&(p[w/8|0]=g,at=v),w=k(p,w+1,s.subarray(j,at))}c.i=v}return b(d,0,h+m(w)+u)}(s,null==a.level?6:a.level,null==a.mem?u.l?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(s.length)))):20:12+a.mem,o,h,u)},O=function(t,n,r){for(;r;++n)t[n]=r,r>>>=8},j=function(){function n(n,r){if("function"==typeof n&&(r=n,n={}),this.ondata=r,this.o=n||{},this.s={l:0,i:32768,w:32768,z:32768},this.b=new t(98304),this.o.dictionary){var e=this.o.dictionary.subarray(-32768);this.b.set(e,32768-e.length),this.s.i=32768-e.length}}return n.prototype.p=function(t,n){this.ondata(L(t,this.o,0,0,this.s),n)},n.prototype.push=function(n,r){this.ondata||E(5),this.s.l&&E(4);var e=n.length+this.s.z;if(e>this.b.length){if(e>2*this.b.length-32768){var i=new t(-32768&e);i.set(this.b.subarray(0,this.s.z)),this.b=i}var s=this.b.length-this.s.z;this.b.set(n.subarray(0,s),this.s.z),this.s.z=this.b.length,this.p(this.b,!1),this.b.set(this.b.subarray(-32768)),this.b.set(n.subarray(s),32768),this.s.z=n.length-s+32768,this.s.i=32766,this.s.w=32768}else this.b.set(n,this.s.z),this.s.z+=n.length;this.s.l=1&r,(this.s.z>this.s.w+8191||r)&&(this.p(this.b,r||!1),this.s.w=this.s.i,this.s.i-=2)},n.prototype.flush=function(){this.ondata||E(5),this.s.l&&E(4),this.p(this.b,!1),this.s.w=this.s.i,this.s.i-=2},n}();function q(t,n){n||(n={});var r=function(){var t=-1;return{p:function(n){for(var r=t,e=0;e<n.length;++e)r=I[255&r^n[e]]^r>>>8;t=r},d:function(){return~t}}}(),e=t.length;r.p(t);var i,s=L(t,n,10+((i=n).filename?i.filename.length+1:0),8),a=s.length;return function(t,n){var r=n.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=n.level<2?4:9==n.level?2:0,t[9]=3,0!=n.mtime&&O(t,4,Math.floor(new Date(n.mtime||Date.now())/1e3)),r){t[3]=8;for(var e=0;e<=r.length;++e)t[e+10]=r.charCodeAt(e)}}(s,n),O(s,a-8,r.d()),O(s,a-4,e),s}var B=function(){function t(t,n){this.c=S(),this.v=1,j.call(this,t,n)}return t.prototype.push=function(t,n){this.c.p(t),j.prototype.push.call(this,t,n)},t.prototype.p=function(t,n){var r=L(t,this.o,this.v&&(this.o.dictionary?6:2),n&&4,this.s);this.v&&(function(t,n){var r=n.level,e=0==r?0:r<6?1:9==r?3:2;if(t[0]=120,t[1]=e<<6|(n.dictionary&&32),t[1]|=31-(t[0]<<8|t[1])%31,n.dictionary){var i=S();i.p(n.dictionary),O(t,2,i.d())}}(r,this.o),this.v=0),n&&O(r,r.length-4,this.c.d()),this.ondata(r,n)},t.prototype.flush=function(){j.prototype.flush.call(this)},t}(),G="undefined"!=typeof TextEncoder&&new TextEncoder,H="undefined"!=typeof TextDecoder&&new TextDecoder;try{H.decode(F,{stream:!0})}catch(t){}var J=function(){function t(t){this.ondata=t}return t.prototype.push=function(t,n){this.ondata||E(5),this.d&&E(4),this.ondata(K(t),this.d=n||!1)},t}();function K(n,r){if(G)return G.encode(n);for(var e=n.length,i=new t(n.length+(n.length>>1)),s=0,a=function(t){i[s++]=t},o=0;o<e;++o){if(s+5>i.length){var h=new t(s+8+(e-o<<1));h.set(i),i=h}var f=n.charCodeAt(o);f<128||r?a(f):f<2048?(a(192|f>>6),a(128|63&f)):f>55295&&f<57344?(a(240|(f=65536+(1047552&f)|1023&n.charCodeAt(++o))>>18),a(128|f>>12&63),a(128|f>>6&63),a(128|63&f)):(a(224|f>>12),a(128|f>>6&63),a(128|63&f))}return b(i,0,s)}const N=new class{constructor(){this._init()}clear(){this._init()}addEvent(t){if(!t)throw new Error("Adding invalid event");const n=this._hasEvents?",":"";this.stream.push(n+t),this._hasEvents=!0}finish(){this.stream.push("]",!0);const t=function(t){let n=0;for(const r of t)n+=r.length;const r=new Uint8Array(n);for(let n=0,e=0,i=t.length;n<i;n++){const i=t[n];r.set(i,e),e+=i.length}return r}(this._deflatedData);return this._init(),t}_init(){this._hasEvents=!1,this._deflatedData=[],this.deflate=new B,this.deflate.ondata=(t,n)=>{this._deflatedData.push(t)},this.stream=new J((t,n)=>{this.deflate.push(t,n)}),this.stream.push("[")}},P={clear:()=>{N.clear()},addEvent:t=>N.addEvent(t),finish:()=>N.finish(),compress:t=>function(t){return q(K(t))}(t)};addEventListener("message",function(t){const n=t.data.method,r=t.data.id,e=t.data.arg;if(n in P&&"function"==typeof P[n])try{const t=P[n](e);postMessage({id:r,method:n,success:!0,response:t})}catch(t){postMessage({id:r,method:n,success:!1,response:t.message}),console.error(t)}}),postMessage({id:void 0,method:"init",success:!0,response:void 0});';
  function F0() {
    let e = new Blob([P0]);
    return URL.createObjectURL(e);
  }
  var Xm = ['log', 'warn', 'error'],
    ca = '[Replay] ';
  function ll(e, t = 'info') {
    Ze(
      { category: 'console', data: { logger: 'replay' }, level: t, message: `${ca}${e}` },
      { level: t }
    );
  }
  function U0() {
    let e = !1,
      t = !1,
      n = {
        exception: () => {},
        infoTick: () => {},
        setConfig: (r) => {
          ((e = !!r.captureExceptions), (t = !!r.traceInternals));
        },
      };
    return (
      W
        ? (Xm.forEach((r) => {
            n[r] = (...o) => {
              (h[r](ca, ...o), t && ll(o.join(''), jn(r)));
            };
          }),
          (n.exception = (r, ...o) => {
            (o.length && n.error && n.error(...o),
              h.error(ca, r),
              e
                ? ht(r, { mechanism: { handled: !0, type: 'auto.function.replay.debug' } })
                : t && ll(r, 'error'));
          }),
          (n.infoTick = (...r) => {
            (h.log(ca, ...r), t && setTimeout(() => ll(r[0]), 0));
          }))
        : Xm.forEach((r) => {
            n[r] = () => {};
          }),
      n
    );
  }
  var G = U0(),
    li = class extends Error {
      constructor() {
        super(`Event buffer exceeded maximum size of ${Fl}.`);
      }
    },
    _a = class {
      constructor() {
        ((this.events = []),
          (this._totalSize = 0),
          (this.hasCheckout = !1),
          (this.waitForCheckout = !1));
      }
      get hasEvents() {
        return this.events.length > 0;
      }
      get type() {
        return 'sync';
      }
      destroy() {
        this.events = [];
      }
      async addEvent(t) {
        let n = JSON.stringify(t).length;
        if (((this._totalSize += n), this._totalSize > Fl)) throw new li();
        this.events.push(t);
      }
      finish() {
        return new Promise((t) => {
          let n = this.events;
          (this.clear(), t(JSON.stringify(n)));
        });
      }
      clear() {
        ((this.events = []), (this._totalSize = 0), (this.hasCheckout = !1));
      }
      getEarliestTimestamp() {
        let t = this.events.map((n) => n.timestamp).sort()[0];
        return t ? Gl(t) : null;
      }
    },
    xl = class {
      constructor(t) {
        ((this._worker = t), (this._id = 0));
      }
      ensureReady() {
        return this._ensureReadyPromise
          ? this._ensureReadyPromise
          : ((this._ensureReadyPromise = new Promise((t, n) => {
              (this._worker.addEventListener(
                'message',
                ({ data: r }) => {
                  r.success ? t() : n();
                },
                { once: !0 }
              ),
                this._worker.addEventListener(
                  'error',
                  (r) => {
                    n(r);
                  },
                  { once: !0 }
                ));
            })),
            this._ensureReadyPromise);
      }
      destroy() {
        (W && G.log('Destroying compression worker'), this._worker.terminate());
      }
      postMessage(t, n) {
        let r = this._getAndIncrementId();
        return new Promise((o, i) => {
          let s = ({ data: a }) => {
            let c = a;
            if (c.method === t && c.id === r) {
              if ((this._worker.removeEventListener('message', s), !c.success)) {
                (W && G.error('Error in compression worker: ', c.response),
                  i(new Error('Error in compression worker')));
                return;
              }
              o(c.response);
            }
          };
          (this._worker.addEventListener('message', s),
            this._worker.postMessage({ id: r, method: t, arg: n }));
        });
      }
      _getAndIncrementId() {
        return this._id++;
      }
    },
    Cl = class {
      constructor(t) {
        ((this._worker = new xl(t)),
          (this._earliestTimestamp = null),
          (this._totalSize = 0),
          (this.hasCheckout = !1),
          (this.waitForCheckout = !1));
      }
      get hasEvents() {
        return !!this._earliestTimestamp;
      }
      get type() {
        return 'worker';
      }
      ensureReady() {
        return this._worker.ensureReady();
      }
      destroy() {
        this._worker.destroy();
      }
      addEvent(t) {
        let n = Gl(t.timestamp);
        (!this._earliestTimestamp || n < this._earliestTimestamp) && (this._earliestTimestamp = n);
        let r = JSON.stringify(t);
        return (
          (this._totalSize += r.length),
          this._totalSize > Fl ? Promise.reject(new li()) : this._sendEventToWorker(r)
        );
      }
      finish() {
        return this._finishRequest();
      }
      clear() {
        ((this._earliestTimestamp = null),
          (this._totalSize = 0),
          (this.hasCheckout = !1),
          this._worker.postMessage('clear').then(null, (t) => {
            W && G.exception(t, 'Sending "clear" message to worker failed', t);
          }));
      }
      getEarliestTimestamp() {
        return this._earliestTimestamp;
      }
      _sendEventToWorker(t) {
        return this._worker.postMessage('addEvent', t);
      }
      async _finishRequest() {
        let t = await this._worker.postMessage('finish');
        return ((this._earliestTimestamp = null), (this._totalSize = 0), t);
      }
    },
    Al = class {
      constructor(t) {
        ((this._fallback = new _a()),
          (this._compression = new Cl(t)),
          (this._used = this._fallback),
          (this._ensureWorkerIsLoadedPromise = this._ensureWorkerIsLoaded()));
      }
      get waitForCheckout() {
        return this._used.waitForCheckout;
      }
      get type() {
        return this._used.type;
      }
      get hasEvents() {
        return this._used.hasEvents;
      }
      get hasCheckout() {
        return this._used.hasCheckout;
      }
      set hasCheckout(t) {
        this._used.hasCheckout = t;
      }
      set waitForCheckout(t) {
        this._used.waitForCheckout = t;
      }
      destroy() {
        (this._fallback.destroy(), this._compression.destroy());
      }
      clear() {
        return this._used.clear();
      }
      getEarliestTimestamp() {
        return this._used.getEarliestTimestamp();
      }
      addEvent(t) {
        return this._used.addEvent(t);
      }
      async finish() {
        return (await this.ensureWorkerIsLoaded(), this._used.finish());
      }
      ensureWorkerIsLoaded() {
        return this._ensureWorkerIsLoadedPromise;
      }
      async _ensureWorkerIsLoaded() {
        try {
          await this._compression.ensureReady();
        } catch (t) {
          W &&
            G.exception(t, 'Failed to load the compression worker, falling back to simple buffer');
          return;
        }
        await this._switchToCompressionWorker();
      }
      async _switchToCompressionWorker() {
        let { events: t, hasCheckout: n, waitForCheckout: r } = this._fallback,
          o = [];
        for (let i of t) o.push(this._compression.addEvent(i));
        ((this._compression.hasCheckout = n),
          (this._compression.waitForCheckout = r),
          (this._used = this._compression));
        try {
          (await Promise.all(o), this._fallback.clear());
        } catch (i) {
          W && G.exception(i, 'Failed to add events when switching buffers.');
        }
      }
    };
  function B0({ useCompression: e, workerUrl: t }) {
    if (e && window.Worker) {
      let n = H0(t);
      if (n) return n;
    }
    return (W && G.log('Using simple buffer'), new _a());
  }
  function H0(e) {
    try {
      let t = e || $0();
      if (!t) return;
      W && G.log(`Using compression worker${e ? ` from ${e}` : ''}`);
      let n = new Worker(t);
      return new Al(n);
    } catch (t) {
      W && G.exception(t, 'Failed to create compression worker');
    }
  }
  function $0() {
    return typeof __SENTRY_EXCLUDE_REPLAY_WORKER__ > 'u' || !__SENTRY_EXCLUDE_REPLAY_WORKER__
      ? F0()
      : '';
  }
  function ql() {
    try {
      return 'sessionStorage' in me && !!me.sessionStorage;
    } catch {
      return !1;
    }
  }
  function W0(e) {
    (G0(), (e.session = void 0));
  }
  function G0() {
    if (ql())
      try {
        me.sessionStorage.removeItem(Dl);
      } catch {}
  }
  function Ah(e) {
    return e === void 0 ? !1 : Math.random() < e;
  }
  function Vl(e) {
    if (ql())
      try {
        me.sessionStorage.setItem(Dl, JSON.stringify(e));
      } catch {}
  }
  function kh(e) {
    let t = Date.now(),
      n = e.id || ge(),
      r = e.started || t,
      o = e.lastActivity || t,
      i = e.segmentId || 0,
      s = e.sampled,
      a = e.previousSessionId;
    return { id: n, started: r, lastActivity: o, segmentId: i, sampled: s, previousSessionId: a };
  }
  function z0(e, t) {
    return Ah(e) ? 'session' : t ? 'buffer' : !1;
  }
  function Zm(
    { sessionSampleRate: e, allowBuffering: t, stickySession: n = !1 },
    { previousSessionId: r } = {}
  ) {
    let o = z0(e, t),
      i = kh({ sampled: o, previousSessionId: r });
    return (n && Vl(i), i);
  }
  function j0() {
    if (!ql()) return null;
    try {
      let e = me.sessionStorage.getItem(Dl);
      if (!e) return null;
      let t = JSON.parse(e);
      return (W && G.infoTick('Loading existing session'), kh(t));
    } catch {
      return null;
    }
  }
  function kl(e, t, n = +new Date()) {
    return e === null || t === void 0 || t < 0 ? !0 : t === 0 ? !1 : e + t <= n;
  }
  function Nh(e, { maxReplayDuration: t, sessionIdleExpire: n, targetTime: r = Date.now() }) {
    return kl(e.started, t, r) || kl(e.lastActivity, n, r);
  }
  function Mh(e, { sessionIdleExpire: t, maxReplayDuration: n }) {
    return !(
      !Nh(e, { sessionIdleExpire: t, maxReplayDuration: n }) ||
      (e.sampled === 'buffer' && e.segmentId === 0)
    );
  }
  function dl({ sessionIdleExpire: e, maxReplayDuration: t, previousSessionId: n }, r) {
    let o = r.stickySession && j0();
    return o
      ? Mh(o, { sessionIdleExpire: e, maxReplayDuration: t })
        ? (W && G.infoTick('Session in sessionStorage is expired, creating new one...'),
          Zm(r, { previousSessionId: o.id }))
        : o
      : (W && G.infoTick('Creating new session'), Zm(r, { previousSessionId: n }));
  }
  function q0(e) {
    return e.type === Y.Custom;
  }
  function Yl(e, t, n) {
    return Lh(e, t) ? (Oh(e, t, n), !0) : !1;
  }
  function V0(e, t, n) {
    return Lh(e, t) ? Oh(e, t, n) : Promise.resolve(null);
  }
  async function Oh(e, t, n) {
    let { eventBuffer: r } = e;
    if (!r || (r.waitForCheckout && !n)) return null;
    let o = e.recordingMode === 'buffer';
    try {
      (n && o && r.clear(), n && ((r.hasCheckout = !0), (r.waitForCheckout = !1)));
      let i = e.getOptions(),
        s = Y0(t, i.beforeAddRecordingEvent);
      return s ? await r.addEvent(s) : void 0;
    } catch (i) {
      let s = i && i instanceof li,
        a = s ? 'addEventSizeExceeded' : 'addEvent';
      if (s && o) return (r.clear(), (r.waitForCheckout = !0), null);
      (e.handleException(i), await e.stop({ reason: a }));
      let c = b();
      c && c.recordDroppedEvent('internal_sdk_error', 'replay');
    }
  }
  function Lh(e, t) {
    if (!e.eventBuffer || e.isPaused() || !e.isEnabled()) return !1;
    let n = Gl(t.timestamp);
    return n + e.timeouts.sessionIdlePause < Date.now()
      ? !1
      : n > e.getContext().initialTimestamp + e.getOptions().maxReplayDuration
        ? (W &&
            G.infoTick(`Skipping event with timestamp ${n} because it is after maxReplayDuration`),
          !1)
        : !0;
  }
  function Y0(e, t) {
    try {
      if (typeof t == 'function' && q0(e)) return t(e);
    } catch (n) {
      return (
        W &&
          G.exception(
            n,
            'An error occurred in the `beforeAddRecordingEvent` callback, skipping the event...'
          ),
        null
      );
    }
    return e;
  }
  function Jl(e) {
    return !e.type;
  }
  function Nl(e) {
    return e.type === 'transaction';
  }
  function J0(e) {
    return e.type === 'replay_event';
  }
  function Qm(e) {
    return e.type === 'feedback';
  }
  function K0(e) {
    return (t, n) => {
      if (!e.isEnabled() || (!Jl(t) && !Nl(t))) return;
      let r = n.statusCode;
      if (!(!r || r < 200 || r >= 300)) {
        if (Nl(t)) {
          X0(e, t);
          return;
        }
        Z0(e, t);
      }
    };
  }
  function X0(e, t) {
    let n = e.getContext();
    t.contexts?.trace?.trace_id &&
      n.traceIds.size < 100 &&
      n.traceIds.add(t.contexts.trace.trace_id);
  }
  function Z0(e, t) {
    let n = e.getContext();
    if (
      (t.event_id && n.errorIds.size < 100 && n.errorIds.add(t.event_id),
      e.recordingMode !== 'buffer' || !t.tags || !t.tags.replayId)
    )
      return;
    let { beforeErrorSampling: r } = e.getOptions();
    (typeof r == 'function' && !r(t)) ||
      Qn(async () => {
        try {
          await e.sendBufferedReplayOrFlush();
        } catch (o) {
          e.handleException(o);
        }
      });
  }
  function Q0(e) {
    return (t) => {
      !e.isEnabled() || !Jl(t) || ew(e, t);
    };
  }
  function ew(e, t) {
    let n = t.exception?.values?.[0]?.value;
    if (
      typeof n == 'string' &&
      (n.match(
        /(reactjs\.org\/docs\/error-decoder\.html\?invariant=|react\.dev\/errors\/)(418|419|422|423|425)/
      ) ||
        n.match(/(does not match server-rendered HTML|Hydration failed because)/i))
    ) {
      let r = Zt({ category: 'replay.hydrate-error', data: { url: Xe() } });
      mi(e, r);
    }
  }
  function tw(e) {
    let t = b();
    t && t.on('beforeAddBreadcrumb', (n) => nw(e, n));
  }
  function nw(e, t) {
    if (!e.isEnabled() || !Dh(t)) return;
    let n = rw(t);
    n && mi(e, n);
  }
  function rw(e) {
    return !Dh(e) ||
      ['fetch', 'xhr', 'sentry.event', 'sentry.transaction'].includes(e.category) ||
      e.category.startsWith('ui.')
      ? null
      : e.category === 'console'
        ? ow(e)
        : Zt(e);
  }
  function ow(e) {
    let t = e.data?.arguments;
    if (!Array.isArray(t) || t.length === 0) return Zt(e);
    let n = !1,
      r = t.map((o) => {
        if (!o) return o;
        if (typeof o == 'string') return o.length > oa ? ((n = !0), `${o.slice(0, oa)}\u2026`) : o;
        if (typeof o == 'object')
          try {
            let i = Me(o, 7);
            return JSON.stringify(i).length > oa
              ? ((n = !0), `${JSON.stringify(i, null, 2).slice(0, oa)}\u2026`)
              : i;
          } catch {}
        return o;
      });
    return Zt({
      ...e,
      data: {
        ...e.data,
        arguments: r,
        ...(n ? { _meta: { warnings: ['CONSOLE_ARG_TRUNCATED'] } } : {}),
      },
    });
  }
  function Dh(e) {
    return !!e.category;
  }
  function iw(e, t) {
    return e.type || !e.exception?.values?.length ? !1 : !!t.originalException?.__rrweb__;
  }
  function Ph() {
    let e = M().getPropagationContext().dsc;
    e && delete e.replay_id;
    let t = Z();
    if (t) {
      let n = Re(t);
      delete n.replay_id;
    }
  }
  function sw(e, t) {
    (e.triggerUserActivity(),
      e.addUpdate(() =>
        t.timestamp
          ? (e.throttledAddEvent({
              type: Y.Custom,
              timestamp: t.timestamp * 1e3,
              data: {
                tag: 'breadcrumb',
                payload: {
                  timestamp: t.timestamp,
                  type: 'default',
                  category: 'sentry.feedback',
                  data: { feedbackId: t.event_id },
                },
              },
            }),
            !1)
          : !0
      ));
  }
  function aw(e, t) {
    return e.recordingMode !== 'buffer' || t.message === Pl || !t.exception || t.type
      ? !1
      : Ah(e.getOptions().errorSampleRate);
  }
  function cw(e) {
    return Object.assign(
      (t, n) =>
        !e.isEnabled() || e.isPaused()
          ? t
          : J0(t)
            ? (delete t.breadcrumbs, t)
            : !Jl(t) && !Nl(t) && !Qm(t)
              ? t
              : e.checkAndHandleExpiredSession()
                ? Qm(t)
                  ? (e.flush(), (t.contexts.feedback.replay_id = e.getSessionId()), sw(e, t), t)
                  : iw(t, n) && !e.getOptions()._experiments.captureExceptions
                    ? (W && G.log('Ignoring error from rrweb internals', t), null)
                    : ((aw(e, t) || e.recordingMode === 'session') &&
                        (t.tags = { ...t.tags, replayId: e.getSessionId() }),
                      t)
                : (Ph(), t),
      { id: 'Replay' }
    );
  }
  function va(e, t) {
    return t.map(({ type: n, start: r, end: o, name: i, data: s }) => {
      let a = e.throttledAddEvent({
        type: Y.Custom,
        timestamp: r,
        data: {
          tag: 'performanceSpan',
          payload: { op: n, description: i, startTimestamp: r, endTimestamp: o, data: s },
        },
      });
      return typeof a == 'string' ? Promise.resolve(null) : a;
    });
  }
  function uw(e) {
    let { from: t, to: n } = e,
      r = Date.now() / 1e3;
    return { type: 'navigation.push', start: r, end: r, name: n, data: { previous: t } };
  }
  function lw(e) {
    return (t) => {
      if (!e.isEnabled()) return;
      let n = uw(t);
      n !== null &&
        (e.getContext().urls.push(n.name),
        e.triggerUserActivity(),
        e.addUpdate(() => (va(e, [n]), !1)));
    };
  }
  function dw(e, t) {
    return W && e.getOptions()._experiments.traceInternals ? !1 : Po(t, b());
  }
  function Fh(e, t) {
    e.isEnabled() && t !== null && (dw(e, t.name) || e.addUpdate(() => (va(e, [t]), !0)));
  }
  function wa(e) {
    if (!e) return;
    let t = new TextEncoder();
    try {
      if (typeof e == 'string') return t.encode(e).length;
      if (e instanceof URLSearchParams) return t.encode(e.toString()).length;
      if (e instanceof FormData) {
        let n = Ys(e);
        return t.encode(n).length;
      }
      if (e instanceof Blob) return e.size;
      if (e instanceof ArrayBuffer) return e.byteLength;
    } catch {}
  }
  function Uh(e) {
    if (!e) return;
    let t = parseInt(e, 10);
    return isNaN(t) ? void 0 : t;
  }
  function Sa(e, t) {
    if (!e) return { headers: {}, size: void 0, _meta: { warnings: [t] } };
    let n = { ...e._meta },
      r = n.warnings || [];
    return ((n.warnings = [...r, t]), (e._meta = n), e);
  }
  function Bh(e, t) {
    if (!t) return null;
    let {
      startTimestamp: n,
      endTimestamp: r,
      url: o,
      method: i,
      statusCode: s,
      request: a,
      response: c,
    } = t;
    return {
      type: e,
      start: n / 1e3,
      end: r / 1e3,
      name: o,
      data: { method: i, statusCode: s, request: a, response: c },
    };
  }
  function di(e) {
    return { headers: {}, size: e, _meta: { warnings: ['URL_SKIPPED'] } };
  }
  function On(e, t, n) {
    if (!t && Object.keys(e).length === 0) return;
    if (!t) return { headers: e };
    if (!n) return { headers: e, size: t };
    let r = { headers: e, size: t },
      { body: o, warnings: i } = fw(n);
    return ((r.body = o), i?.length && (r._meta = { warnings: i }), r);
  }
  function Ml(e, t) {
    return Object.entries(e).reduce((n, [r, o]) => {
      let i = r.toLowerCase();
      return (t.includes(i) && e[r] && (n[i] = o), n);
    }, {});
  }
  function fw(e) {
    if (!e || typeof e != 'string') return { body: e };
    let t = e.length > Lm,
      n = pw(e);
    if (t) {
      let r = e.slice(0, Lm);
      return n
        ? { body: r, warnings: ['MAYBE_JSON_TRUNCATED'] }
        : { body: `${r}\u2026`, warnings: ['TEXT_TRUNCATED'] };
    }
    if (n)
      try {
        return { body: JSON.parse(e) };
      } catch {}
    return { body: e };
  }
  function pw(e) {
    let t = e[0],
      n = e[e.length - 1];
    return (t === '[' && n === ']') || (t === '{' && n === '}');
  }
  function ya(e, t) {
    let n = mw(e);
    return Ue(n, t);
  }
  function mw(e, t = me.document.baseURI) {
    if (e.startsWith('http://') || e.startsWith('https://') || e.startsWith(me.location.origin))
      return e;
    let n = new URL(e, t);
    if (n.origin !== new URL(t).origin) return e;
    let r = n.href;
    return !e.endsWith('/') && r.endsWith('/') ? r.slice(0, -1) : r;
  }
  async function hw(e, t, n) {
    try {
      let r = await _w(e, t, n),
        o = Bh('resource.fetch', r);
      Fh(n.replay, o);
    } catch (r) {
      W && G.exception(r, 'Failed to capture fetch breadcrumb');
    }
  }
  function gw(e, t) {
    let { input: n, response: r } = t,
      o = n ? Br(n) : void 0,
      i = wa(o),
      s = r ? Uh(r.headers.get('content-length')) : void 0;
    (i !== void 0 && (e.data.request_body_size = i),
      s !== void 0 && (e.data.response_body_size = s));
  }
  async function _w(e, t, n) {
    let r = Date.now(),
      { startTimestamp: o = r, endTimestamp: i = r } = t,
      {
        url: s,
        method: a,
        status_code: c = 0,
        request_body_size: u,
        response_body_size: d,
      } = e.data,
      l = ya(s, n.networkDetailAllowUrls) && !ya(s, n.networkDetailDenyUrls),
      p = l ? Sw(n, t.input, u) : di(u),
      f = await yw(l, n, t.response, d);
    return {
      startTimestamp: o,
      endTimestamp: i,
      url: s,
      method: a,
      statusCode: c,
      request: p,
      response: f,
    };
  }
  function Sw({ networkCaptureBodies: e, networkRequestHeaders: t }, n, r) {
    let o = n ? Tw(n, t) : {};
    if (!e) return On(o, r, void 0);
    let i = Br(n),
      [s, a] = tr(i, G),
      c = On(o, r, s);
    return a ? Sa(c, a) : c;
  }
  async function yw(e, { networkCaptureBodies: t, networkResponseHeaders: n }, r, o) {
    if (!e && o !== void 0) return di(o);
    let i = r ? Hh(r.headers, n) : {};
    if (!r || (!t && o !== void 0)) return On(i, o, void 0);
    let [s, a] = await bw(r),
      c = Ew(s, { networkCaptureBodies: t, responseBodySize: o, captureDetails: e, headers: i });
    return a ? Sa(c, a) : c;
  }
  function Ew(e, { networkCaptureBodies: t, responseBodySize: n, captureDetails: r, headers: o }) {
    try {
      let i = e?.length && n === void 0 ? wa(e) : n;
      return r ? (t ? On(o, i, e) : On(o, i, void 0)) : di(i);
    } catch (i) {
      return (W && G.exception(i, 'Failed to serialize response body'), On(o, n, void 0));
    }
  }
  async function bw(e) {
    let t = Iw(e);
    if (!t) return [void 0, 'BODY_PARSE_ERROR'];
    try {
      return [await vw(t)];
    } catch (n) {
      return n instanceof Error && n.message.indexOf('Timeout') > -1
        ? (W && G.warn('Parsing text body from response timed out'), [void 0, 'BODY_PARSE_TIMEOUT'])
        : (W && G.exception(n, 'Failed to get text body from response'),
          [void 0, 'BODY_PARSE_ERROR']);
    }
  }
  function Hh(e, t) {
    let n = {};
    return (
      t.forEach((r) => {
        e.get(r) && (n[r] = e.get(r));
      }),
      n
    );
  }
  function Tw(e, t) {
    return e.length === 1 && typeof e[0] != 'string'
      ? eh(e[0], t)
      : e.length === 2
        ? eh(e[1], t)
        : {};
  }
  function eh(e, t) {
    if (!e) return {};
    let n = e.headers;
    return n ? (n instanceof Headers ? Hh(n, t) : Array.isArray(n) ? {} : Ml(n, t)) : {};
  }
  function Iw(e) {
    try {
      return e.clone();
    } catch (t) {
      W && G.exception(t, 'Failed to clone response body');
    }
  }
  function vw(e) {
    return new Promise((t, n) => {
      let r = Qn(() => n(new Error('Timeout while trying to read response body')), 500);
      ww(e)
        .then(
          (o) => t(o),
          (o) => n(o)
        )
        .finally(() => clearTimeout(r));
    });
  }
  async function ww(e) {
    return await e.text();
  }
  async function Rw(e, t, n) {
    try {
      let r = Cw(e, t, n),
        o = Bh('resource.xhr', r);
      Fh(n.replay, o);
    } catch (r) {
      W && G.exception(r, 'Failed to capture xhr breadcrumb');
    }
  }
  function xw(e, t) {
    let { xhr: n, input: r } = t;
    if (!n) return;
    let o = wa(r),
      i = n.getResponseHeader('content-length')
        ? Uh(n.getResponseHeader('content-length'))
        : Mw(n.response, n.responseType);
    (o !== void 0 && (e.data.request_body_size = o),
      i !== void 0 && (e.data.response_body_size = i));
  }
  function Cw(e, t, n) {
    let r = Date.now(),
      { startTimestamp: o = r, endTimestamp: i = r, input: s, xhr: a } = t,
      {
        url: c,
        method: u,
        status_code: d = 0,
        request_body_size: l,
        response_body_size: p,
      } = e.data;
    if (!c) return null;
    if (!a || !ya(c, n.networkDetailAllowUrls) || ya(c, n.networkDetailDenyUrls)) {
      let A = di(l),
        T = di(p);
      return {
        startTimestamp: o,
        endTimestamp: i,
        url: c,
        method: u,
        statusCode: d,
        request: A,
        response: T,
      };
    }
    let f = a[Qe],
      m = f ? Ml(f.request_headers, n.networkRequestHeaders) : {},
      _ = Ml(Aw(a), n.networkResponseHeaders),
      [g, S] = n.networkCaptureBodies ? tr(s, G) : [void 0],
      [E, P] = n.networkCaptureBodies ? kw(a) : [void 0],
      w = On(m, l, g),
      F = On(_, p, E);
    return {
      startTimestamp: o,
      endTimestamp: i,
      url: c,
      method: u,
      statusCode: d,
      request: S ? Sa(w, S) : w,
      response: P ? Sa(F, P) : F,
    };
  }
  function Aw(e) {
    let t = e.getAllResponseHeaders();
    return t
      ? t
          .split(
            `\r
`
          )
          .reduce((n, r) => {
            let [o, i] = r.split(': ');
            return (i && (n[o.toLowerCase()] = i), n);
          }, {})
      : {};
  }
  function kw(e) {
    let t = [];
    try {
      return [e.responseText];
    } catch (n) {
      t.push(n);
    }
    try {
      return Nw(e.response, e.responseType);
    } catch (n) {
      t.push(n);
    }
    return (W && G.warn('Failed to get xhr response body', ...t), [void 0]);
  }
  function Nw(e, t) {
    try {
      if (typeof e == 'string') return [e];
      if (e instanceof Document) return [e.body.outerHTML];
      if (t === 'json' && e && typeof e == 'object') return [JSON.stringify(e)];
      if (!e) return [void 0];
    } catch (n) {
      return (W && G.exception(n, 'Failed to serialize body', e), [void 0, 'BODY_PARSE_ERROR']);
    }
    return (
      W && G.log('Skipping network body because of body type', e),
      [void 0, 'UNPARSEABLE_BODY_TYPE']
    );
  }
  function Mw(e, t) {
    try {
      let n = t === 'json' && e && typeof e == 'object' ? JSON.stringify(e) : e;
      return wa(n);
    } catch {
      return;
    }
  }
  function Ow(e) {
    let t = b();
    try {
      let {
          networkDetailAllowUrls: n,
          networkDetailDenyUrls: r,
          networkCaptureBodies: o,
          networkRequestHeaders: i,
          networkResponseHeaders: s,
        } = e.getOptions(),
        a = {
          replay: e,
          networkDetailAllowUrls: n,
          networkDetailDenyUrls: r,
          networkCaptureBodies: o,
          networkRequestHeaders: i,
          networkResponseHeaders: s,
        };
      t && t.on('beforeAddBreadcrumb', (c, u) => Lw(a, c, u));
    } catch {}
  }
  function Lw(e, t, n) {
    if (t.data)
      try {
        (Dw(t) && Fw(n) && (xw(t, n), Rw(t, n, e)), Pw(t) && Uw(n) && (gw(t, n), hw(t, n, e)));
      } catch (r) {
        W && G.exception(r, 'Error when enriching network breadcrumb');
      }
  }
  function Dw(e) {
    return e.category === 'xhr';
  }
  function Pw(e) {
    return e.category === 'fetch';
  }
  function Fw(e) {
    return e?.xhr;
  }
  function Uw(e) {
    return e?.response;
  }
  function Bw(e) {
    let t = b();
    (ei(S0(e)), dn(lw(e)), tw(e), Ow(e));
    let n = cw(e);
    (Co(n),
      t &&
        (t.on('beforeSendEvent', Q0(e)),
        t.on('afterSendEvent', K0(e)),
        t.on('createDsc', (r) => {
          let o = e.getSessionId();
          o &&
            e.isEnabled() &&
            e.recordingMode === 'session' &&
            e.checkAndHandleExpiredSession() &&
            (r.replay_id = o);
        }),
        t.on('spanStart', (r) => {
          e.lastActiveSpan = r;
        }),
        t.on('spanEnd', (r) => {
          e.lastActiveSpan = r;
        }),
        t.on('beforeSendFeedback', async (r, o) => {
          let i = e.getSessionId();
          o?.includeReplay &&
            e.isEnabled() &&
            i &&
            r.contexts?.feedback &&
            (r.contexts.feedback.source === 'api' && (await e.sendBufferedReplayOrFlush()),
            (r.contexts.feedback.replay_id = i));
        }),
        t.on('openFeedbackWidget', async () => {
          await e.sendBufferedReplayOrFlush();
        })));
  }
  async function Hw(e) {
    try {
      return Promise.all(va(e, [$w(me.performance.memory)]));
    } catch {
      return [];
    }
  }
  function $w(e) {
    let { jsHeapSizeLimit: t, totalJSHeapSize: n, usedJSHeapSize: r } = e,
      o = Date.now() / 1e3;
    return {
      type: 'memory',
      name: 'memory',
      start: o,
      end: o,
      data: { memory: { jsHeapSizeLimit: t, totalJSHeapSize: n, usedJSHeapSize: r } },
    };
  }
  function Ww(e, t, n) {
    return Jc(e, t, { ...n, setTimeoutImpl: Qn });
  }
  var aa = v.navigator;
  function Gw() {
    return /iPhone|iPad|iPod/i.test(aa?.userAgent ?? '') ||
      (/Macintosh/i.test(aa?.userAgent ?? '') && aa?.maxTouchPoints && aa?.maxTouchPoints > 1)
      ? { sampling: { mousemove: !1 } }
      : {};
  }
  function zw(e) {
    let t = !1;
    return (n, r) => {
      if (!e.checkAndHandleExpiredSession()) {
        W && G.warn('Received replay event after session expired.');
        return;
      }
      let o = r || !t;
      ((t = !0),
        e.clickDetector && p0(e.clickDetector, n),
        e.addUpdate(() => {
          if ((e.recordingMode === 'buffer' && o && e.setInitialState(), !Yl(e, n, o))) return !0;
          if (!o) return !1;
          let i = e.session;
          if ((qw(e, o), e.recordingMode === 'buffer' && i && e.eventBuffer)) {
            let s = e.eventBuffer.getEarliestTimestamp();
            s &&
              (W &&
                G.log(`Updating session start time to earliest event in buffer to ${new Date(s)}`),
              (i.started = s),
              e.getOptions().stickySession && Vl(i));
          }
          return (i?.previousSessionId || (e.recordingMode === 'session' && e.flush()), !0);
        }));
    };
  }
  function jw(e) {
    let t = e.getOptions();
    return {
      type: Y.Custom,
      timestamp: Date.now(),
      data: {
        tag: 'options',
        payload: {
          shouldRecordCanvas: e.isRecordingCanvas(),
          sessionSampleRate: t.sessionSampleRate,
          errorSampleRate: t.errorSampleRate,
          useCompressionOption: t.useCompression,
          blockAllMedia: t.blockAllMedia,
          maskAllText: t.maskAllText,
          maskAllInputs: t.maskAllInputs,
          useCompression: e.eventBuffer ? e.eventBuffer.type === 'worker' : !1,
          networkDetailHasUrls: t.networkDetailAllowUrls.length > 0,
          networkCaptureBodies: t.networkCaptureBodies,
          networkRequestHasHeaders: t.networkRequestHeaders.length > 0,
          networkResponseHasHeaders: t.networkResponseHeaders.length > 0,
        },
      },
    };
  }
  function qw(e, t) {
    !t || !e.session || e.session.segmentId !== 0 || Yl(e, jw(e), !1);
  }
  function Vw(e) {
    if (!e) return null;
    try {
      return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
    } catch {
      return null;
    }
  }
  function Yw(e, t, n, r) {
    return Oe(yo(e, gr(e), r, n), [
      [{ type: 'replay_event' }, e],
      [
        {
          type: 'replay_recording',
          length: typeof t == 'string' ? new TextEncoder().encode(t).length : t.length,
        },
        t,
      ],
    ]);
  }
  function Jw({ recordingData: e, headers: t }) {
    let n,
      r = `${JSON.stringify(t)}
`;
    if (typeof e == 'string') n = `${r}${e}`;
    else {
      let i = new TextEncoder().encode(r);
      ((n = new Uint8Array(i.length + e.length)), n.set(i), n.set(e, i.length));
    }
    return n;
  }
  async function Kw({ client: e, scope: t, replayId: n, event: r }) {
    let o =
        typeof e._integrations == 'object' &&
        e._integrations !== null &&
        !Array.isArray(e._integrations)
          ? Object.keys(e._integrations)
          : void 0,
      i = { event_id: n, integrations: o };
    e.emit('preprocessEvent', r, i);
    let s = await vo(e.getOptions(), r, i, t, e, se());
    if (!s) return null;
    (e.emit('postprocessEvent', s, i), (s.platform = s.platform || 'javascript'));
    let a = e.getSdkMetadata(),
      { name: c, version: u, settings: d } = a?.sdk || {};
    return (
      (s.sdk = {
        ...s.sdk,
        name: c || 'sentry.javascript.unknown',
        version: u || '0.0.0',
        settings: d,
      }),
      s
    );
  }
  async function Xw({
    recordingData: e,
    replayId: t,
    segmentId: n,
    eventContext: r,
    timestamp: o,
    session: i,
  }) {
    let s = Jw({ recordingData: e, headers: { segment_id: n } }),
      { urls: a, errorIds: c, traceIds: u, initialTimestamp: d } = r,
      l = b(),
      p = M(),
      f = l?.getTransport(),
      m = l?.getDsn();
    if (!l || !f || !m || !i.sampled) return Promise.resolve({});
    let _ = {
        type: HI,
        replay_start_timestamp: d / 1e3,
        timestamp: o / 1e3,
        error_ids: c,
        trace_ids: u,
        urls: a,
        replay_id: t,
        segment_id: n,
        replay_type: i.sampled,
      },
      g = await Kw({ scope: p, client: l, replayId: t, event: _ });
    if (!g)
      return (
        l.recordDroppedEvent('event_processor', 'replay'),
        W && G.log('An event processor returned `null`, will not send event.'),
        Promise.resolve({})
      );
    delete g.sdkProcessingMetadata;
    let S = Yw(g, s, m, l.getOptions().tunnel),
      E;
    try {
      E = await f.send(S);
    } catch (w) {
      let F = new Error(Pl);
      try {
        F.cause = w;
      } catch {}
      throw F;
    }
    if (typeof E.statusCode == 'number' && (E.statusCode < 200 || E.statusCode >= 300))
      throw new Ea(E.statusCode);
    let P = Oo({}, E);
    if (Mo(P, 'replay')) throw new fi(P);
    return E;
  }
  var Ea = class extends Error {
      constructor(t) {
        super(`Transport returned status code ${t}`);
      }
    },
    fi = class extends Error {
      constructor(t) {
        (super('Rate limit hit'), (this.rateLimits = t));
      }
    };
  async function $h(e, t = { count: 0, interval: qI }) {
    let { recordingData: n, onError: r } = e;
    if (n.length)
      try {
        return (await Xw(e), !0);
      } catch (o) {
        if (o instanceof Ea || o instanceof fi) throw o;
        if ((wo('Replays', { _retryCount: t.count }), r && r(o), t.count >= VI)) {
          let i = new Error(`${Pl} - max retries exceeded`);
          try {
            i.cause = o;
          } catch {}
          throw i;
        }
        return (
          (t.interval *= ++t.count),
          new Promise((i, s) => {
            Qn(async () => {
              try {
                (await $h(e, t), i(!0));
              } catch (a) {
                s(a);
              }
            }, t.interval);
          })
        );
      }
  }
  var Wh = '__THROTTLED',
    Zw = '__SKIPPED';
  function Qw(e, t, n) {
    let r = new Map(),
      o = (a) => {
        let c = a - n;
        r.forEach((u, d) => {
          d < c && r.delete(d);
        });
      },
      i = () => [...r.values()].reduce((a, c) => a + c, 0),
      s = !1;
    return (...a) => {
      let c = Math.floor(Date.now() / 1e3);
      if ((o(c), i() >= t)) {
        let d = s;
        return ((s = !0), d ? Zw : Wh);
      }
      s = !1;
      let u = r.get(c) || 0;
      return (r.set(c, u + 1), e(...a));
    };
  }
  var Ol = class {
    constructor({ options: t, recordingOptions: n }) {
      ((this.eventBuffer = null),
        (this.performanceEntries = []),
        (this.replayPerformanceEntries = []),
        (this.recordingMode = 'session'),
        (this.timeouts = { sessionIdlePause: $I, sessionIdleExpire: WI }),
        (this._lastActivity = Date.now()),
        (this._isEnabled = !1),
        (this._isPaused = !1),
        (this._requiresManualStart = !1),
        (this._hasInitializedCoreListeners = !1),
        (this._context = {
          errorIds: new Set(),
          traceIds: new Set(),
          urls: [],
          initialTimestamp: Date.now(),
          initialUrl: '',
        }),
        (this._recordingOptions = n),
        (this._options = t),
        (this._debouncedFlush = Ww(() => this._flush(), this._options.flushMinDelay, {
          maxWait: this._options.flushMaxDelay,
        })),
        (this._throttledAddEvent = Qw((s, a) => V0(this, s, a), 300, 5)));
      let { slowClickTimeout: r, slowClickIgnoreSelectors: o } = this.getOptions(),
        i = r
          ? {
              threshold: Math.min(YI, r),
              timeout: r,
              scrollTimeout: JI,
              ignoreSelector: o ? o.join(',') : '',
            }
          : void 0;
      if ((i && (this.clickDetector = new Rl(this, i)), W)) {
        let s = t._experiments;
        G.setConfig({
          captureExceptions: !!s.captureExceptions,
          traceInternals: !!s.traceInternals,
        });
      }
      ((this._handleVisibilityChange = () => {
        me.document.visibilityState === 'visible'
          ? this._doChangeToForegroundTasks()
          : this._doChangeToBackgroundTasks();
      }),
        (this._handleWindowBlur = () => {
          let s = Zt({ category: 'ui.blur' });
          this._doChangeToBackgroundTasks(s);
        }),
        (this._handleWindowFocus = () => {
          let s = Zt({ category: 'ui.focus' });
          this._doChangeToForegroundTasks(s);
        }),
        (this._handleKeyboardEvent = (s) => {
          T0(this, s);
        }));
    }
    getContext() {
      return this._context;
    }
    isEnabled() {
      return this._isEnabled;
    }
    isPaused() {
      return this._isPaused;
    }
    isRecordingCanvas() {
      return !!this._canvas;
    }
    getOptions() {
      return this._options;
    }
    handleException(t) {
      (W && G.exception(t), this._options.onError && this._options.onError(t));
    }
    initializeSampling(t) {
      let { errorSampleRate: n, sessionSampleRate: r } = this._options,
        o = n <= 0 && r <= 0;
      if (((this._requiresManualStart = o), !o)) {
        if ((this._initializeSessionForSampling(t), !this.session)) {
          W && G.exception(new Error('Unable to initialize and create session'));
          return;
        }
        this.session.sampled !== !1 &&
          ((this.recordingMode =
            this.session.sampled === 'buffer' && this.session.segmentId === 0
              ? 'buffer'
              : 'session'),
          W && G.infoTick(`Starting replay in ${this.recordingMode} mode`),
          this._initializeRecording());
      }
    }
    start() {
      if (this._isEnabled && this.recordingMode === 'session') {
        W && G.log('Recording is already in progress');
        return;
      }
      if (this._isEnabled && this.recordingMode === 'buffer') {
        W && G.log('Buffering is in progress, call `flush()` to save the replay');
        return;
      }
      (W && G.infoTick('Starting replay in session mode'), this._updateUserActivity());
      let t = dl(
        {
          maxReplayDuration: this._options.maxReplayDuration,
          sessionIdleExpire: this.timeouts.sessionIdleExpire,
        },
        { stickySession: this._options.stickySession, sessionSampleRate: 1, allowBuffering: !1 }
      );
      ((this.session = t), (this.recordingMode = 'session'), this._initializeRecording());
    }
    startBuffering() {
      if (this._isEnabled) {
        W && G.log('Buffering is in progress, call `flush()` to save the replay');
        return;
      }
      W && G.infoTick('Starting replay in buffer mode');
      let t = dl(
        {
          sessionIdleExpire: this.timeouts.sessionIdleExpire,
          maxReplayDuration: this._options.maxReplayDuration,
        },
        { stickySession: this._options.stickySession, sessionSampleRate: 0, allowBuffering: !0 }
      );
      ((this.session = t), (this.recordingMode = 'buffer'), this._initializeRecording());
    }
    startRecording() {
      try {
        let t = this._canvas;
        this._stopRecording = pn({
          ...this._recordingOptions,
          ...(this.recordingMode === 'buffer'
            ? { checkoutEveryNms: jI }
            : this._options._experiments.continuousCheckout && {
                checkoutEveryNms: Math.max(36e4, this._options._experiments.continuousCheckout),
              }),
          emit: zw(this),
          ...Gw(),
          onMutation: this._onMutationHandler.bind(this),
          ...(t
            ? {
                recordCanvas: t.recordCanvas,
                getCanvasManager: t.getCanvasManager,
                sampling: t.sampling,
                dataURLOptions: t.dataURLOptions,
              }
            : {}),
        });
      } catch (t) {
        this.handleException(t);
      }
    }
    stopRecording() {
      try {
        return (this._stopRecording && (this._stopRecording(), (this._stopRecording = void 0)), !0);
      } catch (t) {
        return (this.handleException(t), !1);
      }
    }
    async stop({ forceFlush: t = !1, reason: n } = {}) {
      if (this._isEnabled) {
        ((this._isEnabled = !1), (this.recordingMode = 'buffer'));
        try {
          (W && G.log(`Stopping Replay${n ? ` triggered by ${n}` : ''}`),
            Ph(),
            this._removeListeners(),
            this.stopRecording(),
            this._debouncedFlush.cancel(),
            t && (await this._flush({ force: !0 })),
            this.eventBuffer?.destroy(),
            (this.eventBuffer = null),
            W0(this));
        } catch (r) {
          this.handleException(r);
        }
      }
    }
    pause() {
      this._isPaused || ((this._isPaused = !0), this.stopRecording(), W && G.log('Pausing replay'));
    }
    resume() {
      !this._isPaused ||
        !this._checkSession() ||
        ((this._isPaused = !1), this.startRecording(), W && G.log('Resuming replay'));
    }
    async sendBufferedReplayOrFlush({ continueRecording: t = !0 } = {}) {
      if (this.recordingMode === 'session') return this.flushImmediate();
      let n = Date.now();
      (W && G.log('Converting buffer to session'), await this.flushImmediate());
      let r = this.stopRecording();
      !t ||
        !r ||
        (this.recordingMode !== 'session' &&
          ((this.recordingMode = 'session'),
          this.session &&
            (this._updateUserActivity(n), this._updateSessionActivity(n), this._maybeSaveSession()),
          this.startRecording()));
    }
    addUpdate(t) {
      let n = t();
      this.recordingMode === 'buffer' || !this._isEnabled || (n !== !0 && this._debouncedFlush());
    }
    triggerUserActivity() {
      if ((this._updateUserActivity(), !this._stopRecording)) {
        if (!this._checkSession()) return;
        this.resume();
        return;
      }
      (this.checkAndHandleExpiredSession(), this._updateSessionActivity());
    }
    updateUserActivity() {
      (this._updateUserActivity(), this._updateSessionActivity());
    }
    conditionalFlush() {
      return this.recordingMode === 'buffer' ? Promise.resolve() : this.flushImmediate();
    }
    flush() {
      return this._debouncedFlush();
    }
    flushImmediate() {
      return (this._debouncedFlush(), this._debouncedFlush.flush());
    }
    cancelFlush() {
      this._debouncedFlush.cancel();
    }
    getSessionId(t) {
      if (!(t && this.session?.sampled === !1)) return this.session?.id;
    }
    checkAndHandleExpiredSession() {
      if (
        this._lastActivity &&
        kl(this._lastActivity, this.timeouts.sessionIdlePause) &&
        this.session &&
        this.session.sampled === 'session'
      ) {
        this.pause();
        return;
      }
      return !!this._checkSession();
    }
    setInitialState() {
      let t = `${me.location.pathname}${me.location.hash}${me.location.search}`,
        n = `${me.location.origin}${t}`;
      ((this.performanceEntries = []),
        (this.replayPerformanceEntries = []),
        this._clearContext(),
        (this._context.initialUrl = n),
        (this._context.initialTimestamp = Date.now()),
        this._context.urls.push(n));
    }
    throttledAddEvent(t, n) {
      let r = this._throttledAddEvent(t, n);
      if (r === Wh) {
        let o = Zt({ category: 'replay.throttled' });
        this.addUpdate(
          () =>
            !Yl(this, {
              type: r0,
              timestamp: o.timestamp || 0,
              data: { tag: 'breadcrumb', payload: o, metric: !0 },
            })
        );
      }
      return r;
    }
    getCurrentRoute() {
      let t = this.lastActiveSpan || Z(),
        n = t && re(t),
        o = ((n && D(n).data) || {})[Ie];
      if (!(!n || !o || !['route', 'custom'].includes(o))) return D(n).description;
    }
    _initializeRecording() {
      (this.setInitialState(),
        this._updateSessionActivity(),
        (this.eventBuffer = B0({
          useCompression: this._options.useCompression,
          workerUrl: this._options.workerUrl,
        })),
        this._removeListeners(),
        this._addListeners(),
        (this._isEnabled = !0),
        (this._isPaused = !1),
        this.startRecording());
    }
    _initializeSessionForSampling(t) {
      let n = this._options.errorSampleRate > 0,
        r = dl(
          {
            sessionIdleExpire: this.timeouts.sessionIdleExpire,
            maxReplayDuration: this._options.maxReplayDuration,
            previousSessionId: t,
          },
          {
            stickySession: this._options.stickySession,
            sessionSampleRate: this._options.sessionSampleRate,
            allowBuffering: n,
          }
        );
      this.session = r;
    }
    _checkSession() {
      if (!this.session) return !1;
      let t = this.session;
      return Mh(t, {
        sessionIdleExpire: this.timeouts.sessionIdleExpire,
        maxReplayDuration: this._options.maxReplayDuration,
      })
        ? (this._refreshSession(t), !1)
        : !0;
    }
    async _refreshSession(t) {
      this._isEnabled &&
        (await this.stop({ reason: 'refresh session' }), this.initializeSampling(t.id));
    }
    _addListeners() {
      try {
        (me.document.addEventListener('visibilitychange', this._handleVisibilityChange),
          me.addEventListener('blur', this._handleWindowBlur),
          me.addEventListener('focus', this._handleWindowFocus),
          me.addEventListener('keydown', this._handleKeyboardEvent),
          this.clickDetector && this.clickDetector.addListeners(),
          this._hasInitializedCoreListeners ||
            (Bw(this), (this._hasInitializedCoreListeners = !0)));
      } catch (t) {
        this.handleException(t);
      }
      this._performanceCleanupCallback = D0(this);
    }
    _removeListeners() {
      try {
        (me.document.removeEventListener('visibilitychange', this._handleVisibilityChange),
          me.removeEventListener('blur', this._handleWindowBlur),
          me.removeEventListener('focus', this._handleWindowFocus),
          me.removeEventListener('keydown', this._handleKeyboardEvent),
          this.clickDetector && this.clickDetector.removeListeners(),
          this._performanceCleanupCallback && this._performanceCleanupCallback());
      } catch (t) {
        this.handleException(t);
      }
    }
    _doChangeToBackgroundTasks(t) {
      !this.session ||
        Nh(this.session, {
          maxReplayDuration: this._options.maxReplayDuration,
          sessionIdleExpire: this.timeouts.sessionIdleExpire,
        }) ||
        (t && this._createCustomBreadcrumb(t), this.conditionalFlush());
    }
    _doChangeToForegroundTasks(t) {
      if (!this.session) return;
      if (!this.checkAndHandleExpiredSession()) {
        W && G.log('Document has become active, but session has expired');
        return;
      }
      t && this._createCustomBreadcrumb(t);
    }
    _updateUserActivity(t = Date.now()) {
      this._lastActivity = t;
    }
    _updateSessionActivity(t = Date.now()) {
      this.session && ((this.session.lastActivity = t), this._maybeSaveSession());
    }
    _createCustomBreadcrumb(t) {
      this.addUpdate(() => {
        this.throttledAddEvent({
          type: Y.Custom,
          timestamp: t.timestamp || 0,
          data: { tag: 'breadcrumb', payload: t },
        });
      });
    }
    _addPerformanceEntries() {
      let t = R0(this.performanceEntries).concat(this.replayPerformanceEntries);
      if (
        ((this.performanceEntries = []),
        (this.replayPerformanceEntries = []),
        this._requiresManualStart)
      ) {
        let n = this._context.initialTimestamp / 1e3;
        t = t.filter((r) => r.start >= n);
      }
      return Promise.all(va(this, t));
    }
    _clearContext() {
      (this._context.errorIds.clear(), this._context.traceIds.clear(), (this._context.urls = []));
    }
    _updateInitialTimestampFromEventBuffer() {
      let { session: t, eventBuffer: n } = this;
      if (!t || !n || this._requiresManualStart || t.segmentId) return;
      let r = n.getEarliestTimestamp();
      r && r < this._context.initialTimestamp && (this._context.initialTimestamp = r);
    }
    _popEventContext() {
      let t = {
        initialTimestamp: this._context.initialTimestamp,
        initialUrl: this._context.initialUrl,
        errorIds: Array.from(this._context.errorIds),
        traceIds: Array.from(this._context.traceIds),
        urls: this._context.urls,
      };
      return (this._clearContext(), t);
    }
    async _runFlush() {
      let t = this.getSessionId();
      if (!this.session || !this.eventBuffer || !t) {
        W && G.error('No session or eventBuffer found to flush.');
        return;
      }
      if (
        (await this._addPerformanceEntries(),
        !!this.eventBuffer?.hasEvents &&
          (await Hw(this), !!this.eventBuffer && t === this.getSessionId()))
      )
        try {
          this._updateInitialTimestampFromEventBuffer();
          let n = Date.now();
          if (n - this._context.initialTimestamp > this._options.maxReplayDuration + 3e4)
            throw new Error('Session is too long, not sending replay');
          let r = this._popEventContext(),
            o = this.session.segmentId++;
          this._maybeSaveSession();
          let i = await this.eventBuffer.finish();
          await $h({
            replayId: t,
            recordingData: i,
            segmentId: o,
            eventContext: r,
            session: this.session,
            timestamp: n,
            onError: (s) => this.handleException(s),
          });
        } catch (n) {
          (this.handleException(n), this.stop({ reason: 'sendReplay' }));
          let r = b();
          if (r) {
            let o = n instanceof fi ? 'ratelimit_backoff' : 'send_error';
            r.recordDroppedEvent(o, 'replay');
          }
        }
    }
    async _flush({ force: t = !1 } = {}) {
      if (!this._isEnabled && !t) return;
      if (!this.checkAndHandleExpiredSession()) {
        W && G.error('Attempting to finish replay event after session expired.');
        return;
      }
      if (!this.session) return;
      let n = this.session.started,
        o = Date.now() - n;
      this._debouncedFlush.cancel();
      let i = o < this._options.minReplayDuration,
        s = o > this._options.maxReplayDuration + 5e3;
      if (i || s) {
        (W &&
          G.log(
            `Session duration (${Math.floor(o / 1e3)}s) is too ${i ? 'short' : 'long'}, not sending replay.`
          ),
          i && this._debouncedFlush());
        return;
      }
      let a = this.eventBuffer;
      a &&
        this.session.segmentId === 0 &&
        !a.hasCheckout &&
        W &&
        G.log('Flushing initial segment without checkout.');
      let c = !!this._flushLock;
      this._flushLock || (this._flushLock = this._runFlush());
      try {
        await this._flushLock;
      } catch (u) {
        this.handleException(u);
      } finally {
        ((this._flushLock = void 0), c && this._debouncedFlush());
      }
    }
    _maybeSaveSession() {
      this.session && this._options.stickySession && Vl(this.session);
    }
    _onMutationHandler(t) {
      let { ignoreMutations: n } = this._options._experiments;
      if (
        n?.length &&
        t.some((a) => {
          let c = Vw(a.target),
            u = n.join(',');
          return c?.matches(u);
        })
      )
        return !1;
      let r = t.length,
        o = this._options.mutationLimit,
        i = this._options.mutationBreadcrumbLimit,
        s = o && r > o;
      if (r > i || s) {
        let a = Zt({ category: 'replay.mutations', data: { count: r, limit: s } });
        this._createCustomBreadcrumb(a);
      }
      return s
        ? (this.stop({ reason: 'mutationLimit', forceFlush: this.recordingMode === 'session' }), !1)
        : !0;
    }
  };
  function ni(e, t) {
    return [...e, ...t].join(',');
  }
  function eR({ mask: e, unmask: t, block: n, unblock: r, ignore: o }) {
    let i = ['base', 'iframe[srcdoc]:not([src])'],
      s = ni(e, ['.sentry-mask', '[data-sentry-mask]']),
      a = ni(t, []);
    return {
      maskTextSelector: s,
      unmaskTextSelector: a,
      blockSelector: ni(n, ['.sentry-block', '[data-sentry-block]', ...i]),
      unblockSelector: ni(r, []),
      ignoreSelector: ni(o, ['.sentry-ignore', '[data-sentry-ignore]', 'input[type="file"]']),
    };
  }
  function tR({ el: e, key: t, maskAttributes: n, maskAllText: r, privacyOptions: o, value: i }) {
    return !r || (o.unmaskTextSelector && e.matches(o.unmaskTextSelector))
      ? i
      : n.includes(t) ||
          (t === 'value' &&
            e.tagName === 'INPUT' &&
            ['submit', 'button'].includes(e.getAttribute('type') || ''))
        ? i.replace(/[\S]/g, '*')
        : i;
  }
  var th =
      'img,image,svg,video,object,picture,embed,map,audio,link[rel="icon"],link[rel="apple-touch-icon"]',
    nR = ['content-length', 'content-type', 'accept'],
    nh = !1,
    Gh = (e) => new Ll(e),
    Ll = class {
      constructor({
        flushMinDelay: t = GI,
        flushMaxDelay: n = zI,
        minReplayDuration: r = KI,
        maxReplayDuration: o = Dm,
        stickySession: i = !0,
        useCompression: s = !0,
        workerUrl: a,
        _experiments: c = {},
        maskAllText: u = !0,
        maskAllInputs: d = !0,
        blockAllMedia: l = !0,
        mutationBreadcrumbLimit: p = 750,
        mutationLimit: f = 1e4,
        slowClickTimeout: m = 7e3,
        slowClickIgnoreSelectors: _ = [],
        networkDetailAllowUrls: g = [],
        networkDetailDenyUrls: S = [],
        networkCaptureBodies: E = !0,
        networkRequestHeaders: P = [],
        networkResponseHeaders: w = [],
        mask: F = [],
        maskAttributes: A = ['title', 'placeholder', 'aria-label'],
        unmask: T = [],
        block: R = [],
        unblock: I = [],
        ignore: k = [],
        maskFn: H,
        beforeAddRecordingEvent: x,
        beforeErrorSampling: L,
        onError: q,
      } = {}) {
        this.name = 'Replay';
        let J = eR({ mask: F, unmask: T, block: R, unblock: I, ignore: k });
        if (
          ((this._recordingOptions = {
            maskAllInputs: d,
            maskAllText: u,
            maskInputOptions: { password: !0 },
            maskTextFn: H,
            maskInputFn: H,
            maskAttributeFn: (ne, C, z) =>
              tR({
                maskAttributes: A,
                maskAllText: u,
                privacyOptions: J,
                key: ne,
                value: C,
                el: z,
              }),
            ...J,
            slimDOMOptions: 'all',
            inlineStylesheet: !0,
            inlineImages: !1,
            collectFonts: !0,
            errorHandler: (ne) => {
              try {
                ne.__rrweb__ = !0;
              } catch {}
            },
            recordCrossOriginIframes: !!c.recordCrossOriginIframes,
          }),
          (this._initialOptions = {
            flushMinDelay: t,
            flushMaxDelay: n,
            minReplayDuration: Math.min(r, XI),
            maxReplayDuration: Math.min(o, Dm),
            stickySession: i,
            useCompression: s,
            workerUrl: a,
            blockAllMedia: l,
            maskAllInputs: d,
            maskAllText: u,
            mutationBreadcrumbLimit: p,
            mutationLimit: f,
            slowClickTimeout: m,
            slowClickIgnoreSelectors: _,
            networkDetailAllowUrls: g,
            networkDetailDenyUrls: S,
            networkCaptureBodies: E,
            networkRequestHeaders: rh(P),
            networkResponseHeaders: rh(w),
            beforeAddRecordingEvent: x,
            beforeErrorSampling: L,
            onError: q,
            _experiments: c,
          }),
          this._initialOptions.blockAllMedia &&
            (this._recordingOptions.blockSelector = this._recordingOptions.blockSelector
              ? `${this._recordingOptions.blockSelector},${th}`
              : th),
          this._isInitialized && Rr())
        )
          throw new Error('Multiple Sentry Session Replay instances are not supported');
        this._isInitialized = !0;
      }
      get _isInitialized() {
        return nh;
      }
      set _isInitialized(t) {
        nh = t;
      }
      afterAllSetup(t) {
        !Rr() || this._replay || (this._setup(t), this._initialize(t));
      }
      start() {
        this._replay && this._replay.start();
      }
      startBuffering() {
        this._replay && this._replay.startBuffering();
      }
      stop() {
        return this._replay
          ? this._replay.stop({ forceFlush: this._replay.recordingMode === 'session' })
          : Promise.resolve();
      }
      flush(t) {
        return this._replay
          ? this._replay.isEnabled()
            ? this._replay.sendBufferedReplayOrFlush(t)
            : (this._replay.start(), Promise.resolve())
          : Promise.resolve();
      }
      getReplayId(t) {
        if (this._replay?.isEnabled()) return this._replay.getSessionId(t);
      }
      getRecordingMode() {
        if (this._replay?.isEnabled()) return this._replay.recordingMode;
      }
      _initialize(t) {
        this._replay &&
          (this._maybeLoadFromReplayCanvasIntegration(t), this._replay.initializeSampling());
      }
      _setup(t) {
        let n = rR(this._initialOptions, t);
        this._replay = new Ol({ options: n, recordingOptions: this._recordingOptions });
      }
      _maybeLoadFromReplayCanvasIntegration(t) {
        try {
          let n = t.getIntegrationByName('ReplayCanvas');
          if (!n) return;
          this._replay._canvas = n.getOptions();
        } catch {}
      }
    };
  function rR(e, t) {
    let n = t.getOptions(),
      r = { sessionSampleRate: 0, errorSampleRate: 0, ...e },
      o = ft(n.replaysSessionSampleRate),
      i = ft(n.replaysOnErrorSampleRate);
    return (
      o == null &&
        i == null &&
        Le(() => {
          console.warn(
            'Replay is disabled because neither `replaysSessionSampleRate` nor `replaysOnErrorSampleRate` are set.'
          );
        }),
      o != null && (r.sessionSampleRate = o),
      i != null && (r.errorSampleRate = i),
      r
    );
  }
  function rh(e) {
    return [...nR, ...e.map((t) => t.toLowerCase())];
  }
  function zh() {
    return b()?.getIntegrationByName('Replay');
  }
  var oR = Object.defineProperty,
    iR = (e, t, n) =>
      t in e ? oR(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n),
    jh = (e, t, n) => iR(e, typeof t != 'symbol' ? t + '' : t, n),
    Xl = class {
      constructor() {
        (jh(this, 'idNodeMap', new Map()), jh(this, 'nodeMetaMap', new WeakMap()));
      }
      getId(t) {
        return t ? (this.getMeta(t)?.id ?? -1) : -1;
      }
      getNode(t) {
        return this.idNodeMap.get(t) || null;
      }
      getIds() {
        return Array.from(this.idNodeMap.keys());
      }
      getMeta(t) {
        return this.nodeMetaMap.get(t) || null;
      }
      removeNodeFromMap(t) {
        let n = this.getId(t);
        (this.idNodeMap.delete(n),
          t.childNodes && t.childNodes.forEach((r) => this.removeNodeFromMap(r)));
      }
      has(t) {
        return this.idNodeMap.has(t);
      }
      hasNode(t) {
        return this.nodeMetaMap.has(t);
      }
      add(t, n) {
        let r = n.id;
        (this.idNodeMap.set(r, t), this.nodeMetaMap.set(t, n));
      }
      replace(t, n) {
        let r = this.getNode(t);
        if (r) {
          let o = this.nodeMetaMap.get(r);
          o && this.nodeMetaMap.set(n, o);
        }
        this.idNodeMap.set(t, n);
      }
      reset() {
        ((this.idNodeMap = new Map()), (this.nodeMetaMap = new WeakMap()));
      }
    };
  function sR() {
    return new Xl();
  }
  function aR(e, t) {
    for (let n = e.classList.length; n--; ) {
      let r = e.classList[n];
      if (t.test(r)) return !0;
    }
    return !1;
  }
  function Zl(e, t, n = 1 / 0, r = 0) {
    return !e || e.nodeType !== e.ELEMENT_NODE || r > n
      ? -1
      : t(e)
        ? r
        : Zl(e.parentNode, t, n, r + 1);
  }
  function qh(e, t) {
    return (n) => {
      let r = n;
      if (r === null) return !1;
      try {
        if (e) {
          if (typeof e == 'string') {
            if (r.matches(`.${e}`)) return !0;
          } else if (aR(r, e)) return !0;
        }
        return !!(t && r.matches(t));
      } catch {
        return !1;
      }
    };
  }
  var Zr = `Please stop import mirror directly. Instead of that,\r
now you can use replayer.getMirror() to access the mirror instance of a replayer,\r
or you can use record.mirror to access the mirror instance during recording.`,
    Vh = {
      map: {},
      getId() {
        return (console.error(Zr), -1);
      },
      getNode() {
        return (console.error(Zr), null);
      },
      removeNodeFromMap() {
        console.error(Zr);
      },
      has() {
        return (console.error(Zr), !1);
      },
      reset() {
        console.error(Zr);
      },
    };
  typeof window < 'u' &&
    window.Proxy &&
    window.Reflect &&
    (Vh = new Proxy(Vh, {
      get(e, t, n) {
        return (t === 'map' && console.error(Zr), Reflect.get(e, t, n));
      },
    }));
  function ed(e, t, n, r, o = window) {
    let i = o.Object.getOwnPropertyDescriptor(e, t);
    return (
      o.Object.defineProperty(
        e,
        t,
        r
          ? n
          : {
              set(s) {
                (tg(() => {
                  n.set.call(this, s);
                }, 0),
                  i && i.set && i.set.call(this, s));
              },
            }
      ),
      () => ed(e, t, i || {}, !0)
    );
  }
  function td(e, t, n) {
    try {
      if (!(t in e)) return () => {};
      let r = e[t],
        o = n(r);
      return (
        typeof o == 'function' &&
          ((o.prototype = o.prototype || {}),
          Object.defineProperties(o, { __rrweb_original__: { enumerable: !1, value: r } })),
        (e[t] = o),
        () => {
          e[t] = r;
        }
      );
    } catch {
      return () => {};
    }
  }
  Date.now().toString();
  function cR(e) {
    if (!e) return null;
    try {
      return e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
    } catch {
      return null;
    }
  }
  function Aa(e, t, n, r, o) {
    if (!e) return !1;
    let i = cR(e);
    if (!i) return !1;
    let s = qh(t, n);
    if (!o) {
      let u = r && i.matches(r);
      return s(i) && !u;
    }
    let a = Zl(i, s),
      c = -1;
    return a < 0 ? !1 : (r && (c = Zl(i, qh(null, r))), a > -1 && c < 0 ? !0 : a < c);
  }
  var Yh = {};
  function eg(e) {
    let t = Yh[e];
    if (t) return t;
    let n = window.document,
      r = window[e];
    if (n && typeof n.createElement == 'function')
      try {
        let o = n.createElement('iframe');
        ((o.hidden = !0), n.head.appendChild(o));
        let i = o.contentWindow;
        (i && i[e] && (r = i[e]), n.head.removeChild(o));
      } catch {}
    return (Yh[e] = r.bind(window));
  }
  function rr(...e) {
    return eg('requestAnimationFrame')(...e);
  }
  function tg(...e) {
    return eg('setTimeout')(...e);
  }
  var eo = ((e) => (
      (e[(e['2D'] = 0)] = '2D'),
      (e[(e.WebGL = 1)] = 'WebGL'),
      (e[(e.WebGL2 = 2)] = 'WebGL2'),
      e
    ))(eo || {}),
    xa;
  function uR(e) {
    xa = e;
  }
  var Kl = (e) =>
      xa
        ? (...n) => {
            try {
              return e(...n);
            } catch (r) {
              if (xa && xa(r) === !0) return () => {};
              throw r;
            }
          }
        : e,
    Qr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    lR = typeof Uint8Array > 'u' ? [] : new Uint8Array(256);
  for (hi = 0; hi < Qr.length; hi++) lR[Qr.charCodeAt(hi)] = hi;
  var hi,
    dR = function (e) {
      var t = new Uint8Array(e),
        n,
        r = t.length,
        o = '';
      for (n = 0; n < r; n += 3)
        ((o += Qr[t[n] >> 2]),
          (o += Qr[((t[n] & 3) << 4) | (t[n + 1] >> 4)]),
          (o += Qr[((t[n + 1] & 15) << 2) | (t[n + 2] >> 6)]),
          (o += Qr[t[n + 2] & 63]));
      return (
        r % 3 === 2
          ? (o = o.substring(0, o.length - 1) + '=')
          : r % 3 === 1 && (o = o.substring(0, o.length - 2) + '=='),
        o
      );
    },
    Jh = new Map();
  function fR(e, t) {
    let n = Jh.get(e);
    return (n || ((n = new Map()), Jh.set(e, n)), n.has(t) || n.set(t, []), n.get(t));
  }
  var ng = (e, t, n) => {
    if (!e || !(og(e, t) || typeof e == 'object')) return;
    let r = e.constructor.name,
      o = fR(n, r),
      i = o.indexOf(e);
    return (i === -1 && ((i = o.length), o.push(e)), i);
  };
  function Ca(e, t, n) {
    if (e instanceof Array) return e.map((r) => Ca(r, t, n));
    if (e === null) return e;
    if (
      e instanceof Float32Array ||
      e instanceof Float64Array ||
      e instanceof Int32Array ||
      e instanceof Uint32Array ||
      e instanceof Uint8Array ||
      e instanceof Uint16Array ||
      e instanceof Int16Array ||
      e instanceof Int8Array ||
      e instanceof Uint8ClampedArray
    )
      return { rr_type: e.constructor.name, args: [Object.values(e)] };
    if (e instanceof ArrayBuffer) {
      let r = e.constructor.name,
        o = dR(e);
      return { rr_type: r, base64: o };
    } else {
      if (e instanceof DataView)
        return {
          rr_type: e.constructor.name,
          args: [Ca(e.buffer, t, n), e.byteOffset, e.byteLength],
        };
      if (e instanceof HTMLImageElement) {
        let r = e.constructor.name,
          { src: o } = e;
        return { rr_type: r, src: o };
      } else if (e instanceof HTMLCanvasElement) {
        let r = 'HTMLImageElement',
          o = e.toDataURL();
        return { rr_type: r, src: o };
      } else {
        if (e instanceof ImageData)
          return { rr_type: e.constructor.name, args: [Ca(e.data, t, n), e.width, e.height] };
        if (og(e, t) || typeof e == 'object') {
          let r = e.constructor.name,
            o = ng(e, t, n);
          return { rr_type: r, index: o };
        }
      }
    }
    return e;
  }
  var rg = (e, t, n) => e.map((r) => Ca(r, t, n)),
    og = (e, t) =>
      !![
        'WebGLActiveInfo',
        'WebGLBuffer',
        'WebGLFramebuffer',
        'WebGLProgram',
        'WebGLRenderbuffer',
        'WebGLShader',
        'WebGLShaderPrecisionFormat',
        'WebGLTexture',
        'WebGLUniformLocation',
        'WebGLVertexArrayObject',
        'WebGLVertexArrayObjectOES',
      ]
        .filter((o) => typeof t[o] == 'function')
        .find((o) => e instanceof t[o]);
  function pR(e, t, n, r, o) {
    let i = [],
      s = Object.getOwnPropertyNames(t.CanvasRenderingContext2D.prototype);
    for (let a of s)
      try {
        if (typeof t.CanvasRenderingContext2D.prototype[a] != 'function') continue;
        let c = td(t.CanvasRenderingContext2D.prototype, a, function (u) {
          return function (...d) {
            return (
              Aa(this.canvas, n, r, o, !0) ||
                tg(() => {
                  let l = rg(d, t, this);
                  e(this.canvas, { type: eo['2D'], property: a, args: l });
                }, 0),
              u.apply(this, d)
            );
          };
        });
        i.push(c);
      } catch {
        let c = ed(t.CanvasRenderingContext2D.prototype, a, {
          set(u) {
            e(this.canvas, { type: eo['2D'], property: a, args: [u], setter: !0 });
          },
        });
        i.push(c);
      }
    return () => {
      i.forEach((a) => a());
    };
  }
  function mR(e) {
    return e === 'experimental-webgl' ? 'webgl' : e;
  }
  function Kh(e, t, n, r, o) {
    let i = [];
    try {
      let s = td(e.HTMLCanvasElement.prototype, 'getContext', function (a) {
        return function (c, ...u) {
          if (!Aa(this, t, n, r, !0)) {
            let d = mR(c);
            if (('__context' in this || (this.__context = d), o && ['webgl', 'webgl2'].includes(d)))
              if (u[0] && typeof u[0] == 'object') {
                let l = u[0];
                l.preserveDrawingBuffer || (l.preserveDrawingBuffer = !0);
              } else u.splice(0, 1, { preserveDrawingBuffer: !0 });
          }
          return a.apply(this, [c, ...u]);
        };
      });
      i.push(s);
    } catch {
      console.error('failed to patch HTMLCanvasElement.prototype.getContext');
    }
    return () => {
      i.forEach((s) => s());
    };
  }
  function Xh(e, t, n, r, o, i, s, a) {
    let c = [],
      u = Object.getOwnPropertyNames(e);
    for (let d of u)
      if (!['isContextLost', 'canvas', 'drawingBufferWidth', 'drawingBufferHeight'].includes(d))
        try {
          if (typeof e[d] != 'function') continue;
          let l = td(e, d, function (p) {
            return function (...f) {
              let m = p.apply(this, f);
              if ((ng(m, a, this), 'tagName' in this.canvas && !Aa(this.canvas, r, o, i, !0))) {
                let _ = rg(f, a, this),
                  g = { type: t, property: d, args: _ };
                n(this.canvas, g);
              }
              return m;
            };
          });
          c.push(l);
        } catch {
          let l = ed(e, d, {
            set(p) {
              n(this.canvas, { type: t, property: d, args: [p], setter: !0 });
            },
          });
          c.push(l);
        }
    return c;
  }
  function hR(e, t, n, r, o, i) {
    let s = [];
    return (
      s.push(...Xh(t.WebGLRenderingContext.prototype, eo.WebGL, e, n, r, o, i, t)),
      typeof t.WebGL2RenderingContext < 'u' &&
        s.push(...Xh(t.WebGL2RenderingContext.prototype, eo.WebGL2, e, n, r, o, i, t)),
      () => {
        s.forEach((a) => a());
      }
    );
  }
  var gR =
    'for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="undefined"==typeof Uint8Array?[]:new Uint8Array(256),a=0;a<64;a++)t[e.charCodeAt(a)]=a;var n=function(t){var a,n=new Uint8Array(t),r=n.length,s="";for(a=0;a<r;a+=3)s+=e[n[a]>>2],s+=e[(3&n[a])<<4|n[a+1]>>4],s+=e[(15&n[a+1])<<2|n[a+2]>>6],s+=e[63&n[a+2]];return r%3==2?s=s.substring(0,s.length-1)+"=":r%3==1&&(s=s.substring(0,s.length-2)+"=="),s};const r=new Map,s=new Map;const i=self;i.onmessage=async function(e){if(!("OffscreenCanvas"in globalThis))return i.postMessage({id:e.data.id});{const{id:t,bitmap:a,width:o,height:f,maxCanvasSize:c,dataURLOptions:g}=e.data,u=async function(e,t,a){const r=e+"-"+t;if("OffscreenCanvas"in globalThis){if(s.has(r))return s.get(r);const i=new OffscreenCanvas(e,t);i.getContext("2d");const o=await i.convertToBlob(a),f=await o.arrayBuffer(),c=n(f);return s.set(r,c),c}return""}(o,f,g),[h,d]=function(e,t,a){if(!a)return[e,t];const[n,r]=a;if(e<=n&&t<=r)return[e,t];let s=e,i=t;return s>n&&(i=Math.floor(n*t/e),s=n),i>r&&(s=Math.floor(r*e/t),i=r),[s,i]}(o,f,c),l=new OffscreenCanvas(h,d),w=l.getContext("bitmaprenderer"),p=h===o&&d===f?a:await createImageBitmap(a,{resizeWidth:h,resizeHeight:d,resizeQuality:"low"});w?.transferFromImageBitmap(p),a.close();const y=await l.convertToBlob(g),v=y.type,b=await y.arrayBuffer(),m=n(b);if(p.close(),!r.has(t)&&await u===m)return r.set(t,m),i.postMessage({id:t});if(r.get(t)===m)return i.postMessage({id:t});i.postMessage({id:t,type:v,base64:m,width:o,height:f}),r.set(t,m)}};';
  function _R() {
    let e = new Blob([gR]);
    return URL.createObjectURL(e);
  }
  var Ql = class {
    constructor(t) {
      ((this.pendingCanvasMutations = new Map()),
        (this.rafStamps = { latestId: 0, invokeId: null }),
        (this.shadowDoms = new Set()),
        (this.windowsSet = new WeakSet()),
        (this.windows = []),
        (this.restoreHandlers = []),
        (this.frozen = !1),
        (this.locked = !1),
        (this.snapshotInProgressMap = new Map()),
        (this.worker = null),
        (this.lastSnapshotTime = 0),
        (this.processMutation = (a, c) => {
          (((this.rafStamps.invokeId && this.rafStamps.latestId !== this.rafStamps.invokeId) ||
            !this.rafStamps.invokeId) &&
            (this.rafStamps.invokeId = this.rafStamps.latestId),
            this.pendingCanvasMutations.has(a) || this.pendingCanvasMutations.set(a, []),
            this.pendingCanvasMutations.get(a).push(c));
        }));
      let {
        enableManualSnapshot: n,
        sampling: r = 'all',
        win: o,
        recordCanvas: i,
        errorHandler: s,
      } = t;
      ((t.sampling = r),
        (this.mutationCb = t.mutationCb),
        (this.mirror = t.mirror),
        (this.options = t),
        s && uR(s),
        ((i && typeof r == 'number') || n) && (this.worker = this.initFPSWorker()),
        this.addWindow(o),
        !n &&
          Kl(() => {
            (i &&
              r === 'all' &&
              (this.startRAFTimestamping(), this.startPendingCanvasMutationFlusher()),
              i && typeof r == 'number' && this.initCanvasFPSObserver());
          })());
    }
    reset() {
      (this.pendingCanvasMutations.clear(),
        this.restoreHandlers.forEach((t) => {
          try {
            t();
          } catch {}
        }),
        (this.restoreHandlers = []),
        (this.windowsSet = new WeakSet()),
        (this.windows = []),
        (this.shadowDoms = new Set()),
        this.worker?.terminate(),
        (this.worker = null),
        (this.snapshotInProgressMap = new Map()));
    }
    freeze() {
      this.frozen = !0;
    }
    unfreeze() {
      this.frozen = !1;
    }
    lock() {
      this.locked = !0;
    }
    unlock() {
      this.locked = !1;
    }
    addWindow(t) {
      let {
        sampling: n = 'all',
        blockClass: r,
        blockSelector: o,
        unblockSelector: i,
        recordCanvas: s,
        enableManualSnapshot: a,
      } = this.options;
      if (!this.windowsSet.has(t)) {
        if (a) {
          (this.windowsSet.add(t), this.windows.push(new WeakRef(t)));
          return;
        }
        (Kl(() => {
          if (
            (s && n === 'all' && this.initCanvasMutationObserver(t, r, o, i),
            s && typeof n == 'number')
          ) {
            let c = Kh(t, r, o, i, !0);
            this.restoreHandlers.push(() => {
              c();
            });
          }
        })(),
          this.windowsSet.add(t),
          this.windows.push(new WeakRef(t)));
      }
    }
    addShadowRoot(t) {
      this.shadowDoms.add(new WeakRef(t));
    }
    resetShadowRoots() {
      this.shadowDoms = new Set();
    }
    snapshot(t, n) {
      if (n?.skipRequestAnimationFrame) {
        this.takeSnapshot(performance.now(), !0, t);
        return;
      }
      rr((r) => this.takeSnapshot(r, !0, t));
    }
    initFPSWorker() {
      let t = new Worker(_R());
      return (
        (t.onmessage = (n) => {
          let r = n.data,
            { id: o } = r;
          if ((this.snapshotInProgressMap.set(o, !1), !('base64' in r))) return;
          let { base64: i, type: s, width: a, height: c } = r;
          this.mutationCb({
            id: o,
            type: eo['2D'],
            commands: [
              { property: 'clearRect', args: [0, 0, a, c] },
              {
                property: 'drawImage',
                args: [
                  {
                    rr_type: 'ImageBitmap',
                    args: [
                      { rr_type: 'Blob', data: [{ rr_type: 'ArrayBuffer', base64: i }], type: s },
                    ],
                  },
                  0,
                  0,
                  a,
                  c,
                ],
              },
            ],
          });
        }),
        t
      );
    }
    initCanvasFPSObserver() {
      let t;
      if (!this.windows.length && !this.shadowDoms.size) return;
      let n = (r) => {
        (this.takeSnapshot(r, !1), (t = rr(n)));
      };
      ((t = rr(n)),
        this.restoreHandlers.push(() => {
          t && cancelAnimationFrame(t);
        }));
    }
    initCanvasMutationObserver(t, n, r, o) {
      let i = Kh(t, n, r, o, !1),
        s = pR(this.processMutation.bind(this), t, n, r, o),
        a = hR(this.processMutation.bind(this), t, n, r, o, this.mirror);
      this.restoreHandlers.push(() => {
        (i(), s(), a());
      });
    }
    getCanvasElements(t, n, r) {
      let o = [],
        i = (s) => {
          s.querySelectorAll('canvas').forEach((a) => {
            Aa(a, t, n, r, !0) || o.push(a);
          });
        };
      for (let s of this.windows) {
        let a = s.deref(),
          c;
        try {
          c = a && a.document;
        } catch {}
        c && i(c);
      }
      for (let s of this.shadowDoms) {
        let a = s.deref();
        a && i(a);
      }
      return o;
    }
    takeSnapshot(t, n, r) {
      let {
          sampling: o,
          blockClass: i,
          blockSelector: s,
          unblockSelector: a,
          dataURLOptions: c,
          maxCanvasSize: u,
        } = this.options,
        l = 1e3 / (o === 'all' ? 2 : o || 2);
      return this.lastSnapshotTime && t - this.lastSnapshotTime < l
        ? !1
        : ((this.lastSnapshotTime = t),
          (r ? [r] : this.getCanvasElements(i, s, a)).forEach((m) => {
            let _ = this.mirror.getId(m);
            if (
              !(
                !this.mirror.hasNode(m) ||
                !m.width ||
                !m.height ||
                this.snapshotInProgressMap.get(_)
              )
            ) {
              if (
                (this.snapshotInProgressMap.set(_, !0),
                !n && ['webgl', 'webgl2'].includes(m.__context))
              ) {
                let g = m.getContext(m.__context);
                g?.getContextAttributes()?.preserveDrawingBuffer === !1 &&
                  g.clear(g.COLOR_BUFFER_BIT);
              }
              createImageBitmap(m)
                .then((g) => {
                  this.worker?.postMessage(
                    {
                      id: _,
                      bitmap: g,
                      width: m.width,
                      height: m.height,
                      dataURLOptions: c,
                      maxCanvasSize: u,
                    },
                    [g]
                  );
                })
                .catch((g) => {
                  Kl(() => {
                    throw (this.snapshotInProgressMap.delete(_), g);
                  })();
                });
            }
          }),
          !0);
    }
    startPendingCanvasMutationFlusher() {
      rr(() => this.flushPendingCanvasMutations());
    }
    startRAFTimestamping() {
      let t = (n) => {
        ((this.rafStamps.latestId = n), rr(t));
      };
      rr(t);
    }
    flushPendingCanvasMutations() {
      (this.pendingCanvasMutations.forEach((t, n) => {
        let r = this.mirror.getId(n);
        this.flushPendingCanvasMutationFor(n, r);
      }),
        rr(() => this.flushPendingCanvasMutations()));
    }
    flushPendingCanvasMutationFor(t, n) {
      if (this.frozen || this.locked) return;
      let r = this.pendingCanvasMutations.get(t);
      if (!r || n === -1) return;
      let o = r.map((s) => {
          let { type: a, ...c } = s;
          return c;
        }),
        { type: i } = r[0];
      (this.mutationCb({ id: n, type: i, commands: o }), this.pendingCanvasMutations.delete(t));
    }
  };
  try {
    if (Array.from([1], (e) => e * 2)[0] !== 2) {
      let e = document.createElement('iframe');
      (document.body.appendChild(e),
        (Array.from = e.contentWindow?.Array.from || Array.from),
        document.body.removeChild(e));
    }
  } catch (e) {
    console.debug('Unable to override Array.from', e);
  }
  sR();
  var Zh;
  (function (e) {
    ((e[(e.NotStarted = 0)] = 'NotStarted'),
      (e[(e.Running = 1)] = 'Running'),
      (e[(e.Stopped = 2)] = 'Stopped'));
  })(Zh || (Zh = {}));
  var Qh = {
      low: { sampling: { canvas: 1 }, dataURLOptions: { type: 'image/webp', quality: 0.25 } },
      medium: { sampling: { canvas: 2 }, dataURLOptions: { type: 'image/webp', quality: 0.4 } },
      high: { sampling: { canvas: 4 }, dataURLOptions: { type: 'image/webp', quality: 0.5 } },
    },
    SR = 'ReplayCanvas',
    Ra = 1280,
    yR = (e = {}) => {
      let [t, n] = e.maxCanvasSize || [],
        r = {
          quality: e.quality || 'medium',
          enableManualSnapshot: e.enableManualSnapshot,
          maxCanvasSize: [t ? Math.min(t, Ra) : Ra, n ? Math.min(n, Ra) : Ra],
        },
        o,
        i = new Promise((s) => (o = s));
      return {
        name: SR,
        getOptions() {
          let { quality: s, enableManualSnapshot: a, maxCanvasSize: c } = r;
          return {
            enableManualSnapshot: a,
            recordCanvas: !0,
            getCanvasManager: (u) => {
              let d = new Ql({
                ...u,
                enableManualSnapshot: a,
                maxCanvasSize: c,
                errorHandler: (l) => {
                  try {
                    typeof l == 'object' && (l.__rrweb__ = !0);
                  } catch {}
                },
              });
              return (o(d), d);
            },
            ...(Qh[s] || Qh.medium),
          };
        },
        async snapshot(s, a) {
          (await i).snapshot(s, a);
        },
      };
    },
    ig = yR;
  var sg = new WeakMap(),
    nd = new Map(),
    gi = { traceFetch: !0, traceXHR: !0, enableHTTPTimings: !0, trackFetchStreamPerformance: !1 };
  function ka(e, t) {
    let {
        traceFetch: n,
        traceXHR: r,
        trackFetchStreamPerformance: o,
        shouldCreateSpanForRequest: i,
        enableHTTPTimings: s,
        tracePropagationTargets: a,
        onRequestSpanStart: c,
      } = { ...gi, ...t },
      u = typeof i == 'function' ? i : (f) => !0,
      d = (f) => bR(f, a),
      l = {},
      p = e.getOptions().propagateTraceparent;
    (n &&
      (e.addEventProcessor(
        (f) => (
          f.type === 'transaction' &&
            f.spans &&
            f.spans.forEach((m) => {
              if (m.op === 'http.client') {
                let _ = nd.get(m.span_id);
                _ && ((m.timestamp = _ / 1e3), nd.delete(m.span_id));
              }
            }),
          f
        )
      ),
      o &&
        pu((f) => {
          if (f.response) {
            let m = sg.get(f.response);
            m && f.endTimestamp && nd.set(m, f.endTimestamp);
          }
        }),
      qn((f) => {
        let m = su(f, u, d, l, { propagateTraceparent: p });
        if ((f.response && f.fetchData.__span && sg.set(f.response, f.fetchData.__span), m)) {
          let _ = cg(f.fetchData.url),
            g = _ ? Ft(_).host : void 0;
          (m.setAttributes({ 'http.url': _, 'server.address': g }),
            s && ag(m),
            c?.(m, { headers: f.headers }));
        }
      })),
      r &&
        er((f) => {
          let m = TR(f, u, d, l, p);
          if (m) {
            s && ag(m);
            let _;
            try {
              _ = new Headers(f.xhr.__sentry_xhr_v3__?.request_headers);
            } catch {}
            c?.(m, { headers: _ });
          }
        }));
  }
  function ER(e) {
    return (
      e.entryType === 'resource' &&
      'initiatorType' in e &&
      typeof e.nextHopProtocol == 'string' &&
      (e.initiatorType === 'fetch' || e.initiatorType === 'xmlhttprequest')
    );
  }
  function ag(e) {
    let { url: t } = D(e).data;
    if (!t || typeof t != 'string') return;
    let n = _t('resource', ({ entries: r }) => {
      r.forEach((o) => {
        ER(o) && o.name.endsWith(t) && (e.setAttributes(Qo(o)), setTimeout(n));
      });
    });
  }
  function bR(e, t) {
    let n = Xe();
    if (n) {
      let r, o;
      try {
        ((r = new URL(e, n)), (o = new URL(n).origin));
      } catch {
        return !1;
      }
      let i = r.origin === o;
      return t ? Ue(r.toString(), t) || (i && Ue(r.pathname, t)) : i;
    } else {
      let r = !!e.match(/^\/(?!\/)/);
      return t ? Ue(e, t) : r;
    }
  }
  function TR(e, t, n, r, o) {
    let i = e.xhr,
      s = i?.[Qe];
    if (!i || i.__sentry_own_request__ || !s) return;
    let { url: a, method: c } = s,
      u = Ne() && t(a);
    if (e.endTimestamp && u) {
      let g = i.__sentry_xhr_span_id__;
      if (!g) return;
      let S = r[g];
      S && s.status_code !== void 0 && (Yt(S, s.status_code), S.end(), delete r[g]);
      return;
    }
    let d = cg(a),
      l = d ? Ft(d) : Ft(a),
      p = Do(a),
      f = !!Z(),
      m =
        u && f
          ? st({
              name: `${c} ${p}`,
              attributes: {
                url: a,
                type: 'xhr',
                'http.method': c,
                'http.url': d,
                'server.address': l?.host,
                [X]: 'auto.http.browser',
                [Se]: 'http.client',
                ...(l?.search && { 'http.query': l?.search }),
                ...(l?.hash && { 'http.fragment': l?.hash }),
              },
            })
          : new Ye();
    ((i.__sentry_xhr_span_id__ = m.spanContext().spanId),
      (r[i.__sentry_xhr_span_id__] = m),
      n(a) && IR(i, Ne() && f ? m : void 0, o));
    let _ = b();
    return (_ && _.emit('beforeOutgoingRequestSpan', m, e), m);
  }
  function IR(e, t, n) {
    let {
      'sentry-trace': r,
      baggage: o,
      traceparent: i,
    } = Gn({ span: t, propagateTraceparent: n });
    r && vR(e, r, o, i);
  }
  function vR(e, t, n, r) {
    let o = e.__sentry_xhr_v3__?.request_headers;
    if (!(o?.['sentry-trace'] || !e.setRequestHeader))
      try {
        if (
          (e.setRequestHeader('sentry-trace', t),
          r && !o?.traceparent && e.setRequestHeader('traceparent', r),
          n)
        ) {
          let i = o?.baggage;
          (!i || !wR(i)) && e.setRequestHeader('baggage', n);
        }
      } catch {}
  }
  function wR(e) {
    return e.split(',').some((t) => t.trim().startsWith('sentry-'));
  }
  function cg(e) {
    try {
      return new URL(e, O.location.origin).href;
    } catch {
      return;
    }
  }
  function ug() {
    O.document
      ? O.document.addEventListener('visibilitychange', () => {
          let e = Z();
          if (!e) return;
          let t = re(e);
          if (O.document.hidden && t) {
            let n = 'cancelled',
              { op: r, status: o } = D(t);
            (B &&
              h.log(`[Tracing] Transaction: ${n} -> since tab moved to the background, op: ${r}`),
              o || t.setStatus({ code: 2, message: n }),
              t.setAttribute('sentry.cancellation_reason', 'document.hidden'),
              t.end());
          }
        })
      : B &&
        h.warn(
          '[Tracing] Could not set up background tab detection due to lack of global document'
        );
  }
  var RR = 3600,
    lg = 'sentry_previous_trace',
    xR = 'sentry.previous_trace';
  function dg(e, { linkPreviousTrace: t, consistentTraceSampling: n }) {
    let r = t === 'session-storage',
      o = r ? kR() : void 0;
    e.on('spanStart', (s) => {
      if (re(s) !== s) return;
      let a = M().getPropagationContext();
      ((o = CR(o, s, a)), r && AR(o));
    });
    let i = !0;
    n &&
      e.on('beforeSampling', (s) => {
        if (!o) return;
        let a = M(),
          c = a.getPropagationContext();
        if (i && c.parentSpanId) {
          i = !1;
          return;
        }
        (a.setPropagationContext({
          ...c,
          dsc: { ...c.dsc, sample_rate: String(o.sampleRate), sampled: String(rd(o.spanContext)) },
          sampleRand: o.sampleRand,
        }),
          (s.parentSampled = rd(o.spanContext)),
          (s.parentSampleRate = o.sampleRate),
          (s.spanAttributes = { ...s.spanAttributes, [lo]: o.sampleRate }));
      });
  }
  function CR(e, t, n) {
    let r = D(t);
    function o() {
      try {
        return Number(n.dsc?.sample_rate) ?? Number(r.data?.[en]);
      } catch {
        return 0;
      }
    }
    let i = {
      spanContext: t.spanContext(),
      startTimestamp: r.start_timestamp,
      sampleRate: o(),
      sampleRand: n.sampleRand,
    };
    if (!e) return i;
    let s = e.spanContext;
    return s.traceId === r.trace_id
      ? e
      : (Date.now() / 1e3 - e.startTimestamp <= RR &&
          (B &&
            h.log(`Adding previous_trace ${s} link to span ${{ op: r.op, ...t.spanContext() }}`),
          t.addLink({ context: s, attributes: { [tc]: 'previous_trace' } }),
          t.setAttribute(xR, `${s.traceId}-${s.spanId}-${rd(s) ? 1 : 0}`)),
        i);
  }
  function AR(e) {
    try {
      O.sessionStorage.setItem(lg, JSON.stringify(e));
    } catch (t) {
      B && h.warn('Could not store previous trace in sessionStorage', t);
    }
  }
  function kR() {
    try {
      let e = O.sessionStorage?.getItem(lg);
      return JSON.parse(e);
    } catch {
      return;
    }
  }
  function rd(e) {
    return e.traceFlags === 1;
  }
  var NR = 'BrowserTracing',
    MR = {
      ..._r,
      instrumentNavigation: !0,
      instrumentPageLoad: !0,
      markBackgroundSpan: !0,
      enableLongTask: !0,
      enableLongAnimationFrame: !0,
      enableInp: !0,
      enableElementTiming: !0,
      ignoreResourceSpans: [],
      ignorePerformanceApiSpans: [],
      detectRedirects: !0,
      linkPreviousTrace: 'in-memory',
      consistentTraceSampling: !1,
      enableReportPageLoaded: !1,
      _experiments: {},
      ...gi,
    },
    hg = (e = {}) => {
      let t = { name: void 0, source: void 0 },
        n = O.document,
        {
          enableInp: r,
          enableElementTiming: o,
          enableLongTask: i,
          enableLongAnimationFrame: s,
          _experiments: {
            enableInteractions: a,
            enableStandaloneClsSpans: c,
            enableStandaloneLcpSpans: u,
          },
          beforeStartSpan: d,
          idleTimeout: l,
          finalTimeout: p,
          childSpanTimeout: f,
          markBackgroundSpan: m,
          traceFetch: _,
          traceXHR: g,
          trackFetchStreamPerformance: S,
          shouldCreateSpanForRequest: E,
          enableHTTPTimings: P,
          ignoreResourceSpans: w,
          ignorePerformanceApiSpans: F,
          instrumentPageLoad: A,
          instrumentNavigation: T,
          detectRedirects: R,
          linkPreviousTrace: I,
          consistentTraceSampling: k,
          enableReportPageLoaded: H,
          onRequestSpanStart: x,
        } = { ...MR, ...e },
        L,
        q,
        J;
      function ne(C, z, N = !0) {
        let $ = z.op === 'pageload',
          Q = z.name,
          ae = d ? d(z) : z,
          we = ae.attributes || {};
        if ((Q !== ae.name && ((we[Ie] = 'custom'), (ae.attributes = we)), !N)) {
          let Mt = dt();
          st({ ...ae, startTime: Mt }).end(Mt);
          return;
        }
        ((t.name = ae.name), (t.source = we[Ie]));
        let ye = Ji(ae, {
          idleTimeout: l,
          finalTimeout: p,
          childSpanTimeout: f,
          disableAutoFinish: $,
          beforeSpanEnd: (Mt) => {
            (L?.(),
              Yu(Mt, {
                recordClsOnPageloadSpan: !c,
                recordLcpOnPageloadSpan: !u,
                ignoreResourceSpans: w,
                ignorePerformanceApiSpans: F,
              }),
              pg(C, void 0));
            let yt = M(),
              ct = yt.getPropagationContext();
            (yt.setPropagationContext({
              ...ct,
              traceId: ye.spanContext().traceId,
              sampled: pt(ye),
              dsc: Re(Mt),
            }),
              $ && (J = void 0));
          },
          trimIdleSpanEndTimestamp: !H,
        });
        ($ && H && (J = ye), pg(C, ye));
        function mn() {
          n &&
            ['interactive', 'complete'].includes(n.readyState) &&
            C.emit('idleSpanEnableAutoFinish', ye);
        }
        $ &&
          !H &&
          n &&
          (n.addEventListener('readystatechange', () => {
            mn();
          }),
          mn());
      }
      return {
        name: NR,
        setup(C) {
          if (
            (So(),
            (L = zu({
              recordClsStandaloneSpans: c || !1,
              recordLcpStandaloneSpans: u || !1,
              client: C,
            })),
            r && el(),
            o && Ju(),
            s &&
            v.PerformanceObserver &&
            PerformanceObserver.supportedEntryTypes &&
            PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')
              ? qu()
              : i && ju(),
            a && Vu(),
            R && n)
          ) {
            let N = () => {
              q = K();
            };
            (addEventListener('click', N, { capture: !0 }),
              addEventListener('keydown', N, { capture: !0, passive: !0 }));
          }
          function z() {
            let N = _i(C);
            N &&
              !D(N).timestamp &&
              (B && h.log(`[Tracing] Finishing current active span with op: ${D(N).op}`),
              N.setAttribute(En, 'cancelled'),
              N.end());
          }
          (C.on('startNavigationSpan', (N, $) => {
            if (b() !== C) return;
            if ($?.isRedirect) {
              (B &&
                h.warn(
                  '[Tracing] Detected redirect, navigation span will not be the root span, but a child span.'
                ),
                ne(C, { op: 'navigation.redirect', ...N }, !1));
              return;
            }
            ((q = void 0),
              z(),
              se().setPropagationContext({
                traceId: Be(),
                sampleRand: Math.random(),
                propagationSpanId: Ne() ? void 0 : je(),
              }));
            let Q = M();
            (Q.setPropagationContext({
              traceId: Be(),
              sampleRand: Math.random(),
              propagationSpanId: Ne() ? void 0 : je(),
            }),
              Q.setSDKProcessingMetadata({ normalizedRequest: void 0 }),
              ne(C, { op: 'navigation', ...N, parentSpan: null, forceTransaction: !0 }));
          }),
            C.on('startPageLoadSpan', (N, $ = {}) => {
              if (b() !== C) return;
              z();
              let Q = $.sentryTrace || fg('sentry-trace'),
                ae = $.baggage || fg('baggage'),
                we = po(Q, ae),
                ye = M();
              (ye.setPropagationContext(we),
                Ne() || (ye.getPropagationContext().propagationSpanId = je()),
                ye.setSDKProcessingMetadata({ normalizedRequest: Yo() }),
                ne(C, { op: 'pageload', ...N }));
            }),
            C.on('endPageloadSpan', () => {
              H && J && (J.setAttribute(En, 'reportPageLoaded'), J.end());
            }));
        },
        afterAllSetup(C) {
          let z = Xe();
          if (
            (I !== 'off' && dg(C, { linkPreviousTrace: I, consistentTraceSampling: k }), O.location)
          ) {
            if (A) {
              let N = _e();
              od(C, {
                name: O.location.pathname,
                startTime: N ? N / 1e3 : void 0,
                attributes: { [Ie]: 'url', [X]: 'auto.pageload.browser' },
              });
            }
            T &&
              dn(({ to: N, from: $ }) => {
                if ($ === void 0 && z?.indexOf(N) !== -1) {
                  z = void 0;
                  return;
                }
                z = void 0;
                let Q = Wn(N),
                  ae = _i(C),
                  we = ae && R && LR(ae, q);
                id(
                  C,
                  {
                    name: Q?.pathname || O.location.pathname,
                    attributes: { [Ie]: 'url', [X]: 'auto.navigation.browser' },
                  },
                  { url: N, isRedirect: we }
                );
              });
          }
          (m && ug(),
            a && OR(C, l, p, f, t),
            r && tl(),
            ka(C, {
              traceFetch: _,
              traceXHR: g,
              trackFetchStreamPerformance: S,
              tracePropagationTargets: C.getOptions().tracePropagationTargets,
              shouldCreateSpanForRequest: E,
              enableHTTPTimings: P,
              onRequestSpanStart: x,
            }));
        },
      };
    };
  function od(e, t, n) {
    (e.emit('startPageLoadSpan', t, n), M().setTransactionName(t.name));
    let r = _i(e);
    return (r && e.emit('afterStartPageLoadSpan', r), r);
  }
  function id(e, t, n) {
    let { url: r, isRedirect: o } = n || {};
    (e.emit('beforeStartNavigationSpan', t, { isRedirect: o }),
      e.emit('startNavigationSpan', t, { isRedirect: o }));
    let i = M();
    return (
      i.setTransactionName(t.name),
      r && !o && i.setSDKProcessingMetadata({ normalizedRequest: { ...Yo(), url: r } }),
      _i(e)
    );
  }
  function fg(e) {
    return O.document?.querySelector(`meta[name=${e}]`)?.getAttribute('content') || void 0;
  }
  function OR(e, t, n, r, o) {
    let i = O.document,
      s,
      a = () => {
        let c = 'ui.action.click',
          u = _i(e);
        if (u) {
          let d = D(u).op;
          if (['navigation', 'pageload'].includes(d)) {
            B &&
              h.warn(
                `[Tracing] Did not create ${c} span because a pageload or navigation span is in progress.`
              );
            return;
          }
        }
        if ((s && (s.setAttribute(En, 'interactionInterrupted'), s.end(), (s = void 0)), !o.name)) {
          B &&
            h.warn(
              `[Tracing] Did not create ${c} transaction because _latestRouteName is missing.`
            );
          return;
        }
        s = Ji(
          { name: o.name, op: c, attributes: { [Ie]: o.source || 'url' } },
          { idleTimeout: t, finalTimeout: n, childSpanTimeout: r }
        );
      };
    i && addEventListener('click', a, { capture: !0 });
  }
  var gg = '_sentry_idleSpan';
  function _i(e) {
    return e[gg];
  }
  function pg(e, t) {
    he(e, gg, t);
  }
  var mg = 1.5;
  function LR(e, t) {
    let n = D(e),
      r = dt(),
      o = n.start_timestamp;
    return !(r - o > mg || (t && r - t <= mg));
  }
  function _g(e = b()) {
    e?.emit('endPageloadSpan');
  }
  function Sg(e) {
    let t = Z();
    if (t === e) return;
    let n = M();
    ((e.end = new Proxy(e.end, {
      apply(r, o, i) {
        return (it(n, t), Reflect.apply(r, o, i));
      },
    })),
      it(n, e));
  }
  function to(e) {
    return new Promise((t, n) => {
      ((e.oncomplete = e.onsuccess = () => t(e.result)),
        (e.onabort = e.onerror = () => n(e.error)));
    });
  }
  function DR(e, t) {
    let n = indexedDB.open(e);
    n.onupgradeneeded = () => n.result.createObjectStore(t);
    let r = to(n);
    return (o) => r.then((i) => o(i.transaction(t, 'readwrite').objectStore(t)));
  }
  function sd(e) {
    return to(e.getAllKeys());
  }
  function PR(e, t, n) {
    return e((r) =>
      sd(r).then((o) => {
        if (!(o.length >= n)) return (r.put(t, Math.max(...o, 0) + 1), to(r.transaction));
      })
    );
  }
  function FR(e, t, n) {
    return e((r) =>
      sd(r).then((o) => {
        if (!(o.length >= n)) return (r.put(t, Math.min(...o, 0) - 1), to(r.transaction));
      })
    );
  }
  function UR(e) {
    return e((t) =>
      sd(t).then((n) => {
        let r = n[0];
        if (r != null)
          return to(t.get(r)).then((o) => (t.delete(r), to(t.transaction).then(() => o)));
      })
    );
  }
  function BR(e) {
    let t;
    function n() {
      return (t == null && (t = DR(e.dbName || 'sentry-offline', e.storeName || 'queue')), t);
    }
    return {
      push: async (r) => {
        try {
          let o = await bn(r);
          await PR(n(), o, e.maxQueueSize || 30);
        } catch {}
      },
      unshift: async (r) => {
        try {
          let o = await bn(r);
          await FR(n(), o, e.maxQueueSize || 30);
        } catch {}
      },
      shift: async () => {
        try {
          let r = await UR(n());
          if (r) return lc(r);
        } catch {}
      },
    };
  }
  function HR(e) {
    return (t) => {
      let n = e({ ...t, createStore: BR });
      return (
        O.addEventListener('online', async (r) => {
          await n.flush();
        }),
        n
      );
    };
  }
  function yg(e = Hr) {
    return HR(Gc(e));
  }
  var Eg = 1e6,
    Na = String(0),
    $R = 'main',
    Ma = O.navigator,
    Tg = '',
    Ig = '',
    vg = '',
    ad = Ma?.userAgent || '',
    wg = '',
    WR = Ma?.language || Ma?.languages?.[0] || '';
  function GR(e) {
    return typeof e == 'object' && e !== null && 'getHighEntropyValues' in e;
  }
  var bg = Ma?.userAgentData;
  GR(bg) &&
    bg
      .getHighEntropyValues([
        'architecture',
        'model',
        'platform',
        'platformVersion',
        'fullVersionList',
      ])
      .then((e) => {
        if (
          ((Tg = e.platform || ''),
          (vg = e.architecture || ''),
          (wg = e.model || ''),
          (Ig = e.platformVersion || ''),
          e.fullVersionList?.length)
        ) {
          let t = e.fullVersionList[e.fullVersionList.length - 1];
          ad = `${t.brand} ${t.version}`;
        }
      })
      .catch((e) => {});
  function zR(e) {
    return !('thread_metadata' in e);
  }
  function jR(e) {
    return zR(e) ? YR(e) : e;
  }
  function qR(e) {
    let t = e.contexts?.trace?.trace_id;
    return (
      typeof t == 'string' &&
        t.length !== 32 &&
        B &&
        h.log(`[Profiling] Invalid traceId: ${t} on profiled event`),
      typeof t != 'string' ? '' : t
    );
  }
  function VR(e, t, n, r) {
    if (r.type !== 'transaction')
      throw new TypeError(
        'Profiling events may only be attached to transactions, this should never occur.'
      );
    if (n == null)
      throw new TypeError(
        `Cannot construct profiling event envelope without a valid profile. Got ${n} instead.`
      );
    let o = qR(r),
      i = jR(n),
      s = t || (typeof r.start_timestamp == 'number' ? r.start_timestamp * 1e3 : K() * 1e3),
      a = typeof r.timestamp == 'number' ? r.timestamp * 1e3 : K() * 1e3;
    return {
      event_id: e,
      timestamp: new Date(s).toISOString(),
      platform: 'javascript',
      version: '1',
      release: r.release || '',
      environment: r.environment || nn,
      runtime: { name: 'javascript', version: O.navigator.userAgent },
      os: { name: Tg, version: Ig, build_number: ad },
      device: { locale: WR, model: wg, manufacturer: ad, architecture: vg, is_emulator: !1 },
      debug_meta: { images: JR(n.resources) },
      profile: i,
      transactions: [
        {
          name: r.transaction || '',
          id: r.event_id || ge(),
          trace_id: o,
          active_thread_id: Na,
          relative_start_ns: '0',
          relative_end_ns: ((a - s) * 1e6).toFixed(0),
        },
      ],
    };
  }
  function Oa(e) {
    return D(e).op === 'pageload';
  }
  function YR(e) {
    let t,
      n = 0,
      r = { samples: [], stacks: [], frames: [], thread_metadata: { [Na]: { name: $R } } },
      o = e.samples[0];
    if (!o) return r;
    let i = o.timestamp,
      s = _e(),
      a = typeof performance.timeOrigin == 'number' ? performance.timeOrigin : s || 0,
      c = a - (s || a);
    return (
      e.samples.forEach((u, d) => {
        if (u.stackId === void 0) {
          (t === void 0 && ((t = n), (r.stacks[t] = []), n++),
            (r.samples[d] = {
              elapsed_since_start_ns: ((u.timestamp + c - i) * Eg).toFixed(0),
              stack_id: t,
              thread_id: Na,
            }));
          return;
        }
        let l = e.stacks[u.stackId],
          p = [];
        for (; l; ) {
          p.push(l.frameId);
          let m = e.frames[l.frameId];
          (m &&
            r.frames[l.frameId] === void 0 &&
            (r.frames[l.frameId] = {
              function: m.name,
              abs_path: typeof m.resourceId == 'number' ? e.resources[m.resourceId] : void 0,
              lineno: m.line,
              colno: m.column,
            }),
            (l = l.parentId === void 0 ? void 0 : e.stacks[l.parentId]));
        }
        let f = {
          elapsed_since_start_ns: ((u.timestamp + c - i) * Eg).toFixed(0),
          stack_id: n,
          thread_id: Na,
        };
        ((r.stacks[n] = p), (r.samples[d] = f), n++);
      }),
      r
    );
  }
  function Rg(e, t) {
    if (!t.length) return e;
    for (let n of t) e[1].push([{ type: 'profile' }, n]);
    return e;
  }
  function xg(e) {
    let t = [];
    return (
      mt(e, (n, r) => {
        if (r === 'transaction')
          for (let o = 1; o < n.length; o++) n[o]?.contexts?.profile?.profile_id && t.push(n[o]);
      }),
      t
    );
  }
  function JR(e) {
    let r = b()?.getOptions()?.stackParser;
    return r ? bc(r, e) : [];
  }
  function KR(e) {
    return (typeof e != 'number' && typeof e != 'boolean') || (typeof e == 'number' && isNaN(e))
      ? (B &&
          h.warn(
            `[Profiling] Invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(e)} of type ${JSON.stringify(typeof e)}.`
          ),
        !1)
      : e === !0 || e === !1
        ? !0
        : e < 0 || e > 1
          ? (B &&
              h.warn(
                `[Profiling] Invalid sample rate. Sample rate must be between 0 and 1. Got ${e}.`
              ),
            !1)
          : !0;
  }
  function XR(e) {
    return e.samples.length < 2
      ? (B && h.log('[Profiling] Discarding profile because it contains less than 2 samples'), !1)
      : e.frames.length
        ? !0
        : (B && h.log('[Profiling] Discarding profile because it contains no frames'), !1);
  }
  var Cg = !1,
    cd = 3e4;
  function ZR(e) {
    return typeof e == 'function';
  }
  function Ag() {
    let e = O.Profiler;
    if (!ZR(e)) {
      B &&
        h.log(
          '[Profiling] Profiling is not supported by this browser, Profiler interface missing on window object.'
        );
      return;
    }
    let t = 10,
      n = Math.floor(cd / t);
    try {
      return new e({ sampleInterval: t, maxBufferSize: n });
    } catch {
      (B &&
        (h.log(
          "[Profiling] Failed to initialize the Profiling constructor, this is likely due to a missing 'Document-Policy': 'js-profiling' header."
        ),
        h.log('[Profiling] Disabling profiling for current user session.')),
        (Cg = !0));
    }
  }
  function ud(e) {
    if (Cg)
      return (
        B &&
          h.log(
            '[Profiling] Profiling has been disabled for the duration of the current user session.'
          ),
        !1
      );
    if (!e.isRecording())
      return (
        B && h.log('[Profiling] Discarding profile because transaction was not sampled.'),
        !1
      );
    let n = b()?.getOptions();
    if (!n) return (B && h.log('[Profiling] Profiling disabled, no options found.'), !1);
    let r = n.profilesSampleRate;
    return KR(r)
      ? r
        ? (r === !0 ? !0 : Math.random() < r)
          ? !0
          : (B &&
              h.log(
                `[Profiling] Discarding profile because it's not included in the random sample (sampling rate = ${Number(r)})`
              ),
            !1)
        : (B &&
            h.log(
              '[Profiling] Discarding profile because a negative sampling decision was inherited or profileSampleRate is set to 0'
            ),
          !1)
      : (B && h.warn('[Profiling] Discarding profile because of invalid sample rate.'), !1);
  }
  function kg(e, t, n, r) {
    return XR(n) ? VR(e, t, n, r) : null;
  }
  var or = new Map();
  function Ng() {
    return or.size;
  }
  function Mg(e) {
    let t = or.get(e);
    return (t && or.delete(e), t);
  }
  function Og(e, t) {
    if ((or.set(e, t), or.size > 30)) {
      let n = or.keys().next().value;
      or.delete(n);
    }
  }
  function ld(e) {
    let t;
    Oa(e) && (t = K() * 1e3);
    let n = Ag();
    if (!n) return;
    B && h.log(`[Profiling] started profiling span: ${D(e).description}`);
    let r = ge();
    M().setContext('profile', { profile_id: r, start_timestamp: t });
    async function o() {
      if (e && n)
        return n
          .stop()
          .then((c) => {
            if (
              (i && (O.clearTimeout(i), (i = void 0)),
              B && h.log(`[Profiling] stopped profiling of span: ${D(e).description}`),
              !c)
            ) {
              B &&
                h.log(
                  `[Profiling] profiler returned null profile for: ${D(e).description}`,
                  'this may indicate an overlapping span or a call to stopProfiling with a profile title that was never started'
                );
              return;
            }
            Og(r, c);
          })
          .catch((c) => {
            B && h.log('[Profiling] error while stopping profiler:', c);
          });
    }
    let i = O.setTimeout(() => {
        (B &&
          h.log(
            '[Profiling] max profile duration elapsed, stopping profiling for:',
            D(e).description
          ),
          o());
      }, cd),
      s = e.end.bind(e);
    function a() {
      return e
        ? (o().then(
            () => {
              s();
            },
            () => {
              s();
            }
          ),
          e)
        : s();
    }
    e.end = a;
  }
  var QR = 'BrowserProfiling',
    ex = () => ({
      name: QR,
      setup(e) {
        let t = Z(),
          n = t && re(t);
        (n && Oa(n) && ud(n) && ld(n),
          e.on('spanStart', (r) => {
            r === re(r) && ud(r) && ld(r);
          }),
          e.on('beforeEnvelope', (r) => {
            if (!Ng()) return;
            let o = xg(r);
            if (!o.length) return;
            let i = [];
            for (let s of o) {
              let a = s?.contexts,
                c = a?.profile?.profile_id,
                u = a?.profile?.start_timestamp;
              if (typeof c != 'string') {
                B && h.log('[Profiling] cannot find profile for a span without a profile context');
                continue;
              }
              if (!c) {
                B && h.log('[Profiling] cannot find profile for a span without a profile context');
                continue;
              }
              a?.profile && delete a.profile;
              let d = Mg(c);
              if (!d) {
                B && h.log(`[Profiling] Could not retrieve profile for span: ${c}`);
                continue;
              }
              let l = kg(c, u, d, s);
              l && i.push(l);
            }
            Rg(r, i);
          }));
      },
    }),
    Lg = ex;
  var tx = 'SpotlightBrowser',
    nx = (e = {}) => {
      let t = e.sidecarUrl || 'http://localhost:8969/stream';
      return {
        name: tx,
        setup: () => {
          B && h.log('Using Sidecar URL', t);
        },
        processEvent: (n) => (ox(n) ? null : n),
        afterAllSetup: (n) => {
          rx(n, t);
        },
      };
    };
  function rx(e, t) {
    let n = Ur('fetch'),
      r = 0;
    e.on('beforeEnvelope', (o) => {
      if (r > 3) {
        h.warn(
          '[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests:',
          r
        );
        return;
      }
      n(t, {
        method: 'POST',
        body: bn(o),
        headers: { 'Content-Type': 'application/x-sentry-envelope' },
        mode: 'cors',
      }).then(
        (i) => {
          i.status >= 200 && i.status < 400 && (r = 0);
        },
        (i) => {
          (r++,
            h.error(
              "Sentry SDK can't connect to Sidecar is it running? See: https://spotlightjs.com/sidecar/npx/",
              i
            ));
        }
      );
    });
  }
  var Dg = nx;
  function ox(e) {
    return !!(
      e.type === 'transaction' &&
      e.spans &&
      e.contexts?.trace &&
      e.contexts.trace.op === 'ui.action.click' &&
      e.spans.some(({ description: t }) => t?.includes('#sentry-spotlight'))
    );
  }
  var Pg = () => ({
    name: 'LaunchDarkly',
    processEvent(e, t, n) {
      return Ut(e);
    },
  });
  function Fg() {
    return {
      name: 'sentry-flag-auditor',
      type: 'flag-used',
      synchronous: !0,
      method: (e, t, n) => {
        (xt(e, t.value), Ct(e, t.value));
      },
    };
  }
  var Ug = () => ({
      name: 'OpenFeature',
      processEvent(e, t, n) {
        return Ut(e);
      },
    }),
    La = class {
      after(t, n) {
        (xt(n.flagKey, n.value), Ct(n.flagKey, n.value));
      }
      error(t, n, r) {
        (xt(t.flagKey, t.defaultValue), Ct(t.flagKey, t.defaultValue));
      }
    };
  var Bg = ({ featureFlagClientClass: e }) => ({
    name: 'Unleash',
    setupOnce() {
      let t = e.prototype;
      be(t, 'isEnabled', ix);
    },
    processEvent(t, n, r) {
      return Ut(t);
    },
  });
  function ix(e) {
    return function (...t) {
      let n = t[0],
        r = e.apply(this, t);
      return (
        typeof n == 'string' && typeof r == 'boolean'
          ? (xt(n, r), Ct(n, r))
          : B &&
            h.error(
              `[Feature Flags] UnleashClient.isEnabled does not match expected signature. arg0: ${n} (${typeof n}), result: ${r} (${typeof r})`
            ),
        r
      );
    };
  }
  var Hg = ({ featureFlagClient: e }) => ({
    name: 'Statsig',
    setup(t) {
      e.on('gate_evaluation', (n) => {
        (xt(n.gate.name, n.gate.value), Ct(n.gate.name, n.gate.value));
      });
    },
    processEvent(t, n, r) {
      return Ut(t);
    },
  });
  async function $g() {
    let e = b();
    if (!e) return 'no-client-active';
    if (!e.getDsn()) return 'no-dsn-configured';
    try {
      await bo(() =>
        fetch(
          'https://o447951.ingest.sentry.io/api/4509632503087104/envelope/?sentry_version=7&sentry_key=c1dfb07d783ad5325c245c1fd3725390&sentry_client=sentry.javascript.browser%2F1.33.7',
          { body: '{}', method: 'POST', mode: 'cors', credentials: 'omit' }
        )
      );
    } catch {
      return 'sentry-unreachable';
    }
  }
  var sx = 'WebWorker',
    Gg = ({ worker: e }) => ({
      name: sx,
      setupOnce: () => {
        (Array.isArray(e) ? e : [e]).forEach((t) => Wg(t));
      },
      addWorker: (t) => Wg(t),
    });
  function Wg(e) {
    e.addEventListener('message', (t) => {
      ax(t.data) &&
        (t.stopImmediatePropagation(),
        B && h.log('Sentry debugId web worker message received', t.data),
        (O._sentryDebugIds = { ...t.data._sentryDebugIds, ...O._sentryDebugIds }));
    });
  }
  function zg({ self: e }) {
    e.postMessage({ _sentryMessage: !0, _sentryDebugIds: e._sentryDebugIds ?? void 0 });
  }
  function ax(e) {
    return (
      Ge(e) &&
      e._sentryMessage === !0 &&
      '_sentryDebugIds' in e &&
      (Ge(e._sentryDebugIds) || e._sentryDebugIds === void 0)
    );
  }
  return Jg(cx);
})();
