import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';

import { RevealDirective } from '../../core/reveal.directive';
import { RsvpApiService, RsvpRequest } from '../../core/rsvp-api.service';

const ACCEPTS = 'Joyfully accepts';
const DECLINES = 'Regretfully declines';

/**
 * RSVP form, ported from the source but submitting to the event-rsvp-api
 * instead of Formspree. The backend upserts by name, so coming back and
 * re-submitting updates the previous RSVP.
 *
 * A "+1" is not self-service: whoever generated the invite link decides. When
 * the link carries an ?invite=<token> whose invite has AllowGuest=true, the
 * form shows guest name fields and the guest is submitted as their own RSVP so
 * they land on the attendee list as a normal attendee.
 */
@Component({
  selector: 'app-rsvp',
  imports: [ReactiveFormsModule, RevealDirective],
  templateUrl: './rsvp.component.html',
})
export class RsvpComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(RsvpApiService);

  protected readonly ACCEPTS = ACCEPTS;
  protected readonly DECLINES = DECLINES;

  protected readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    attending: [ACCEPTS],
    guestFirstName: [''],
    guestLastName: [''],
    note: [''],
  });

  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly message = signal('');
  protected readonly messageIsError = signal(false);

  /** True when the invite for this link permits a +1 — controls the guest fields. */
  protected readonly allowGuest = signal(false);
  /** Invite token from the link, forwarded on submit so the invite is marked answered. */
  private inviteToken: string | null = null;

  ngOnInit(): void {
    const token = new URLSearchParams(window.location.search).get('invite');
    if (!token) return;
    this.inviteToken = token;

    this.api.viewInvite(token).subscribe({
      next: (info) => {
        this.allowGuest.set(!!info.allowGuest);
        // Pre-fill the primary guest's name from the invite (single string → first/last).
        if (info.name?.trim()) {
          const parts = info.name.trim().split(/\s+/);
          const firstName = parts.shift() ?? '';
          this.form.patchValue({ firstName, lastName: parts.join(' ') });
        }
      },
      // An invalid/expired token just means no pre-fill and no +1 — fail quietly.
      error: () => {},
    });
  }

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

    // A +1 is only in play when the invite allows it and the person is attending.
    const guestFirst = value.guestFirstName.trim();
    const guestLast = value.guestLastName.trim();
    const bringingGuest = accepting && this.allowGuest() && (guestFirst !== '' || guestLast !== '');
    if (bringingGuest && (!guestFirst || !guestLast)) {
      this.message.set("Please enter both your guest's first and last name.");
      return;
    }

    // Primary RSVP. The guest (below) is a separate attendee, so keep this at 1.
    const requests: Observable<unknown>[] = [
      this.api.submitRsvp({
        name,
        status: accepting ? 'Yes' : 'No',
        email,
        guestCount: 1,
        note: value.note,
        ...(this.inviteToken ? { inviteToken: this.inviteToken } : {}),
      }),
    ];

    // The guest joins the attendee list as their own "Yes" RSVP.
    if (bringingGuest) {
      const guest: RsvpRequest = {
        name: `${guestFirst} ${guestLast}`.trim(),
        status: 'Yes',
        email: '',
        guestCount: 1,
        note: '',
      };
      requests.push(this.api.submitRsvp(guest));
    }

    this.sending.set(true);
    forkJoin(requests).subscribe({
      next: () => {
        this.form.patchValue({
          firstName: '',
          lastName: '',
          email: '',
          guestFirstName: '',
          guestLastName: '',
          note: '',
        });
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
