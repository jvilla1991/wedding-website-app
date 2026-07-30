import { Component, signal } from '@angular/core';

import { RevealDirective } from '../../core/reveal.directive';

/** FAQ accordion: one item open at a time; clicking the open item closes it. */
@Component({
  selector: 'app-faqs',
  imports: [RevealDirective],
  templateUrl: './faqs.component.html',
})
export class FaqsComponent {
  protected readonly faqs = [
    {
      q: 'Are kids welcome?',
      a: 'We love your little ones, but our reception is an adults-only celebration. Thank you for understanding.',
    },
    {
      q: 'Is there parking?',
      a: 'Yes — street parking and nearby lots are available around Vester St in downtown Ferndale.',
    },
    {
      q: "Didn't you already get married?",
      a: 'We did! We eloped in Las Vegas on April 9, 2027, with just us and close family and friends. This June celebration is the reception with everyone we love.',
    },
    {
      q: 'Can I bring a plus-one?',
      a: 'Please RSVP for the number of guests listed on your invitation. Reach out to us directly with any questions.',
    },
    {
      q: 'What if my plans change?',
      a: "Come back to this page and submit a new RSVP — we'll use the most recent one.",
    },
  ];

  protected readonly openIndex = signal<number | null>(null);

  protected toggle(index: number): void {
    this.openIndex.update((open) => (open === index ? null : index));
  }
}
