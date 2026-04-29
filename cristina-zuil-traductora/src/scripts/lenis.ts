import Lenis from 'lenis';

let lenis: Lenis | null = null;
let rafId: number | null = null;

function initLenis() {
  if (lenis) destroyLenis();

  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

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
}

initLenis();

document.addEventListener('astro:after-swap', () => {
  destroyLenis();
  initLenis();
});

document.addEventListener('astro:before-preparation', () => {
  destroyLenis();
});
