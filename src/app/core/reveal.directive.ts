import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Scroll-reveal ported from the source page: every `.reveal` element gets the
 * `.in` class the first time it intersects the viewport (threshold 0.1), then
 * is unobserved — exactly the source's IntersectionObserver behavior.
 */
@Directive({ selector: '.reveal' })
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private io?: IntersectionObserver;

  ngOnInit(): void {
    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            this.io?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    this.io.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
