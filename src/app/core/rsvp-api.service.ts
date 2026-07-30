import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface RsvpRequest {
  name: string;
  status: 'Yes' | 'No';
  email: string;
  guestCount: number;
  mealChoice: string;
  note: string;
}

@Injectable({ providedIn: 'root' })
export class RsvpApiService {
  private readonly http = inject(HttpClient);

  /** The backend upserts by name, so re-submitting updates the existing RSVP. */
  submitRsvp(rsvp: RsvpRequest): Observable<unknown> {
    return this.http.post(
      `${environment.apiUrl}/api/events/${environment.eventId}/rsvps`,
      rsvp,
    );
  }
}
