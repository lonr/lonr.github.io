import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {IconDirective} from './icon/icon.directive';
import { LoaderComponent } from './loader/loader.component';
import { NgVarDirective } from './ng-var.directive';

@NgModule({
  declarations: [IconDirective, LoaderComponent, NgVarDirective],
  imports: [CommonModule],
  exports: [IconDirective, LoaderComponent, NgVarDirective],
})
export class SharedModule {}
