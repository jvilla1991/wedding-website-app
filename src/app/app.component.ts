import { Component, signal } from '@angular/core';

import { environment } from '../environments/environment';
import { GateComponent } from './sections/gate/gate.component';
import { SaveTheDateComponent } from './sections/save-the-date/save-the-date.component';
import { HeroComponent } from './sections/hero/hero.component';
import { NavComponent } from './sections/nav/nav.component';
import { WelcomeComponent } from './sections/welcome/welcome.component';
import { StoryComponent } from './sections/story/story.component';
import { DetailsComponent } from './sections/details/details.component';
import { TravelComponent } from './sections/travel/travel.component';
import { RegistryComponent } from './sections/registry/registry.component';
import { RsvpComponent } from './sections/rsvp/rsvp.component';
import { FaqsComponent } from './sections/faqs/faqs.component';
import { FooterComponent } from './sections/footer/footer.component';

/**
 * Shell for the gate -> save-the-date -> site sequence from the source page:
 *   'gate' : envelope overlay visible, body scroll locked
 *   'std'  : envelope faded out (.gone), save-the-date overlay shown (.show)
 *   'site' : save-the-date faded out (.gone), main site shown, scroll restored
 */
type Phase = 'gate' | 'std' | 'site';

@Component({
  selector: 'app-root',
  imports: [
    GateComponent,
    SaveTheDateComponent,
    HeroComponent,
    NavComponent,
    WelcomeComponent,
    StoryComponent,
    DetailsComponent,
    TravelComponent,
    RegistryComponent,
    RsvpComponent,
    FaqsComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly phase = signal<Phase>('gate');

  constructor() {
    // Source: document.documentElement.setAttribute('data-mode', SITE_MODE)
    document.documentElement.setAttribute('data-mode', environment.siteMode);
    // Source: document.body.style.overflow='hidden' while gated
    document.body.style.overflow = 'hidden';
  }

  /** Fired by the gate 550ms after the envelope starts leaving. */
  protected onEnvelopeOpened(): void {
    this.phase.set('std');
  }

  /** "Enter" on the save-the-date overlay reveals the site. */
  protected onEnterSite(): void {
    this.phase.set('site');
    document.body.style.overflow = 'auto';
    setTimeout(() => window.scrollTo(0, 0), 30);
  }
}
