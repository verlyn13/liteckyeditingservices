// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://liteckyeditingservices.com',
  integrations: [
    svelte(),
    sitemap()
  ],
  // Static output for Cloudflare Pages
  // Will change to 'server' when we add SSR functions
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'svelte-runtime': ['svelte']
          },
          assetFileNames: '_assets/[name].[hash][extname]'
        }
      }
    },
    ssr: {
      noExternal: ['@fontsource/*']
    }
  },
  image: {
    domains: [],
    remotePatterns: [{ protocol: "https" }],
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689
      }
    }
  },
  // No experimental flags enabled
  security: {
    checkOrigin: true
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});
