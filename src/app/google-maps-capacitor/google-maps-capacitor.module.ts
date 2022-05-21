import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoogleMapsCapacitorPageRoutingModule } from './google-maps-capacitor-routing.module';

import { GoogleMapsCapacitorPage } from './google-maps-capacitor.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsCapacitorPageRoutingModule
  ],
  declarations: [GoogleMapsCapacitorPage]
})
export class GoogleMapsCapacitorPageModule {}
