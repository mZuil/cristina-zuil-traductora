import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

let registered = false;

export function initRipple(): void {
  if (!registered) {
    gsap.registerPlugin(CustomEase);
    CustomEase.create('btn-ease', '0.32, 0.72, 0, 1');
    registered = true;
  }

  const mm = gsap.matchMedia();

  const isTouchDevice =
    (typeof navigator !== 'undefined' && (navigator.maxTouchPoints ?? 0) > 0) ||
    (typeof window !== 'undefined' &&
      (window.matchMedia('(hover: none)').matches ||
       window.matchMedia('(pointer: coarse)').matches));

  document.querySelectorAll<HTMLElement>('.a-button--ripple').forEach((button) => {
    // Skip buttons already initialized
    if ((button as any).__rippleInit) return;
    (button as any).__rippleInit = true;

    const circle = button.querySelector<HTMLElement>('[data-ripple-circle]');
    if (!circle) return;

    if (isTouchDevice) return;

    mm.add(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        const xSet = gsap.quickSetter(circle, 'xPercent') as (value: number) => void;
        const ySet = gsap.quickSetter(circle, 'yPercent') as (value: number) => void;

        function getXY(e: PointerEvent): { x: number; y: number } {
          const { left, top, width, height } = button.getBoundingClientRect();
          const xT = gsap.utils.pipe(
            gsap.utils.mapRange(0, width,  0, 100),
            gsap.utils.clamp(0, 100)
          ) as (value: number) => number;
          const yT = gsap.utils.pipe(
            gsap.utils.mapRange(0, height, 0, 100),
            gsap.utils.clamp(0, 100)
          ) as (value: number) => number;
          return { x: xT(e.clientX - left), y: yT(e.clientY - top) };
        }

        function onEnter(e: PointerEvent): void {
          const { x, y } = getXY(e);
          xSet(x); ySet(y);
          gsap.to(circle, { scale: 1, duration: 1.25, ease: 'btn-ease', overwrite: 'auto' });
        }

        function onLeave(e: PointerEvent): void {
          const { x, y } = getXY(e);
          gsap.killTweensOf(circle);
          gsap.to(circle, {
            xPercent: x > 90 ? x + 25 : x < 12.5 ? x - 25 : x,
            yPercent: y > 90 ? y + 25 : y < 12.5 ? y - 25 : y,
            scale: 0,
            duration: 0.45,
            ease: 'btn-ease',
            overwrite: 'auto',
          });
        }

        function onMove(e: PointerEvent): void {
          const { x, y } = getXY(e);
          gsap.to(circle, { xPercent: x, yPercent: y, duration: 0.5, ease: 'power1', overwrite: 'auto' });
        }

        button.addEventListener('pointerenter', onEnter);
        button.addEventListener('pointerleave', onLeave);
        button.addEventListener('pointermove',  onMove);

        return (): void => {
          button.removeEventListener('pointerenter', onEnter);
          button.removeEventListener('pointerleave', onLeave);
          button.removeEventListener('pointermove',  onMove);
        };
      }
    );
  });
}