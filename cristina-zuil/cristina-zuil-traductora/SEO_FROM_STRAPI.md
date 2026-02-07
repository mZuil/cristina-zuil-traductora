# SEO Implementation - Managed in Strapi

This SEO implementation reads all SEO data from Strapi, allowing content editors to manage titles, descriptions, and images directly in the CMS without code changes.

## ✅ What Was Added

### 1. **Strapi Schema Updates**
Added SEO fields to all content types:
- `seoMetaTitle` (String) - Custom page title
- `seoMetaDescription` (Text) - Meta description for search engines
- `seoMetaImage` (Media - Image) - Open Graph/Twitter Card image
- `seoKeywords` (String) - Keywords (optional)

**Content Types Updated:**
- ✅ Pages (`api::page.page`)
- ✅ Books (`api::book.book`)
- ✅ Articles (`api::article.article`)

### 2. **Frontend Components**
- `SEOHead.astro` - Renders all meta tags from Strapi data
- `utils/seo.ts` - Helper functions to extract SEO data from Strapi content
- Updated `Layout.astro` - Automatically reads SEO from Strapi

## 📝 How It Works

### In Your Pages

Simply pass the Strapi content to the Layout:

```astro
---
import Layout from '../layouts/Layout.astro';
const { page } = Astro.props;
---

<Layout 
  content={page}
  locale="es"
  contentType="WebPage"
>
  <!-- Your content -->
</Layout>
```

### For Different Content Types

**Homepage:**
```astro
<Layout 
  content={homePage}
  locale={i18nConfig.defaultLocale}
  contentType="WebSite"
>
```

**Regular Page:**
```astro
<Layout 
  content={page}
  locale={locale}
  contentType="WebPage"
>
```

**Book:**
```astro
<Layout 
  content={book}
  locale={locale}
  contentType="Book"
>
```

**Article:**
```astro
<Layout 
  content={article}
  locale={locale}
  contentType="Article"
>
```

**Archive Page:**
```astro
<Layout 
  content={archivePage}
  locale={locale}
  contentType="CollectionPage"
>
```

## 🎯 Fallback Behavior

The system automatically falls back if SEO fields aren't filled in Strapi:

1. **Title**: `seoMetaTitle` → `title` → Default
2. **Description**: `seoMetaDescription` → First 160 chars of content → Default
3. **Image**: `seoMetaImage` → `coverPage`/`cover`/`featured_image` → Default OG image

## 🔧 Next Steps in Strapi

1. **Restart Strapi** to apply schema changes
2. **Go to Content-Type Builder** and verify the new SEO fields are visible
3. **Fill in SEO fields** for your content:
   - Navigate to any Page, Book, or Article
   - You'll see new fields: `SEO Meta Title`, `SEO Meta Description`, `SEO Meta Image`, `SEO Keywords`
   - Fill them in for better SEO control

## 📊 SEO Features Included

- ✅ Meta title and description
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ hreflang tags for i18n
- ✅ Structured Data (JSON-LD) for rich snippets
- ✅ Keywords meta tag
- ✅ Automatic image optimization

## 🚀 Best Practices

1. **Always fill `seoMetaTitle`** - This is what appears in search results
2. **Keep descriptions 150-160 characters** - Optimal length for search snippets
3. **Use high-quality images** (1200x630px) for `seoMetaImage` - Better social sharing
4. **Use keywords sparingly** - Focus on 3-5 relevant keywords
5. **Test your pages** using:
   - Google Rich Results Test
   - Facebook Sharing Debugger
   - Twitter Card Validator

## 📝 Example: Updating a Page in Strapi

1. Go to **Content Manager** → **Pages**
2. Edit any page
3. Scroll to the **SEO** section (new fields)
4. Fill in:
   - **SEO Meta Title**: "Cristina Zuil - Traductora Profesional | Página Principal"
   - **SEO Meta Description**: "Traductora profesional especializada en..."
   - **SEO Meta Image**: Upload a 1200x630px image
   - **SEO Keywords**: "traducción, traductora, español, inglés"
5. Save and publish
6. The frontend will automatically use these values!

## 🔍 Testing

After updating content in Strapi:
1. Rebuild your Astro site: `npm run build`
2. Check the page source - you should see the meta tags
3. Test with social sharing tools
4. Verify structured data with Google's Rich Results Test
