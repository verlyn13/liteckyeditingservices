# Infisical Quickstart (Production)

Authoritative guide to manage production secrets with Infisical for this project.

Project
- Workspace: liteckyeditingservices
- Project ID: d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7
- Environments: dev, staging, prod (use prod for Cloudflare Production)

Prerequisites
- Infisical CLI installed and logged in to the self-hosted instance
  - API URL: `$INFISICAL_API_URL` should be `https://secrets.jefahnierocks.com/api`
  - Login: `infisical login --domain $INFISICAL_API_URL`
- gopass installed and populated with provider credentials

Scripts (project-root)
- `scripts/secrets/infisical_seed_prod_from_gopass.sh`
  - Seeds prod secrets in Infisical by reading from gopass
  - Never prints values; sets only what it finds; reports any missing
- `scripts/secrets/infisical_pull_prod.sh`
  - Exports prod secrets to `secrets/.env.production.local` (git-ignored)
- `scripts/secrets/cloudflare_prepare_from_infisical.sh`
  - Produces two files for Pages upload:
    - `secrets/public.env` (PUBLIC_* variables)
    - `secrets/secrets.env` (all other keys)

Standard Flow
1) Seed Infisical prod from gopass
   ```bash
   ./scripts/secrets/infisical_seed_prod_from_gopass.sh || true
   ```
   - If any keys are missing, add them to gopass at the indicated paths and re-run.

2) Verify keys present in Infisical
   ```bash
   infisical export --projectId d6f4ecdd-a92e-4a2a-92f6-afc23e7175c7 --env prod --format dotenv | sort
   ```

3) Generate files for Cloudflare Pages
   ```bash
   ./scripts/secrets/cloudflare_prepare_from_infisical.sh
   # Upload contents of secrets/public.env and secrets/secrets.env
   ```

Production Keys (canonical)
See `secrets/PRODUCTION_KEYS.md` for the authoritative list by category and notes on where to store each variable (public vs secret).

Troubleshooting
- Not logged in
  - `infisical login --domain $INFISICAL_API_URL`
- Wrong instance
  - Ensure `INFISICAL_API_URL=https://secrets.jefahnierocks.com/api`
- Missing keys after seeding
  - Add values to gopass under the suggested path(s), then re-run the seed script
- Export shows zero keys
  - Confirm project ID and environment flags match above

Reference
- SECRETS.md – higher-level repository secrets architecture
- secrets/PRODUCTION_KEYS.md – exact prod keys and purpose

