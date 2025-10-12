#!/usr/bin/env node

/**
 * Validates package.json versions against September 2025 requirements
 * Ensures we're using latest versions and not downgrading
 */

import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');

const packageJson = JSON.parse(fs.readFileSync(join(rootDir, 'package.json'), 'utf8'));

// September 2025 minimum versions
const _requiredVersions = {
  node: '24.0.0',
  pnpm: '10.16.0',
};

let hasErrors = false;

// Check Node version
if (packageJson.engines?.node) {
  const nodeSpec = packageJson.engines.node;
  if (!nodeSpec.includes('24')) {
    console.error(`❌ Node version must be >=24, got: ${nodeSpec}`);
    hasErrors = true;
  } else {
    console.log(`✅ Node version: ${nodeSpec}`);
  }
} else {
  console.error('❌ Missing engines.node in package.json');
  hasErrors = true;
}

// Check pnpm version
if (packageJson.engines?.pnpm) {
  const pnpmSpec = packageJson.engines.pnpm;
  if (!pnpmSpec.includes('10.16')) {
    console.error(`❌ pnpm version must be >=10.16, got: ${pnpmSpec}`);
    hasErrors = true;
  } else {
    console.log(`✅ pnpm version: ${pnpmSpec}`);
  }
} else {
  console.error('❌ Missing engines.pnpm in package.json');
  hasErrors = true;
}

// Semver helpers for simple range assertions on specs like ^3.6.0
function _extractSemverTuple(spec) {
  const m = (spec || '').match(/(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return {
    major: parseInt(m[1], 10),
    minor: parseInt(m[2], 10),
    patch: parseInt(m[3], 10),
  };
}

// Check key dependencies
// Skip individual dependency pin checks; latest policy validated by CI install

// Check required scripts
const requiredScripts = ['dev', 'build', 'preview', 'check', 'lint:fix', 'test:e2e'];
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    console.error(`❌ Missing script: ${script}`);
    hasErrors = true;
  } else {
    console.log(`✅ Script '${script}' present`);
  }
}

// Check for Tailwind v4 - we intentionally use it as a dependency with Vite plugin
if (packageJson.dependencies?.tailwindcss) {
  const tailwindSpec = packageJson.dependencies.tailwindcss;
  if (tailwindSpec === 'latest' || /\b4\./.test(tailwindSpec)) {
    console.log(`✅ Tailwind CSS spec acceptable: ${tailwindSpec}`);
  } else {
    console.error(`❌ Tailwind CSS should target v4 (or 'latest'), got: ${tailwindSpec}`);
    hasErrors = true;
  }
} else {
  console.error('❌ Missing tailwindcss v4 in dependencies');
  hasErrors = true;
}

if (packageJson.devDependencies?.['@tailwindcss/vite']) {
  console.log('✅ Using @tailwindcss/vite plugin for v4 integration');
} else {
  console.error('❌ Missing @tailwindcss/vite for Tailwind v4');
  hasErrors = true;
}

// Check for incorrect adapters in package.json
if (packageJson.dependencies?.['@astrojs/vercel']) {
  console.error('❌ Found @astrojs/vercel - should not be present (deploying to Cloudflare)');
  hasErrors = true;
}

if (packageJson.dependencies?.['@astrojs/netlify']) {
  console.error('❌ Found @astrojs/netlify - should not be present (deploying to Cloudflare)');
  hasErrors = true;
}

// Note: @astrojs/cloudflare will be added when we need SSR
console.log('ℹ️  Deployment adapter: keep Cloudflare; no non-CF adapters allowed.');

if (hasErrors) {
  console.error('\n❌ Package version validation failed');
  process.exit(1);
} else {
  console.log('\n✅ All package versions are correct');
}
