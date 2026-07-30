import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';

import { RevealDirective } from '../../core/reveal.directive';

/**
 * "The Celebration" sections: the std-mode save-the-date details band and the
 * full-mode events band (venue, schedule). Also ports the source's map-link
 * swap: Apple devices get Apple Maps, everyone else stays on Google Maps.
 */
@Component({
  selector: 'app-details',
  imports: [RevealDirective],
  templateUrl: './details.component.html',
})
export class DetailsComponent implements AfterViewInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit(): void {
    const ua = navigator.userAgent || '';
    const isApple =
      /iPad|iPhone|iPod/.test(ua) ||
      (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ||
      /Mac OS X/.test(ua);
    if (!isApple) return;
    this.el.nativeElement.querySelectorAll('a[data-apple]').forEach((a) => {
      a.setAttribute('href', a.getAttribute('data-apple')!);
    });
  }
}
