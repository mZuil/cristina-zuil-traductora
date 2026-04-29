import type { APIRoute } from 'astro';
import { getLocaleFromUrl, proxyJson } from '../../utils/api/strapi/strapiProxy';
import { buildPublishersUrl } from '../../utils/api/strapi/urls';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const locale = getLocaleFromUrl(url);
  return proxyJson(buildPublishersUrl(locale));
};
