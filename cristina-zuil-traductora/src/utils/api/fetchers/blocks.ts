import { i18nConfig } from '../../../config/i18n';

export type HeaderMenuResponse = {
  links: any[];
  menuText: string;
  contactText: string;
};

export async function fetchHeaderMenu(locale: string): Promise<HeaderMenuResponse> {
  const url = new URL(`${i18nConfig.strapi.url}/api/header-menu`);
  url.searchParams.set('populate', '*');
  url.searchParams.set('locale', locale);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch header menu: ${res.status} ${res.statusText}`);
      return { links: [], menuText: '', contactText: '' };
    }

    const json = await res.json();
    const headerMenu = json?.data;

    return {
      links: headerMenu?.links ?? [],
      menuText: headerMenu?.menuText ?? '',
      contactText: headerMenu?.contactText ?? '',
    };
  } catch (err) {
    console.error('Failed to fetch header menu:', err);
    return { links: [], menuText: '', contactText: '' };
  }
}

export type FooterResponse = {
  copyrightText: string;
};

export async function fetchFooter(locale: string): Promise<FooterResponse> {
  const url = new URL(`${i18nConfig.strapi.url}/api/footer`);
  url.searchParams.set('populate', '*');
  url.searchParams.set('locale', locale);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch footer: ${res.status} ${res.statusText}`);
      return { copyrightText: '' };
    }

    const json = await res.json();
    const footer = json?.data;

    return {
      copyrightText: footer?.copyrightText ?? '',
    };
  } catch (err) {
    console.error('Failed to fetch footer:', err);
    return { copyrightText: '' };
  }
}
