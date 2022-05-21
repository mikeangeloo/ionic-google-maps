import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'google-maps-javascript',
    loadChildren: () => import('./google-maps-javascript/google-maps-javascript.module').then( m => m.GoogleMapsJavascriptPageModule)
  },
  {
    path: 'google-maps-capacitor',
    loadChildren: () => import('./google-maps-capacitor/google-maps-capacitor.module').then( m => m.GoogleMapsCapacitorPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
