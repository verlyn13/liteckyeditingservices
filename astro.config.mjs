// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/static';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://liteckyeditingservices.com',
  integrations: [
    svelte(),
    sitemap()
  ],
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    }
  }),
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
  experimental: {
    contentCollectionCache: true,
    contentLayer: true,
    globalRoutingPriority: true
  },
  security: {
    checkOrigin: true
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});
