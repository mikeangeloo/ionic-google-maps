import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoogleMapsJavascriptPage } from './google-maps-javascript.page';

const routes: Routes = [
  {
    path: '',
    component: GoogleMapsJavascriptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoogleMapsJavascriptPageRoutingModule {}
