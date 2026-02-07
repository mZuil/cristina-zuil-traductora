/**
 * Centralized i18n configuration
 * Edit these settings to update language configuration across the entire site
 */

export const i18nConfig = {
  // Default locale (no prefix in URLs)
  defaultLocale: 'es',
  
  // All supported locales
  locales: ['es', 'en'],
  
  // Locale labels for display
  localeLabels: {
    es: 'Español',
    en: 'English',
  },
  
  // Strapi API configuration
  strapi: {
    url: import.meta.env.STRAPI_URL || 'http://localhost:1337',
  },
  
  // Homepage slug identifier (empty string for homepage)
  homeSlug: '', // Empty slug identifies the homepage in Strapi
};

/**
 * Get non-default locales (locales that need URL prefix)
 */
export function getNonDefaultLocales() {
  return i18nConfig.locales.filter(locale => locale !== i18nConfig.defaultLocale);
}

/**
 * Generate localized URL
 * @param {string} slug - Page slug
 * @param {string} locale - Locale code
 * @returns {string} Localized URL
 */
export function getLocalizedUrl(slug, locale) {
  // Handle homepage (empty slug)
  if (!slug || slug === i18nConfig.homeSlug) {
    if (locale === i18nConfig.defaultLocale) {
      return '/';
    }
    return `/${locale}`;
  }
  
  // Handle other pages
  if (locale === i18nConfig.defaultLocale) {
    return `/${slug}`;
  }
  return `/${locale}/${slug}`;
}

/**
 * Check if a page is the homepage
 * @param {any} page - Strapi page object
 * @returns {boolean}
 */
export function isHomePage(page) {
  return !page?.slug || page.slug === '' || page.slug === i18nConfig.homeSlug;
}

/**
 * Fetch pages from Strapi for a specific locale
 * @param {string} locale - Locale code
 * @returns {Promise<Array>} Array of pages
 */
export async function fetchPagesByLocale(locale) {
  const url = `${i18nConfig.strapi.url}/api/pages?locale=${locale}&populate=*`;
    
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch pages for locale ${locale}:`, response.status, response.statusText);
      return [];
    }
    
    const result = await response.json();
    console.log(`Full API response for locale ${locale}:`, JSON.stringify(result, null, 2));
    
    const { data } = result;
    
    if (!data) {
      console.error('No "data" field in response');
      return [];
    }
    
    console.log(`Found ${data.length} pages for locale ${locale}`);
    
    // Log each page structure
    data.forEach((page, index) => {
      console.log(`Page ${index}:`, {
        id: page.id,
        slug: page.slug || '(empty - homepage)',
        title: page.title,
      });
    });
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching pages for locale ${locale}:`, error);
    return [];
  }
}