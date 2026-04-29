import { i18nConfig } from '../../../config/i18n';

export async function getPagesByLocale(locale: string = i18nConfig.defaultLocale): Promise<any[]> {
  const response = await fetch(`${i18nConfig.strapi.url}/api/pages?locale=${locale}&populate=*`);
  const { data } = await response.json();
  return data;
}
