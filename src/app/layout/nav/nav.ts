import { Observable } from 'rxjs';

export interface NavItem {
  routerLink: '' | 'home' | 'blogs' | 'portfolio' | 'about';
  text: string;
  icon: string;
  counter$?: Observable<number>;
}

export type Nav = NavItem[];


