import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'home',
    },
    {
      path: 'home',
      loadComponent: () =>
        import('./pages/cover-page/cover-page.component').then((mod) => mod.CoverPageComponent),
    },
    {
      path: '**',
      pathMatch: 'full',
      redirectTo: 'home',
    },
  ];
