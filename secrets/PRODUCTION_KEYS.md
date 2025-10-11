# Production Keys (Infisical → Cloudflare Pages)

Workspace: liteckyeditingservices
Project ID: d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7
Environment: prod (Infisical) → Production (Cloudflare)

Categories and required keys:

- Turnstile
  - PUBLIC_TURNSTILE_SITE_KEY (public)
  - TURNSTILE_SECRET_KEY (secret)

- SendGrid
  - SENDGRID_API_KEY (secret)
  - SENDGRID_FROM (variable)
  - SENDGRID_CONTACT_TEMPLATE_ID (variable)
  - SENDGRID_CONFIRMATION_TEMPLATE_ID (variable)

- OAuth (Pages Functions)
  - GITHUB_CLIENT_ID (variable)
  - GITHUB_CLIENT_SECRET (secret)

- Site
  - PUBLIC_SITE_NAME (variable)
  - PUBLIC_SITE_URL (variable)
  - ADMIN_EMAIL (variable)

- Environment
  - ENVIRONMENT=production (variable)

- Sentry (build + runtime)
  - PUBLIC_SENTRY_DSN (variable)
  - PUBLIC_SENTRY_ENVIRONMENT=production (variable)
  - PUBLIC_SENTRY_RELEASE=$CF_PAGES_COMMIT_SHA (variable; typically set in Cloudflare, not Infisical)
  - SENTRY_ORG (variable)
  - SENTRY_PROJECT (variable)
  - SENTRY_AUTH_TOKEN (secret)

How to populate via Infisical CLI:

1) Login if needed: `infisical login --domain $INFISICAL_API_URL`
2) Set values (examples):

```bash
infisical secrets set PUBLIC_TURNSTILE_SITE_KEY --env prod --projectId d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7
infisical secrets set TURNSTILE_SECRET_KEY       --env prod --projectId d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7
infisical secrets set SENDGRID_API_KEY           --env prod --projectId d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7
...
```

Pull and Prepare for Cloudflare:

```bash
./scripts/secrets/infisical_seed_prod_from_gopass.sh   # seed from gopass (no values printed)
./scripts/secrets/infisical_pull_prod.sh
./scripts/secrets/cloudflare_prepare_from_infisical.sh
# Then upload public.env (Environment Variables) and secrets.env (Secrets) to Cloudflare Pages (Production)
```

Notes:
- PUBLIC_* keys are safe for browser exposure; store as Environment Variables
- All others should be stored as Secrets in Cloudflare Pages
- Consider setting PUBLIC_SENTRY_RELEASE in Cloudflare as `$CF_PAGES_COMMIT_SHA`
