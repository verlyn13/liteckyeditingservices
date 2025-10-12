# Biome Playbook (v2.2.5)

## Purpose

Biome provides fast formatting and linting for JS/TS/JSON. We pin to v2.2.5 and scope via `biome.jsonc`.

## Commands

### Local Development
```bash
pnpm run biome:check        # format + fix + lint all files (write mode)
pnpm run biome:fix          # alias for biome:check
pnpm run biome:changed      # fix only files changed from main
pnpm run biome:triage       # preview issues without fixing (read-only)
```

### CI/CD
```bash
pnpm run biome:ci           # fail on any issues (read-only, never writes)
pnpm run biome:ci:changed   # check only changed files vs main
pnpm run biome:triage:json  # JSON output for tooling
```

### Full Validation
```bash
pnpm run check              # clean + validate + biome + typecheck + prettier
```

## Scope

**Included:**
- `*.{js,ts,tsx,mjs,cjs,json,jsonc}` in:
  - `src/`, `functions/`, `workers/`, `tests/`, `scripts/`, `config/`
  - Root config files (astro.config.mjs, package.json, etc.)

**Excluded:**
- Framework files: `.astro`, `.svelte`, `.vue` (handled by Prettier/ESLint)
- Build artifacts: `dist/`, `.astro/`, `node_modules/`, `coverage/`
- Generated files: `src/admin/cms-config.ts`
- Archived code: `_archive/`
- Large files: Files >1MB skipped automatically

**Division of Responsibilities:**
- **Biome**: JS/TS/JSON formatting + linting
- **ESLint**: Astro/Svelte framework-specific linting
- **Prettier**: Everything Biome doesn't handle (CSS, MD, Astro, Svelte)

## Troubleshooting

### Hanging or Slow Performance
- **Cause**: Deep directory traversal or missing exclusions
- **Fix**: Verify `biome.jsonc` has directory-level excludes: `!dist`, `!node_modules`, `!.astro`
- **Note**: Trailing slashes not required in v2.2.5

### Formatter Conflicts
- **Symptom**: Biome and Prettier fighting over the same files
- **Fix**: Ensure `.prettierignore` contains: `**/*.{js,ts,tsx,mjs,cjs,json,jsonc}`
- **Check**: Run `biome:ci` and `prettier --check .` separately to isolate

### CI Writing Files
- **Problem**: CI modifying files instead of just checking
- **Fix**: Always use `biome ci .` (no `--write`) in CI pipelines
- **Scripts**: Use `biome:ci` or `biome:ci:changed`, never `biome:check` in CI

### Framework Files Corrupted
- **Symptom**: `.astro` or `.svelte` files have broken syntax after Biome run
- **Cause**: Missing framework file exclusions in `biome.jsonc`
- **Fix**: Add `!**/*.astro`, `!**/*.svelte`, `!**/*.vue` to `files.includes`
- **Recovery**: `git restore src/**/*.astro src/**/*.svelte`

### Generated Files Causing Check Failures
- **Problem**: Generated files fail formatting checks
- **Examples**: `src/admin/cms-config.ts`, bundled/minified files
- **Fix**: Add explicit exclusions to `biome.jsonc` or use `// @generated` comments

## Configuration Reference

Full configuration documented in: `docs/decisions/2025-10-12-biome-2.2.5.md`

Key settings:
- `root: true` - Don't search parent directories
- `vcs.enabled: true` - Respect `.gitignore`
- `maxSize: 1048576` - Skip files >1MB
- `ignoreUnknown: true` - Don't error on unknown file types

