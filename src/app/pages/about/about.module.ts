import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MarkdownModule } from 'src/app/widgets/markdown/markdown.module';


@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    SharedModule,
    MarkdownModule,
    AboutRoutingModule
  ]
})
export class AboutModule { }
