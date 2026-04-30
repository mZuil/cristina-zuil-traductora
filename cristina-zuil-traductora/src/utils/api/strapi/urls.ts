import { i18nConfig } from '../../../config/i18n';

function buildNameOnlyCollectionUrl(params: { collection: string; locale: string }): URL {
  const upstreamUrl = new URL(`${i18nConfig.strapi.url}/api/${params.collection}`);
  upstreamUrl.searchParams.set('locale', params.locale);
  upstreamUrl.searchParams.set('pagination[pageSize]', '1000');
  upstreamUrl.searchParams.set('fields[0]', 'name');
  upstreamUrl.searchParams.set('fields[1]', 'slug');
  upstreamUrl.searchParams.set('sort[0]', 'name:asc');
  return upstreamUrl;
}

export function buildGenresUrl(locale: string): URL {
  return buildNameOnlyCollectionUrl({ collection: 'genres', locale });
}

export function buildPublishersUrl(locale: string): URL {
  return buildNameOnlyCollectionUrl({ collection: 'publishers', locale });
}

export function buildBooksUrl(params: {
  locale: string;
  bookCategory?: string;
  page: number;
  pageSize: number;
  search?: string;
  genreId?: string;
  publisherId?: string;
  genreSlug?: string;
  publisherSlug?: string;
}): URL {
  const upstreamUrl = new URL(`${i18nConfig.strapi.url}/api/books`);
  upstreamUrl.searchParams.set('locale', params.locale);
  upstreamUrl.searchParams.set('populate', '*');
  upstreamUrl.searchParams.set('pagination[page]', String(params.page));
  upstreamUrl.searchParams.set('pagination[pageSize]', String(params.pageSize));
  upstreamUrl.searchParams.set('sort[0]', 'year:desc');

  if (params.bookCategory) {
    upstreamUrl.searchParams.set('filters[bookCategory][$eq]', params.bookCategory);
  }

  if (params.publisherSlug) {
    upstreamUrl.searchParams.set('filters[publisher][slug][$eq]', params.publisherSlug);
  } else if (params.publisherId) {
    upstreamUrl.searchParams.set('filters[publisher][id][$eq]', params.publisherId);
  }

  if (params.genreSlug) {
    upstreamUrl.searchParams.set('filters[genres][slug][$eq]', params.genreSlug);
  } else if (params.genreId) {
    upstreamUrl.searchParams.set('filters[genres][id][$eq]', params.genreId);
  }

  if (params.search) {
    upstreamUrl.searchParams.set('filters[$or][0][title][$containsi]', params.search);
    upstreamUrl.searchParams.set('filters[$or][1][author][$containsi]', params.search);
  }

  return upstreamUrl;
}
