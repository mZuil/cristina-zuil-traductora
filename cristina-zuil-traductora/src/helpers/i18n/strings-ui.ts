export type UiLocale = 'es' | 'en';

const UI_STRINGS: Record<UiLocale, Record<string, string>> = {
  es: {
    searchLabel: 'Buscar',
    searchPlaceholder: 'Buscar por título o autor',
    genreLabel: 'Género',
    publisherLabel: 'Editorial',
    allOption: 'Todos',
    resultsLabel: 'Resultados',
    prev: 'Anterior',
    next: 'Siguiente',
    loading: 'Cargando',
    noResults: 'No hay resultados',
  },
  en: {
    searchLabel: 'Search',
    searchPlaceholder: 'Search by title or author',
    genreLabel: 'Genre',
    publisherLabel: 'Publisher',
    allOption: 'All',
    resultsLabel: 'Results',
    prev: 'Previous',
    next: 'Next',
    loading: 'Loading',
    noResults: 'No results',
  },
};

export function uiT(locale: string | undefined, key: string): string {
  const safeLocale: UiLocale = locale === 'en' ? 'en' : 'es';
  return UI_STRINGS[safeLocale][key] ?? UI_STRINGS.es[key] ?? key;
}
