import {Component, ViewChild} from '@angular/core';
import {NavController} from '@ionic/angular';
import {GoogleMapsService} from '../modules/google-maps-javascript/services/google-maps.service';
import {GoogleMapsJavascriptComponent} from '../modules/google-maps-javascript/components/google-maps-javascript.component';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('googleMapJs', {static: false}) googleMapJs: GoogleMapsJavascriptComponent;
  constructor(
    private navCtrl: NavController,
    private googleServ: GoogleMapsService
  ) {
  }

  ionViewDidEnter() {
    // this.googleServ.currentMarkerLocation$.subscribe(res => {
    //   console.log('currentMarkerLocation$ --->', res);
    //   if (res) {
    //     this.googleMapJs.calculateDistance(
    //       {
    //         lat: this.googleServ.currentMarkerLocation$.value.position.lat,
    //         long: this.googleServ.currentMarkerLocation$.value.position.long
    //       },
    //       {
    //         lat: 20.6568434,
    //         long: -87.0942691
    //       }
    //     );
    //   }
    // });


  }



}
