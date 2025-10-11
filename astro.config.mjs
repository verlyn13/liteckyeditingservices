// @ts-check

import { dirname, join } from "node:path";
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
		// Sentry Astro integration for source maps upload (client-only runtime kept)
		sentry({
			sourceMapsUploadOptions: {
				org: process.env.SENTRY_ORG,
				project: process.env.SENTRY_PROJECT,
				authToken: process.env.SENTRY_AUTH_TOKEN,
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
			cssCodeSplit: true,
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
