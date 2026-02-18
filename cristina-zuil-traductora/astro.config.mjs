// @ts-check
import { defineConfig } from 'astro/config';
import { i18nConfig } from './src/config/i18n';

export default defineConfig({
  i18n: {
    defaultLocale: i18nConfig.defaultLocale,
    locales: i18nConfig.locales,
    routing: {
      prefixDefaultLocale: false,
    },
  },
});