# Playbook: Email Delivery Issues (SendGrid)

Use this guide to diagnose and fix email problems related to the `/api/contact` flow.

## Quick Checks

- Endpoint response is `accepted-no-email`
  - Cause: SendGrid env vars not set on Pages
  - Fix: Set `SENDGRID_API_KEY`, `SENDGRID_FROM`, `SENDGRID_TO` in Pages (Preview and Production)

- Endpoint response is `202 { status: "sent" }` but no email received
  - Check SendGrid Activity (deliveries/blocks/bounces)
  - Verify sender domain authenticated and sender identity verified
  - Confirm `SENDGRID_TO` is correct and mailbox not filtering

- Endpoint response is `202 { status: "enqueued" }` but no email received
  - Ensure queue consumer worker is deployed and healthy
  - Check worker logs and replay dead letters if any

## Validation Steps

1. Verify environment
   - Cloudflare Pages → Project → Settings → Environment variables
   - Confirm required vars present for the active environment

2. Run integration tests
   ```bash
   pnpm test:e2e
   node tests/sendgrid-test.mjs   # manual SendGrid check
   ```

3. Inspect logs
   - Pages Functions: Cloudflare Pages → Deployments → Logs
   - Queue consumer worker: `pnpm wrangler tail --name <queue-consumer-worker-name>`

4. SendGrid dashboard
   - Activity feed: look for drops/blocks/spam checks
   - Suppression lists: remove target if suppressed
   - Domain authentication: ensure DNS records are verified

## Common Root Causes & Fixes

- Missing/incorrect secrets
  - Fix: Update Pages env vars. For dev, ensure `.dev.vars` exists and `direnv` loaded or use `pnpm run dev:env`.

- Sender identity not verified
  - Fix: Verify sender domain or use a verified single sender in SendGrid.

- Domain authentication incomplete
  - Fix: Complete DNS setup in SendGrid and wait for verification.

- Spam filtering
  - Fix: Check content for spam triggers; test with a different recipient.

- Queue not connected
  - Fix: Add producer binding to Pages Functions and redeploy; verify consumer deployment.

## Escalation

- If production emails fail for >15 minutes:
  - Post an incident note in the repo
  - Switch to direct-send path (disable queue) to reduce moving parts
  - Consider temporary alternate recipient while resolving

## References

- ENVIRONMENT.md
- SECRETS.md
- DEPLOYMENT.md
- docs/infrastructure/SENDGRID-CONFIGURATION.md
- tests/e2e/pages-function-contact.spec.ts
- tests/sendgrid-test.mjs

