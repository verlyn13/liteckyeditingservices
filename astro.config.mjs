// @ts-check

import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import sentry from "@sentry/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://liteckyeditingservices.com",
	integrations: [
		svelte({
			compilerOptions: {
				experimental: { async: true },
			},
		}),
		sitemap(),
		// Sentry Astro integration for error tracking and source maps upload
		// Note: DSN is configured in sentry.client.config.js and sentry.server.config.js
		sentry({
			sourceMapsUploadOptions: {
				org: process.env.SENTRY_ORG || "happy-patterns-llc",
				project: process.env.SENTRY_PROJECT || "javascript-astro",
				authToken: process.env.SENTRY_AUTH_TOKEN,
				enabled: !!process.env.SENTRY_AUTH_TOKEN,
			},
			autoInstrumentation: {
				// We run static output on Cloudflare Pages (non-Node). Ensure no server middleware.
				requestHandler: false,
			},
		}),
	],
	// Static output for now, will switch to hybrid when SSR is needed
	output: "static",
	compressHTML: true,
	build: {
		inlineStylesheets: "auto",
		assets: "_assets",
	},
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		build: {
			target: "es2024",
			cssCodeSplit: true,
			sourcemap: true, // Enable sourcemaps for Sentry
			rollupOptions: {
				output: {
					manualChunks: {
						"svelte-runtime": ["svelte"],
					},
					assetFileNames: "_assets/[name].[hash][extname]",
				},
			},
		},
		ssr: {
			noExternal: ["@fontsource/*"],
		},
	},
	image: {
		domains: [],
		remotePatterns: [{ protocol: "https" }],
		service: {
			entrypoint: "astro/assets/services/sharp",
			config: {
				limitInputPixels: 268402689,
			},
		},
	},
	// No experimental flags enabled
	security: {
		checkOrigin: true,
	},
	prefetch: {
		...(process.env.CI
			? { prefetchAll: false }
			: { prefetchAll: true, defaultStrategy: "viewport" }),
	},
});
