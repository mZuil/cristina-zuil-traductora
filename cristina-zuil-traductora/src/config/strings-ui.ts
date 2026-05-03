export type UiLocale = 'es' | 'en';

const UI_STRINGS: Record<UiLocale, Record<string, string>> = {
  es: {
    //For searching
    searchPlaceholder: 'Busca por título o autor',
    genreLabel: 'Género',
    publisherLabel: 'Editorial',
    allOption: 'Todos',
    noResults: 'No hay resultados',
    pagination: 'Paginación',

    //For books list
    translation: 'Traducción',
    publisher: 'Editorial',
    genre: 'Género',
    genres: 'Géneros',
    year: 'Año',
    visitShop: 'Visitar tienda',

    //For articles
    articleItem: 'Artículo',
    readMore: 'Leer más',
  },
  en: {
    //For searching
    searchPlaceholder: 'Search by title or author',
    genreLabel: 'Genre',
    publisherLabel: 'Publisher',
    allOption: 'All',
    noResults: 'No results',
    pagination: 'Pagination',
    
    //For books list
    translation: 'Translation',
    publisher: 'Publisher',
    genre: 'Genre',
    genres: 'Genres',
    year: 'Year',
    visitShop: 'Visit shop',
    
    //For articles
    articleItem: 'Article',
    readMore: 'Read more',
  },
};

export function uiT(locale: string | undefined, key: string): string {
  const safeLocale: UiLocale = locale === 'en' ? 'en' : 'es';
  return UI_STRINGS[safeLocale][key] ?? UI_STRINGS.es[key] ?? key;
}
