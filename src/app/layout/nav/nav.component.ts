import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Href from '@lonr/href';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/core/config/config.service';
import { GithubService } from 'src/app/core/github/github.service';
import { Nav, NavItem } from './nav';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nav.app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  nav: Nav = [];
  constructor(public router: Router, private config: ConfigService, private github: GithubService) {
    this.nav = [
      { routerLink: '', icon: 'home', text: 'Home' },
      {
        routerLink: 'blogs',
        icon: 'book',
        text: 'Blogs',
        counter$: this.github.getBlogFiles().pipe(map((files) => files.length)),
      },
      {
        routerLink: 'portfolio',
        icon: 'briefcase',
        text: 'Portfolio',
        counter$: combineLatest([
          this.github.getPortfolioLength(),
          this.github.getBlogFiles(),
        ]).pipe(map(([length]) => length)),
      },
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
    if (item.routerLink === '' && new Href(this.router.url).pathname === '/') {
      return 'page';
    }
    return null;
  }

  ngOnInit(): void {}
}

// https://github.com/angular/angular/issues/29736
// https://angular.io/api/router/RouterLinkActive
