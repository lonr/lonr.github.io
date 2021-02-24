import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogComponent } from './blog/blog.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'blogs',
        redirectTo: 'blogs/1',
        pathMatch: 'full'
      },
      {
        path: 'blogs/:page',
        component: BlogListComponent,
      },
      {
        path: 'blog/:id',
        component: BlogComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogsRoutingModule {}
