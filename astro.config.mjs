// @ts-check

import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://liteckyeditingservices.com",
	integrations: [svelte(), sitemap()],
	// Static output for now, will switch to hybrid when SSR is needed
	output: "static",
	compressHTML: true,
	build: {
		inlineStylesheets: "auto",
		assets: "_assets",
	},
	vite: {
		plugins: [tailwindcss()],
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
		prefetchAll: true,
		defaultStrategy: "viewport",
	},
});
