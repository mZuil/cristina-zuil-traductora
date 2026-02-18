import { i18nConfig, getLocalizedUrl } from '../config/i18n.js';
import type { AstroGlobal } from 'astro';

/**
 * Safely extract text content from Strapi content field
 * Handles strings, arrays (dynamic zones), and rich text
 */
function extractTextContent(content: any, maxLength: number = 160): string {
  if (!content) return '';
  
  // If it's a string, return substring
  if (typeof content === 'string') {
    return content.substring(0, maxLength);
  }
  
  // If it's an array (dynamic zone), extract text from blocks
  if (Array.isArray(content)) {
    const textParts: string[] = [];
    for (const block of content) {
      if (block.body && typeof block.body === 'string') {
        textParts.push(block.body);
      } else if (block.text && typeof block.text === 'string') {
        textParts.push(block.text);
      } else if (typeof block === 'string') {
        textParts.push(block);
      }
    }
    const combined = textParts.join(' ');
    return combined.substring(0, maxLength);
  }
  
  // If it's an object (rich text), try to extract text
  if (typeof content === 'object') {
    // Try common rich text fields
    if (content.text && typeof content.text === 'string') {
      return content.text.substring(0, maxLength);
    }
    if (content.body && typeof content.body === 'string') {
      return content.body.substring(0, maxLength);
    }
    // If it's a rich text object, try to stringify and strip HTML
    const stringified = JSON.stringify(content);
    // Simple HTML tag removal
    const textOnly = stringified.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '');
    return textOnly.substring(0, maxLength);
  }
  
  return '';
}

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
  
  // Get SEO component (new structure) or individual fields (backward compatibility)
  const seo = content.seo || {};
  
  // Get SEO fields from Strapi (with fallbacks)
  // Check SEO component first, then fallback to direct fields, then defaults
  const seoTitle = seo.seoMetaTitle || content.seoMetaTitle || content.title || options?.defaultTitle || 'Cristina Zuil Traductora';
  const seoDescription = seo.seoMetaDescription || content.seoMetaDescription || 
    extractTextContent(content.content, 160) ||
    options?.defaultDescription || 
    'Cristina Zuil - Traductora profesional';
  
  // Get image from SEO field, or fallback to cover/featured image
  let seoImage = null;
  if (seo.seoMetaImage?.url) {
    seoImage = seo.seoMetaImage.url;
  } else if (content.seoMetaImage?.url) {
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
    keywords: seo.seoKeywords || content.seoKeywords,
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
  
  // Get SEO component (new structure) or individual fields (backward compatibility)
  const seo = content.seo || {};
  
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
      baseData.name = seo.seoMetaTitle || content.seoMetaTitle || content.title;
      baseData.description = seo.seoMetaDescription || content.seoMetaDescription || extractTextContent(content.content, 160);
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
      baseData.description = seo.seoMetaDescription || content.seoMetaDescription;
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
      baseData.description = seo.seoMetaDescription || content.seoMetaDescription || extractTextContent(content.content, 160);
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
      baseData.description = seo.seoMetaDescription || content.seoMetaDescription || extractTextContent(content.content, 160);
      baseData.url = `${siteUrl}${astro.url.pathname}`;
      break;
  }
  
  return baseData;
}
