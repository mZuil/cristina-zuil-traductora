const STRAPI_URL = 'http://localhost:1337';

/**
 * Fetch all pages for a specific locale
 */
export async function getPagesByLocale(locale = 'es') {
  const response = await fetch(
    `${STRAPI_URL}/api/pages?locale=${locale}&populate=*`
  );
  const { data } = await response.json();
  return data;
}

/**
 * Get URL for a page based on locale
 */
export function getLocalizedUrl(slug, locale, defaultLocale = 'es') {
  if (locale === defaultLocale) {
    return `/${slug}`;
  }
  return `/${locale}/${slug}`;
}