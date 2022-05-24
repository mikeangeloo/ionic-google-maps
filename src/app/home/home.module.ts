import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {GoogleMapsJavascriptModule} from '../modules/google-maps-javascript/google-maps-javascript.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    GoogleMapsJavascriptModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
