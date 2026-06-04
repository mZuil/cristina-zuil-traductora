export type UiLocale = 'es' | 'en';

const UI_STRINGS: Record<UiLocale, Record<string, string>> = {
  es: {

    //For model tags
    aboutMeTag: 'Sobre mí',
    translationsTag: 'Traducciones',
    writingsTag: 'Escritos',
    articlesTag: 'Noticias',
    contactTag: 'Contacto',
    chickTag: 'Tradupollito',

    //For searching
    searchPlaceholder: 'Busca por título o autor',
    genreLabel: 'Género',
    publisherLabel: 'Editorial',
    allOption: 'Todos',
    noResults: 'No hay resultados',
    pagination: 'Paginación',
    prevPage: 'Página anterior',
    nextPage: 'Página siguiente',
    pageOf: 'Página {current} de {total}',

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

    //For contact button in Sobre mi page
    contactButton: 'Contáctame',

    //For contact modal
    contactEmail: 'Correo',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    emailCopied: '¡Correo copiado al portapapeles!',

    //URLs
    aboutMeUrl: '/sobre-mi',
    translationsUrl: '/traducciones',
    writingsUrl: '/escritos',
    articlesUrl: '/noticias',
  },
  en: {
    //For model tags
    aboutMeTag: 'About me',
    translationsTag: 'Translations',
    writingsTag: 'Writings',
    articlesTag: 'Articles',
    contactTag: 'Contact',
    chickTag: 'Traduchicken',

    //For searching
    searchPlaceholder: 'Search by title or author',
    genreLabel: 'Genre',
    publisherLabel: 'Publisher',
    allOption: 'All',
    noResults: 'No results',
    pagination: 'Pagination',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    pageOf: 'Page {current} of {total}',
    
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
    
    //For contact button in Sobre mi page
    contactButton: 'Contact me',

    //For contact modal
    contactEmail: 'Email',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    emailCopied: 'Email copied to clipboard!',
    
    //URLs
    aboutMeUrl: '/about-me',
    translationsUrl: '/translations',
    writingsUrl: '/writings',
    articlesUrl: '/articles',
  },
};

export function uiT(locale: string | undefined, key: string): string {
  const safeLocale: UiLocale = locale === 'en' ? 'en' : 'es';
  return UI_STRINGS[safeLocale][key] ?? UI_STRINGS.es[key] ?? key;
}
