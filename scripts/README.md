# Scripts Directory

This directory contains automation scripts for repository maintenance, validation, and build processes.

---

## 📁 Directory Structure

- **`validate/`** - Validation scripts enforcing repository standards
- **`gates/`** - Pre-push gates ensuring documentation quality
- **`build/`** - Build-time automation (icons, CMS bundles)
- **`drift/`** - Configuration drift detection

---

## 🔍 Validation Scripts

### Package Versions (`validate/package-versions.mjs`)
Enforces package version policies defined in `policy/` Rego files.

**Run**: `pnpm run validate:versions`

**Checks**:
- Node version requirements (>=24 <25)
- pnpm version requirements (>=10.16.0)
- Required package scripts exist
- Tailwind CSS v4 configuration
- Deployment adapter constraints

### Repository Structure (`validate/repo-structure.mjs`)
Validates required files and directories exist per `desired-state/repo.required-files.json`.

**Run**: `pnpm run validate:structure`

**Checks**:
- All required files present
- All required directories present
- No forbidden files committed
- Configuration choices (Tailwind v4, Prettier, global.css)

### Path Structure (`validate/path-structure.mjs`)
Validates project organization and file naming conventions.

**Run**: `pnpm run validate:paths`

### Decap CMS Bundle (`validate/decap-bundle.mjs`)
Validates Decap CMS self-hosted bundle configuration.

**Run**: `pnpm run validate:decap`

**Checks**:
- Single self-hosted bundle exists
- No vendor bundles present
- Proper hash-based cache-busting

### Sentry Setup (`validate/sentry-setup.mjs`)
Validates Sentry error tracking configuration.

**Run**: `pnpm run validate:sentry`

**Checks**:
- Sentry packages installed
- Environment variables configured
- Documentation indexed
- Test page exists

### **Documentation Accuracy (`validate/docs-accuracy.mjs`)** 🆕
**Automatically validates documentation accuracy** to prevent drift.

**Run**: `pnpm run validate:docs`

**Checks**:
1. **Package Versions**: Verifies versions mentioned in PROJECT-STATUS.md match installed versions
   - Biome, TypeScript, ESLint, Prettier, Vitest, Tailwind CSS, SendGrid, Decap CMS
2. **Internal Links**: Validates all markdown links and backtick file references point to existing files
   - Filters out globs, URL paths, dynamic references
   - Historical tolerance for references in dated progress sections
3. **Workflow References**: Ensures all mentioned GitHub Actions workflows exist

**Historical Tolerance**: References in "Recent Progress" sections dated >10 days ago, or mentioned with verbs like "Added", "Created", etc., are treated as historical and allowed even if files no longer exist.

**Integration**:
- ✅ Pre-commit hook (via lefthook) - runs on `*.md` files
- ✅ CI workflow (quality-gate.yml) - dedicated `validate-docs` job
- ✅ Part of `validate:all` chain

**Exit Codes**:
- `0` - All validations passed
- `1` - Validation failures found (blocks commit/CI)

---

## 🚪 Gates

### Documentation Gate (`gates/require-docs.mjs`)
Pre-push gate ensuring documentation is updated when code changes.

**Run**: `pnpm run gate:docs`

**Triggers**: Runs automatically on `git push` (via lefthook)

**Checks**: If code files changed, at least one doc file must also change

---

## 🏗️ Build Scripts

### Icon Generation (`build-icons.sh`)
Generates multiple icon sizes from SVG source.

**Run**: `pnpm run icons:build`

### CMS Bundle Build (`build-cms.mjs`, `build-cms-config.mjs`, `build-cms-hash.mjs`)
Builds self-hosted Decap CMS bundle with content hashing.

**Run**: Automatic during `pnpm build`

---

## 🔄 Running All Validations

```bash
# Run all validation scripts
pnpm run validate:all

# Run all validations + documentation gate
pnpm run policy:check
```

---

## 📝 Adding New Validation Scripts

When creating a new validation script:

1. **Location**: Place in `scripts/validate/` or `scripts/gates/`
2. **Naming**: Use kebab-case: `my-validator.mjs`
3. **Shebang**: Start with `#!/usr/bin/env node`
4. **Exit codes**: 
   - `0` for success
   - `1` for failure
5. **Output**: Use colors (see `docs-accuracy.mjs` for example)
6. **Add to package.json**: Create `validate:*` or `gate:*` script
7. **Integration**: 
   - Add to `lefthook.yml` for pre-commit/pre-push
   - Add to `.github/workflows/quality-gate.yml` for CI
   - Update `validate:all` if applicable
8. **Document**: Update this README

---

## 🎯 Design Principles

**Validation scripts follow these principles**:
- **Fast**: Run in <2 seconds
- **Clear**: Explicit error messages with context
- **Actionable**: Tell developers exactly what to fix
- **Idempotent**: Same result on repeated runs
- **Zero false positives**: Tune carefully to avoid crying wolf

---

## 🔗 Related Documentation

- **Policies**: `policy/` - Rego policy definitions
- **Desired State**: `desired-state/` - Configuration templates
- **Lefthook**: `lefthook.yml` - Git hooks configuration
- **CI Workflows**: `.github/workflows/` - GitHub Actions

---

**Last Updated**: October 15, 2025 (Added docs-accuracy validator)
