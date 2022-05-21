import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoogleMapsJavascriptPageRoutingModule } from './google-maps-javascript-routing.module';

import { GoogleMapsJavascriptPage } from './google-maps-javascript.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapsJavascriptPageRoutingModule
  ],
  declarations: [GoogleMapsJavascriptPage]
})
export class GoogleMapsJavascriptPageModule {}
