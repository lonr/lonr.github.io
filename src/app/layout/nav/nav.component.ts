import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Nav, NavItem } from './nav';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nav.app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  nav: Nav = [];
  constructor(public router: Router) {
    this.nav = [
      { routerLink: '', icon: 'home', text: 'Home' },
      { routerLink: 'blogs', icon: 'book', text: 'Blogs', counter$: of(1) },
      { routerLink: 'portfolio', icon: 'briefcase', text: 'Portfolio', counter$: of(1) },
      { routerLink: 'about', icon: 'octoface', text: 'About' },
    ];
  }

  isActive(item: NavItem): 'page' | null {
    if (this.router.isActive(item.routerLink, true)) {
      return 'page';
    }
    if (
      item.routerLink === 'blogs' &&
      (this.router.isActive('blog', false) || this.router.isActive('blogs', false))
    ) {
      return 'page';
    }
    return null;
  }

  ngOnInit(): void {}
}

// https://github.com/angular/angular/issues/29736
// https://angular.io/api/router/RouterLinkActive
