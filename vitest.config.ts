import { getViteConfig } from "astro/config";
import { defineConfig } from "vite";

export default defineConfig(
	getViteConfig(
		defineConfig({
			test: {
				globals: true,
				environment: "happy-dom",
				coverage: {
					provider: "v8",
					reporter: ["text", "json", "html"],
					exclude: [
						"node_modules/",
						"dist/",
						".astro/",
						"tests/",
						"*.config.{js,ts,mjs}",
						"scripts/",
						"policy/",
					],
				},
				include: ["tests/unit/**/*.{test,spec}.{js,mjs,ts}"],
				exclude: ["node_modules", "dist", ".astro"],
			},
		}),
	),
);
