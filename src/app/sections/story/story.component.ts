import { Component } from '@angular/core';

import { RevealDirective } from '../../core/reveal.directive';

@Component({
  selector: 'app-story',
  imports: [RevealDirective],
  templateUrl: './story.component.html',
})
export class StoryComponent {}
