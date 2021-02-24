import { DOCUMENT, Location } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Href from '@lonr/href';
import { combineLatest, Observable, of } from 'rxjs';
import { ConfigService } from 'src/app/core/config/config.service';
import { TocData, TocService } from 'src/app/layout/toc/toc.service';
import { inSamePage } from 'src/utils/href-helpers';
import { fix, MarkdownMeta } from './markdown';

// Heading to be transformed to TOC heading
type MarkdownHeadingElement = HTMLHeadingElement & { firstElementChild: HTMLAnchorElement };

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
})
export class MarkdownComponent implements OnInit, OnDestroy {
  @ViewChild('template', { static: true }) templateElementRef!: ElementRef<HTMLTemplateElement>;
  template!: HTMLTemplateElement;
  @Input() markdownMeta!: MarkdownMeta;

  markdown?: HTMLElement;

  constructor(
    private config: ConfigService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private toc: TocService,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.renderMarkdown(this.markdownMeta);
  }

  ngOnDestroy(): void {
    this.toc.updateTocData([]);
  }

  // https://stackoverflow.com/a/62783788/5783347
  @HostListener('click', ['$event'])
  public handleClick(event: Event): void {
    // https://stackoverflow.com/questions/28900077/why-is-event-target-not-element-in-typescript
    if (event.target instanceof Element) {
      let element: HTMLAnchorElement | null = null;
      for (let target of event.composedPath()) {
        if (target instanceof HTMLAnchorElement) {
          element = target;
        }
      }
      if (element?.classList.contains('on-site-link')) {
        event.preventDefault();
        if (element.href !== '') {
          // PlatformLocation instead?
          if (inSamePage(this.document.location.href, element.href)) {
            let hash = new Href(element.href).hash;
            if (hash !== '') {
              hash = `user-content-${hash.slice(1)}`;

              let target = this.document.getElementById(decodeURIComponent(hash));
              if (target !== null) {
                history.pushState(null, '', element.href);
                target.scrollIntoView();
              }
            }
          } else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.router.navigateByUrl(`${decodeURI(element.getAttribute('href')!)}`);
          }
        }
      }
    }
  }

  private renderMarkdown(markdownMeta: MarkdownMeta) {
    this.template = this.templateElementRef.nativeElement;
    this.template.innerHTML = markdownMeta.source;
    this.markdown = this.template.content.firstElementChild as HTMLElement;

    fix(this.markdown, markdownMeta);
    // update toc component next cycle
    // https://blog.angular-university.io/angular-debugging/
    setTimeout(() => {
      this.toc.updateTocData(this.generateTocData());
    }, 0);

    this.renderer.appendChild(this.el.nativeElement, this.template.content);
    this.route.fragment.subscribe((fragment) => {
      setTimeout(() => {
        this.document
          .getElementById(decodeURIComponent(`user-content-${fragment}`))
          ?.scrollIntoView();
      }, 0);
    });
  }

  private generateTocData() {
    const startLevel = 2;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [...this.markdown!.querySelectorAll('h2, h3')]
      .filter(
        (heading): heading is MarkdownHeadingElement =>
          heading.querySelector('a:first-child') !== null,
      )
      .map((heading) => {
        const dataItem: TocData[number] = { level: 0, href: new Href(), innerHTML: '' };
        const headingClone = heading.cloneNode(true) as MarkdownHeadingElement;
        dataItem.level = parseInt(heading.tagName.slice(1));
        dataItem.href.href = headingClone.firstElementChild.getAttribute('href') ?? '';
        headingClone.removeChild(headingClone.firstElementChild);
        dataItem.innerHTML = headingClone.innerHTML;
        return dataItem;
      })
      .reduce((acc, curr) => {
        let p = acc;
        for (let depth = curr.level; depth > startLevel; depth -= 1) {
          if (p[p.length - 1].subTocData === undefined) {
            p[p.length - 1].subTocData = [];
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          p = p[p.length - 1].subTocData!;
        }
        p.push(curr);
        return acc;
      }, [] as TocData);
  }
}
