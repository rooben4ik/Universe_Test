import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
      path: '',
      redirectTo: 'documents',
      pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'signin',
        loadComponent: () => import('./signin/signin.component').then(m => m.SigninComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./documents/documents.component').then(m => m.DocumentsComponent)
      },
      {
        path: 'document/:id',
        loadComponent: () => import('./pdf-viewer/pdf-viewer.component').then(m => m.PdfViewerComponent)
      }
  ];