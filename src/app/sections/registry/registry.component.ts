import { Component, signal } from '@angular/core';

import { RevealDirective } from '../../core/reveal.directive';

/**
 * "The Villa Fund" registry section. Ports the source's three behaviors:
 *  - Venmo: on mobile, try the app deep link first and fall back to the web
 *    profile if the app doesn't open (desktop keeps the normal web link).
 *  - Zelle: expandable details panel.
 *  - Copy: navigator.clipboard with the hidden-textarea execCommand fallback.
 */
@Component({
  selector: 'app-registry',
  imports: [RevealDirective],
  templateUrl: './registry.component.html',
})
export class RegistryComponent {
  protected readonly zelleOpen = signal(false);
  protected readonly copyCta = signal<'Copy' | 'Copied' | 'Select & copy'>('Copy');

  protected readonly venmoWeb = 'https://venmo.com/u/Jessica-Cummings-5';
  protected readonly venmoApp = 'venmo://users/Jessica-Cummings-5';
  protected readonly zelleAddress = 'jessicacummings01@gmail.com';

  protected toggleZelle(): void {
    this.zelleOpen.update((open) => !open);
  }

  protected onVenmoClick(event: Event): void {
    const ua = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    if (!isMobile) return; // desktop: normal web link is correct
    event.preventDefault();
    const t = Date.now();
    // if the app opens, the page is backgrounded and the fallback is skipped
    const fallback = setTimeout(() => {
      if (Date.now() - t < 1600) window.location.href = this.venmoWeb;
    }, 1200);
    window.addEventListener('pagehide', () => clearTimeout(fallback), { once: true });
    window.addEventListener('blur', () => clearTimeout(fallback), { once: true });
    window.location.href = this.venmoApp;
  }

  protected copyZelle(): void {
    const done = () => {
      this.copyCta.set('Copied');
      setTimeout(() => this.copyCta.set('Copy'), 2000);
    };
    const fallback = () => {
      const t = document.createElement('textarea');
      t.value = this.zelleAddress;
      t.setAttribute('readonly', '');
      t.style.position = 'absolute';
      t.style.left = '-9999px';
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand('copy');
        done();
      } catch {
        this.copyCta.set('Select & copy');
      }
      document.body.removeChild(t);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.zelleAddress).then(done).catch(fallback);
    } else {
      fallback();
    }
  }
}
