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
  '.dev.vars',
  'secrets.json',
  'credentials.json'
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
      for (const pattern of forbiddenPatterns) {
        if (entry.name === pattern || entry.name.startsWith(pattern + '.')) {
          console.error(`❌ Forbidden file found: ${relativePath}`);
          hasErrors = true;
        }
      }
    }
  }
}

checkForbiddenFiles();

if (!hasErrors) {
  console.log('✅ No forbidden files found');
}

// Final result
if (hasErrors) {
  console.error('\n❌ Repository structure validation failed');
  process.exit(1);
} else {
  console.log('\n✅ Repository structure is valid');
}