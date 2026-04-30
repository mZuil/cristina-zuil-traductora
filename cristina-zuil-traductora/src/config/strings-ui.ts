export type UiLocale = 'es' | 'en';

const UI_STRINGS: Record<UiLocale, Record<string, string>> = {
  es: {
    searchPlaceholder: 'Busca por título o autor',
    genreLabel: 'Género',
    publisherLabel: 'Editorial',
    allOption: 'Todos',
    noResults: 'No hay resultados',
  },
  en: {
    searchPlaceholder: 'Search by title or author',
    genreLabel: 'Genre',
    publisherLabel: 'Publisher',
    allOption: 'All',
    noResults: 'No results',
  },
};

export function uiT(locale: string | undefined, key: string): string {
  const safeLocale: UiLocale = locale === 'en' ? 'en' : 'es';
  return UI_STRINGS[safeLocale][key] ?? UI_STRINGS.es[key] ?? key;
}
