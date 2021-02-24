import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogComponent } from './blog/blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { PaginationModule } from 'src/app/widgets/pagination/pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MarkdownModule } from 'src/app/widgets/markdown/markdown.module';
import { UtterancesModule } from 'src/app/widgets/utterances/utterances.module';

@NgModule({
  declarations: [BlogComponent, BlogListComponent],
  imports: [
    CommonModule,
    SharedModule,
    PaginationModule,
    MarkdownModule,
    UtterancesModule,
    BlogsRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BlogsModule {}
