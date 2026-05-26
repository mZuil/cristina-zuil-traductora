import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let gsapPluginsRegistered = false;
function ensureGsapPlugins(): void {
  if (gsapPluginsRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsapPluginsRegistered = true;
}

export function initArticlesList(root: HTMLElement): void {
  ensureGsapPlugins();

  const isFirstInit = root.dataset.articlesListInit !== '1';
  if (isFirstInit) root.dataset.articlesListInit = '1';

  const grid = root.querySelector<HTMLElement>('.js-articles-grid');
  if (!grid) return;

  const dialog = root.querySelector('dialog[data-dialog]');
  if (!(dialog instanceof HTMLDialogElement)) return;

  const dialogPanel = dialog.querySelector<HTMLElement>('.c-articles-list__dialog-inner');
  const dialogModel = dialog.querySelector<HTMLElement>('.js-dialog-model');

  const dialogImg = dialog.querySelector('[data-dialog-image]');
  const dialogTitle = dialog.querySelector('[data-dialog-title]');
  const dialogDescription = dialog.querySelector('[data-dialog-description]');
  const dialogLink = dialog.querySelector('[data-dialog-link]');
  const closeBtn = dialog.querySelector('[data-dialog-close]');

  // ─── Dialog tween ────────────────────────────────────────────────────────────

  let dialogTween: gsap.core.Tween | null = null;

  const killDialogTween = (): void => {
    dialogTween?.kill();
    dialogTween = null;
  };

  const openDialog = (): void => {
    killDialogTween();
    if (dialog.open) dialog.close();
    dialog.showModal();

    document.dispatchEvent(new CustomEvent('articles-modal:open'));
    document.body.classList.add('is-overflow-hidden');

    if (dialogModel) {
      gsap.killTweensOf(dialogModel);
      gsap.set(dialogModel, { autoAlpha: 0 });
      gsap.to(dialogModel, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' });
    }

    gsap.set(dialogPanel, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.85,
      autoAlpha: 0,
      transformOrigin: '50% 50%',
    });

    dialogTween = gsap.to(dialogPanel, {
      scale: 1,
      autoAlpha: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
    });
  };

  const closeDialog = (): void => {
    if (!dialog.open) return;
    killDialogTween();

    if (dialogModel) {
      gsap.killTweensOf(dialogModel);
      gsap.to(dialogModel, { autoAlpha: 0, duration: 0.2, ease: 'power1.in' });
    }

    dialogTween = gsap.to(dialogPanel, {
      scale: 0.85,
      autoAlpha: 0,
      duration: 0.3,
      ease: 'back.in(1.7)',
      onComplete: () => {
        dialog.close();
        gsap.set(dialogPanel, { clearProps: 'all' });
        if (dialogModel) gsap.set(dialogModel, { autoAlpha: 0, clearProps: 'all' });
        setLenisEnabled(true);
        document.body.classList.remove('is-overflow-hidden');

        document.dispatchEvent(new CustomEvent('articles-modal:close'));
      },
    });
  };

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const setLenisEnabled = (enabled: boolean): void => {
    const lenis = (window as any).__lenis as { stop?: () => void; start?: () => void } | undefined;
    if (!lenis) return;
    if (enabled) lenis.start?.();
    else lenis.stop?.();
  };

  const setText = (el: Element | null, value: unknown): void => {
    if (!(el instanceof HTMLElement)) return;
    el.textContent = typeof value === 'string' ? value : '';
  };

  const setHref = (el: Element | null, href: unknown): void => {
    if (!(el instanceof HTMLAnchorElement)) return;
    const safeHref = typeof href === 'string' ? href : '';
    el.href = safeHref || '#';
    el.toggleAttribute('aria-disabled', !safeHref);
    el.style.pointerEvents = safeHref ? '' : 'none';
    el.style.opacity = safeHref ? '' : '0.5';
  };

  // ─── Grid animation ───────────────────────────────────────────────────────────

  const scheduleScrollTriggerRefresh = (): void => {
    const prev = Number((root as any).__articlesListRefreshRaf ?? 0);
    if (prev) cancelAnimationFrame(prev);
    (root as any).__articlesListRefreshRaf = requestAnimationFrame(() => {
      (root as any).__articlesListRefreshRaf = 0;
      ScrollTrigger.refresh();
    });
  };

  const killGridAnimations = (): void => {
    const state = (root as any).__articlesListGsap as { tween?: gsap.core.Tween; trigger?: ScrollTrigger } | undefined;
    state?.tween?.kill();
    state?.trigger?.kill();
    delete (root as any).__articlesListGsap;
  };

  const animateGrid = (): void => {
    killGridAnimations();

    const cards = Array.from(root.querySelectorAll<HTMLElement>('.js-article-card'));
    if (!cards.length) return;

    const isMobileTrigger = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 768px)').matches;

    gsap.set(cards, { autoAlpha: 0, y: 24 });

    const tween = gsap.to(cards, {
      autoAlpha: 1,
      y: 0,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.06,
      clearProps: 'transform',
      scrollTrigger: {
        trigger: grid,
        start: isMobileTrigger ? 'top 80%' : 'top 90%',
        once: true,
      },
    });

    const trigger = tween.scrollTrigger ?? undefined;
    (root as any).__articlesListGsap = { tween, trigger };
    scheduleScrollTriggerRefresh();
  };

  // ─── Event listeners ──────────────────────────────────────────────────────────

  if (isFirstInit) {
    animateGrid();

    closeBtn?.addEventListener('click', () => {
      closeDialog();
    });

    dialogModel?.addEventListener('click', () => {
      closeDialog();
    });

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeDialog();
      }
    });

    // Intercept native ESC so it plays the close animation first
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDialog();
      }
    });

    // Safety net: clean up body state if dialog closes by any other means
    dialog.addEventListener('close', () => {
      if (dialogModel) gsap.set(dialogModel, { autoAlpha: 0, clearProps: 'all' });
      setLenisEnabled(true);
      document.body.classList.remove('is-overflow-hidden');

      document.dispatchEvent(new CustomEvent('articles-modal:close'));
    });

    root.addEventListener('click', async (e) => {
      const btn = e.target instanceof HTMLElement ? e.target.closest('button[data-article]') : null;
      if (!(btn instanceof HTMLButtonElement)) return;

      const raw = btn.getAttribute('data-article') || '';
      let data: any;
      try {
        data = JSON.parse(decodeURIComponent(raw));
      } catch {
        data = {};
      }

      setText(dialogTitle, data.title);
      setText(dialogDescription, data.content);
      setHref(dialogLink, data.linkUrl);

      const src = typeof data.imageUrl === 'string' ? data.imageUrl : '';
      const alt = typeof data.title === 'string' ? data.title : '';

      if (dialogImg instanceof HTMLImageElement) {
        dialogImg.alt = alt;

        if (src) {
          const preload = new Image();
          preload.src = src;

          await new Promise<void>((resolve) => {
            const done = () => resolve();
            if (preload.complete) { resolve(); return; }
            preload.addEventListener('load', done, { once: true });
            preload.addEventListener('error', done, { once: true });
          });

          dialogImg.src = src;
          try {
            if (typeof (dialogImg as any).decode === 'function') await (dialogImg as any).decode();
          } catch {
            // ignore decode failures
          }
        } else {
          dialogImg.src = '';
        }
      }

      setLenisEnabled(false);
      openDialog();
    });

    // Only refresh on width changes. On mobile, showing/hiding the URL bar
    // fires a resize event where only the height changes; refreshing then
    // causes visible layout jumps.
    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      scheduleScrollTriggerRefresh();
    });
  }
}