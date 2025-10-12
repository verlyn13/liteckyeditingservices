# Secrets Scripts

Location: `scripts/secrets/`

- `infisical_seed_prod_from_gopass.sh`
  - Seeds Infisical prod with values from gopass
  - Safe (no values printed), idempotent for present keys

- `infisical_pull_prod.sh`
  - Exports prod secrets to `secrets/.env.production.local` (git-ignored)

- `cloudflare_prepare_from_infisical.sh`
  - Splits export into:
    - `secrets/public.env` (keys starting with PUBLIC\_)
    - `secrets/secrets.env` (all other keys)

See also: `docs/INFISICAL-QUICKSTART.md` and `secrets/PRODUCTION_KEYS.md`.
