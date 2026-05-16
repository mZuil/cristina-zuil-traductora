import type { TransitionBeforePreparationEvent } from "astro:transitions/client";

document.addEventListener('astro:before-preparation', (e) => {
  const event = e as TransitionBeforePreparationEvent;
  const path = document.querySelector<SVGPathElement>('.js-transition-path');
  if (!path) return;

  // Hold navigation until morph-in finishes
  const originalLoader = event.loader;
  event.loader = async () => {
    path.style.animation = 'none';
    path.getBoundingClientRect();
    path.style.animation = 'morph-in 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards';

    // Wait for animation to complete
    await new Promise<void>(resolve => {
      path.addEventListener('animationend', () => resolve(), { once: true });
    });

    // Now let Astro continue with the navigation
    await originalLoader();
  };
});

document.addEventListener('astro:after-swap', () => {
  const path = document.querySelector<SVGPathElement>('.js-transition-path');
  if (!path) return;

  path.style.animation = 'none';
  path.getBoundingClientRect();
  path.style.animation = 'morph-out 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards';
});