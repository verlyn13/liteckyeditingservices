# Cloudflare Pages Migration to Git-Connected Project

Date: 2025-10-04

Goal: Align deployment with the intended Git-connected architecture.

Assumption: Current project `litecky-editing-services` is direct-upload. We will create a new Git-connected project and move custom domains.

## Prerequisites
- Cloudflare account access
- Repo access and GitHub Actions secrets:
  - `CLOUDFLARE_API_TOKEN` (Pages:Edit)
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CF_GIT_CONNECTED=true` (set after migration)

## Checklist

1. Create Git-connected Pages project
- Dashboard → Pages → Create project → Connect to Git
- Repo: `verlyn13/liteckyeditingservices`
- Production branch: `main`
- Build command: `pnpm install && pnpm build`
- Output: `dist`
- Environment: `NODE_VERSION=24` (and optionally `PNPM_VERSION=10.17.1`)
- Add env vars (SendGrid, Turnstile, OAuth, etc.) matching existing Production.

2. Validate builds and previews
- Open a PR to trigger `preview-validation` workflow.
- Ensure the admin smoke test and homepage smoke complete successfully.

3. Prepare for cutover
- Choose a low-traffic window.
- Communicate a brief maintenance window (1–3 minutes).

4. Move custom domains
- Old project: remove `liteckyeditingservices.com` and `www.liteckyeditingservices.com`.
- New Git-connected project: attach the same domains.
- Cloudflare handles SSL issuance automatically; propagation is typically < 5 minutes.

5. Validate Production
- Run `post-deploy-validation` workflow (headers, admin smoke, E2E security).
- Manual checks:
  - `curl -sI https://www.liteckyeditingservices.com/admin/ | grep -i "content-security-policy\|x-frame-options"`
  - Confirm admin imports decap-cms@3.8.4 with cache-busting.

6. Lock in Git-connected flow
- Set GitHub secret `CF_GIT_CONNECTED=true` to disable the wrangler deploy job.
- Keep `post-deploy-validation` on push to `main`.
- Keep `admin-check` scheduled.

7. Clean up
- Retire the old direct-upload Pages project after a day of monitoring.

## Rollback Plan
- If issues occur post-cutover, remove custom domains from the new project and re-attach them to the old project.
- Re-run admin smoke and headers validation.

