import { Component } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from './core/config/config.service';
import { Profile } from './core/config/profile';
import { TocService } from './layout/toc/toc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public config: ConfigService, public toc: TocService) {}

  shouldShowToc() {
    return this.toc.getTocData().pipe(
      map((data) => {
        return data.length > 0;
      }),
    );
  }
}
