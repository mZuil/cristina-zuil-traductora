import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsCFeaturedData extends Struct.ComponentSchema {
  collectionName: 'components_components_c_featured_data';
  info: {
    displayName: 'CFeaturedData';
    icon: 'code';
  };
  attributes: {
    awardsNumber: Schema.Attribute.Integer;
    awardsText: Schema.Attribute.String;
    booksText: Schema.Attribute.String;
    dateNumber: Schema.Attribute.Date;
    languagesNumber: Schema.Attribute.Integer;
    languagesText: Schema.Attribute.String;
    yearText: Schema.Attribute.String;
  };
}

export interface ComponentsCHeading extends Struct.ComponentSchema {
  collectionName: 'components_components_c_headings';
  info: {
    displayName: 'CHeading';
    icon: 'code';
  };
  attributes: {
    subheading: Schema.Attribute.String;
    titleInBlue: Schema.Attribute.String;
    titleInDark: Schema.Attribute.String;
  };
}

export interface ComponentsCTitle extends Struct.ComponentSchema {
  collectionName: 'components_components_c_titles';
  info: {
    displayName: 'CTitle';
    icon: 'code';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LinksLink extends Struct.ComponentSchema {
  collectionName: 'components_links_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    is_external: Schema.Attribute.Boolean;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SeoSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_seos';
  info: {
    description: 'Search Engine Optimization fields for better visibility';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    seoKeywords: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seoMetaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seoMetaImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seoMetaTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'components.c-featured-data': ComponentsCFeaturedData;
      'components.c-heading': ComponentsCHeading;
      'components.c-title': ComponentsCTitle;
      'links.link': LinksLink;
      'seo.seo': SeoSeo;
    }
  }
}
