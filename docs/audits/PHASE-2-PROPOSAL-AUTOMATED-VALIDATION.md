# Phase 2 Proposal: Automated Documentation Validation

**Date**: October 15, 2025  
**Status**: Proposed  
**Purpose**: Eliminate manual documentation maintenance through automated validation

---

## 🎯 Objective

Create a validation script that runs as part of pre-commit hooks and CI to automatically verify documentation accuracy, preventing the drift we just remediated.

---

## 📋 Validation Script Scope

### 1. Package Version Verification

**What**: Validate that package versions mentioned in PROJECT-STATUS.md match actual installed versions

**How**:
- Parse `package.json` and `pnpm-lock.yaml` for actual installed versions
- Parse PROJECT-STATUS.md for package version claims
- Flag any mismatches

**Example Check**:
```javascript
const actualBiomeVersion = getInstalledVersion('@biomejs/biome'); // "2.2.5"
const claimedVersion = parseVersionFromMarkdown('PROJECT-STATUS.md', 'Biome'); // "2.2.5"
if (actualBiomeVersion !== claimedVersion) {
  error(`Biome version mismatch: claimed ${claimedVersion}, actual ${actualBiomeVersion}`);
}
```

**Packages to Monitor**:
- Biome
- TypeScript
- ESLint
- Prettier
- Vitest
- Tailwind CSS
- Decap CMS
- SendGrid
- Playwright
- Astro

### 2. Internal Link Validation

**What**: Verify all markdown links to internal files/paths are valid

**How**:
- Extract all relative file paths from markdown links
- Check if files exist at those paths
- Flag broken links

**Example Check**:
```javascript
const links = extractInternalLinks('PROJECT-STATUS.md');
// e.g., ["docs/DOCUMENTATION-INDEX.md", "src/lib/email.ts", ...]

links.forEach(link => {
  if (!fs.existsSync(link)) {
    error(`Broken link in PROJECT-STATUS.md: ${link}`);
  }
});
```

**Link Patterns to Check**:
- `[text](path/to/file.md)` - Standard markdown links
- `` `path/to/file.ts` `` - Backtick file references
- Relative paths starting with `docs/`, `src/`, `functions/`, `scripts/`, etc.

### 3. Workflow File Validation

**What**: Verify mentioned GitHub Actions workflows actually exist

**How**:
- Parse PROJECT-STATUS.md for workflow mentions (e.g., `.github/workflows/quality-gate.yml`)
- Check if workflow files exist
- Flag missing workflows

**Example Check**:
```javascript
const workflows = extractWorkflowReferences('PROJECT-STATUS.md');
workflows.forEach(workflow => {
  const path = `.github/workflows/${workflow}`;
  if (!fs.existsSync(path)) {
    error(`Referenced workflow does not exist: ${path}`);
  }
});
```

---

## 🛠️ Implementation Plan

### Script Location
`scripts/validate/docs-accuracy.mjs`

### Integration Points

**1. Pre-commit Hook (via lefthook)**:
```yaml
# lefthook.yml
pre-commit:
  commands:
    docs-accuracy:
      glob: "*.md"
      run: node scripts/validate/docs-accuracy.mjs
```

**2. CI Workflow**:
```yaml
# .github/workflows/quality-gate.yml
- name: Validate documentation accuracy
  run: pnpm run validate:docs
```

**3. Package Script**:
```json
// package.json
{
  "scripts": {
    "validate:docs": "node scripts/validate/docs-accuracy.mjs",
    "validate:all": "... && pnpm run validate:docs"
  }
}
```

---

## 📦 Script Architecture

### Core Functions

```javascript
// scripts/validate/docs-accuracy.mjs

/**
 * Main validation orchestrator
 */
async function validateDocumentation() {
  const errors = [];
  
  errors.push(...await validatePackageVersions());
  errors.push(...await validateInternalLinks());
  errors.push(...await validateWorkflowReferences());
  
  if (errors.length > 0) {
    console.error('\n❌ Documentation validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
  
  console.log('✅ Documentation validation passed');
}

/**
 * Validate package versions match installed versions
 */
async function validatePackageVersions() {
  const errors = [];
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const statusContent = fs.readFileSync('PROJECT-STATUS.md', 'utf8');
  
  // Define packages to check
  const packagesToCheck = {
    '@biomejs/biome': /Biome\s+([\d.]+)/,
    'typescript': /TypeScript\s+([\d.]+)/,
    'eslint': /ESLint\s+([\d.]+)/,
    'prettier': /Prettier\s+([\d.]+)/,
    // ... more packages
  };
  
  for (const [pkg, regex] of Object.entries(packagesToCheck)) {
    const installedVersion = await getInstalledVersion(pkg);
    const match = statusContent.match(regex);
    
    if (match) {
      const claimedVersion = match[1];
      if (installedVersion && installedVersion !== claimedVersion) {
        errors.push(
          `${pkg}: claimed ${claimedVersion}, installed ${installedVersion}`
        );
      }
    }
  }
  
  return errors;
}

/**
 * Get actual installed version from pnpm
 */
async function getInstalledVersion(packageName) {
  try {
    const result = execSync(
      `pnpm list --depth=0 --json 2>/dev/null | jq -r '.[0].dependencies["${packageName}"].version'`,
      { encoding: 'utf8' }
    );
    return result.trim() === 'null' ? null : result.trim();
  } catch {
    return null;
  }
}

/**
 * Validate internal file links
 */
async function validateInternalLinks() {
  const errors = [];
  const statusContent = fs.readFileSync('PROJECT-STATUS.md', 'utf8');
  
  // Extract markdown links: [text](path)
  const markdownLinks = [...statusContent.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)]
    .map(match => match[2])
    .filter(link => !link.startsWith('http')); // Internal links only
  
  // Extract backtick file references: `path/to/file.ext`
  const backtickPaths = [...statusContent.matchAll(/`([^`]+\.(ts|js|yml|json|md|mjs))`/g)]
    .map(match => match[1]);
  
  const allPaths = [...new Set([...markdownLinks, ...backtickPaths])];
  
  for (const path of allPaths) {
    if (!fs.existsSync(path)) {
      errors.push(`Broken link/reference: ${path}`);
    }
  }
  
  return errors;
}

/**
 * Validate workflow references
 */
async function validateWorkflowReferences() {
  const errors = [];
  const statusContent = fs.readFileSync('PROJECT-STATUS.md', 'utf8');
  
  // Extract workflow file references
  const workflows = [...statusContent.matchAll(/\.github\/workflows\/([a-z-]+\.yml)/g)]
    .map(match => match[0]);
  
  for (const workflow of new Set(workflows)) {
    if (!fs.existsSync(workflow)) {
      errors.push(`Referenced workflow does not exist: ${workflow}`);
    }
  }
  
  return errors;
}

// Execute validation
validateDocumentation().catch(err => {
  console.error('Validation script error:', err);
  process.exit(1);
});
```

---

## 🎯 Success Criteria

**Phase 2 is successful when**:
1. Script runs in <2 seconds
2. Catches version mismatches automatically
3. Catches broken internal links
4. Runs on every commit touching `.md` files
5. Runs in CI on every PR
6. Zero false positives after initial tuning

---

## 📊 Expected Benefits

**Immediate**:
- Catch documentation drift at commit time
- Prevent broken links from reaching main
- Eliminate manual version checking

**Long-term**:
- Documentation becomes self-validating
- Reduced maintenance burden
- Higher documentation trustworthiness
- Faster onboarding (docs are always accurate)

---

## 🚀 Implementation Estimate

**Time**: 2-3 hours
- Script development: 1.5 hours
- Integration (lefthook + CI): 30 min
- Testing and tuning: 1 hour

**Risk**: Low
- Read-only operations
- Clear failure messages
- Easy to disable if needed

---

## 🔄 Future Enhancements (Post-Phase 2)

1. **Cross-reference validation**: Verify claims like "15/15 tests passing" against actual test results
2. **Commit SHA validation**: Verify mentioned commit SHAs exist in git history
3. **Workflow status validation**: Check if mentioned workflows are actually enabled
4. **Content freshness**: Flag sections not updated in >30 days
5. **Markdown lint integration**: Enforce consistent formatting

---

## 📝 Acceptance Criteria

Before marking Phase 2 complete:
- [ ] Script created at `scripts/validate/docs-accuracy.mjs`
- [ ] Version validation implemented and tested
- [ ] Link validation implemented and tested
- [ ] Workflow reference validation implemented and tested
- [ ] Integrated into lefthook pre-commit
- [ ] Integrated into CI quality-gate workflow
- [ ] Package script `validate:docs` added
- [ ] Script added to `validate:all` chain
- [ ] Documentation updated in `scripts/README.md`
- [ ] Zero false positives on current codebase

---

**Status**: Awaiting approval to proceed  
**Estimated Completion**: Same day (2-3 hours)  
**Dependencies**: None (Phase 1 complete)
