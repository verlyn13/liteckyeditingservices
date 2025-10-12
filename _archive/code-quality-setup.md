# Academic Editor - Complete Code Quality Setup

## Root Configuration Updates

### Updated Root `package.json`

```json
{
  "name": "academic-editor-monorepo",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@10.16.0",
  "engines": {
    "node": ">=24.0.0",
    "pnpm": ">=10.16.0"
  },
  "scripts": {
    "dev": "pnpm --filter @ae/site dev",
    "dev:all": "pnpm --parallel dev",
    "build": "pnpm --filter '*' build",
    "build:site": "pnpm --filter @ae/site build",
    "preview": "pnpm --filter @ae/site preview",
    "deploy:site": "pnpm --filter @ae/site deploy",
    "deploy:workers": "pnpm --filter '@ae/worker-*' deploy",
    "format": "biome format . --write && prettier --write \"**/*.{astro,svelte}\"",
    "format:check": "biome format . && prettier --check \"**/*.{astro,svelte}\"",
    "lint": "biome lint . && eslint .",
    "lint:fix": "biome check . --write --unsafe && eslint . --fix",
    "typecheck": "pnpm --filter '*' typecheck",
    "check": "pnpm lint && pnpm typecheck",
    "check:ci": "biome ci . && prettier --check \"**/*.{astro,svelte}\" && eslint . && pnpm typecheck",
    "prepare": "husky"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.0.0",
    "@cloudflare/workers-types": "^4.20250922.0",
    "@commitlint/cli": "^19.5.0",
    "@commitlint/config-conventional": "^19.5.0",
    "@eslint/js": "^9.11.0",
    "@types/node": "^22.5.0",
    "@typescript-eslint/parser": "^8.6.0",
    "eslint": "^9.11.0",
    "eslint-plugin-astro": "^1.2.0",
    "eslint-plugin-jsx-a11y": "^6.10.0",
    "eslint-plugin-svelte": "^2.44.0",
    "eslint-plugin-tailwindcss": "^3.17.0",
    "globals": "^15.9.0",
    "husky": "^9.1.6",
    "lint-staged": "^15.2.10",
    "prettier": "^3.3.0",
    "prettier-plugin-astro": "^0.14.0",
    "prettier-plugin-svelte": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.6.0",
    "typescript": "^5.6.0"
  }
}
```

### `biome.jsonc` (Root)

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true,
    "defaultBranch": "main",
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf",
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "noNonNullAssertion": "off",
        "useConst": "error",
        "useImportType": "error",
        "useNodejsImportProtocol": "error",
        "noParameterAssign": "error",
      },
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error",
      },
      "complexity": {
        "noBannedTypes": "error",
        "noExtraBooleanCast": "error",
        "noMultipleSpacesInRegularExpressionLiterals": "error",
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noConsoleLog": "warn",
      },
      "performance": {
        "noAccumulatingSpread": "error",
        "noDelete": "error",
      },
      "a11y": {
        "recommended": true,
      },
    },
  },
  "organizeImports": {
    "enabled": true,
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "always",
      "arrowParentheses": "always",
      "bracketSameLine": false,
      "bracketSpacing": true,
    },
    "parser": {
      "unsafeParameterDecoratorsEnabled": false,
    },
  },
  "json": {
    "formatter": {
      "trailingCommas": "none",
    },
  },
  "css": {
    "linter": {
      "enabled": true,
    },
    "formatter": {
      "enabled": true,
      "indentWidth": 2,
      "lineWidth": 100,
    },
  },
  "files": {
    "ignore": [
      "**/dist",
      "**/build",
      "**/.astro",
      "**/.svelte-kit",
      "**/.vercel",
      "**/.wrangler",
      "**/node_modules",
      "**/.pnpm-store",
      "**/coverage",
      "**/.turbo",
      "pnpm-lock.yaml",
    ],
    "include": [
      "**/*.js",
      "**/*.ts",
      "**/*.jsx",
      "**/*.tsx",
      "**/*.json",
      "**/*.jsonc",
      "**/*.css",
    ],
  },
  "overrides": [
    {
      "include": ["**/*.svelte", "**/*.astro"],
      "linter": {
        "enabled": false,
      },
      "formatter": {
        "enabled": false,
      },
    },
    {
      "include": ["**/*.config.js", "**/*.config.ts", "**/*.config.mjs"],
      "linter": {
        "rules": {
          "suspicious": {
            "noConsoleLog": "off",
          },
        },
      },
    },
  ],
}
```

### `eslint.config.js` (Root - ESLint 9 Flat Config)

```javascript
import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import sveltePlugin from 'eslint-plugin-svelte';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tailwind from 'eslint-plugin-tailwindcss';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Base configuration
  js.configs.recommended,

  // Global settings
  {
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.worker,
      },
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Astro files
  ...astroPlugin.configs.recommended,
  ...astroPlugin.configs['jsx-a11y-recommended'],
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroPlugin.parser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
        project: true,
      },
    },
    rules: {
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'error',
      'astro/no-set-html-directive': 'warn',
      'astro/no-set-text-directive': 'warn',
    },
  },

  // Svelte 5 files
  ...sveltePlugin.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: sveltePlugin.parser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.svelte'],
        svelteFeatures: {
          runes: true,
        },
      },
    },
    rules: {
      'svelte/no-at-html-tags': 'error',
      'svelte/valid-compile': 'error',
      'svelte/no-unused-svelte-ignore': 'warn',
      'svelte/no-target-blank': 'error',
    },
  },

  // Tailwind CSS rules
  {
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-custom-classname': 'warn',
    },
  },

  // Accessibility rules (general)
  {
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
    },
  },

  // Project-specific rules
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Ignore patterns
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/.astro/**',
      '**/.svelte-kit/**',
      '**/node_modules/**',
      '**/.wrangler/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/*.min.js',
      '**/*.d.ts',
    ],
  },
];
```

### `prettier.config.mjs` (Root)

```javascript
/** @type {import('prettier').Config} */
export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',

  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-svelte',
    'prettier-plugin-tailwindcss', // Must be last
  ],

  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
        svelteStrictMode: true,
        svelteBracketNewLine: true,
        svelteAllowShorthand: false,
        svelteIndentScriptAndStyle: true,
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],

  // Tailwind v4 configuration
  tailwindConfig: './apps/site/tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'tw'],
  tailwindAttributes: ['class', 'className'],
};
```

### `tsconfig.json` (Root)

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2023", "DOM", "DOM.Iterable", "WebWorker"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": true,
    "declaration": false,
    "declarationMap": false,
    "inlineSources": false,
    "noEmit": true,

    // Strictness beyond strict: true
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noFallthroughCasesInSwitch": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,

    // Modern features
    "useDefineForClassFields": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,

    // Type acquisition
    "types": ["node", "@cloudflare/workers-types"],

    // Paths
    "baseUrl": ".",
    "paths": {
      "@ae/shared/*": ["packages/shared/src/*"],
      "@/*": ["apps/site/src/*"]
    }
  },
  "include": [],
  "exclude": ["node_modules", "dist", "build", ".astro", ".svelte-kit", ".wrangler"],
  "references": [
    { "path": "./apps/site" },
    { "path": "./workers/cron" },
    { "path": "./workers/queue-consumer" },
    { "path": "./packages/shared" }
  ]
}
```

### `.lintstagedrc.json` (Root)

```json
{
  "*.{js,ts,mjs,cjs,jsx,tsx}": [
    "biome check --write --no-errors-on-unmatched",
    "eslint --fix --max-warnings 0"
  ],
  "*.{json,jsonc}": ["biome check --write --no-errors-on-unmatched"],
  "*.css": ["biome check --write --no-errors-on-unmatched"],
  "*.{astro,svelte}": ["prettier --write", "eslint --fix --max-warnings 0"],
  "*.{md,mdx}": ["prettier --write"],
  "*.{yml,yaml}": ["prettier --write"]
}
```

### `commitlint.config.js` (Root)

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation only
        'style', // Code style (formatting, semicolons, etc)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Tests
        'build', // Build system or dependencies
        'ci', // CI/CD configuration
        'chore', // Maintenance tasks
        'revert', // Revert previous commit
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
```

### `.husky/pre-commit` (Git Hook)

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec lint-staged
```

### `.husky/commit-msg` (Git Hook)

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec commitlint --edit $1
```

## App-Specific Configurations

### `apps/site/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@styles/*": ["src/styles/*"]
    },
    "types": ["astro/client", "svelte", "@cloudflare/workers-types"]
  },
  "include": ["src/**/*", "functions/**/*", "astro.config.mjs", "tailwind.config.js", "env.d.ts"]
}
```

### `apps/site/package.json` (Updated scripts)

```json
{
  "name": "@ae/site",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "dev:cf": "wrangler pages dev -- pnpm astro dev",
    "build": "astro build",
    "preview": "wrangler pages dev ./dist",
    "deploy": "pnpm build && wrangler pages deploy ./dist --project-name=academic-editor",
    "deploy:preview": "pnpm build && wrangler pages deploy ./dist --project-name=academic-editor --branch=preview",
    "lint": "eslint . && biome lint src functions",
    "lint:fix": "eslint . --fix && biome check src functions --write",
    "format": "prettier --write \"**/*.{astro,svelte}\" && biome format src functions --write",
    "typecheck": "tsc --noEmit && astro check && sv check",
    "test:a11y": "pa11y-ci --sitemap http://localhost:4321/sitemap.xml",
    "test:lighthouse": "lighthouse http://localhost:4321 --view --budget-path=./lighthouse-budget.json",
    "clean": "rm -rf dist .astro node_modules"
  },
  "dependencies": {
    "@astrojs/cloudflare": "^11.1.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/svelte": "^7.0.0",
    "@fontsource-variable/inter": "^5.1.0",
    "@fontsource/lora": "^5.1.0",
    "astro": "^5.13.0",
    "svelte": "^5.40.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250922.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "@types/node": "^22.5.0",
    "astro-check": "^0.9.0",
    "lighthouse": "^12.2.0",
    "pa11y-ci": "^3.1.0",
    "postcss": "^8.4.47",
    "svelte-check": "^4.0.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.6.0",
    "wrangler": "^3.78.0"
  }
}
```

### `apps/site/env.d.ts`

```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="svelte" />
/// <reference types="@cloudflare/workers-types" />

interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_MAX_FILE_SIZE: string;
  readonly PUBLIC_ALLOWED_FILE_TYPES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        TURNSTILE_SECRET_KEY: string;
        DOCUMENTS: R2Bucket;
        DB: D1Database;
        CACHE: KVNamespace;
        DOCUMENT_QUEUE: Queue;
        ANALYTICS: AnalyticsEngineDataset;
      };
    };
  }
}
```

## Worker Configurations

### `workers/cron/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "lib": ["ES2023"],
    "types": ["@cloudflare/workers-types", "node"]
  },
  "include": ["src/**/*", "wrangler.toml"]
}
```

### `workers/queue-consumer/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "lib": ["ES2023"],
    "types": ["@cloudflare/workers-types", "node"]
  },
  "include": ["src/**/*", "wrangler.toml"]
}
```

## VS Code Configuration

### `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit",
    "source.fixAll.eslint": "explicit"
  },
  "[javascript][typescript][json][jsonc]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[css]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[astro]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[svelte]": {
    "editor.defaultFormatter": "svelte.svelte-vscode"
  },
  "[markdown][mdx]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[yaml][yml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.useFlatConfig": true,
  "eslint.workingDirectories": [
    { "directory": "apps/site", "changeProcessCWD": true },
    { "directory": "workers/cron", "changeProcessCWD": true },
    { "directory": "workers/queue-consumer", "changeProcessCWD": true }
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.configFile": "apps/site/tailwind.config.js",
  "files.associations": {
    "*.css": "css"
  },
  "emmet.includeLanguages": {
    "astro": "html"
  }
}
```

### `.vscode/extensions.json`

```json
{
  "recommendations": [
    "biomejs.biome",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "astro-build.astro-vscode",
    "svelte.svelte-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

## GitHub Actions Updates

### `.github/workflows/quality.yml`

```yaml
name: Code Quality

on:
  pull_request:
    types: [opened, synchronize, reopened]
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v4
        with:
          version: 10.16.0

      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Biome CI (format + lint)
        run: pnpm exec biome ci .

      - name: Prettier check (Astro/Svelte)
        run: pnpm exec prettier --check "**/*.{astro,svelte}"

      - name: ESLint
        run: pnpm exec eslint . --max-warnings 0

      - name: TypeScript checks
        run: |
          pnpm exec tsc --build
          pnpm --filter @ae/site exec astro check
          pnpm --filter @ae/site exec sv check --threshold error

      - name: Build test
        run: pnpm build:site

      - name: Size check
        run: |
          echo "### Bundle Size Report" >> $GITHUB_STEP_SUMMARY
          du -sh apps/site/dist/* | sort -h >> $GITHUB_STEP_SUMMARY

      - name: Comment PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const output = `
            ✅ **Code Quality Checks Passed**
            - Biome format & lint
            - ESLint framework rules  
            - TypeScript compilation
            - Astro & Svelte checks
            `;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            });

  lighthouse:
    needs: quality
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.16.0

      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build site
        run: pnpm build:site

      - name: Run Lighthouse
        run: |
          pnpm --filter @ae/site preview &
          sleep 10
          npx lighthouse http://localhost:8788 \
            --output=json \
            --output-path=./lighthouse-report.json \
            --only-categories=performance,accessibility,best-practices,seo

      - name: Upload Lighthouse report
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-report
          path: lighthouse-report.json
```

### `lighthouse-budget.json` (apps/site/)

```json
{
  "path": "/*",
  "resourceSizes": [
    {
      "resourceType": "script",
      "budget": 150
    },
    {
      "resourceType": "stylesheet",
      "budget": 50
    },
    {
      "resourceType": "image",
      "budget": 500
    },
    {
      "resourceType": "total",
      "budget": 1000
    }
  ],
  "resourceCounts": [
    {
      "resourceType": "third-party",
      "budget": 3
    }
  ],
  "timings": [
    {
      "metric": "interactive",
      "budget": 3000
    },
    {
      "metric": "first-contentful-paint",
      "budget": 1500
    },
    {
      "metric": "largest-contentful-paint",
      "budget": 2500
    }
  ]
}
```

## Installation & Setup Commands

```bash
# 1. Install Node 24 (via nvm or volta)
nvm install 24
nvm use 24

# 2. Install pnpm 10.16
npm install -g pnpm@10.16.0

# 3. Install all dependencies
pnpm install

# 4. Set up Git hooks
pnpm exec husky init
pnpm exec husky add .husky/pre-commit "pnpm exec lint-staged"
pnpm exec husky add .husky/commit-msg "pnpm exec commitlint --edit \$1"

# 5. Run initial checks
pnpm check

# 6. Fix any issues automatically
pnpm lint:fix
pnpm format

# 7. Verify everything works
pnpm check:ci
```

## Quick Reference

### Daily Development Commands

```bash
# Format code
pnpm format

# Fix linting issues
pnpm lint:fix

# Type check
pnpm typecheck

# Run all checks
pnpm check

# Commit with conventional format
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in upload"
git commit -m "docs: update README"
```

### CI/CD Pipeline

- **Pre-commit**: Runs Biome, Prettier, ESLint on staged files
- **Commit message**: Validates conventional commit format
- **PR checks**: Full quality suite + Lighthouse
- **Main branch**: Deploy after quality checks pass

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Total bundle size**: < 1MB
- **Script budget**: < 150KB
- **Stylesheet budget**: < 50KB

This setup provides:

- ⚡ **Fast checks** with Biome v2's Rust-based linter
- 🎯 **Framework-specific rules** for Astro and Svelte
- 🎨 **Consistent formatting** with proper Tailwind v4 class sorting
- 🔒 **Type safety** across the entire monorepo
- 🚀 **Automated fixes** on commit
- 📊 **Performance budgets** enforced in CI
- ♿ **Accessibility checks** built into the workflow
