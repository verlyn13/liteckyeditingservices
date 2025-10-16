---
name: Documentation Sync
trigger: /doc_sync
version: 1.0
description: Update docs when API, schema, or architecture changes
---

# Documentation Sync Workflow

Maintain documentation consistency with codebase changes.

## When to Trigger

Run this workflow after:
- **API changes** (new endpoints, changed signatures)
- **Schema changes** (database, CMS content types, env vars)
- **Architecture changes** (new modules, refactored patterns)
- **Deployment changes** (new workflows, infrastructure updates)
- **Breaking changes** (requires migration guide)

## Documentation Structure

### Core Documentation Files

**Root Level:**
- `README.md` — Project overview, quick start, setup
- `AGENTS.md` — Agent/AI assistant guidelines (structure, conventions)
- `ARCHITECTURE.md` — High-level design patterns
- `DEPLOYMENT.md` — Deployment procedures (Cloudflare Pages/Workers)
- `ENVIRONMENT.md` — Environment variables and secrets setup
- `CHANGELOG.md` — User-facing changes (semver-aligned)

**docs/ Directory:**
- `docs/decisions/ADR-*.md` — Architecture Decision Records
- `docs/api/` — API endpoint documentation
- `docs/playbooks/` — Operational procedures
- `docs/WORKFLOWS.md` — Cascade workflow catalog

### Decision: When to Create an ADR

Create an ADR (`docs/decisions/ADR-####-[title].md`) when:
- Introducing a new architectural pattern
- Making a significant technology choice
- Changing build or deployment strategy
- Resolving a contentious design trade-off

**ADR Template:**
```markdown
# ADR-####: [Title]

**Status:** Accepted | Proposed | Superseded  
**Date:** YYYY-MM-DD  
**Deciders:** [Names/Roles]

## Context

[Describe the problem and constraints]

## Decision

[State the decision clearly]

## Consequences

**Positive:**
- Benefit 1
- Benefit 2

**Negative:**
- Trade-off 1
- Mitigation strategy

## Alternatives Considered

- Option A: [why rejected]
- Option B: [why rejected]
```

## Sync Checklist

### API Changes

- [ ] Update `docs/api/[endpoint].md` with new signature
- [ ] Update request/response examples
- [ ] Document error codes and messages
- [ ] Update OpenAPI spec (if present)
- [ ] Add migration notes (if breaking)

### Schema Changes

- [ ] Update `ENVIRONMENT.md` if new env vars added
- [ ] Update `.env.example` with placeholders
- [ ] Document required vs optional vars
- [ ] Update Cloudflare Pages/Workers settings in docs
- [ ] Add migration steps for existing deployments

### Architecture Changes

- [ ] Update `ARCHITECTURE.md` with new patterns
- [ ] Create ADR for significant decisions
- [ ] Update module diagrams (if present)
- [ ] Document new dependencies in README
- [ ] Update `AGENTS.md` if coding patterns changed

### Deployment Changes

- [ ] Update `DEPLOYMENT.md` with new procedures
- [ ] Update `desired-state/` templates
- [ ] Document rollback procedures
- [ ] Update GitHub Actions workflow docs
- [ ] Test deployment steps end-to-end

### Breaking Changes

- [ ] Add entry to `CHANGELOG.md`
- [ ] Create migration guide in `docs/migrations/`
- [ ] Update version in `package.json` (semver major)
- [ ] Notify stakeholders (if user-facing)
- [ ] Add deprecation warnings (if gradual migration)

## Execution

### 1. Identify Changed Surface

Run git diff to see what changed:
```fish
git diff main...HEAD --name-status
```

Check for:
- New files in `src/pages/api/`
- Changed function signatures in `src/lib/`
- Modified env var usage
- New dependencies in `package.json`

### 2. Update Relevant Docs

Use this priority order:
1. **Critical:** API, schema, breaking changes
2. **Important:** Architecture, deployment procedures
3. **Nice-to-have:** Internal implementation notes

### 3. Validate Documentation

- [ ] Run docs linter (if configured)
- [ ] Check for broken links
- [ ] Verify code examples compile
- [ ] Test deployment instructions in clean environment

### 4. Commit Documentation

Separate docs commits from code commits:
```fish
git add docs/ README.md ARCHITECTURE.md
git commit -m "docs: update API documentation for new pricing endpoint"
```

## Code Comment Guidelines

While syncing, also update **inline code comments**:

**Good comments** (explain *why*):
```typescript
// Use exponential backoff to avoid overwhelming the CMS API
// during bulk content migrations (ADR-0023)
await retry(() => fetchContent(id), { maxAttempts: 3 });
```

**Bad comments** (explain *what*, which is obvious):
```typescript
// Fetch content by ID
await fetchContent(id);
```

## Usage

In Cascade:
- Type `/doc_sync` after making changes
- Provide context: what changed, which files affected
- Cascade will generate a documentation update checklist
- Review and apply updates

## Verification

After documentation sync:

1. **Build docs site** (if using docs generator)
   ```fish
   pnpm docs:build
   ```

2. **Spell check** (optional)
   ```fish
   pnpm docs:spell-check
   ```

3. **Link check** (optional)
   ```fish
   pnpm docs:link-check
   ```

4. **Peer review** (for critical changes)
   - Ask colleague to test deployment steps
   - Verify migration guide is complete

## Documentation Debt

If immediate documentation is not feasible:
1. Create GitHub issue labeled `documentation`
2. Reference the code change (commit hash)
3. Assign to next sprint
4. Add TODO comment in code pointing to issue

**Never ship breaking changes without documentation.**
