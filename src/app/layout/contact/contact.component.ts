import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/config/config.service';
import { ContactItem } from 'src/app/core/config/contact';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aside.app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contact$: Observable<ContactItem[]>;

  constructor(private config: ConfigService) {
    this.contact$ = this.config.contact$;
  }
}
