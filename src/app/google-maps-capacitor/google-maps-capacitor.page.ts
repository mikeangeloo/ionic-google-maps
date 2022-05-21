import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, MapType} from '@capacitor/google-maps';

@Component({
  selector: 'app-google-maps-capacitor',
  templateUrl: './google-maps-capacitor.page.html',
  styleUrls: ['./google-maps-capacitor.page.scss'],
})
export class GoogleMapsCapacitorPage implements OnInit, AfterViewInit {

  @ViewChild('map') mapRef: ElementRef<HTMLElement>;
  newMap: GoogleMap;
  center: any = {
    lat: 20.6567627,
    lng: -87.0899625
  };

  markerId: string;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.createMap();
  }

  async createMap() {
    this.newMap = await GoogleMap.create({
      id: 'capacitor-google-maps',
      element: this.mapRef.nativeElement,
      apiKey: 'AIzaSyC0fdAWXhp-rU-n5_73ycql5A4vMBTvCvQ',
      config: {
        center: this.center,
        zoom: 13,
      }
    });

    // await this.newMap.setPadding({
    //   top: 50,
    //   left: 50,
    //   right: 50,
    //   bottom: 50
    // });

    //await this.newMap.setMapType(MapType.Terrain);

    //await this.addMarker(this.center.lat, this.center.lng);
    await this.addMarkers(this.center.lat, this.center.lng);
    await this.addListeners();
  }

  async addMarker(lat, lng) {
    //if (this.markerId) this.removeMarker();
    this.markerId = await this.newMap.addMarker({
      coordinate: {
        lat: lat,
        lng: lng
      },
      //title: ,
      draggable: true
    });
  }

  async addMarkers(lat, lng) {
    await this.newMap.addMarkers([
      {
        coordinate: {
          lat: lat,
          lng: lng
        },
        //title: ,
        draggable: true
      },
      {
        coordinate: {
          lat: 20.6564763,
          lng: -87.0757037
        },
        //title: ,
        draggable: true
      }
    ]);
  }

  async removeMarker(id?) {
    await this.newMap.removeMarker(id? id: this.markerId);
  }

  async addListeners() {
    await this.newMap.setOnMarkerClickListener((event) => {
      console.log('setOnMarkerClickListener -->', event);
      this.removeMarker(event.markerId);
    });

    await this.newMap.setOnMapClickListener((event) => {
      console.log('setOnMapClickListener --->', event);
      this.addMarker(event.latitude, event.longitude);
    });

    await this.newMap.setOnMyLocationButtonClickListener((event) => {
      console.log('setOnMyLocationButtonClickListener --->', event);
      this.addMarker(event.latitude, event.longitude);
    });

    await this.newMap.setOnMyLocationClickListener((event) => {
      console.log('setOnMyLocationClickListener --->', event);
      this.addMarker(event.latitude, event.longitude);
    });

  }

}
