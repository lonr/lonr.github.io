import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of, ReplaySubject } from 'rxjs';
import { concatAll, concatMap, map, mergeAll, mergeMap, retry, switchMap } from 'rxjs/operators';
import { orderedMergeMap } from 'src/utils/ordered-merge-map';
import { ConfigService } from '../config/config.service';

import {
  markdownAPI,
  repoAPI,
  MARKDOWN_HTML_HEADERS,
  PORTFOLIO_HEADERS,
  Repo,
  DEFAULT_HEADERS,
  blogsAPI,
  filterBlogFilesFromFiles,
  BlogFiles,
  RepoFiles,
  blogAPI,
} from './github';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  blogFiles$ = new ReplaySubject<BlogFiles>();
  constructor(private config: ConfigService, private http: HttpClient) {
    this.config.blogRepo$
      .pipe(
        switchMap((repo) =>
          this.http
            .get<RepoFiles>(blogsAPI(repo), {
              headers: DEFAULT_HEADERS,
            })
            .pipe(map(filterBlogFilesFromFiles), retry(1)),
        ),
      )
      .subscribe((blogFiles) => {
        this.blogFiles$.next(blogFiles);
      });
  }

  getBlogFiles() {
    return this.blogFiles$.asObservable();
  }

  getPortfolioLength(): Observable<number> {
    return this.config.portfolioRepos$.pipe(map((repos) => repos.length));
  }

  getPortfolio() {
    return this.config.portfolioRepos$.pipe(
      concatMap(from),
      orderedMergeMap((repo) =>
        this.http
          .get<Repo>(repoAPI(repo), {
            headers: PORTFOLIO_HEADERS,
          })
          .pipe(retry(1)),
      ),
    );
  }

  getBlogMeta(blog: string) {
    return this.config.blogRepo$.pipe(
      switchMap((repo) =>
        this.getBlogSource(repo, blog).pipe(
          map((source) => ({
            source: source,
            repo: repo,
            path: `blog/blogs/${blog}.md`,
          })),
        ),
      ),
    );
  }

  private getBlogSource(repo: string, blog: string) {
    return this.http
      .get(blogAPI(repo, blog), {
        responseType: 'text',
        headers: MARKDOWN_HTML_HEADERS,
      })
      .pipe(retry(1));
  }

  getReadmeMeta() {
    return this.config.readmeMeta$.pipe(
      switchMap(({ repo, path }) =>
        this.getMarkdownSource(repo, path).pipe(
          map((source) => ({
            source: source,
            repo: repo,
            path: path,
          })),
        ),
      ),
    );
  }

  private getMarkdownSource(repo: string, path: string) {
    return this.http
      .get(markdownAPI(repo, path), {
        responseType: 'text',
        headers: MARKDOWN_HTML_HEADERS,
      })
      .pipe(retry(1));
  }
}
