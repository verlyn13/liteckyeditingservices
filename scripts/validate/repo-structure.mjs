#!/usr/bin/env node

/**
 * Validates repository structure and required files
 * Checks against desired-state/repo.required-files.json
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');

// Load required files list
const requiredFiles = JSON.parse(
  fs.readFileSync(join(rootDir, 'desired-state/repo.required-files.json'), 'utf8')
);

// Required directories
const requiredDirs = [
  'src',
  'src/components',
  'src/layouts',
  'src/pages',
  'src/styles',
  'src/scripts',
  'src/content',
  'src/images',
  'src/lib',
  'src/utils',
  'public',
  'public/fonts',
  'public/images',
  'tests',
  'tests/unit',
  'tests/e2e',
  'policy',
  'policy/code',
  'policy/infra',
  'policy/cms',
  'policy/email',
  'policy/docs',
  'scripts',
  'scripts/drift',
  'scripts/validate',
  'scripts/gates',
  'desired-state',
  'docs',
  'docs/playbooks',
  'docs/decisions',
  'docs/api',
  '_archive'
];

let hasErrors = false;

console.log('Checking required files...\n');

// Check required files
for (const file of requiredFiles.required) {
  const filePath = join(rootDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.error(`❌ Missing: ${file}`);
    hasErrors = true;
  }
}

console.log('\nChecking required directories...\n');

// Check required directories
for (const dir of requiredDirs) {
  const dirPath = join(rootDir, dir);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    console.log(`✅ ${dir}/`);
  } else {
    console.error(`❌ Missing directory: ${dir}/`);
    hasErrors = true;
  }
}

// Check for forbidden files
console.log('\nChecking for forbidden files...\n');

const forbiddenPatterns = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.staging',
  '.env.development',
  '.dev.vars',
  'secrets.json',
  'credentials.json',
  'private-key.pem',
  'cert.pem'
];

// These patterns are ALLOWED (documentation/examples)
const allowedPatterns = [
  '.env.example',
  '.dev.vars.example',
  '.env.template',
  '.env.sample',
  '.dev.vars' // Local development secrets (should be gitignored)
];

function checkForbiddenFiles(dir = '.') {
  const fullPath = join(rootDir, dir);
  if (!fs.existsSync(fullPath)) return;

  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = join(dir, entry.name);

    // Skip node_modules and .git
    if (entry.name === 'node_modules' || entry.name === '.git') continue;

    if (entry.isDirectory()) {
      checkForbiddenFiles(relativePath);
    } else {
      // Check if file is explicitly allowed
      const isAllowed = allowedPatterns.some(allowed => entry.name === allowed);

      if (!isAllowed) {
        // Check against forbidden patterns
        for (const pattern of forbiddenPatterns) {
          if (entry.name === pattern || entry.name.startsWith(pattern + '.')) {
            console.error(`❌ Forbidden file found: ${relativePath}`);
            hasErrors = true;
            break;
          }
        }
      }
    }
  }
}

checkForbiddenFiles();

if (!hasErrors) {
  console.log('✅ No forbidden files found');
}

// Config validations reflecting deployment/styling decisions
console.log('\nValidating configuration choices...\n');

const astroConfigPath = join(rootDir, 'astro.config.mjs');
if (fs.existsSync(astroConfigPath)) {
  const astroConfig = fs.readFileSync(astroConfigPath, 'utf8');

  // Disallow non-Cloudflare adapters
  if (astroConfig.includes('@astrojs/vercel')) {
    console.error('❌ astro.config.mjs imports @astrojs/vercel (disallowed)');
    hasErrors = true;
  }
  if (astroConfig.includes('@astrojs/netlify')) {
    console.error('❌ astro.config.mjs imports @astrojs/netlify (disallowed)');
    hasErrors = true;
  }

  // Ensure Tailwind v4 Vite plugin is present
  if (!astroConfig.includes("@tailwindcss/vite")) {
    console.error('❌ astro.config.mjs missing @tailwindcss/vite plugin for Tailwind v4');
    hasErrors = true;
  } else {
    console.log('✅ Tailwind v4 Vite plugin configured');
  }
} else {
  console.error('❌ Missing astro.config.mjs');
  hasErrors = true;
}

// Ensure single source of truth for styles
const prettierPath = join(rootDir, '.prettierrc.json');
if (fs.existsSync(prettierPath)) {
  try {
    const prettier = JSON.parse(fs.readFileSync(prettierPath, 'utf8'));
    if (prettier.tailwindStylesheet !== './src/styles/global.css') {
      console.error('❌ .prettierrc.json tailwindStylesheet must point to ./src/styles/global.css');
      hasErrors = true;
    } else {
      console.log('✅ Prettier tailwindStylesheet points to global.css');
    }
  } catch (e) {
    console.error('❌ Could not parse .prettierrc.json');
    hasErrors = true;
  }
}

const globalCssPath = join(rootDir, 'src/styles/global.css');
if (fs.existsSync(globalCssPath)) {
  const css = fs.readFileSync(globalCssPath, 'utf8');
  if (!css.includes('@import "tailwindcss"')) {
    console.error('❌ global.css must import Tailwind v4: @import "tailwindcss"');
    hasErrors = true;
  }
  if (!css.includes('@theme')) {
    console.error('❌ global.css must define @theme tokens');
    hasErrors = true;
  }
  if (!hasErrors) {
    console.log('✅ global.css contains Tailwind import and @theme tokens');
  }
} else {
  console.error('❌ Missing src/styles/global.css');
  hasErrors = true;
}

// Final result
if (hasErrors) {
  console.error('\n❌ Repository structure validation failed');
  process.exit(1);
} else {
  console.log('\n✅ Repository structure is valid');
}
