import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-utterances',
  templateUrl: './utterances.component.html',
  styleUrls: ['./utterances.component.scss'],
})
export class UtterancesComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  @Input() config: { [k: string]: string } = {};

  ngOnInit(): void {
    this.config = {
      ...{
        src: 'https://utteranc.es/client.js',
        theme: "github-light",
        crossorigin: 'anonymous',
        async: '',
      },
      ...this.config,
    };
  }

  ngAfterViewInit(): void {
   this.insertScript();
  }
  insertScript() {
    const script = this.renderer.createElement('script') as HTMLScriptElement;
    Object.entries(this.config).forEach(([k, v]) => {
      this.renderer.setAttribute(script, k, v);
    });
    this.renderer.appendChild(this.el.nativeElement, script);
  }

  ngOnDestroy(): void {
    let headFirstEleChild = this.document.head.firstElementChild;
    if (
      headFirstEleChild &&
      headFirstEleChild.tagName === 'STYLE' &&
      headFirstEleChild.innerHTML.includes('utterances')
    ) {
      this.document.head.removeChild(headFirstEleChild);
    }
  }
}
