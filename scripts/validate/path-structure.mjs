#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

console.log('🔍 Validating directory structure and path integrity...\n');

// Expected directory structure
const expectedStructure = {
  'src/': ['components/', 'layouts/', 'pages/', 'styles/', 'scripts/', 'content/', 'images/', 'lib/', 'utils/'],
  'public/': ['fonts/', 'images/', 'admin/', 'scripts/'],
  'workers/': ['decap-oauth/', 'queue-consumer/'],
  'tests/': ['unit/', 'e2e/', 'a11y/'],
  'scripts/': ['validate/', 'gates/', 'drift/'],
  'policy/': ['code/', 'infra/', 'cms/', 'email/', 'docs/'],
  'docs/': ['playbooks/', 'decisions/', 'api/', 'infrastructure/'],
  'desired-state/': [],
  '_archive/': []
};

// Forbidden nested patterns (prevent directory duplication)
const forbiddenNestedPatterns = [
  'workers/*/workers/',
  'src/*/src/',
  'public/*/public/',
  'tests/*/tests/',
  'scripts/*/scripts/',
  'policy/*/policy/',
  'docs/*/docs/'
];

let hasErrors = false;

function checkExpectedStructure() {
  console.log('Checking expected directory structure...');

  for (const [parentDir, expectedSubDirs] of Object.entries(expectedStructure)) {
    const parentPath = join(rootDir, parentDir);

    if (!fs.existsSync(parentPath)) {
      console.log(`❌ Missing expected directory: ${parentDir}`);
      hasErrors = true;
      continue;
    }

    console.log(`✅ ${parentDir}`);

    for (const subDir of expectedSubDirs) {
      const subPath = join(parentPath, subDir);
      if (!fs.existsSync(subPath)) {
        console.log(`⚠️  Missing expected subdirectory: ${parentDir}${subDir}`);
      } else {
        console.log(`  ✅ ${parentDir}${subDir}`);
      }
    }
  }
  console.log();
}

function checkForbiddenNesting() {
  console.log('Checking for forbidden nested directory patterns...');

  for (const pattern of forbiddenNestedPatterns) {
    const parts = pattern.split('/');
    const parentPattern = parts[0];
    const nestedPattern = parts[2];

    // Find all directories matching the parent pattern
    const parentDirs = fs.readdirSync(rootDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && (parentPattern === '*' || entry.name === parentPattern))
      .map(entry => entry.name);

    for (const parentDir of parentDirs) {
      if (parentPattern === 'workers' || parentDir === parentPattern) {
        const parentPath = join(rootDir, parentDir);

        try {
          const subDirs = fs.readdirSync(parentPath, { withFileTypes: true })
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name);

          for (const subDir of subDirs) {
            const subPath = join(parentPath, subDir);

            try {
              const nestedDirs = fs.readdirSync(subPath, { withFileTypes: true })
                .filter(entry => entry.isDirectory())
                .map(entry => entry.name);

              for (const nestedDir of nestedDirs) {
                if (nestedPattern === '*' || nestedDir === nestedPattern || nestedDir === parentDir) {
                  console.log(`❌ Forbidden nested structure found: ${parentDir}/${subDir}/${nestedDir}/`);
                  hasErrors = true;
                }
              }
            } catch (err) {
              // Directory might not be readable, skip
            }
          }
        } catch (err) {
          // Directory might not be readable, skip
        }
      }
    }
  }

  if (!hasErrors) {
    console.log('✅ No forbidden nested patterns found');
  }
  console.log();
}

function checkWorkingDirectory() {
  console.log('Checking working directory context...');

  const cwd = process.cwd();
  const expectedRoot = '/home/verlyn13/Projects/verlyn13/liteckyeditingservices';

  if (cwd !== expectedRoot) {
    console.log(`⚠️  Current working directory: ${cwd}`);
    console.log(`⚠️  Expected working directory: ${expectedRoot}`);
    console.log('   Run commands from project root to avoid path issues');
  } else {
    console.log(`✅ Working directory is correct: ${cwd}`);
  }
  console.log();
}

function generatePathHelper() {
  const helperContent = `#!/bin/bash

# Path Helper for Litecky Editing Services
# Source this file to ensure correct working directory and paths

PROJECT_ROOT="/home/verlyn13/Projects/verlyn13/liteckyeditingservices"

# Function to ensure we're in the project root
ensure_project_root() {
    if [ "$(pwd)" != "$PROJECT_ROOT" ]; then
        echo "⚠️  Not in project root. Changing to: $PROJECT_ROOT"
        cd "$PROJECT_ROOT" || {
            echo "❌ Failed to change to project root"
            return 1
        }
    fi
    echo "✅ Working in project root: $(pwd)"
}

# Function to run commands in worker directories
run_in_worker() {
    local worker_name="$1"
    shift
    local worker_path="$PROJECT_ROOT/workers/$worker_name"

    if [ ! -d "$worker_path" ]; then
        echo "❌ Worker directory not found: $worker_path"
        return 1
    fi

    echo "🔧 Running in worker '$worker_name': $*"
    (cd "$worker_path" && "$@")
}

# Function to validate current path
validate_path() {
    if [ "$(pwd)" != "$PROJECT_ROOT" ]; then
        echo "❌ Not in project root: $(pwd)"
        echo "   Expected: $PROJECT_ROOT"
        return 1
    fi

    echo "✅ Path validation passed"
    return 0
}

# Auto-correct path if sourced
if [ "\${BASH_SOURCE[0]}" != "\${0}" ]; then
    ensure_project_root
fi
`;

  const helperPath = join(rootDir, 'scripts/path-helper.sh');
  fs.writeFileSync(helperPath, helperContent);
  fs.chmodSync(helperPath, 0o755);

  console.log('📝 Generated path helper script: scripts/path-helper.sh');
  console.log('   Usage: source scripts/path-helper.sh');
  console.log('   Functions: ensure_project_root, run_in_worker, validate_path');
  console.log();
}

// Run all checks
checkWorkingDirectory();
checkExpectedStructure();
checkForbiddenNesting();
generatePathHelper();

if (hasErrors) {
  console.log('❌ Path structure validation failed');
  process.exit(1);
} else {
  console.log('✅ Path structure validation passed');
}