import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { RevealDirective } from '../../core/reveal.directive';
import { RsvpApiService } from '../../core/rsvp-api.service';

const ACCEPTS = 'Joyfully accepts';
const DECLINES = 'Regretfully declines';

/**
 * RSVP form, ported from the source but submitting to the event-rsvp-api
 * instead of Formspree. The backend upserts by name, so coming back and
 * re-submitting updates the previous RSVP.
 */
@Component({
  selector: 'app-rsvp',
  imports: [ReactiveFormsModule, RevealDirective],
  templateUrl: './rsvp.component.html',
})
export class RsvpComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(RsvpApiService);

  protected readonly ACCEPTS = ACCEPTS;
  protected readonly DECLINES = DECLINES;

  protected readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    attending: [ACCEPTS],
    plusOne: [false],
    note: [''],
  });

  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly message = signal('');
  protected readonly messageIsError = signal(false);

  protected pick(value: string): void {
    this.form.controls.attending.setValue(value);
  }

  protected pickKeydown(event: Event, value: string): void {
    event.preventDefault();
    this.pick(value);
  }

  protected submit(): void {
    this.messageIsError.set(false);
    this.message.set('');

    const value = this.form.getRawValue();
    const firstName = value.firstName.trim();
    const lastName = value.lastName.trim();
    const name = `${firstName} ${lastName}`.trim();
    const email = value.email.trim();
    if (!firstName || !lastName || !email || this.form.invalid) {
      this.message.set('Please add your name and email so we know who to expect.');
      return;
    }

    const accepting = value.attending.indexOf('Joyfully') === 0;
    this.sending.set(true);

    this.api
      .submitRsvp({
        name,
        status: accepting ? 'Yes' : 'No',
        email,
        guestCount: value.plusOne ? 2 : 1,
        mealChoice: '',
        note: value.note,
      })
      .subscribe({
        next: () => {
          // Reset the visible fields like the source (attendance toggle keeps its state)
          this.form.patchValue({ firstName: '', lastName: '', email: '', plusOne: false, note: '' });
          this.message.set(
            accepting
              ? "Thank you — we can't wait to celebrate with you!"
              : "Thank you for letting us know. You'll be missed!",
          );
          this.sending.set(false);
          this.sent.set(true);
        },
        error: () => {
          this.messageIsError.set(true);
          this.message.set('Something went wrong sending your RSVP. Please try again, or text us directly.');
          this.sending.set(false);
        },
      });
  }
}
