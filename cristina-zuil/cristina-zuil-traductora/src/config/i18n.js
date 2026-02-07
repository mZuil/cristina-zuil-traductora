/**
 * Centralized i18n configuration
 */

export const i18nConfig = {
  defaultLocale: 'es',
  locales: ['es', 'en'],
  localeLabels: {
    es: 'Español',
    en: 'English',
  },
  strapi: {
    url: import.meta.env.STRAPI_URL || 'http://localhost:1337',
  },
  homeSlug: '',
};

export function getNonDefaultLocales() {
  return i18nConfig.locales.filter(locale => locale !== i18nConfig.defaultLocale);
}

export function getLocalizedUrl(slug, locale) {
  if (!slug || slug === i18nConfig.homeSlug) {
    if (locale === i18nConfig.defaultLocale) {
      return '/';
    }
    return `/${locale}`;
  }
  
  if (locale === i18nConfig.defaultLocale) {
    return `/${slug}`;
  }
  return `/${locale}/${slug}`;
}

export function isHomePage(page) {
  return !page?.slug || page.slug === '' || page.slug === i18nConfig.homeSlug;
}

export async function fetchPagesByLocale(locale) {
  const url = `${i18nConfig.strapi.url}/api/pages?locale=${locale}&populate=*`;
    
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch pages for locale ${locale}:`, response.status, response.statusText);
      return [];
    }
    
    const result = await response.json();
    const { data } = result;
    
    if (!data) {
      console.error('No "data" field in response');
      return [];
    }
        
    return data || [];
  } catch (error) {
    console.error(`Error fetching pages for locale ${locale}:`, error);
    return [];
  }
}

/**
 * Fetch books from Strapi for a specific locale and optional category
 */
export async function fetchBooksByLocale(locale, category = null) {
  let url = `${i18nConfig.strapi.url}/api/books?locale=${locale}&populate=*`;
  
  if (category) {
    url += `&filters[category][$eq]=${category}`;
  }
  
  console.log(`Fetching books from: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch books for locale ${locale}:`, response.status, response.statusText);
      return [];
    }
    
    const result = await response.json();
    const { data } = result;
    
    if (!data) {
      console.error('No "data" field in response');
      return [];
    }
    
    console.log(`Found ${data.length} books for locale ${locale}${category ? ` in category ${category}` : ''}`);
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching books for locale ${locale}:`, error);
    return [];
  }
}

/**
 * Fetch a single book by slug
 */
export async function fetchBookBySlug(slug, locale) {
  const url = `${i18nConfig.strapi.url}/api/books?locale=${locale}&filters[slug][$eq]=${slug}&populate=*`;
  
  console.log(`Fetching book: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch book:`, response.status, response.statusText);
      return null;
    }
    
    const result = await response.json();
    const { data } = result;
    
    if (!data || data.length === 0) {
      console.error('Book not found');
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error(`Error fetching book:`, error);
    return null;
  }
}

/**
 * Fetch articles from Strapi for a specific locale
 */
export async function fetchArticlesByLocale(locale) {
  const url = `${i18nConfig.strapi.url}/api/articles?locale=${locale}&populate=*&sort=publishedDate:desc`;
  
  console.log(`Fetching articles from: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch articles for locale ${locale}:`, response.status, response.statusText);
      return [];
    }
    
    const result = await response.json();
    const { data } = result;
    
    if (!data) {
      console.error('No "data" field in response');
      return [];
    }
    
    console.log(`Found ${data.length} articles for locale ${locale}`);
    
    return data || [];
  } catch (error) {
    console.error(`Error fetching articles for locale ${locale}:`, error);
    return [];
  }
}

/**
 * Fetch a single article by slug
 */
export async function fetchArticleBySlug(slug, locale) {
  const url = `${i18nConfig.strapi.url}/api/articles?locale=${locale}&filters[slug][$eq]=${slug}&populate=*`;
  
  console.log(`Fetching article: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch article:`, response.status, response.statusText);
      return null;
    }
    
    const result = await response.json();
    const { data } = result;
    
    if (!data || data.length === 0) {
      console.error('Article not found');
      return null;
    }
    
    return data[0];
  } catch (error) {
    console.error(`Error fetching article:`, error);
    return null;
  }
}