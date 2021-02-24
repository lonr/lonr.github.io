import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Repo } from 'src/app/core/github/github';
import { GithubService } from 'src/app/core/github/github.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
  portfolio: Repo[] = [];
  badges: Array<{
    // check if the badge should be added
    check: (repo: Repo) => boolean;
    type: 'a' | 'span';
    getHref?: (repo: Repo) => string;
    icon: string;
    getContent: (repo: Repo) => string;
  }> = [
    {
      check: (repo: Repo) => repo.stargazers_count > 0,
      type: 'a',
      icon: 'star',
      getHref: (repo: Repo) => repo.html_url + '/stargazers',
      getContent: (repo: Repo) => '' + repo.stargazers_count,
    },
    {
      check: (repo: Repo) => repo.forks_count > 0,
      type: 'a',
      icon: 'repo-forked',
      getHref: (repo: Repo) => repo.html_url + '/network/members',
      getContent: (repo: Repo) => '' + repo.forks_count,
    },
    {
      check: (repo: Repo) => repo.license !== null,
      type: 'span',
      icon: 'law',
      getContent: (repo: Repo) => repo.license?.spdx_id ?? 'no license?',
    },
    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      check: (repo: Repo) => repo.has_issues && repo.open_issues_count! > 0,
      type: 'a',
      icon: 'issue-opened',
      getHref: (repo: Repo) => repo.html_url + '/issues',
      getContent: (repo: Repo) => '' + repo.open_issues_count,
    },
  ];

  constructor(private github: GithubService) {
    this.github.getPortfolio().subscribe((repo: Repo) => {
      this.portfolio.push(repo);
    });
  }

  ngOnInit(): void {}
}
