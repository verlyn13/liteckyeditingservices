// Svelte configuration for Astro integration
// See: https://svelte.dev/docs/svelte/compiler-options

export default {
	compilerOptions: {
		// Enable async SSR for Svelte 5.39+ (October 2025 best practice)
		// Prevents "experimental_async_ssr" warnings during SSR/testing
		experimental: {
			async: true,
		},
	},
};
