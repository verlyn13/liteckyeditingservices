# Editorial Workflow (Decap CMS + GitHub PRs)

This guide helps non-technical editors submit and publish content safely.

## Overview
- Edits in /admin create a Git branch and a Pull Request (PR).
- Cloudflare Pages builds a Preview URL for review.
- After review, a maintainer merges the PR; production deploy happens automatically.

## Steps (Editors)
1. Go to `/admin` and make edits.
2. Click “Save” or “Publish” → this opens a PR.
3. Share the PR link with stakeholders.
4. Open the Preview link in the PR checks to review content.
5. Address any requested changes; push updates via /admin.

## Steps (Maintainers)
1. Check `preview-validation` workflow results.
2. Validate the Preview URL renders correctly (homepage and admin checks pass).
3. Approve and merge the PR when ready.
4. `post-deploy-validation` runs on `main` and validates production.

## Tips
- Need to publish faster? Coordinate with a maintainer to expedite review.
- Images: ensure formats and sizes are optimized to keep previews quick.
- If a preview looks broken, check PR comments for validation errors.

