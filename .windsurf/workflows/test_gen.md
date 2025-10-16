---
name: Test Generator
trigger: /test_gen
version: 1.0
description: Generate or patch missing tests based on diff context
---

# Test Generator Workflow

Automatically generate test scaffolds for new or changed code.

## Context Analysis

Before generating tests, analyze:

1. **Changed files** (via git diff or explicit file list)
2. **Function signatures** and exports
3. **Existing test coverage** (check `tests/unit/` and `tests/e2e/`)
4. **Test framework** (Vitest for unit, Playwright for E2E)

## Unit Test Generation (Vitest)

For new functions or components in `src/`:

1. **Identify testable units**
   - Pure functions
   - Component logic (Svelte components)
   - Utility modules
   - API route handlers

2. **Create test file structure**

   ```typescript
   // tests/unit/[module-name].test.ts
   import { describe, it, expect, vi } from 'vitest';
   import { functionName } from '@/path/to/module';

   describe('functionName', () => {
     it('should handle expected input', () => {
       // Arrange
       const input = 'test';

       // Act
       const result = functionName(input);

       // Assert
       expect(result).toBe('expected');
     });

     it('should handle edge cases', () => {
       expect(functionName(null)).toThrow();
     });
   });
   ```

3. **Mock external dependencies**

   ```typescript
   vi.mock('@/lib/api', () => ({
     fetchData: vi.fn().mockResolvedValue({ data: 'mocked' }),
   }));
   ```

4. **Test guidelines**
   - Use `describe` blocks for grouping related tests
   - Follow Arrange-Act-Assert pattern
   - Test happy path + edge cases + error states
   - Mock fetch, API calls, CMS, and external services
   - Target ≥80% coverage for new code

## E2E Test Generation (Playwright)

For new pages or user flows:

1. **Identify user journeys**
   - Page navigation
   - Form submissions
   - Interactive components
   - Authentication flows

2. **Create E2E test structure**

   ```typescript
   // tests/e2e/[feature-name].spec.ts
   import { test, expect } from '@playwright/test';

   test.describe('Feature Name', () => {
     test('should complete user flow', async ({ page }) => {
       await page.goto('/');
       await expect(page).toHaveTitle(/Expected Title/);

       await page.click('button[aria-label="Action"]');
       await expect(page.locator('.result')).toBeVisible();
     });
   });
   ```

3. **E2E guidelines**
   - Use semantic selectors (aria-label, role, data-testid)
   - Test critical paths only (avoid exhaustive coverage)
   - Include accessibility checks (`toBeAccessible()`)
   - Test responsive behavior (mobile, tablet, desktop)

## Execution

After generating tests:

1. **Run unit tests**

   ```fish
   pnpm test
   ```

2. **Run E2E tests**

   ```fish
   pnpm test:e2e
   ```

3. **Check coverage**

   ```fish
   pnpm test:coverage
   ```

4. **Iterate** if coverage is below 80% for changed files

## Usage

In Cascade:

- Type `/test_gen` with file context
- Or: "Generate tests for `src/lib/utils.ts`"
- Or: "Add E2E test for the contact form flow"

## Notes

- Prefer extending existing test files over creating new ones
- Use fixtures from `tests/fixtures/` for test data
- Mock CMS content using `tests/mocks/decap-content.json`
- Follow existing test patterns in the codebase
