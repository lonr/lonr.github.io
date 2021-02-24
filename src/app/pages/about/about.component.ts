import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/core/config/config.service';
import { GithubService } from 'src/app/core/github/github.service';
import { MarkdownMeta } from 'src/app/widgets/markdown/markdown';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  readmeMeta$!: Observable<MarkdownMeta>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private github: GithubService,
  ) {
  }

  ngOnInit(): void {
    this.readmeMeta$ = this.github.getReadmeMeta();
  }
}
