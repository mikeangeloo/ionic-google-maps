import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoogleMapsCapacitorPage } from './google-maps-capacitor.page';

const routes: Routes = [
  {
    path: '',
    component: GoogleMapsCapacitorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoogleMapsCapacitorPageRoutingModule {}
