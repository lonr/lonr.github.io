import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import Href from '@lonr/href';
import { inSamePage } from 'src/utils/href-helpers';
import { TocService } from './toc.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aside.app-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss'],
})
export class TocComponent {
  constructor(
    public toc: TocService,
    private router: Router,

    @Inject(DOCUMENT) private document: Document,
  ) {}

  @HostListener('click', ['$event'])
  public handleClick(event: Event): void {
    if (event.target instanceof Element) {
      let element: HTMLAnchorElement | null = null;
      for (let target of event.composedPath()) {
        if (target instanceof HTMLAnchorElement) {
          element = target;
          break;
        }
      }
      if (element?.classList.contains('toc-link')) {
        event.preventDefault();
        if (element.href !== '' && inSamePage(this.document.location.href, element.href)) {
          let hash = new Href(element.href).hash;
          if (hash !== '') {
            hash = `user-content-${hash.slice(1)}`;

            let target = this.document.getElementById(decodeURIComponent(hash));
            if (target !== null) {
              history.pushState(null, '', element.href);
              target.scrollIntoView();
            }
          }
        }
      }
    }
  }
}
