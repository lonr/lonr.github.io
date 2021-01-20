import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GITHUB_CONFIG, GITHUB_DI_CONFIG, Repo } from './github';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: GITHUB_CONFIG,
          useValue: GITHUB_DI_CONFIG,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(GithubService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return portfolio list length', () => {
    service.getPortfolioLength().subscribe((length: number) => {
      expect(length).toBe(GITHUB_DI_CONFIG.RAW_PORTFOLIO.length);
    });
  });

  it('should get remote portfolio list', () => {
    const repo0Res = JSON.parse(`{
          "id": 46569238,
          "node_id": "MDEwOlJlcG9zaXRvcnk0NjU2OTIzOA==",
          "name": "lonr.github.io",
          "full_name": "lonr/lonr.github.io",
          "private": false,
          "html_url": "https://github.com/lonr/lonr.github.io",
          "description": null,
          "fork": false,
          "url": "https://api.github.com/repos/lonr/lonr.github.io",
          "created_at": "2015-11-20T15:13:56Z",
          "updated_at": "2019-01-07T14:11:39Z",
          "pushed_at": "2019-01-07T14:11:38Z",
          "git_url": "git://github.com/lonr/lonr.github.io.git",
          "ssh_url": "git@github.com:lonr/lonr.github.io.git",
          "clone_url": "https://github.com/lonr/lonr.github.io.git",
          "svn_url": "https://github.com/lonr/lonr.github.io",
          "homepage": "https://lonr.github.io",
          "size": 327,
          "stargazers_count": 2,
          "watchers_count": 2,
          "language": "JavaScript",
          "has_issues": true,
          "has_projects": true,
          "has_downloads": true,
          "has_wiki": false,
          "has_pages": true,
          "forks_count": 0,
          "mirror_url": null,
          "archived": false,
          "disabled": false,
          "open_issues_count": 2,
          "license": null,
          "forks": 0,
          "open_issues": 2,
          "watchers": 2,
          "default_branch": "master",
          "temp_clone_token": null,
          "network_count": 0,
          "subscribers_count": 2
        }`);
    const repo1Res = JSON.parse(`{
          "id": 94361062,
          "node_id": "MDEwOlJlcG9zaXRvcnk5NDM2MTA2Mg==",
          "name": "zici-webext",
          "full_name": "zicijs/zici-webext",
          "private": false,
          "html_url": "https://github.com/zicijs/zici-webext",
          "description": null,
          "fork": false,
          "url": "https://api.github.com/repos/zicijs/zici-webext",
          "created_at": "2017-06-14T18:25:56Z",
          "updated_at": "2017-10-26T05:19:37Z",
          "pushed_at": "2017-06-15T05:34:10Z",
          "git_url": "git://github.com/zicijs/zici-webext.git",
          "ssh_url": "git@github.com:zicijs/zici-webext.git",
          "clone_url": "https://github.com/zicijs/zici-webext.git",
          "svn_url": "https://github.com/zicijs/zici-webext",
          "homepage": null,
          "size": 33,
          "stargazers_count": 0,
          "watchers_count": 0,
          "language": "TypeScript",
          "has_issues": true,
          "has_projects": true,
          "has_downloads": true,
          "has_wiki": true,
          "has_pages": false,
          "forks_count": 0,
          "mirror_url": null,
          "archived": false,
          "disabled": false,
          "open_issues_count": 0,
          "license": {
            "key": "gpl-3.0",
            "name": "GNU General Public License v3.0",
            "spdx_id": "GPL-3.0",
            "url": "https://api.github.com/licenses/gpl-3.0",
            "node_id": "MDc6TGljZW5zZTk="
          },
          "forks": 0,
          "open_issues": 0,
          "watchers": 0,
          "default_branch": "master",
          "temp_clone_token": null,
          "network_count": 0,
          "subscribers_count": 1
        }`);

    const repos: Repo[] = [];
    service.getPortfolio().subscribe(
      (repo) => repos.push(repo),
      fail,
      () => {
        expect(repos.length).toBe(2);
        expect(repos[0].full_name).toBe('lonr/lonr.github.io');
      },
    );

    const req0 = httpTestingController.expectOne(GITHUB_DI_CONFIG.RAW_PORTFOLIO[0]);
    const req1 = httpTestingController.expectOne(GITHUB_DI_CONFIG.RAW_PORTFOLIO[1]);
    req1.flush(repo1Res);
    req0.flush(repo0Res);
  });
});
