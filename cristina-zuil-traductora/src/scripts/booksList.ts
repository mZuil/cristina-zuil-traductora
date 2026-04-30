import type { BooksFiltersDetail } from './booksFilters';

// ── Spine color ────────────────────────────────────────────────────────────
// Deterministic: same genre/publisher always gets the same color.
// No lookup table needed — just hash the string into the palette.
const SPINE_PALETTE = [
  '#6B3A2A', '#1A3D30', '#5C3D2A', '#5E1E1E',
  '#1B2535', '#7A2E10', '#3B2E5E', '#1A3D27',
];

function hashColor(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return SPINE_PALETTE[h % SPINE_PALETTE.length];
}

// ── Safety: escape user-controlled strings going into innerHTML ───────────
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Init ───────────────────────────────────────────────────────────────────
export function initBooksList(root: HTMLElement): void {
  const isFirstInit = root.dataset.booksListInit !== '1';
  if (isFirstInit) root.dataset.booksListInit = '1';

  const locale       = root.dataset.locale       || 'es';
  const bookCategory = root.dataset.category     || '';
  const pageSize     = Number(root.dataset.pageSize || '12') || 12;
  const strapiUrl    = root.dataset.strapiUrl    || '';

  const grid    = root.querySelector<HTMLElement>('.c-books-list__grid')!;
  const results = root.querySelector<HTMLElement>('[data-results]');
  const pages   = root.querySelector<HTMLElement>('[data-pages]')!;

  const labels = {
    genre:     locale === 'en' ? 'Genre'     : 'Género',
    publisher: locale === 'en' ? 'Publisher' : 'Editorial',
    year:      locale === 'en' ? 'Year'      : 'Año',
    empty:     locale === 'en' ? 'No results found.' : 'No hay resultados.',
    error:     locale === 'en' ? 'Error loading books.' : 'Error al cargar los libros.',
  };

  // ── State lives in the URL ───────────────────────────────────────────────
  // Shareable links, working back button, zero extra state to manage.
  const getPage = (): number =>
    Math.max(1, Number(new URLSearchParams(location.search).get('page') || '1') || 1);

  function pushParams(overrides: Record<string, string | null>): void {
    const params = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(overrides)) {
      value ? params.set(key, value) : params.delete(key);
    }
    history.pushState({}, '', `?${params}`);
  }

  // ── Cover URL ────────────────────────────────────────────────────────────
  function getCoverUrl(book: any): string {
    const url = book?.attributes?.coverPage?.data?.attributes?.url;
    if (!url) return '';
    return strapiUrl ? `${strapiUrl}${url}` : url;
  }

  // ── Render: grid ─────────────────────────────────────────────────────────
  function renderGrid(items: any[]): void {
    if (!items.length) {
      grid.innerHTML = `<div class="c-books-list__empty">${labels.empty}</div>`;
      return;
    }

    grid.innerHTML = items.map((book, i) => {
      const attr = book?.attributes ?? book ?? {};
      const coverUrl  = getCoverUrl(book);
      const title     = esc(attr.title     ?? '');
      const author    = esc(attr.author    ?? '');
      const year      = esc(String(attr.year ?? ''));
      const publisher = esc(attr.publisher?.data?.attributes?.name ?? '');
      const genre     = esc(attr.genres?.data?.[0]?.attributes?.name ?? '');
      const spine     = hashColor(genre || publisher || title);

      return `
        <div class="c-books-list__book-card" data-index="${i}">
          <div class="book-scene">

            <div class="book-pages">
              <div class="bp-content">
                <div class="bp-title">${title}</div>
                <div class="bp-author">${author}</div>
                ${genre ? `
                <div class="bp-row">
                  <span class="bp-label">${labels.genre}</span>
                  <span class="bp-value">
                    <span class="bp-genre-pill" style="background:${spine}22;color:${spine}">
                      ${genre}
                    </span>
                  </span>
                </div>` : ''}
                ${publisher ? `
                <div class="bp-row">
                  <span class="bp-label">${labels.publisher}</span>
                  <span class="bp-value">${publisher}</span>
                </div>` : ''}
                ${year ? `
                <div class="bp-row">
                  <span class="bp-label">${labels.year}</span>
                  <span class="bp-value">${year}</span>
                </div>` : ''}
              </div>
            </div>

            <div class="book-cover">
              <div class="bc-clip">
                <div class="bc-spine" style="background:${spine}"></div>
                ${coverUrl
                  ? `<img
                       class="bc-img"
                       src="${esc(coverUrl)}"
                       alt="${title}"
                       loading="lazy"
                       onerror="this.style.display='none'"
                     >`
                  : `<div class="bc-img" style="background:${spine}30"></div>`
                }
                <div class="bc-gradient"></div>
                <div class="bc-cover-shadow"></div>
                <div class="bc-title-wrap">
                  <div class="bc-title">${title}</div>
                  <div class="bc-author">${author}</div>
                </div>
              </div>
            </div>

          </div>
        </div>`;
    }).join('');

    // Staggered reveal — each observer disconnects itself after firing once
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

    // Render all page buttons, then attach a single delegated listener
    pages.innerHTML = Array.from({ length: pageCount }, (_, i) => {
      const p         = i + 1;
      const isCurrent = p === currentPage;
      return `<button type="button" class="c-books-list__pagination-btn ${isCurrent ? ' is-current' : ''} v-font-subheading-1" data-page="${p}" ${isCurrent ? 'disabled aria-current="page"' : ''}>${p}</button>`;
    }).join('');

    pages.onclick = (e) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-page]');
      const page = el?.getAttribute('data-page') || '';
      if (!page) return;
      if (el instanceof HTMLButtonElement && el.disabled) return;
      pushParams({ page });
      void fetchAndRender();
    };
  }

  // ── Fetch ────────────────────────────────────────────────────────────────
  async function fetchAndRender(): Promise<void> {
    // Carry everything from the URL — filters were already pushed there
    const params = new URLSearchParams(location.search);
    params.set('locale', locale);
    params.set('bookCategory', bookCategory);
    params.set('pageSize', String(pageSize));
    params.set('page', String(getPage()));

    console.log(params.toString());

    try {
      const res  = await fetch(`/api/books?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      renderGrid(Array.isArray(json?.data) ? json.data : []);
      renderPagination(Number(json?.meta?.pagination?.total ?? 0));
    } catch (err) {
      console.error('[CBooksList] fetch failed:', err);
      grid.innerHTML = `<div class="c-books-list__empty">${labels.error}</div>`;
    }
  }

  // ── Wiring ────────────────────────────────────────────────────────────────
  if (isFirstInit) {
    // Filters event comes from booksFilters.ts — reset to page 1 on any change
    document.addEventListener('books:filters', (e) => {
      const { search, genreId, publisherId } = (e as CustomEvent<BooksFiltersDetail>).detail;
      pushParams({
        search:    search || null,
        genre:     genreId || null,
        publisher: publisherId || null,
        genreId: null,
        publisherId: null,
        page:      '1',
      });
      void fetchAndRender();
    });

    // Back / forward button support — state is in the URL, just re-fetch
    window.addEventListener('popstate', () => void fetchAndRender());
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  // The server already rendered page 1 in the HTML, so we skip the first fetch.
  // We only need to build the pagination controls from the seed data.
  const seed = root.querySelector<HTMLScriptElement>('.c-books-list__initial');
  const { total } = JSON.parse(seed?.textContent || '{"total":0}') as { total: number };
  renderPagination(total);

  void fetchAndRender();
}