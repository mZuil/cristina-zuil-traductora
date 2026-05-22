import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafId: number | null = null;

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function initLenis() {
  if (lenis) destroyLenis();

  lenis = new Lenis({
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    duration: 1.5,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    infinite: false,
  });

  window.__lenis = lenis;

  const currentLenis = lenis;

  function raf(time: number) {
    if (!lenis || lenis !== currentLenis) return;
    currentLenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }

  rafId = requestAnimationFrame(raf);
}

function destroyLenis() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  if (lenis) {
    lenis.destroy();
    lenis = null;
  }

  delete window.__lenis;
}

initLenis();

document.addEventListener('astro:after-swap', () => {
  destroyLenis();
  initLenis();
});

document.addEventListener('astro:before-preparation', () => {
  destroyLenis();
});
