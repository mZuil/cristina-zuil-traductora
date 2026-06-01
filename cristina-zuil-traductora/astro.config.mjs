// @ts-check
import { defineConfig } from 'astro/config';
import { i18nConfig } from './src/config/i18n';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cristina-zuil-traductora.es',
  i18n: {
    defaultLocale: i18nConfig.defaultLocale,
    locales: i18nConfig.locales,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  output: 'server',
  adapter: cloudflare(),
  build: {
    // Inline all per-route CSS into the HTML <style> tag instead of emitting
    // external <link rel="stylesheet"> files. This eliminates the
    // render-blocking CSS request (Lighthouse: "Render-blocking requests").
    // Astro's default 'auto' only inlines stylesheets <4 KiB; our routes are
    // ~7 KiB so they were being externalized.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: i18nConfig.defaultLocale,
        locales: Object.fromEntries(
          i18nConfig.locales.map((locale) => [locale, locale])
        ),
      },
    }),
  ],
});