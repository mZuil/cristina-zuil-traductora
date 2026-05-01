import { uiT } from '../config/strings-ui';
import type { BooksFiltersDetail } from './booksFilters';

// ── Spine color ────────────────────────────────────────────────────────────
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Image helpers ──────────────────────────────────────────────────────────
// Must match BREAKPOINTS in your image-optimizer Strapi plugin
const BREAKPOINTS: Record<string, number> = {
  thumbnail: 156,
  xsmall:    320,
  small:     640,
  medium:    960,
  large:     1280,
  xlarge:    1920,
};

interface CoverData {
  src:           string;
  hash:          string;
  width:         number;
  avifSrcSet:    string;
  webpSrcSet:    string;
  nativeSrcSet:  string;
}

function buildSrcSet(hash: string, format: 'avif' | 'webp', maxWidth: number, strapiUrl: string): string {
  return Object.entries(BREAKPOINTS)
    .filter(([, w]) => w <= maxWidth)
    .map(([name, w]) => `${strapiUrl}/uploads/${name}_${hash}.${format} ${w}w`)
    .join(', ');
}

function getCoverData(book: any, strapiUrl: string): CoverData | null {
  const imgAttr = book?.coverPage;
  if (!imgAttr?.url) return null;

  const { url, hash, width = 1920, formats = {} } = imgAttr;
  const src = strapiUrl ? `${strapiUrl}${url}` : url;

  // Native srcset from Strapi's own breakpoints (JPEG/PNG fallback)
  const nativeEntries = Object.entries(BREAKPOINTS)
    .map(([name, w]) => {
      const fmt = formats[name];
      return fmt ? `${strapiUrl}${fmt.url} ${w}w` : null;
    })
    .filter(Boolean) as string[];
  nativeEntries.push(`${src} ${width}w`);

  return {
    src,
    hash,
    width,
    avifSrcSet:   buildSrcSet(hash, 'avif', width, strapiUrl),
    webpSrcSet:   buildSrcSet(hash, 'webp', width, strapiUrl),
    nativeSrcSet: nativeEntries.join(', '),
  };
}

const DEFAULT_SIZES = '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 960px) 960px, (max-width: 1280px) 1280px, 1920px';

function renderPicture(cover: CoverData | null, alt: string, sizes = DEFAULT_SIZES): string {
  if (!cover) return '';

  return `
    <picture class="a-image__picture">
      ${cover.avifSrcSet   ? `<source type="image/avif" srcset="${cover.avifSrcSet}" sizes="${sizes}">` : ''}
      ${cover.webpSrcSet   ? `<source type="image/webp" srcset="${cover.webpSrcSet}" sizes="${sizes}">` : ''}
      ${cover.nativeSrcSet ? `<source srcset="${cover.nativeSrcSet}" sizes="${sizes}">` : ''}
      <img class="a-image" src="${cover.src}" alt="${alt}" width="${cover.width}" loading="lazy">
    </picture>`;
}

// ── Init ───────────────────────────────────────────────────────────────────
export function initBooksList(root: HTMLElement): void {
  const isFirstInit = root.dataset.booksListInit !== '1';
  if (isFirstInit) root.dataset.booksListInit = '1';

  const locale       = root.dataset.locale    || 'es';
  const bookCategory = root.dataset.category  || '';
  const pageSize     = Number(root.dataset.pageSize || '12') || 12;
  const strapiUrl    = root.dataset.strapiUrl || '';

  const grid    = root.querySelector<HTMLElement>('.c-books-list__grid')!;
  const results = root.querySelector<HTMLElement>('[data-results]');
  const pages   = root.querySelector<HTMLElement>('[data-pages]')!;

  const getPage = (): number =>
    Math.max(1, Number(new URLSearchParams(location.search).get('page') || '1') || 1);

  function pushParams(overrides: Record<string, string | null>): void {
    const params = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(overrides)) {
      value ? params.set(key, value) : params.delete(key);
    }
    history.pushState({}, '', `?${params}`);
  }

  // ── Render: grid ─────────────────────────────────────────────────────────
  function renderGrid(items: any[]): void {
    if (!items.length) {
      grid.innerHTML = `<div class="c-books-list__empty">${uiT(locale, 'noResults')}</div>`;
      return;
    }

    grid.innerHTML = items.map((book, i) => {
      const attr      = book?.attributes ?? book ?? {};
      const cover     = getCoverData(book, strapiUrl);
      const title     = esc(attr.title     ?? '');
      const author    = esc(attr.author    ?? '');
      const fromTranslation = esc(attr.fromTranslation ?? '');
      const toTranslation = esc(attr.toTranslation ?? '');
      const year      = esc(String(attr.year ?? ''));
      const publisher = esc(attr.publisher?.name ?? '');
      const genresArr: string[] = (attr.genres ?? [])
        .map((g: any) => esc(g?.attributes?.name ?? g?.name ?? ''))
        .filter(Boolean);

      const genresHtml = genresArr
        .map((name: string) => `<div class="c-books-list__genre">${name}</div>`)
        .join('');

      const linkUrl = typeof attr.link?.url === 'string' ? attr.link.url : '';

      const hasTranslation = Boolean(fromTranslation || toTranslation);
      const hasPublisher = Boolean(publisher);
      const hasGenres = genresArr.length > 0;
      const hasYear = Boolean(year);
      const hasTitleOrAuthor = Boolean(title || author);

      const translationSection = hasTranslation
        ? `
              <div class="c-books-list__book-section">
                <p class="c-books-list__heading-field">
                  ${uiT(locale, 'translation')}
                </p>
                <p class="c-books-list__value-field">
                  ${fromTranslation}${fromTranslation && toTranslation ? ' → ' : ''}${toTranslation}
                </p>
              </div>`
        : '';

      const publisherSection = hasPublisher
        ? `
              <div class="c-books-list__book-section">
                <p class="c-books-list__heading-field">
                  ${uiT(locale, 'publisher')}
                </p>
                <p class="c-books-list__value-field">
                  ${publisher}
                </p>
              </div>`
        : '';

      const genresSection = hasGenres
        ? `
              <div class="c-books-list__book-section">
                <p class="c-books-list__heading-field">
                  ${(genresArr.length > 1 ? uiT(locale, 'genres') : uiT(locale, 'genre'))}
                </p>
                <div class="c-books-list__value-field --genres">
                  ${genresHtml}
                </div>
              </div>`
        : '';

      const yearSection = hasYear
        ? `
              <div class="c-books-list__book-section">
                <p class="c-books-list__heading-field">
                  ${uiT(locale, 'year')}
                </p>
                <p class="c-books-list__value-field">
                  ${year}
                </p>
              </div>`
        : '';

      const dividerSection = hasTitleOrAuthor
        ? `

              <hr class="c-books-list__divider">`
        : '';

      const titleAuthorSection = hasTitleOrAuthor
        ? `
              <div class="c-books-list__book-section">
                ${title ? `<p class="c-books-list__book-title">${title}</p>` : ''}
                ${author ? `<p class="c-books-list__book-author">${author}</p>` : ''}
              </div>`
        : '';

      const buttonSection = linkUrl
        ? `

              <a href="${esc(linkUrl)}" target="_blank" rel="noopener noreferrer" class="c-books-list__button">${uiT(locale, 'visitShop')}</a>`
        : '';

      return `
        <div class="c-books-list__book-container" data-index="${i}">
          <div class="c-books-list__book-scene">
            <div class="c-books-list__book-cover">
              ${renderPicture(cover, title)}
            </div>
            <div class="c-books-list__book-page">
              ${translationSection}
              ${publisherSection}
              ${genresSection}
              ${yearSection}
              ${dividerSection}
              ${titleAuthorSection}
              ${buttonSection}
            </div>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll<HTMLElement>('.book-card, .c-books-list__book-card').forEach((card, i) => {
      new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting) return;
        setTimeout(() => card.classList.add('visible'), i * 80);
        obs.disconnect();
      }, { threshold: 0.05 }).observe(card);
    });
  }

  // ── Render: pagination ───────────────────────────────────────────────────
  function renderPagination(total: number): void {
    if (results) results.textContent = String(total);

    const pageCount   = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = getPage();

    pages.innerHTML = Array.from({ length: pageCount }, (_, i) => {
      const p         = i + 1;
      const isCurrent = p === currentPage;
      return `<button type="button" class="c-books-list__pagination-btn${isCurrent ? ' is-current' : ''} v-font-subheading-1" data-page="${p}" ${isCurrent ? 'disabled aria-current="page"' : ''}>${p}</button>`;
    }).join('');

    pages.onclick = (e) => {
      const el   = (e.target as HTMLElement).closest<HTMLElement>('[data-page]');
      const page = el?.getAttribute('data-page') || '';
      if (!page) return;
      if (el instanceof HTMLButtonElement && el.disabled) return;
      pushParams({ page });
      void fetchAndRender();
    };
  }

  // ── Fetch ────────────────────────────────────────────────────────────────
  async function fetchAndRender(): Promise<void> {
    const params = new URLSearchParams(location.search);
    params.set('locale', locale);
    params.set('bookCategory', bookCategory);
    params.set('pageSize', String(pageSize));
    params.set('page', String(getPage()));

    try {
      const res  = await fetch(`/api/books?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      renderGrid(Array.isArray(json?.data) ? json.data : []);
      renderPagination(Number(json?.meta?.pagination?.total ?? 0));
    } catch (err) {
      console.error('[CBooksList] fetch failed:', err);
      grid.innerHTML = `<div class="c-books-list__empty">${uiT(locale, 'noResults')}</div>`;
    }
  }

  // ── Wiring ────────────────────────────────────────────────────────────────
  if (isFirstInit) {
    document.addEventListener('books:filters', (e) => {
      const { search, genreId, publisherId } = (e as CustomEvent<BooksFiltersDetail>).detail;
      pushParams({
        search:      search      || null,
        genre:       genreId     || null,
        publisher:   publisherId || null,
        genreId:     null,
        publisherId: null,
        page:        '1',
      });
      void fetchAndRender();
    });

    window.addEventListener('popstate', () => void fetchAndRender());
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  const seed    = root.querySelector<HTMLScriptElement>('.c-books-list__initial');
  const { total } = JSON.parse(seed?.textContent || '{"total":0}') as { total: number };
  renderPagination(total);

  void fetchAndRender();
}