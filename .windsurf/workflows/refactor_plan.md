---
name: Refactor Plan
trigger: /refactor_plan
version: 1.0
description: Produce staged refactor checklist before execution
---

# Refactor Plan Workflow

Plan and execute multi-file refactors with behavior preservation guarantees.

## Planning Phase

### 1. Scope Definition

Define refactor boundaries:
- **Files affected** (list all files to touch)
- **Functions/components** to modify
- **Dependencies** (imports, exports, types)
- **Tests** to update or add

### 2. Behavior Preservation Strategy

Ensure refactor is **behavior-preserving**:
- Identify public API surface (exports, props, endpoints)
- List expected inputs and outputs
- Document edge cases and error handling
- Plan backward compatibility (if breaking, propose deprecation)

### 3. Test-First Verification

Before refactoring:
1. **Run existing tests** to establish baseline
   ```fish
   pnpm test && pnpm test:e2e
   ```
2. **Add regression tests** if coverage is insufficient
3. **Document expected behavior** in test assertions

## Execution Steps

### Phase 1: Preparation

1. **Create feature branch**
   ```fish
   git checkout -b refactor/[description]
   ```

2. **Ensure clean baseline**
   ```fish
   pnpm check
   pnpm test
   ```

### Phase 2: Incremental Changes

Execute refactor in **small, testable steps**:

**Step 1:** Extract/rename (no logic changes)
- Move functions to new modules
- Rename variables/functions
- Update imports
- ✅ Run tests after each change

**Step 2:** Modify internals (preserve interfaces)
- Refactor implementation
- Update types
- Add validation
- ✅ Run tests after each change

**Step 3:** Update call sites
- Adjust function calls
- Update component props
- Fix type errors
- ✅ Run tests after each change

**Step 4:** Clean up
- Remove dead code
- Update docs
- Run linter
- ✅ Final test run

### Phase 3: Verification

1. **Type check**
   ```fish
   pnpm typecheck
   ```

2. **Lint check**
   ```fish
   pnpm biome check
   ```

3. **Full test suite**
   ```fish
   pnpm test && pnpm test:e2e
   ```

4. **Policy gate**
   ```fish
   pnpm validate:all && pnpm policy:check
   ```

5. **Visual inspection** (if UI changed)
   ```fish
   pnpm dev
   # Manually verify in browser
   ```

## Rollback Plan

If refactor introduces issues:

1. **Isolate the problem**
   - Which step introduced the issue?
   - What test failed?

2. **Rollback strategy**
   ```fish
   git reset --hard HEAD~1  # Undo last commit
   # OR
   git revert [commit-hash]  # Create revert commit
   ```

3. **Document learnings**
   - Update ADR with findings
   - Add regression test
   - Plan alternative approach

## Documentation Updates

After successful refactor:

1. **Update ARCHITECTURE.md** (if patterns changed)
2. **Create ADR** (if design decision made)
3. **Update API docs** (if public surface changed)
4. **Update CHANGELOG.md** (if user-facing)

## Commit Strategy

Use **atomic commits** for each refactor step:

```
refactor: extract utility functions to lib/utils

- Move formatDate and formatCurrency to lib/utils.ts
- Update imports in 5 components
- Add unit tests for utilities
- No behavior change

Testing: pnpm test (all passing)
```

## Usage

In Cascade:
- Type `/refactor_plan` before starting a refactor
- Provide context: files, functions, goals
- Cascade will generate a step-by-step checklist
- Execute steps one at a time, keeping tests green

## Example Refactor Checklist

- [ ] Create branch `refactor/extract-pricing-logic`
- [ ] Run baseline tests (`pnpm test`)
- [ ] Extract pricing calculations to `lib/pricing.ts`
- [ ] Add unit tests for `lib/pricing.ts`
- [ ] Update `PricingTable.svelte` to use new module
- [ ] Update `PricingPage.astro` to use new module
- [ ] Run tests after each change
- [ ] Type check (`pnpm typecheck`)
- [ ] Lint check (`pnpm biome check`)
- [ ] Full test suite (`pnpm test && pnpm test:e2e`)
- [ ] Update `ARCHITECTURE.md` with new pricing module
- [ ] Commit with descriptive message
- [ ] Push and create PR

## Safety Rules

- **Never skip tests between steps**
- **Keep each step small** (ideally < 200 lines changed)
- **Preserve public APIs** unless explicitly breaking
- **Document breaking changes** in commit message
- **Tag major refactors** with ADR reference
