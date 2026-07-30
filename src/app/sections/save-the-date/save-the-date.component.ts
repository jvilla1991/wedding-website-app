import { Component, input, output } from '@angular/core';

/** Full-screen save-the-date overlay shown after the envelope opens. */
@Component({
  selector: 'app-save-the-date',
  templateUrl: './save-the-date.component.html',
})
export class SaveTheDateComponent {
  readonly show = input.required<boolean>();
  readonly gone = input.required<boolean>();
  readonly enter = output<void>();
}
