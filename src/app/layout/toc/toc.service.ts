import { Injectable, Renderer2 } from '@angular/core';
import Href from '@lonr/href';
import { BehaviorSubject } from 'rxjs';

export type TocData = {
  level: number;
  href: Href;
  innerHTML: string;
  subTocData?: TocData;
}[];

@Injectable({
  providedIn: 'root',
})
export class TocService {
  TocData$ = new BehaviorSubject<TocData>([]);
  constructor() {}

  updateTocData(tocData: TocData) {
    this.TocData$.next(tocData);
  }

  getTocData() {
    return this.TocData$.asObservable();
  }
}
