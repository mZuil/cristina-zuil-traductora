// src/scripts/customSelect.ts

export function initCustomSelect(wrapper: HTMLElement): void {
  if (wrapper.dataset.selectInit === '1') return;
  wrapper.dataset.selectInit = '1';

  const nativeSelect = wrapper.querySelector<HTMLSelectElement>('select')!;
  const trigger      = wrapper.querySelector<HTMLButtonElement>('.js-select-trigger')!;
  const triggerText  = wrapper.querySelector<HTMLElement>('.a-select__trigger-text')!;
  const dropdown     = wrapper.querySelector<HTMLElement>('.a-select__dropdown')!;
  const inner        = wrapper.querySelector<HTMLElement>('.a-select__dropdown-inner')!;

  let isOpen = false;

  // ── Open / close ──────────────────────────────────────────────────────
  function open() {
    isOpen = true;
    wrapper.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function close() {
    isOpen = false;
    wrapper.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', () => isOpen ? close() : open());

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target as Node)) close();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // ── Sync text + dot on the trigger ───────────────────────────────────
  function syncTrigger() {
    const selected = nativeSelect.options[nativeSelect.selectedIndex];
    triggerText.textContent = selected?.text ?? '';
  }

  nativeSelect.addEventListener('change', () => {
    syncTrigger();
    renderOptions();
  });

  // ── Populate options (called by booksFilters.ts equivalent) ──────────
  // Re-render the visual listbox to mirror the native select
  function renderOptions() {
    inner.innerHTML = Array.from(nativeSelect.options).map((opt, i) => {
      return `<button type="button" role="option" class="a-select__option" data-value="${opt.value}" aria-selected="${nativeSelect.value === opt.value}">
        <span class="a-select__option-dot"></span>
        ${opt.text}
      </button>`;
    }).join('');

    // Delegated click on options
    inner.onclick = (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.a-select__option');
      if (!btn) return;
      nativeSelect.value = btn.dataset.value ?? '';
      nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      syncTrigger();
      renderOptions(); // refresh aria-selected
      close();
    };
  }

  // ── Watch native select for external changes (fillSelect in booksFilters.ts)
  // MutationObserver re-renders visuals whenever options are added
  new MutationObserver(() => {
    renderOptions();
    syncTrigger();
  }).observe(nativeSelect, { childList: true });

  renderOptions();
  syncTrigger();
}