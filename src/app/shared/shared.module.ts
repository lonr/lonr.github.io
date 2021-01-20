import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {IconDirective} from './icon/icon.directive';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [IconDirective, LoaderComponent],
  imports: [CommonModule],
  exports: [IconDirective, LoaderComponent],
})
export class SharedModule {}
