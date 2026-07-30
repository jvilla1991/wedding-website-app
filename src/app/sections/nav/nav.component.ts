import { Component, NgZone, OnDestroy, OnInit, inject, signal } from '@angular/core';

/**
 * Sticky nav with mobile menu toggle and scrollspy, ported from the source.
 * The scroll listener is registered manually with {passive:true} and throttled
 * through requestAnimationFrame, exactly like the original script. Sections
 * hidden by the active site mode (offsetParent === null) are skipped.
 */
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent implements OnInit, OnDestroy {
  private readonly zone = inject(NgZone);

  protected readonly open = signal(false);
  protected readonly active = signal<string | null>(null);

  private readonly ids = ['home', 'story', 'details', 'events', 'travel', 'registry', 'rsvp', 'faqs'];
  private ticking = false;
  private readonly onScroll = (): void => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      let cur: string | null = null;
      this.ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el || el.offsetParent === null) return; // skip sections hidden in this mode
        if (el.getBoundingClientRect().top <= 140) cur = id;
        if (cur === null) cur = id;
      });
      this.active.set(cur);
      this.ticking = false;
    });
  };

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }

  protected toggle(): void {
    this.open.update((open) => !open);
  }

  protected close(): void {
    this.open.set(false);
  }
}
