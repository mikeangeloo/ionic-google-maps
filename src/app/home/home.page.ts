import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  radiusLabel: any;
  constructor(
    private navCtrl: NavController
  ) {
  }



}
