import { uiT } from '../config/strings-ui';
import type { BooksFiltersDetail } from './booksFilters';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initRipple } from './ripple';

let gsapPluginsRegistered = false;
function ensureGsapPlugins(): void {
  if (gsapPluginsRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  gsapPluginsRegistered = true;
}

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
  lqip:      12,
  thumbnail: 156,
  xsmall:    320,
  small:     640,
  medium:    960,
  large:     1280,
  xlarge:    1920,
};

interface CoverData {
  src:           string;
  placeholderSrc: string;
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

  const fmtValues = Object.values(formats || {}) as Array<{ url?: string; width?: number }>;
  const smallest = fmtValues
    .filter((f) => Boolean(f?.url))
    .sort((a, b) => Number(a.width ?? Infinity) - Number(b.width ?? Infinity))[0];

  const placeholderSrc = smallest?.url ? `${strapiUrl}${smallest.url}` : src;

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
    placeholderSrc,
    hash,
    width,
    avifSrcSet:   buildSrcSet(hash, 'avif', width, strapiUrl),
    webpSrcSet:   buildSrcSet(hash, 'webp', width, strapiUrl),
    nativeSrcSet: nativeEntries.join(', '),
  };
}

const DEFAULT_SIZES = '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 960px) 960px, (max-width: 1280px) 1280px, 1920px';

function renderPicture(
  cover: CoverData | null,
  alt: string,
  sizes = DEFAULT_SIZES,
  loading: 'lazy' | 'eager' = 'lazy',
): string {
  if (!cover) return '';

  return `
    <picture class="a-image__picture">
      ${cover.avifSrcSet   ? `<source type="image/avif" srcset="${cover.avifSrcSet}" sizes="${sizes}">` : ''}
      ${cover.webpSrcSet   ? `<source type="image/webp" srcset="${cover.webpSrcSet}" sizes="${sizes}">` : ''}
      ${cover.nativeSrcSet ? `<source srcset="${cover.nativeSrcSet}" sizes="${sizes}">` : ''}
      <img class="a-image is-lqip" src="${cover.placeholderSrc}" alt="${alt}" width="${cover.width}" loading="${loading}" decoding="async">
    </picture>`;
}

// ── Init ───────────────────────────────────────────────────────────────────
export function initBooksList(root: HTMLElement): void {
  ensureGsapPlugins();

  const isFirstInit = root.dataset.booksListInit !== '1';
  if (isFirstInit) root.dataset.booksListInit = '1';

  const locale       = root.dataset.locale    || 'es';
  const bookCategory = root.dataset.category  || '';
  const pageSize     = Number(root.dataset.pageSize || '12') || 12;
  const strapiUrl    = root.dataset.strapiUrl || '';

  const grid    = root.querySelector<HTMLElement>('.c-books-list__grid')!;
  const results = root.querySelector<HTMLElement>('[data-results]');
  const pages   = root.querySelector<HTMLElement>('[data-pages]')!;

  const closeAllOpen = (): void => {
    root.querySelectorAll<HTMLElement>('.c-books-list__book-container.is-open')
      .forEach((el) => el.classList.remove('is-open'));
  };

  const scrollToTop = (): void => {
    const headerOffset = 16;
    const top = root.getBoundingClientRect().top + window.scrollY - headerOffset;

    const lenis = (window as any).__lenis as { scrollTo?: (target: number, opts?: unknown) => void } | undefined;
    if (lenis?.scrollTo) {
      lenis.scrollTo(top, { duration: 0.8 });
      return;
    }

    window.scrollTo({ top, behavior: 'smooth' });
  };

  const wireLqipHandlers = (): void => {
    root.querySelectorAll<HTMLImageElement>('img.a-image.is-lqip').forEach((img) => {
      const done = () => img.classList.remove('is-lqip');
      if (img.complete) {
        done();
        return;
      }
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  };

  const killGridAnimations = (): void => {
    const state = (root as any).__booksListGsap as { tween?: gsap.core.Tween; trigger?: ScrollTrigger } | undefined;
    state?.tween?.kill();
    state?.trigger?.kill();
    delete (root as any).__booksListGsap;
  };

  const nextRenderNonce = (): number => {
    const prev = Number((root as any).__booksListRenderNonce ?? 0);
    const next = prev + 1;
    (root as any).__booksListRenderNonce = next;
    return next;
  };

  const waitForCoversReady = async (cards: HTMLElement[], nonce: number): Promise<void> => {
    const imgs = cards
      .map((c) => c.querySelector<HTMLImageElement>('.c-books-list__book-cover img'))
      .filter((img): img is HTMLImageElement => Boolean(img));

    const awaitImg = (img: HTMLImageElement): Promise<void> => new Promise((resolve) => {
      const done = async () => {
        if (Number((root as any).__booksListRenderNonce ?? 0) !== nonce) return resolve();
        try {
          // decode() helps avoid animating while the browser is still painting the image
          if (typeof (img as any).decode === 'function') await (img as any).decode();
        } catch {
          // ignore decode failures
        }
        resolve();
      };

      if (img.complete) {
        void done();
        return;
      }
      img.addEventListener('load', () => void done(), { once: true });
      img.addEventListener('error', () => void done(), { once: true });
    });

    await Promise.all(imgs.map(awaitImg));
    if (Number((root as any).__booksListRenderNonce ?? 0) !== nonce) return;
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
  };

  const animateGridWhenReady = async (): Promise<void> => {
    killGridAnimations();

    const cards = Array.from(root.querySelectorAll<HTMLElement>('.c-books-list__book-container'));
    if (!cards.length) return;

    const nonce = nextRenderNonce();

    // Keep hidden until content + cover are ready
    gsap.set(cards, { autoAlpha: 0, y: 24 });
    wireLqipHandlers();

    await waitForCoversReady(cards, nonce);
    if (Number((root as any).__booksListRenderNonce ?? 0) !== nonce) return;
    initRipple();

    const tween = gsap.to(cards, {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.06,
      clearProps: 'transform',
      scrollTrigger: {
        trigger: grid,
        start: 'top 90%',
        once: true,
      },
    });

    const trigger = tween.scrollTrigger ?? undefined;
    (root as any).__booksListGsap = { tween, trigger };
    ScrollTrigger.refresh();
  };

  const getPage = (): number =>
    Math.max(1, Number(new URLSearchParams(location.search).get('page') || '1') || 1);

  function pushParams(overrides: Record<string, string | null>): void {
    const params = new URLSearchParams(location.search);
    for (const [key, value] of Object.entries(overrides)) {
      value ? params.set(key, value) : params.delete(key);
    }
    history.pushState({}, '', `?${params}`);
  }

  if (isFirstInit) {
    // Toggle book open state (delegated) + close when clicking outside
    root.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      const container = target?.closest<HTMLElement>('.c-books-list__book-container');
      if (!container) {
        closeAllOpen();
        return;
      }

      const shouldOpen = !container.classList.contains('is-open');
      closeAllOpen();
      if (shouldOpen) container.classList.add('is-open');
    });

    document.addEventListener('click', (e) => {
      const target = e.target as Node | null;
      if (target && root.contains(target)) return;
      closeAllOpen();
    });
  }

  // ── Render: grid ─────────────────────────────────────────────────────────
  function renderGrid(items: any[]): void {
    if (!items.length) {
      grid.innerHTML = `<div class="c-books-list__empty">${uiT(locale, 'noResults')}</div>`;
      killGridAnimations();
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

      const hasTranslation = Boolean(fromTranslation || toTranslation) && attr.bookCategory === 'traduccion';
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
      ? `<a href="${esc(linkUrl)}" target="_blank" rel="noopener noreferrer" class="a-button --primary v-font-body a-button--ripple c-books-list__shop-button">
            <span class="a-button__bg" aria-hidden="true"></span>
            <span class="a-button__bg-circle" aria-hidden="true">
              <span data-ripple-circle class="a-button__circle-wrap">
                <span class="a-button__circle"></span>
              </span>
            </span>
            <span class="a-button__inner">${uiT(locale, 'visitShop')}</span>
          </a>`
      : '';

      return `
        <div class="c-books-list__book-container" data-index="${i}">
          <div class="c-books-list__book-scene">
            <div class="c-books-list__book-cover">
              ${renderPicture(cover, title, DEFAULT_SIZES, i < 4 ? 'eager' : 'lazy')}
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

    void animateGridWhenReady();

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

    if(pageCount <= 1 && pages) return;

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

      scrollToTop();

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

      const rawItems: any[] = Array.isArray(json?.data) ? json.data : [];
      const sortedItems = rawItems.slice().sort((a, b) => {
        const aYearRaw = a?.attributes?.year ?? a?.year;
        const bYearRaw = b?.attributes?.year ?? b?.year;
        const aYear = Number.isFinite(Number(aYearRaw)) ? Number(aYearRaw) : -Infinity;
        const bYear = Number.isFinite(Number(bYearRaw)) ? Number(bYearRaw) : -Infinity;

        if (aYear !== bYear) return bYear - aYear;
        
        const aId = Number(a?.id ?? a?.attributes?.id ?? 0);
        const bId = Number(b?.id ?? b?.attributes?.id ?? 0);
        return bId - aId;
      });

      renderGrid(sortedItems);
      renderPagination(Number(json?.meta?.pagination?.total ?? 0));
    } catch (err) {
      console.error('[CBooksList] fetch failed:', err);
      grid.innerHTML = `<div class="c-books-list__empty">${uiT(locale, 'noResults')}</div>`;
      killGridAnimations();
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