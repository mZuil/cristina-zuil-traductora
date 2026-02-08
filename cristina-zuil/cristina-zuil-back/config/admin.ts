// Function to generate preview pathname based on content type and document
const getPreviewPathname = async (uid: string, { locale, document, strapi }: { locale?: string; document: any; strapi: any }): Promise<string | null> => {
  const defaultLocale = 'es';
  const { slug } = document || {};

  // Handle pages
  if (uid === 'api::page.page') {
    // Homepage (empty slug)
    if (!slug || slug === '') {
      if (locale === defaultLocale || !locale) {
        return '/';
      }
      return `/${locale}`;
    }
    // Regular pages
    if (locale === defaultLocale || !locale) {
      return `/${slug}`;
    }
    return `/${locale}/${slug}`;
  }

  // Handle books
  if (uid === 'api::book.book') {
    if (!slug) {
      return null;
    }
    // Find the archive page with template 'archive-books' for this locale
    try {
      const pages = await strapi.documents('api::page.page').findMany({
        filters: {
          template: 'archive-books',
          locale: locale || defaultLocale,
        },
        limit: 1,
      });
      
      const archivePage = pages?.[0];
      const archiveSlug = archivePage?.slug || 'mis-traducciones'; // Fallback to default
      
      if (locale === defaultLocale || !locale) {
        return `/${archiveSlug}/${slug}`;
      }
      return `/${locale}/${archiveSlug}/${slug}`;
    } catch (error) {
      // Fallback if we can't find the archive page
      const archiveSlug = 'mis-traducciones';
      if (locale === defaultLocale || !locale) {
        return `/${archiveSlug}/${slug}`;
      }
      return `/${locale}/${archiveSlug}/${slug}`;
    }
  }

  // Handle articles
  if (uid === 'api::article.article') {
    if (!slug) {
      return null;
    }
    // Find the archive page with template 'archive-articles' for this locale
    try {
      const pages = await strapi.documents('api::page.page').findMany({
        filters: {
          template: 'archive-articles',
          locale: locale || defaultLocale,
        },
        limit: 1,
      });
      
      const archivePage = pages?.[0];
      const archiveSlug = archivePage?.slug || 'articulos'; // Fallback to default
      
      if (locale === defaultLocale || !locale) {
        return `/${archiveSlug}/${slug}`;
      }
      return `/${locale}/${archiveSlug}/${slug}`;
    } catch (error) {
      // Fallback if we can't find the archive page
      const archiveSlug = 'articulos';
      if (locale === defaultLocale || !locale) {
        return `/${archiveSlug}/${slug}`;
      }
      return `/${locale}/${archiveSlug}/${slug}`;
    }
  }

  // Other content types don't have preview
  return null;
};

export default ({ env }) => {
  const clientUrl = env('CLIENT_URL', 'http://localhost:4321');
  const previewSecret = env('PREVIEW_SECRET');

  return {
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
    preview: {
      enabled: true,
      config: {
        allowedOrigins: clientUrl,
        async handler(uid: string, { documentId, locale, status }: { documentId: number; locale?: string; status?: string }) {
          // @ts-ignore - strapi is available in the handler context
          const strapiInstance = strapi;
          
          // Convert documentId to string as required by Strapi
          const documentIdString = String(documentId);
          
          // Fetch the document - using type assertion for uid
          const document = await (strapiInstance.documents(uid as any) as any).findOne({ 
            documentId: documentIdString 
          });
          
          if (!document) {
            return null;
          }

          // Generate the pathname
          const pathname = await getPreviewPathname(uid, { locale, document, strapi: strapiInstance });
          
          if (!pathname) {
            return null;
          }

          // Normalize clientUrl - remove trailing slash if present
          const normalizedClientUrl = clientUrl.replace(/\/+$/, '');
          
          // Ensure pathname starts with / (it should, but just to be safe)
          const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;

          // Build the preview URL
          // For draft content, you might want to add a query parameter
          const previewUrl = status === 'draft' 
            ? `${normalizedClientUrl}${normalizedPathname}?preview=true&draft=true`
            : `${normalizedClientUrl}${normalizedPathname}`;

          return previewUrl;
        },
      },
    },
  };
};
