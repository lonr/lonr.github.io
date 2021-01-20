import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { BlogsComponent } from './blogs/blogs.component';

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
        component: BlogsComponent,
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
