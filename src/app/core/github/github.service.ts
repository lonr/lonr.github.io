import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { orderedMergeMap } from 'src/utils/ordered-merge-map';
import { ConfigService } from '../config/config.service';

import { getRepoAPI, PORTFOLIO_HEADERS, Repo } from './github';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  constructor(private config: ConfigService, private http: HttpClient) {}

  getPortfolioLength(): Observable<number> {
    return this.config.portfolioRepos$.pipe(map((repos) => repos.length));
  }

  getPortfolio() {
    return this.config.portfolioRepos$.pipe(
      orderedMergeMap((repoName) =>
        this.http
          .get<Repo>(getRepoAPI(repoName), {
            headers: PORTFOLIO_HEADERS,
          })
          .pipe(retry(1)),
      ),
    );
  }
}
