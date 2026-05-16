
import barba from '@barba/core';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

function select<T extends Element = Element>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector(selector) as T | null;
}

function emit(name: string, detail?: Record<string, unknown>) {
  document.dispatchEvent(new CustomEvent(`barba:${name}`, { detail }));
}

class App {

  private barbaWrapper: HTMLElement | null;
  private tlAfter: gsap.core.Timeline | null = null;
  private tlLeave: gsap.core.Timeline | null = null;

  constructor() {

    this.barbaWrapper = select<HTMLElement>('[data-barba="wrapper"]');

    barba.init({
      transitions: [
        {
          name: 'draw-transition',
          before: (data: any) => {
            emit('before', { current: data.current?.container, next: data.next?.container });
            this.barbaWrapper?.classList.add('is-transitioning');
          },
          beforeLeave: (data: any) => {
            emit('beforeLeave', { current: data.current?.container, next: data.next?.container });
          },
          leave: (data: any) => {
            emit('leave', { current: data.current?.container, next: data.next?.container });
            return this.leaveAnimation(data.current?.container);
          },
          afterLeave: (data: any) => {
            emit('afterLeave', { current: data.current?.container, next: data.next?.container });
          },
          beforeEnter: (data: any) => {
            if (data.next?.container) {
              this.runScripts(data.next.container);
              gsap.set(data.next.container, { autoAlpha: 1 });
            }

            emit('beforeEnter', { current: data.current?.container, next: data.next?.container });
          },
          enter: (data: any) => {
            emit('enter', { current: data.current?.container, next: data.next?.container });
            return this.afterAnimation();
          },
          afterEnter: (data: any) => {
            emit('afterEnter', { current: data.current?.container, next: data.next?.container });
          },
          after: (data: any) => {
            emit('after', { current: data.current?.container, next: data.next?.container });
            this.barbaWrapper?.classList.remove('is-transitioning');
          },
        },
      ],
    });
  }

  leaveAnimation(currentContainer?: HTMLElement): gsap.core.Timeline {
    this.tlLeave = gsap.timeline({
        defaults: {
        duration: 1.4,
        ease: 'sine.inOut',
        },
        onComplete: () => this.tlLeave?.kill(),
    });

    gsap.set('.transition__transition-wrapper', {
        pointerEvents: 'auto',
        autoAlpha: 1,
        visibility: 'visible',
    });

    gsap.set('.transition__svg-wrapper svg path', {
        drawSVG: '0% 0%',
        attr: { 'stroke-width': 100 },
        opacity: 0,
    });

    this.tlLeave.to('.transition__svg-wrapper svg path', {
        opacity: 1,
        duration: 0.5,
    });

    this.tlLeave.to(
        '.transition__svg-wrapper svg path',
        {
        drawSVG: '0% 100%',
        },
        '<',
    );

    this.tlLeave.to(
        '.transition__svg-wrapper svg path',
        {
        attr: { 'stroke-width': 400 },
        ease: 'sine.inOut',
        },
        '<+=0.18',
    );

    if (currentContainer) {
      this.tlLeave.set(currentContainer, { autoAlpha: 0 }, '<');
    }

    return this.tlLeave;
  }

  private runScripts(container: HTMLElement): void {
    const scripts = Array.from(container.querySelectorAll('script'));
    for (const oldScript of scripts) {
      const type = oldScript.getAttribute('type') || '';

      // Skip inert JSON payloads
      if (type === 'application/ld+json' || type === 'application/json') continue;

      const newScript = document.createElement('script');

      for (const attr of Array.from(oldScript.attributes)) {
        newScript.setAttribute(attr.name, attr.value);
      }

      if (oldScript.textContent) newScript.textContent = oldScript.textContent;

      oldScript.parentNode?.replaceChild(newScript, oldScript);
    }
  }

  afterAnimation(): gsap.core.Timeline {
    this.tlAfter = gsap.timeline({
        defaults: {
        duration: 1,
        ease: 'sine.inOut',
        },
        onComplete: () => {
        gsap.set('.transition__transition-wrapper', {
            pointerEvents: 'none',
            autoAlpha: 0,
            visibility: 'hidden',
        });

        gsap.set('.transition__svg-wrapper svg path', {
            drawSVG: '0% 0%',
            attr: { 'stroke-width': 100 },
        });

        this.tlAfter?.kill();
        },
    });

    this.tlAfter.to('.transition__svg-wrapper svg path', {
        attr: { 'stroke-width': 100 },
    });

    this.tlAfter.to(
        '.transition__svg-wrapper svg path',
        {
        drawSVG: '100% 100%',
        },
        '<+=0.45',
    );

    return this.tlAfter;
  }
}

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(CustomEase, DrawSVGPlugin);

    new App();
});
