import { i18nConfig } from '../../../config/i18n';

export function getLocaleFromUrl(url: URL): string {
  return url.searchParams.get('locale') || i18nConfig.defaultLocale;
}

export async function proxyJson(upstreamUrl: URL): Promise<Response> {
  const res = await fetch(upstreamUrl);
  const json = await res.json();

  return new Response(JSON.stringify(json), {
    status: res.status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
