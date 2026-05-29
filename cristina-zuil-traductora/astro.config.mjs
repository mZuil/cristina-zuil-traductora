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