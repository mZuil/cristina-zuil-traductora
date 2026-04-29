export type BooksFiltersDetail = {
  search: string;
  genreId: string;
  publisherId: string;
};

export function initBooksFilters(root: HTMLElement): void {
  if (root.dataset.filtersInit === '1') return;
  root.dataset.filtersInit = '1';

  const locale = root.dataset.locale || 'es';

  const input = root.querySelector('#books-search');
  const genreSelect = root.querySelector('#books-genre');
  const publisherSelect = root.querySelector('#books-publisher');

  if (!(input instanceof HTMLInputElement)) throw new Error('Missing search input');
  if (!(genreSelect instanceof HTMLSelectElement)) throw new Error('Missing genre select');
  if (!(publisherSelect instanceof HTMLSelectElement)) throw new Error('Missing publisher select');

  const emit = () => {
    const detail: BooksFiltersDetail = {
      search: input.value || '',
      genreId: genreSelect.value || '',
      publisherId: publisherSelect.value || '',
    };

    document.dispatchEvent(new CustomEvent<BooksFiltersDetail>('books:filters', { detail }));
  };

  const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
    let t: number | undefined;
    return (...args: Parameters<T>) => {
      if (t !== undefined) window.clearTimeout(t);
      t = window.setTimeout(() => fn(...args), delay);
    };
  };

  const emitDebounced = debounce(emit, 250);

  input.addEventListener('input', emitDebounced);
  genreSelect.addEventListener('change', emit);
  publisherSelect.addEventListener('change', emit);

  const fillSelect = (selectEl: HTMLSelectElement, items: any[]) => {
    for (const item of items) {
      const opt = document.createElement('option');
      opt.value = String(item.id);
      opt.textContent = String(item?.name ?? '');
      if (opt.textContent) selectEl.appendChild(opt);
    }
  };

  const load = async () => {
    const [genresRes, publishersRes] = await Promise.all([
      fetch(`/api/genres?locale=${encodeURIComponent(locale)}`),
      fetch(`/api/publishers?locale=${encodeURIComponent(locale)}`),
    ]);

    const genresJson = await genresRes.json();
    const publishersJson = await publishersRes.json();

    fillSelect(genreSelect, genresJson?.data ?? []);
    fillSelect(publisherSelect, publishersJson?.data ?? []);
  };

  load();
}
