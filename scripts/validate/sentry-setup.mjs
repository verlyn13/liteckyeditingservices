#!/usr/bin/env node

/**
 * Sentry Setup Validation Script
 *
 * Validates that Sentry is properly configured and integrated into the project.
 * Checks for:
 * - Required packages installed
 * - Configuration files present and valid
 * - Environment variables documented
 * - Integration in BaseLayout
 * - Admin instrumentation
 * - Test coverage
 * - Documentation completeness
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "../..");

const REQUIRED_FILES = [
	"src/lib/sentry.ts",
	"src/scripts/sentry-init.ts",
	"src/pages/test-sentry.astro",
	"public/admin/sentry-admin.js",
	"tests/sentry-integration.spec.ts",
	"docs/SENTRY-README.md",
	"docs/SENTRY-SETUP.md",
	"docs/SENTRY-INTEGRATIONS.md",
];

const REQUIRED_PACKAGES = ["@sentry/browser", "@sentry/astro"];

const REQUIRED_ENV_VARS = [
	"PUBLIC_SENTRY_DSN",
	"PUBLIC_SENTRY_ENVIRONMENT",
	"PUBLIC_SENTRY_RELEASE",
];

let exitCode = 0;

function error(message) {
	console.error(`❌ ${message}`);
	exitCode = 1;
}

function success(message) {
	console.log(`✅ ${message}`);
}

function info(message) {
	console.log(`ℹ️  ${message}`);
}

console.log("🔍 Validating Sentry Setup...\n");

// Check 1: Validate package.json dependencies
console.log("1️⃣  Checking required packages...");
const packageJsonPath = join(ROOT, "package.json");
if (!existsSync(packageJsonPath)) {
	error("package.json not found");
} else {
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
	const dependencies = {
		...packageJson.dependencies,
		...packageJson.devDependencies,
	};

	for (const pkg of REQUIRED_PACKAGES) {
		if (dependencies[pkg]) {
			success(`Package ${pkg} installed (${dependencies[pkg]})`);
		} else {
			error(`Package ${pkg} not found in package.json`);
		}
	}
}
console.log();

// Check 2: Validate required files exist
console.log("2️⃣  Checking required files...");
for (const file of REQUIRED_FILES) {
	const filePath = join(ROOT, file);
	if (existsSync(filePath)) {
		success(`File exists: ${file}`);
	} else {
		error(`File missing: ${file}`);
	}
}
console.log();

// Check 3: Validate environment variable documentation
console.log("3️⃣  Checking environment variable documentation...");
const envExamplePath = join(ROOT, ".env.example");
if (!existsSync(envExamplePath)) {
	error(".env.example not found");
} else {
	const envExample = readFileSync(envExamplePath, "utf8");
	for (const envVar of REQUIRED_ENV_VARS) {
		if (envExample.includes(envVar)) {
			success(`Environment variable documented: ${envVar}`);
		} else {
			error(`Environment variable missing from .env.example: ${envVar}`);
		}
	}
}
console.log();

// Check 4: Validate BaseLayout integration
console.log("4️⃣  Checking BaseLayout integration...");
const baseLayoutPath = join(ROOT, "src/layouts/BaseLayout.astro");
if (!existsSync(baseLayoutPath)) {
	error("BaseLayout.astro not found");
} else {
	const baseLayout = readFileSync(baseLayoutPath, "utf8");
	if (baseLayout.includes("sentry-init")) {
		success("Sentry initialization script imported in BaseLayout");
	} else {
		error("Sentry initialization script not found in BaseLayout");
	}
}
console.log();

// Check 5: Validate admin instrumentation
console.log("5️⃣  Checking admin instrumentation...");
const adminIndexPath = join(ROOT, "public/admin/index.html");
if (!existsSync(adminIndexPath)) {
	error("Admin index.html not found");
} else {
	const adminIndex = readFileSync(adminIndexPath, "utf8");
	if (adminIndex.includes("sentry-admin.js")) {
		success("Sentry admin instrumentation script loaded");
	} else {
		error("Sentry admin instrumentation script not found in admin/index.html");
	}
}
console.log();

// Check 6: Validate sentry.ts configuration
console.log("6️⃣  Checking Sentry configuration...");
const sentryConfigPath = join(ROOT, "src/lib/sentry.ts");
if (!existsSync(sentryConfigPath)) {
	error("sentry.ts configuration file not found");
} else {
	const sentryConfig = readFileSync(sentryConfigPath, "utf8");

	const checks = [
		{ name: "initSentry function", pattern: "export function initSentry" },
		{
			name: "captureException export",
			pattern: "export function captureException",
		},
		{ name: "startSpan export", pattern: "export function startSpan" },
		{ name: "setUser export", pattern: "export function setUser" },
		{ name: "logger export", pattern: "export const { logger }" },
		{ name: "browserTracingIntegration", pattern: "browserTracingIntegration" },
		{ name: "replayIntegration", pattern: "replayIntegration" },
		{ name: "consoleLoggingIntegration", pattern: "consoleLoggingIntegration" },
		{ name: "httpClientIntegration", pattern: "httpClientIntegration" },
		{ name: "Privacy settings (maskAllText)", pattern: "maskAllText: true" },
		{
			name: "Privacy settings (blockAllMedia)",
			pattern: "blockAllMedia: true",
		},
		{ name: "beforeSend filter", pattern: "beforeSend(" },
	];

	for (const check of checks) {
		if (sentryConfig.includes(check.pattern)) {
			success(`Configuration includes: ${check.name}`);
		} else {
			error(`Configuration missing: ${check.name}`);
		}
	}
}
console.log();

// Check 7: Validate test coverage
console.log("7️⃣  Checking test coverage...");
const testPath = join(ROOT, "tests/sentry-integration.spec.ts");
if (!existsSync(testPath)) {
	error("Sentry integration tests not found");
} else {
	const testContent = readFileSync(testPath, "utf8");

	const testGroups = [
		"Sentry Integration",
		"Sentry Test Page",
		"Sentry Configuration Validation",
		"Sentry Performance",
	];

	for (const group of testGroups) {
		if (testContent.includes(`test.describe('${group}'`)) {
			success(`Test group exists: ${group}`);
		} else {
			error(`Test group missing: ${group}`);
		}
	}
}
console.log();

// Check 8: Validate documentation cross-references
console.log("8️⃣  Checking documentation cross-references...");
const envMdPath = join(ROOT, "ENVIRONMENT.md");
if (!existsSync(envMdPath)) {
	error("ENVIRONMENT.md not found");
} else {
	const envMd = readFileSync(envMdPath, "utf8");
	if (envMd.includes("Sentry") && envMd.includes("PUBLIC_SENTRY_DSN")) {
		success("Sentry documented in ENVIRONMENT.md");
	} else {
		error("Sentry not properly documented in ENVIRONMENT.md");
	}
}

const docIndexPath = join(ROOT, "DOCUMENTATION-MASTER-INDEX.md");
if (!existsSync(docIndexPath)) {
	error("DOCUMENTATION-MASTER-INDEX.md not found");
} else {
	const docIndex = readFileSync(docIndexPath, "utf8");
	if (docIndex.includes("SENTRY-README.md")) {
		success("Sentry documentation indexed in DOCUMENTATION-MASTER-INDEX.md");
	} else {
		error("Sentry documentation not indexed in DOCUMENTATION-MASTER-INDEX.md");
	}
}
console.log();

// Check 9: Validate npm scripts
console.log("9️⃣  Checking npm scripts...");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const scripts = packageJson.scripts || {};

const expectedScripts = ["test:sentry"];

for (const script of expectedScripts) {
	if (scripts[script]) {
		success(`Script exists: ${script}`);
	} else {
		info(`Optional script not found (can be added): ${script}`);
	}
}
console.log();

// Summary
console.log("═".repeat(60));
if (exitCode === 0) {
	console.log("✅ Sentry setup validation PASSED");
	console.log("");
	console.log("Next steps:");
	console.log("1. Create a Sentry account at https://sentry.io/");
	console.log("2. Create a new project (Platform: Browser JavaScript)");
	console.log("3. Copy the DSN from Settings → Client Keys");
	console.log("4. Add DSN to .dev.vars or .env:");
	console.log("   PUBLIC_SENTRY_DSN=https://xxx@o0.ingest.sentry.io/0");
	console.log("5. Test locally: pnpm dev and visit /test-sentry");
	console.log("6. Run tests: pnpm test:sentry (if script added)");
	console.log("7. Deploy with environment variables set in Cloudflare Pages");
} else {
	console.log("❌ Sentry setup validation FAILED");
	console.log("Please fix the errors above and run this script again.");
}
console.log("═".repeat(60));

process.exit(exitCode);
