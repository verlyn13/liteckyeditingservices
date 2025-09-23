#!/usr/bin/env node

/**
 * Validates package.json versions against September 2025 requirements
 * Ensures we're using latest versions and not downgrading
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');

const packageJson = JSON.parse(fs.readFileSync(join(rootDir, 'package.json'), 'utf8'));

// September 2025 minimum versions
const requiredVersions = {
  node: '24.0.0',
  pnpm: '10.16.0',
  dependencies: {
    astro: '5.13.0',
    svelte: '5.0.0',
    '@astrojs/svelte': '7.0.0',
    '@astrojs/sitemap': '3.6.0'  // Current latest version
  },
  devDependencies: {
    '@biomejs/biome': '2.0.0',
    prettier: '4.0.0',
    eslint: '9.0.0',
    typescript: '5.7.0',
    playwright: '1.50.0'
  }
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

// Check key dependencies
for (const [name, minVersion] of Object.entries(requiredVersions.dependencies)) {
  const actual = packageJson.dependencies?.[name];
  if (!actual) {
    console.error(`❌ Missing dependency: ${name}`);
    hasErrors = true;
  } else {
    // Extract major version
    const actualMajor = actual.match(/\d+/)?.[0];
    const requiredMajor = minVersion.split('.')[0];

    if (parseInt(actualMajor) < parseInt(requiredMajor)) {
      console.error(`❌ ${name} version ${actual} is older than required ${minVersion}`);
      hasErrors = true;
    } else {
      console.log(`✅ ${name}: ${actual}`);
    }
  }
}

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
if (packageJson.dependencies?.['tailwindcss']) {
  const tailwindVersion = packageJson.dependencies['tailwindcss'];
  if (!tailwindVersion.includes('4')) {
    console.error(`❌ Tailwind CSS should be v4, got: ${tailwindVersion}`);
    hasErrors = true;
  } else {
    console.log(`✅ Tailwind CSS v4: ${tailwindVersion}`);
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

// Check for incorrect adapters
if (packageJson.dependencies?.['@astrojs/vercel']) {
  console.error('❌ Found @astrojs/vercel - should not be present (deploying to Cloudflare)');
  hasErrors = true;
}

if (packageJson.dependencies?.['@astrojs/netlify']) {
  console.error('❌ Found @astrojs/netlify - should not be present (deploying to Cloudflare)');
  hasErrors = true;
}

// Note: @astrojs/cloudflare will be added when we need SSR
console.log('ℹ️  No adapter configured (static site). Will add @astrojs/cloudflare when SSR is needed.');

if (hasErrors) {
  console.error('\n❌ Package version validation failed');
  process.exit(1);
} else {
  console.log('\n✅ All package versions are correct');
}