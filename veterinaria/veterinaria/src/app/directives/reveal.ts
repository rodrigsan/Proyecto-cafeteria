import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  inject,
  numberAttribute,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: {
    '[style.transition-delay.ms]': 'revealDelay',
  },
})
export class Reveal implements AfterViewInit, OnDestroy {
  @Input({ transform: numberAttribute }) revealDelay = 0;

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.renderer.addClass(this.element.nativeElement, 'app-reveal');

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.renderer.addClass(this.element.nativeElement, 'app-reveal--visible');
          this.observer?.unobserve(this.element.nativeElement);
        }
      },
      { threshold: 0.1 },
    );

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
