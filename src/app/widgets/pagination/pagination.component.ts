import { Component, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  paginateNumbers,
  CompletePagingInfo,
  PagingInfo,
  PagingNumber,
  PagingNumbers,
} from './pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  completePagingInfo!: CompletePagingInfo;
  numbers: PagingNumbers = [];

  @Input() set pagingInfo(info: PagingInfo) {
    this.completePagingInfo = {
      marginPageCount: 1,
      surroundingPageCount: 2,
      ...info,
    };
    this.numbers = paginateNumbers(this.completePagingInfo);
  }

  constructor() {}

  getNumberType(number: PagingNumber) {
    if (number.isCurrent) {
      return 'current';
    }
    if (number.isInGap) {
      return 'inGap';
    }
    return 'normal';
  }

  get previous() {
    const exists = this.completePagingInfo.currentPage > 1;
    let routerLink = '';
    if (exists) {
      let prev = this.completePagingInfo.currentPage - 1;
      routerLink = this.completePagingInfo.routerLinkBuilder(prev);
    }
    return {
      exists,
      routerLink,
    };
  }

  get next() {
    const exists = this.completePagingInfo.currentPage < this.completePagingInfo.pageCount;
    let routerLink = '';
    if (exists) {
      let next = this.completePagingInfo.currentPage + 1;
      routerLink = this.completePagingInfo.routerLinkBuilder(next);
    }
    return {
      exists,
      routerLink,
    };
  }

  ngOnInit(): void {}
}
