#!/usr/bin/env node
import { build } from "esbuild";

await build({
	entryPoints: ["src/admin/cms.ts"],
	outfile: "public/admin/cms.js",
	bundle: true,
	format: "iife",
	target: ["es2024"],
	platform: "browser",
	sourcemap: false,
	minify: true,
	// Critical: DO NOT use external: ['node:*'] - causes "Dynamic require" errors in browser
	// Let esbuild handle Node.js built-ins with its internal polyfills/empty shims
	define: {
		"process.env.NODE_ENV": '"production"',
		global: "window",
		process: "window.process",
	},
	alias: {
		// Map node: imports to browser-compatible versions or empties
		"node:url": "./scripts/shims/url.js",
		"node:path": "./scripts/shims/path.js",
		"node:buffer": "./scripts/shims/buffer.js",
		"node:process": "./scripts/shims/process.js",
	},
});
console.log("[build] cms -> public/admin/cms.js");
