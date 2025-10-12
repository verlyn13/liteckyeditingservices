# Git-Connected Pages Cutover Runbook (Minute-by-minute)

Window: Saturday 06:00–08:00 (lowest traffic)
Target: Zero to 5-minute impact; rollback < 5 minutes

## T-24h (Friday)

- Lower DNS TTLs to 300s if applicable (usually not necessary with Cloudflare proxied DNS, but confirm).
- Verify new Git-connected project builds and PR previews.
- Confirm env vars per `PAGES-ENV-CHECKLIST.md`.

## T-60m (05:00)

- Post status page pre-announcement: “Maintenance 06:00–08:00 UTC, brief admin availability impact.”
- Open monitoring dashboards; verify baseline is healthy.
- Prepare rollback: note current (old) Pages project deployment id and domain attachment.

## T-15m (05:45)

- Re-run PR preview validation on a no-op PR (ensure preview and admin smoke pass).
- Dry-run post-deploy validation locally against staging domain.

## T-5m (05:55)

- Freeze content edits (Decap) and merges.
- Confirm new Git-connected project Production build is green on main.

## T0 (06:00) Cutover

1. Old project: remove custom domains
   - `liteckyeditingservices.com`
   - `www.liteckyeditingservices.com`
2. New Git-connected project: attach the same domains
   - Cloudflare will auto-issue SSL certs
3. Wait 2–5 minutes for full edge propagation

## T+5m (06:05)

- Run GitHub Action: `post-deploy-validation` (or it runs automatically on last push)
  - Header check (CSP, XFO, HSTS)
  - Security Headers E2E (@prod)
  - Admin smoke (@admin)
- Manual checks:
  - `curl -sI https://www.liteckyeditingservices.com/admin/ | grep -i 'content-security-policy\|x-frame-options'`
  - Visit /admin and ensure no error banners; preview pane works.

## T+15m (06:15)

- Announce completion on status page
- Unfreeze edits, switch Decap to editorial workflow usage (PRs)
- Monitor 15–30 minutes

## Rollback (if needed)

- New project: remove custom domains
- Old project: re-attach custom domains
- Validate with admin smoke; announce rollback on status page

## Notes

- For zero-downtime gradual migration, consider Cloudflare Load Balancer with weighted steering (10%→50%→100%). This requires advanced setup and is optional.
