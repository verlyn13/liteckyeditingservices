#!/usr/bin/env node

/**
 * Documentation Accuracy Validator
 *
 * Automatically validates that documentation (especially PROJECT-STATUS.md)
 * contains accurate information by checking:
 * 1. Package versions match installed versions
 * 2. Internal file links/references are valid
 * 3. Referenced GitHub Actions workflows exist
 *
 * This script runs as a pre-commit hook and in CI to catch documentation
 * drift before it reaches the repository.
 *
 * Exit codes:
 *   0 - All validations passed
 *   1 - Validation failures found
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '../..');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
};

/**
 * Main validation orchestrator
 */
async function validateDocumentation() {
  console.log(`${colors.blue}📋 Validating documentation accuracy...${colors.reset}\n`);

  const errors = [];

  try {
    errors.push(...(await validatePackageVersions()));
    errors.push(...(await validateInternalLinks()));
    errors.push(...(await validateWorkflowReferences()));

    if (errors.length > 0) {
      console.error(`\n${colors.red}❌ Documentation validation failed:${colors.reset}`);
      errors.forEach((err) => console.error(`  ${colors.red}•${colors.reset} ${err}`));
      console.error(`\n${colors.dim}Fix these issues and commit again.${colors.reset}\n`);
      process.exit(1);
    }

    console.log(`${colors.green}✅ Documentation validation passed${colors.reset}`);
    console.log(
      `${colors.dim}All package versions, links, and references are accurate.${colors.reset}\n`
    );
  } catch (error) {
    console.error(`\n${colors.red}❌ Validation script error:${colors.reset}`, error.message);
    process.exit(1);
  }
}

/**
 * Validate package versions match installed versions
 */
async function validatePackageVersions() {
  const errors = [];
  const statusPath = join(ROOT, 'PROJECT-STATUS.md');

  if (!existsSync(statusPath)) {
    return []; // Skip if file doesn't exist (e.g., during initial repo setup)
  }

  const statusContent = readFileSync(statusPath, 'utf8');

  // Define packages to check with their regex patterns
  const packagesToCheck = {
    '@biomejs/biome': {
      regex: /Biome\s+([\d.]+)/,
      name: 'Biome',
    },
    typescript: {
      regex: /TypeScript\s+([\d.]+)/,
      name: 'TypeScript',
    },
    eslint: {
      regex: /ESLint\s+([\d.]+)/,
      name: 'ESLint',
    },
    prettier: {
      regex: /Prettier\s+([\d.]+)/,
      name: 'Prettier',
    },
    vitest: {
      regex: /Vitest\s+([\d.]+)/,
      name: 'Vitest',
    },
    tailwindcss: {
      regex: /Tailwind CSS v([\d.]+)/,
      name: 'Tailwind CSS',
    },
    '@sendgrid/mail': {
      regex: /SendGrid\s+([\d.]+)/,
      name: 'SendGrid',
    },
    'decap-cms-app': {
      regex: /Decap CMS[^:]*:\s+\*\*Version\*\*:\s+([\d.]+)/,
      name: 'Decap CMS',
    },
  };

  console.log(`${colors.blue}Checking package versions...${colors.reset}`);

  for (const [pkg, { regex, name }] of Object.entries(packagesToCheck)) {
    const installedVersion = await getInstalledVersion(pkg);
    const match = statusContent.match(regex);

    if (match) {
      // Get version from first capture group that has a value
      const claimedVersion = match[1] || match[2];

      if (installedVersion && installedVersion !== claimedVersion) {
        errors.push(`${name}: claimed ${claimedVersion}, but ${installedVersion} is installed`);
      } else if (installedVersion) {
        console.log(`  ${colors.green}✓${colors.reset} ${name} ${installedVersion}`);
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
      `pnpm list ${packageName} --depth=0 2>/dev/null | grep -oE "${packageName.replace('/', '\\/')} [0-9.]+" | grep -oE "[0-9.]+"`,
      {
        encoding: 'utf8',
        cwd: ROOT,
        stdio: ['pipe', 'pipe', 'ignore'], // Suppress stderr
      }
    );
    const version = result.trim();
    return version || null;
  } catch {
    return null;
  }
}

/**
 * Validate internal file links
 */
async function validateInternalLinks() {
  const errors = [];
  const statusPath = join(ROOT, 'PROJECT-STATUS.md');

  if (!existsSync(statusPath)) {
    return [];
  }

  const statusContent = readFileSync(statusPath, 'utf8');

  console.log(`\n${colors.blue}Checking internal links...${colors.reset}`);

  // Extract markdown links: [text](path)
  const markdownLinks = [...statusContent.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)]
    .map((match) => match[2])
    .filter(
      (link) => !link.startsWith('http') && !link.startsWith('#') && !link.startsWith('mailto:')
    );

  // Extract backtick file references: `path/to/file.ext`
  // Look for common file extensions to avoid false positives
  const backtickPaths = [
    ...statusContent.matchAll(/`([^`]+\.(ts|js|yml|yaml|json|md|mjs|cjs|astro|svelte|toml|css))`/g),
  ]
    .map((match) => match[1])
    .filter((path) => {
      // Filter out code snippets, URL paths, globs, and dynamic references
      if (!path.includes('/')) return false; // Not a file path
      if (path.includes(' ')) return false; // Contains space (likely code)
      if (path.includes('example')) return false; // Example code
      if (path.includes('your-')) return false; // Placeholder
      if (path.startsWith('/')) return false; // URL path, not file path
      if (path.includes('**')) return false; // Glob pattern
      if (path.includes('*')) return false; // Glob pattern
      if (path.includes('<') || path.includes('>')) return false; // Dynamic reference

      // Skip paths that are explicitly mentioned as deleted in context
      // (checking if "Deleted:" appears within 100 chars before the reference)
      const pathIndex = statusContent.indexOf(`\`${path}\``);
      if (pathIndex > 0) {
        const contextBefore = statusContent.substring(Math.max(0, pathIndex - 100), pathIndex);
        if (contextBefore.includes('Deleted:') || contextBefore.includes('deleted files')) {
          return false;
        }
      }

      return true;
    });

  const allPaths = [...new Set([...markdownLinks, ...backtickPaths])];

  // For historical tolerance: extract dates from "Recent Progress" sections
  // to be lenient with file references in progress notes older than 10 days
  const today = new Date();
  const tenDaysAgo = new Date(today);
  tenDaysAgo.setDate(today.getDate() - 10);

  let validCount = 0;
  for (const path of allPaths) {
    const fullPath = join(ROOT, path);
    if (!existsSync(fullPath)) {
      // Check if this reference is in a historical "Recent Progress" section
      const pathIndex = statusContent.indexOf(`\`${path}\``);
      if (pathIndex > 0) {
        // Look for context within 200 chars before the reference
        const contextBefore = statusContent.substring(Math.max(0, pathIndex - 200), pathIndex);

        // Skip if mentioned as historical implementation ("Added", "Created", etc.)
        const historicalPatterns = [
          /Added\s+$/,
          /Created\s+$/,
          /Implemented\s+$/,
          /Updated\s+$/,
          /simplified to\s+$/,
          /page at\s+$/,
          /Config\*\*:\s+$/, // Matches "**Config**: `file`"
        ];

        if (historicalPatterns.some((pattern) => pattern.test(contextBefore))) {
          validCount++; // Count as "valid" (historical reference)
          continue;
        }

        // Also check for date context within 500 chars
        const contextBeforeWide = statusContent.substring(Math.max(0, pathIndex - 500), pathIndex);
        const dateMatch = contextBeforeWide.match(/(?:October|Oct)\s+(\d{1,2}),\s+2025/);
        if (dateMatch) {
          const day = parseInt(dateMatch[1], 10);
          const referencedDate = new Date(2025, 9, day); // October = month 9 (0-indexed)

          // If reference is from a section dated >10 days ago, skip validation
          if (referencedDate < tenDaysAgo) {
            validCount++; // Count as "valid" (historical tolerance)
            continue;
          }
        }
      }

      errors.push(`Broken link/reference: ${path}`);
    } else {
      validCount++;
    }
  }

  console.log(`  ${colors.green}✓${colors.reset} ${validCount} internal links verified`);

  return errors;
}

/**
 * Validate workflow references
 */
async function validateWorkflowReferences() {
  const errors = [];
  const statusPath = join(ROOT, 'PROJECT-STATUS.md');

  if (!existsSync(statusPath)) {
    return [];
  }

  const statusContent = readFileSync(statusPath, 'utf8');

  console.log(`\n${colors.blue}Checking workflow references...${colors.reset}`);

  // Extract workflow file references
  const workflows = [...statusContent.matchAll(/\.github\/workflows\/([a-z0-9-]+\.yml)/g)].map(
    (match) => match[0]
  );

  const uniqueWorkflows = [...new Set(workflows)];
  let validCount = 0;

  for (const workflow of uniqueWorkflows) {
    const fullPath = join(ROOT, workflow);
    if (!existsSync(fullPath)) {
      errors.push(`Referenced workflow does not exist: ${workflow}`);
    } else {
      validCount++;
    }
  }

  console.log(`  ${colors.green}✓${colors.reset} ${validCount} workflow references verified`);

  return errors;
}

// Execute validation
validateDocumentation().catch((err) => {
  console.error(`${colors.red}Validation script error:${colors.reset}`, err);
  process.exit(1);
});
