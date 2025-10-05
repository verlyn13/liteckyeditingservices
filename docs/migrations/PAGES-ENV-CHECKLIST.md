# Cloudflare Pages Environment Variable Checklist

Use this checklist to migrate and verify environment variables when creating the new Git‑connected Pages project(s).

Scope
- Pages – Production environment
- Pages – Preview environment
- Workers (Decap OAuth) – wrangler secrets
- GitHub Actions – repository secrets/variables

References
- See ENVIRONMENT.md and SECRETS.md in the repo for context and expected usage.

## Pages (Production)
Required
- PUBLIC_TURNSTILE_SITE_KEY (public)
- TURNSTILE_SECRET_KEY (secret)
- SENDGRID_API_KEY (secret)
- SENDGRID_FROM_EMAIL (string, verified sender)
- SENDGRID_CONTACT_TEMPLATE_ID (string)
- SENDGRID_CONFIRMATION_TEMPLATE_ID (string)
- ENVIRONMENT=production

Optional/Advanced
- USE_TURNSTILE_TEST (0/1)
- TURNSTILE_TEST_SITE_KEY
- TURNSTILE_TEST_SECRET_KEY

## Pages (Preview)
Required
- PUBLIC_TURNSTILE_SITE_KEY (same as prod or test key)
- TURNSTILE_SECRET_KEY (test/preview key)
- SENDGRID_API_KEY (can be unset to avoid sending on previews)
- SENDGRID_FROM_EMAIL
- SENDGRID_CONTACT_TEMPLATE_ID (preview template id)
- SENDGRID_CONFIRMATION_TEMPLATE_ID (preview template id)
- ENVIRONMENT=preview

Optional
- USE_TURNSTILE_TEST=1
- TURNSTILE_TEST_SITE_KEY=1x00000000000000000000AA
- TURNSTILE_TEST_SECRET_KEY=2x0000000000000000000000000000000AA

## Workers (Decap OAuth Proxy)
wrangler secret put:
- GITHUB_OAUTH_ID
- GITHUB_OAUTH_SECRET

wrangler vars (if used):
- ENVIRONMENT (production/preview)

## GitHub Actions (Repository)
Secrets (required)
- CLOUDFLARE_API_TOKEN (scope: Account → Cloudflare Pages → Edit)
- CLOUDFLARE_ACCOUNT_ID

Variables (optional)
- CF_GIT_CONNECTED=true (set after Git-connected project is live to disable Wrangler deploy job)

## Verification – What to check after setting values
1) Build & Deploy
- Open a PR → confirm Cloudflare creates a preview and `preview-validation` passes.
2) Admin Panel
- Visit /admin on preview: no error banners; window.CMS exists; no CSP errors.
3) Headers
- curl -sI <preview-domain>/admin | grep -i 'content-security-policy\|x-frame-options' → expect SAMEORIGIN + admin CSP overrides.
4) Email
- Ensure SENDGRID_API_KEY is unset on previews (or pointed to test key) to avoid unintended sends.
5) Production
- After domain cutover, run `post-deploy-validation` in Actions and confirm all checks green.

