import { i18nConfig } from '../../../config/i18n';
import type { Link } from '../../../helpers/interfaces/Link.astro';

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
  copyrightTextBlock: any[];
};

export async function fetchFooter(locale: string): Promise<FooterResponse> {
  const url = new URL(`${i18nConfig.strapi.url}/api/footer`);
  url.searchParams.set('populate', '*');
  url.searchParams.set('locale', locale);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch footer: ${res.status} ${res.statusText}`);
      return { copyrightTextBlock: [] };
    }

    const json = await res.json();
    const footer = json?.data;

    return {
      copyrightTextBlock: footer?.copyrightTextBlock ?? [],
    };
  } catch (err) {
    console.error('Failed to fetch footer:', err);
    return { copyrightTextBlock: [] };
  }
}

export type ContactResponse = {
  titleText: string;
  emailAddress: string;
  linkedinLink: Link;
  instagramLink: Link;
};

const toStr = (v: unknown): string => (typeof v === 'string' ? v : '');

const normalizeLink = (v: unknown): Link => {
  if (v && typeof v === 'object') {
    const o = v as any;
    return {
      url: toStr(o.url),
      label: toStr(o.label),
    } as Link;
  }

  return { url: '', label: '' } as Link;
};

export async function fetchContact(locale: string): Promise<ContactResponse> {
  const url = new URL(`${i18nConfig.strapi.url}/api/contact`);
  url.searchParams.set('populate', '*');
  url.searchParams.set('locale', locale);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch contact info: ${res.status} ${res.statusText}`);
      return { titleText: '', emailAddress: '', linkedinLink: { url: '', label: '' }, instagramLink: { url: '', label: '' } };
    }

    const json = await res.json();
    const contactInfo = json?.data;

    return {
      titleText: contactInfo?.titleText ?? '',
      emailAddress: contactInfo?.emailAddress ?? '',
      linkedinLink: normalizeLink(contactInfo?.linkedinLink),
      instagramLink: normalizeLink(contactInfo?.instagramLink),
    };
  } catch (err) {
    console.error('Failed to fetch contact info:', err);
    return { titleText: '', emailAddress: '', linkedinLink: { url: '', label: '' }, instagramLink: { url: '', label: '' } };
  }
}