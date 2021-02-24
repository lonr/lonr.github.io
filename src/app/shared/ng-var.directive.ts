import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

// copied from https://stackoverflow.com/a/43172992/5783347
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngVar]',
})
export class NgVarDirective {
  @Input()
  set ngVar(context: any) {
    this.context.$implicit = this.context.ngVar = context;
    this.updateView();
  }

  context: any = {};

  constructor(private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) {}

  updateView() {
    this.vcRef.clear();
    this.vcRef.createEmbeddedView(this.templateRef, this.context);
  }
}
