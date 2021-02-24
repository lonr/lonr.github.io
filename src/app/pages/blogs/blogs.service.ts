import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GithubService } from 'src/app/core/github/github.service';
import CUSTOM_CONFIG from 'src/custom.config';
import { BlogList, files2GroupedByDateBlogs, files2PaginatedBlogLists, files2SortedBlogs } from './blogs';

@Injectable({
  // https://stackoverflow.com/questions/51062235/angular-6-providedin-a-non-root-module-is-causing-a-circular-dependency
  // https://github.com/angular/angular-cli/issues/10170
  providedIn: 'root',
})
export class BlogsService {
  constructor(private github: GithubService) {}

  getSortedBlogList() {
    return this.github.getBlogFiles().pipe(map((blogFiles) => files2SortedBlogs(blogFiles)));
  }

  getPaginatedBlogLists() {
    return this.github.getBlogFiles().pipe(map((blogFiles) => files2PaginatedBlogLists(blogFiles)));
  }

  getGroupedByDateBlogs() {
    return this.github.getBlogFiles().pipe(map((blogFiles) => files2GroupedByDateBlogs(blogFiles)));
  }
}
