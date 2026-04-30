import type { APIRoute } from 'astro';
import { getLocaleFromUrl, proxyJson } from '../../utils/api/strapi/strapiProxy';
import { buildBooksUrl } from '../../utils/api/strapi/urls';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const locale = getLocaleFromUrl(url);
  const bookCategory = url.searchParams.get('bookCategory') || '';

  const page = Number(url.searchParams.get('page') || '1') || 1;
  const pageSize = Number(url.searchParams.get('pageSize') || '12') || 12;

  const search = (url.searchParams.get('search') || '').trim();
  const genreId = (url.searchParams.get('genreId') || '').trim();
  const publisherId = (url.searchParams.get('publisherId') || '').trim();

  const genreSlug = (url.searchParams.get('genre') || url.searchParams.get('genreSlug') || '').trim();
  const publisherSlug = (url.searchParams.get('publisher') || url.searchParams.get('publisherSlug') || '').trim();

  console.log('Books API - URL params:', {
    locale,
    bookCategory,
    page,
    pageSize,
    search,
    genreId,
    publisherId,
    genreSlug,
    publisherSlug,
  });

  return proxyJson(
    buildBooksUrl({
      locale,
      bookCategory: bookCategory || undefined,
      page,
      pageSize,
      search: search || undefined,
      genreId: genreId || undefined,
      publisherId: publisherId || undefined,
      genreSlug: genreSlug || undefined,
      publisherSlug: publisherSlug || undefined,
    }),
  );
};
