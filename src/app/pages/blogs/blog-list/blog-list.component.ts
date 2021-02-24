import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { PagingInfo } from 'src/app/widgets/pagination/pagination';
import { BlogList } from '../blogs';
import { BlogsService } from '../blogs.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit {
  pagingInfo$!: Observable<PagingInfo>;
  pagingInfo?: PagingInfo;
  paginatedBlogLists?: BlogList[];
  currentPage?: number;

  constructor(private route: ActivatedRoute, private router: Router, private blogs: BlogsService) {}

  ngOnInit(): void {
    combineLatest([this.blogs.getPaginatedBlogLists(), this.route.paramMap]).subscribe(
      ([paginatedBlogLists, params]) => {
        this.paginatedBlogLists = paginatedBlogLists;
        this.currentPage = +(params.get('page') || '1');
        this.pagingInfo = {
          pageCount: this.paginatedBlogLists.length,
          currentPage: this.currentPage,
          // Relatives to `/blogs/:page`
          routerLinkBuilder: (page: string | number) => `../${page}`,
        };
      },
    );
  }
}
