import { Component } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ConfigService } from './core/config/config.service';
import { Profile } from './core/config/profile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  profile$: ReplaySubject<Profile>;

  constructor(config: ConfigService) {
    this.profile$ = config.profile$;
  }
}
