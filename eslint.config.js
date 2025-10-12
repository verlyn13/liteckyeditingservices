import tsParser from "@typescript-eslint/parser";
import astro from "eslint-plugin-astro";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import svelteParser from "svelte-eslint-parser";

export default [
	// Minimal ESLint config for Astro and Svelte only; JS/TS handled by Biome
	...astro.configs["flat/recommended"],
	...svelte.configs["flat/recommended"],
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				// Let <script lang="ts"> parse TypeScript via @typescript-eslint/parser
				parser: tsParser,
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
	},
	{
		ignores: [
			"dist/",
			".astro/",
			"node_modules/",
			"coverage/",
			"public/admin/",
			"*.min.js",
		],
	},
];
