import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: 'portfolio',
    loadChildren: () => import('./pages/portfolio/portfolio.module').then((m) => m.PortfolioModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then((m) => m.AboutModule),
  },
  {
    path: '',
    loadChildren: () => import('./pages/homepage/homepage.module').then((m) => m.HomepageModule),
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./pages/blogs/blogs.module').then((m) => m.BlogsModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      // enableTracing: true,
      // anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
