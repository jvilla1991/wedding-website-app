import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface RsvpRequest {
  name: string;
  status: 'Yes' | 'No';
  email: string;
  guestCount: number;
  note: string;
  /** Token from the shareable invite link, so the backend marks the invite Accepted/Declined. */
  inviteToken?: string;
}

/** Subset of the backend InviteResponse the wedding site cares about. */
export interface InviteInfo {
  name: string;
  /** When true, this recipient may add one guest (a "+1"). */
  allowGuest: boolean;
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

  /** Look up an invite by its token (public endpoint). Also marks it as viewed. */
  viewInvite(token: string): Observable<InviteInfo> {
    return this.http.get<InviteInfo>(`${environment.apiUrl}/api/invites/${token}`);
  }
}
