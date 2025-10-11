// Admin CMS entry (npm) — decap-cms-app path (scaffold)
// This file is not yet wired in production. See ADR-002 and the migration playbook.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - decap-cms-app provides default export CMS
import CMS from 'decap-cms-app';

// Basic config; prefer reading from /admin/config.yml when feasible, but CMS.init allows inline
const config = {
  backend: {
    name: 'github',
    repo: 'verlyn13/liteckyeditingservices',
    branch: 'main',
    base_url: 'https://www.liteckyeditingservices.com',
    auth_endpoint: '/api/auth',
    use_graphql: true,
  },
  site_url: 'https://www.liteckyeditingservices.com',
  media_folder: 'public/images/uploads',
  public_folder: '/images/uploads',
  publish_mode: 'editorial_workflow',
};

CMS.init({ config });

// Canonical auth success re-emit listener
window.addEventListener(
  'message',
  (e) => {
    if (e.origin !== window.location.origin) return;
    const s = String(e.data || '');
    if (!s.startsWith('authorization:github:success:')) return;
    try {
      const payload = JSON.parse(s.slice('authorization:github:success:'.length));
      const token = payload?.token as string | undefined;
      if (!token) return;
      const user = { token, backendName: 'github', login: 'github', isGuest: false };
      try { localStorage.setItem('decap-cms-user', JSON.stringify(user)); } catch {}
      try { localStorage.setItem('netlify-cms-user', JSON.stringify(user)); } catch {}
      const store: any = (CMS as any)?.reduxStore || (CMS as any)?.store;
      try { store?.dispatch?.({ type: 'LOGIN_SUCCESS', payload: { token } }); } catch {}
      try { window.location.replace('/admin/#/'); } catch {}
    } catch {
      // ignore
    }
  },
  true,
);

// Expose for diagnostics
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).__cmsApp = CMS;

