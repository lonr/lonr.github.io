import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/config/config.service';
import { RemoteProfile } from 'src/app/core/config/profile';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  profile$: Observable<RemoteProfile>;
  constructor(private config: ConfigService) {
    this.profile$ = this.config.profile$;
  }

  ngOnInit(): void {}
}
