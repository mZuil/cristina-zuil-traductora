import { i18nConfig, getLocalizedUrl } from '../config/i18n.js';
import type { AstroGlobal } from 'astro';

/**
 * Extract SEO data from Strapi content
 */
export function getSEOData(
  content: any,
  locale: string,
  astro: AstroGlobal,
  options?: {
    defaultTitle?: string;
    defaultDescription?: string;
    defaultImage?: string;
    type?: 'website' | 'article' | 'book';
  }
) {
  const siteUrl = astro.site?.href || 'http://localhost:4321';
  const currentUrl = astro.url;
  
  // Get SEO fields from Strapi (with fallbacks)
  const seoTitle = content.seoMetaTitle || content.title || options?.defaultTitle || 'Cristina Zuil Traductora';
  const seoDescription = content.seoMetaDescription || 
    (typeof content.content === 'string' ? content.content.substring(0, 160) : '') ||
    options?.defaultDescription || 
    'Cristina Zuil - Traductora profesional';
  
  // Get image from SEO field, or fallback to cover/featured image
  let seoImage = null;
  if (content.seoMetaImage?.url) {
    seoImage = content.seoMetaImage.url;
  } else if (content.coverPage?.url) {
    seoImage = content.coverPage.url;
  } else if (content.cover?.url) {
    seoImage = content.cover.url;
  } else if (content.featured_image?.url) {
    seoImage = content.featured_image.url;
  } else {
    seoImage = options?.defaultImage;
  }
  
  // Build canonical URL
  const slug = content.slug || '';
  const canonicalUrl = slug === '' 
    ? (locale === i18nConfig.defaultLocale ? `${siteUrl}/` : `${siteUrl}/${locale}`)
    : (locale === i18nConfig.defaultLocale ? `${siteUrl}/${slug}` : `${siteUrl}/${locale}/${slug}`);
  
  // Build alternate locales
  const alternateLocales: Array<{ locale: string; url: string }> = [];
  if (content.localizations) {
    for (const localization of content.localizations) {
      const altLocale = localization.locale;
      const altSlug = localization.slug || '';
      const altUrl = altSlug === ''
        ? (altLocale === i18nConfig.defaultLocale ? `${siteUrl}/` : `${siteUrl}/${altLocale}`)
        : (altLocale === i18nConfig.defaultLocale ? `${siteUrl}/${altSlug}` : `${siteUrl}/${altLocale}/${altSlug}`);
      alternateLocales.push({
        locale: altLocale,
        url: altUrl,
      });
    }
  }
  
  return {
    title: seoTitle,
    description: seoDescription,
    image: seoImage,
    url: canonicalUrl,
    locale,
    alternateLocales,
    canonicalUrl,
    keywords: content.seoKeywords,
    publishedTime: content.publishedAt,
    modifiedTime: content.updatedAt,
    author: content.author || 'Cristina Zuil',
  };
}

/**
 * Get structured data for different content types
 */
export function getStructuredData(
  content: any,
  type: 'WebSite' | 'WebPage' | 'Article' | 'Book' | 'CollectionPage',
  locale: string,
  astro: AstroGlobal
) {
  const siteUrl = astro.site?.href || 'http://localhost:4321';
  
  const baseData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': type,
  };
  
  switch (type) {
    case 'WebSite':
      baseData.name = 'Cristina Zuil Traductora';
      baseData.url = siteUrl;
      baseData.description = 'Cristina Zuil - Traductora profesional';
      baseData.inLanguage = i18nConfig.locales;
      break;
      
    case 'WebPage':
      baseData.name = content.seoMetaTitle || content.title;
      baseData.description = content.seoMetaDescription || content.content?.substring(0, 160);
      baseData.url = `${siteUrl}${astro.url.pathname}`;
      if (content.publishedAt) {
        baseData.datePublished = new Date(content.publishedAt).toISOString();
      }
      if (content.updatedAt) {
        baseData.dateModified = new Date(content.updatedAt).toISOString();
      }
      break;
      
    case 'Book':
      baseData.name = content.title;
      baseData.description = content.seoMetaDescription;
      if (content.author) {
        baseData.author = {
          '@type': 'Person',
          name: content.author,
        };
      }
      if (content.publisher) {
        baseData.publisher = {
          '@type': 'Organization',
          name: content.publisher.name || content.publisher,
        };
      }
      if (content.year) {
        baseData.datePublished = `${content.year}`;
      }
      if (content.coverPage?.url) {
        baseData.image = `${i18nConfig.strapi.url}${content.coverPage.url}`;
      }
      break;
      
    case 'Article':
      baseData.headline = content.title;
      baseData.description = content.seoMetaDescription || content.content?.substring(0, 160);
      if (content.publishedAt) {
        baseData.datePublished = new Date(content.publishedAt).toISOString();
      }
      if (content.updatedAt) {
        baseData.dateModified = new Date(content.updatedAt).toISOString();
      }
      if (content.featured_image?.url) {
        baseData.image = `${i18nConfig.strapi.url}${content.featured_image.url}`;
      }
      baseData.author = {
        '@type': 'Person',
        name: 'Cristina Zuil',
      };
      baseData.publisher = {
        '@type': 'Organization',
        name: 'Cristina Zuil Traductora',
        url: siteUrl,
      };
      break;
      
    case 'CollectionPage':
      baseData.name = content.title;
      baseData.description = content.seoMetaDescription || content.content?.substring(0, 160);
      baseData.url = `${siteUrl}${astro.url.pathname}`;
      break;
  }
  
  return baseData;
}
