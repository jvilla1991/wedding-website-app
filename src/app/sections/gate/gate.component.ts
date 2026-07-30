import { Component, input, output, signal } from '@angular/core';

/**
 * Envelope gate overlay. Click / Enter / Space on the envelope adds the
 * `.leaving` class, then 550ms later emits `opened` (the source's setTimeout
 * that adds `.gone` to the gate and `.show` to the save-the-date overlay).
 */
@Component({
  selector: 'app-gate',
  templateUrl: './gate.component.html',
})
export class GateComponent {
  readonly gone = input.required<boolean>();
  readonly opened = output<void>();

  protected readonly leaving = signal(false);
  private hasOpened = false;

  protected open(): void {
    if (this.hasOpened) return;
    this.hasOpened = true;
    this.leaving.set(true);
    setTimeout(() => this.opened.emit(), 550);
  }

  protected onKeydown(event: Event): void {
    event.preventDefault();
    this.open();
  }
}
