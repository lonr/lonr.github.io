import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { ConfigService } from 'src/app/core/config/config.service';
import {
  isFullURL,
  getFullURL,
  getBlobBaseURL,
  MarkdownMeta,
  isAbsolute,
  isLinkableMd,
} from './markdown';
import { dirname, join } from 'src/utils/path';

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
})
export class MarkdownComponent implements OnInit {
  @ViewChild('template', { static: true }) templateElementRef!: ElementRef<HTMLTemplateElement>;
  template!: HTMLTemplateElement;
  @Input() markdownMeta$!: Observable<MarkdownMeta>;

  markdown?: HTMLElement;

  constructor(
    private config: ConfigService,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.markdownMeta$.subscribe((markdownMeta) => {
      this.renderMarkdown(markdownMeta);
    });
  }

  private renderMarkdown(markdownMeta: MarkdownMeta) {
    this.template = this.templateElementRef.nativeElement;
    this.template.innerHTML = markdownMeta.source;
    this.markdown = this.template.content.firstElementChild as HTMLElement;

    // const path = markdownMeta.path ?? (this.markdown.dataset.path as string);
    this.fix(this.markdown, markdownMeta);
    // this.buildToc(this.markdown);

    this.renderer.appendChild(this.el.nativeElement, this.template.content);
  }

  private fix(element: HTMLElement, markdownMeta: MarkdownMeta) {
    this.fixImages(element, markdownMeta);
    this.fixHrefs(element, markdownMeta);
  }

  private fixHrefs(element: HTMLElement, markdownMeta: MarkdownMeta) {
    const anchors = element.getElementsByTagName('a');

    for (const anchor of anchors) {
      const hrefAttr = anchor.getAttribute('href');
      if (!hrefAttr || isFullURL(hrefAttr)) {
        continue;
      }
      if (hrefAttr.startsWith('#')) {
        this.fixFragment(anchor, markdownMeta);
      } else {
        this.fixShortHref(anchor, markdownMeta);
      }
    }
    // this.fixAnchors(element);
  }

  private fixFragment(anchor: HTMLAnchorElement, markdownMeta: MarkdownMeta) {
    // for (const anchor of anchors) {
    //   const hrefAttr = anchor.getAttribute('href');
    //   if (hrefAttr?.startsWith('#')) {
    //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   } else if (isFullURL(hrefAttr!)) {
    //   }
    // }
  }

  private fixShortHref(anchor: HTMLAnchorElement, { path, repo, href: pageURL }: MarkdownMeta) {
    const hrefAttr = anchor.getAttribute('href') as string;
    // Let all absolute hrefs be blob URLs
    if (isAbsolute(hrefAttr)) {
      const base = getBlobBaseURL(repo);
      const href = getFullURL(hrefAttr, '', base);
      anchor.setAttribute('href', href);
    } else if (isLinkableMd(hrefAttr, path, repo)) {
      const origin = new URL(pageURL).origin;
      const pathFromBlog = join(path, hrefAttr).replace(/^blog/, '');
      if (pathFromBlog.startsWith('blogs/')) {
      } else {
        // const href = getFullURL(pathFromBlog, )
      }
    } else {
      const base = getBlobBaseURL(repo);
      const href = getFullURL(hrefAttr, path, base);
      anchor.setAttribute('href', href);
    }
  }

  private fixImages(element: HTMLElement, { path, repo }: MarkdownMeta) {
    const images = element.getElementsByTagName('img');
    for (const image of images) {
      const srcAttr = image.getAttribute('src');
      if (srcAttr && !isFullURL(srcAttr)) {
        // There is a `/` at the end!
        const base = `https://github.com/${repo}/raw/master/`;
        // const completeSrc = completeImageSrc(src ?? '', this.path!, base);
        const src = getFullURL(srcAttr, path, base);
        image.setAttribute('src', src);

        // Fix parent anchor element's href
        const parent = image.parentElement;
        if (parent?.tagName?.toLowerCase() === 'a') {
          const base = getBlobBaseURL(repo);
          const src = getFullURL(srcAttr, path, base);
          parent.setAttribute('href', src);
        }
      }
    }
  }

  private buildToc(element: HTMLElement) {
    // this.t
  }
}
