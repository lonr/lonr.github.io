import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfigService } from 'src/app/core/config/config.service';
import { GithubService } from 'src/app/core/github/github.service';
import { MarkdownMeta } from 'src/app/widgets/markdown/markdown';
import { buildIssueTerm } from '../blogs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  blogMeta$?: Observable<MarkdownMeta>;
  utterancesConfig: { [key: string]: string } | null = null;

  constructor(
    private config: ConfigService,
    private github: GithubService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.blogMeta$ = combineLatest([this.config.blogRepo$, this.route.paramMap]).pipe(
      switchMap(([repo, paramsMap]) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const id = paramsMap.get('id')!;
        this.utterancesConfig = { repo, 'issue-term': buildIssueTerm(id)};
        return this.github.getBlogMeta(id);
      }),
    );
  }

  //   repo="lonr/lonr.github.io"
  // issue-term="[ENTER TERM HERE]"
  // label="comments"
  // theme="github-light"
}
