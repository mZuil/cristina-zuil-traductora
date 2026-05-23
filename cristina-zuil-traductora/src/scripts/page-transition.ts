import type { TransitionBeforePreparationEvent } from "astro:transitions/client";

const DURATION = 700; // ms
const EASING = 'cubic-bezier(0.7, 0, 0.3, 1)';

function getEls() {
  return {
    panel:  document.querySelector<HTMLElement>('.js-transition-panel'),
    top:    document.querySelector<HTMLElement>('.js-transition-panel-top'),
    bottom: document.querySelector<HTMLElement>('.js-transition-panel-bottom'),
  };
}

document.addEventListener('astro:before-preparation', (e) => {
  const event = e as TransitionBeforePreparationEvent;
  const originalLoader = event.loader;

  event.loader = async () => {
    const { panel, top } = getEls();
    if (!panel || !top) { await originalLoader(); return; }

    // Reset
    panel.style.animation = 'none';
    top.style.animation = 'none';
    panel.getBoundingClientRect();

    // Slide panel up from below + expand top circle
    panel.style.animation = `panel-in ${DURATION}ms ${EASING} forwards`;
    top.style.animation   = `top-in  ${DURATION}ms ${EASING} forwards`;

    await new Promise<void>(resolve => setTimeout(resolve, DURATION));
    await originalLoader();
  };
});

document.addEventListener('astro:after-swap', () => {
  const { panel, bottom } = getEls();
  if (!panel || !bottom) return;

  // Navigation is effectively done; clear the flag so normal behavior resumes
  document.documentElement.classList.remove('is-navigating');

  panel.style.animation  = 'none';
  bottom.style.animation = 'none';
  panel.getBoundingClientRect();

  document.addEventListener(
      "model:ready",
      () => {
        panel.style.animation  = `panel-out  ${DURATION}ms ${EASING} forwards`;
        bottom.style.animation = `bottom-out ${DURATION}ms ${EASING} forwards`;
      },
  );
});