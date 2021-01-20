import { Directive, ElementRef, HostBinding, Input, OnInit, Renderer2 } from '@angular/core';
import octions from '@primer/octicons';

@Directive({
  selector: '[appIcon]',
})
export class IconDirective implements OnInit {
  @Input() appIcon = '';
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    // can't use something like `@HostBinding('attr') attr = {class: "octions"}` or `<svg [attr]="attr"><svg>` now
    // https://github.com/angular/angular/issues/13940
    this.replaceWithIcon(this.appIcon);
  }

  // Absolutely not the Angular's way
  // Replace the host with a new <svg>, copy classes from the host to the new one
  private replaceWithIcon(iconName: string) {
    const oldSvg = this.el.nativeElement as HTMLElement;
    const classes = oldSvg.classList;
    const template: HTMLTemplateElement = this.renderer.createElement('template');
    template.innerHTML = octions[iconName].toSVG();
    const newSvg = template.content.firstElementChild as SVGImageElement;
    newSvg.classList.add(...classes.values());
    oldSvg.replaceWith(template.content);
  }
}
