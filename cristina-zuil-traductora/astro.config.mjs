// @ts-check
import { defineConfig } from 'astro/config';
import { i18nConfig } from './src/config/i18n';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  i18n: {
    defaultLocale: i18nConfig.defaultLocale,
    locales: i18nConfig.locales,
    routing: {
      prefixDefaultLocale: false,
    },
  },
  output: 'server',
  adapter: cloudflare(),
});