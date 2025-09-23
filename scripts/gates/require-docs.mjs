#!/usr/bin/env node

/**
 * Fails if code paths changed but docs/ADR/CHANGELOG were not touched.
 * For use in CI to enforce documentation updates with code changes.
 */

import { execSync } from 'node:child_process';

function sh(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe' }).toString().trim();
  } catch {
    return '';
  }
}

// Determine base commit for comparison
let base = process.env.GITHUB_BASE_SHA || process.env.GITHUB_EVENT_BEFORE;
if (!base) {
  try {
    base = sh('git merge-base origin/main HEAD');
  } catch {
    base = 'HEAD~1';
  }
}
const head = process.env.GITHUB_SHA || 'HEAD';

// Get list of changed files
const diff = sh(`git diff --name-only ${base} ${head}`).split('\n').filter(Boolean);

if (diff.length === 0) {
  console.log('No files changed');
  process.exit(0);
}

// Check if code was touched
const touchedCode = diff.some(p =>
  p.startsWith('src/') ||
  p.startsWith('functions/') ||
  p.startsWith('workers/') ||
  p.startsWith('apps/') ||
  p === 'wrangler.toml' ||
  p === 'astro.config.mjs' ||
  p === 'package.json' ||
  p.startsWith('public/admin/')
);

// Check if docs were touched
const touchedDocs = diff.some(p =>
  p === 'CHANGELOG.md' ||
  p === 'PROJECT-STATUS.md' ||
  p === 'IMPLEMENTATION-ROADMAP.md' ||
  p === 'DOCUMENTATION-MASTER-INDEX.md' ||
  p.startsWith('docs/decisions/') ||
  (p.startsWith('docs/') && p.endsWith('.md'))
);

console.log('Changed files:');
diff.forEach(f => console.log(`  - ${f}`));
console.log('');
console.log(`Code touched: ${touchedCode}`);
console.log(`Docs touched: ${touchedDocs}`);

// Enforce the rule
if (touchedCode && !touchedDocs) {
  console.error('\n❌ Docs gate FAILED: code changed but no docs/ADR/status updated.');
  console.error('Please update one of:');
  console.error('  - PROJECT-STATUS.md (for progress tracking)');
  console.error('  - IMPLEMENTATION-ROADMAP.md (for plan changes)');
  console.error('  - docs/decisions/*.md (for architectural decisions)');
  console.error('  - docs/*.md (for feature documentation)');
  process.exit(1);
}

console.log('\n✅ Docs gate: OK');
process.exit(0);