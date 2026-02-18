import Lenis from 'lenis';

let lenis;
let rafId;

/**
 * Initialize Lenis smooth scroll
 * This function sets up the smooth scrolling behavior
 */
function initLenis() {
  if (lenis) destroyLenis();
  // Create new Lenis instance
  lenis = new Lenis({
    duration: 1.2,        // Animation duration in seconds
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
    orientation: 'vertical', // Scroll direction
    gestureOrientation: 'vertical', // Gesture direction
    smoothWheel: true,    // Enable smooth scrolling for mouse wheel
    wheelMultiplier: 1,   // Mouse wheel sensitivity
    touchMultiplier: 2,   // Touch scroll sensitivity
    infinite: false,      // Disable infinite scroll
  });

  const currentLenis = lenis;

  // Animation loop - required for Lenis to work
  function raf(time) {
    if (!lenis || lenis !== currentLenis) return;
    currentLenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }

  rafId = requestAnimationFrame(raf);
}

/**
 * Destroy Lenis instance
 * Important: Clean up when navigating away to prevent memory leaks
 */
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

// Initialize Lenis on first page load
initLenis();

// Re-initialize Lenis after each page transition
document.addEventListener('astro:after-swap', () => {
  destroyLenis();
  initLenis();
});

// Clean up before page transition starts
document.addEventListener('astro:before-preparation', () => {
  destroyLenis();
});