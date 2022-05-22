import {Component, ElementRef, ViewChild} from '@angular/core';
declare let google;

import { Geolocation } from '@capacitor/geolocation';
import {LatLng} from '@capacitor/google-maps/dist/typings/definitions';
const TravelMode = google.maps.TravelMode;




@Component({
  selector: 'app-google-maps-javascript',
  templateUrl: './google-maps-javascript.page.html',
  styleUrls: ['./google-maps-javascript.page.scss'],
})

export class GoogleMapsJavascriptPage {

  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  map: any;
  latitude: number;
  longitude: number;

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  infoWindows: any = [];
  markers: any = [
    {
      title: 'National Art Gallery',
      latitude: '-17.824991',
      longitude: '31.049295'
    },
    {
      title: 'West End Hospital',
      latitude: '-17.820987',
      longitude: '31.039682'
    },
    {
      title: 'Dominican Convent School',
      latitude: '-17.822647',
      longitude: '31.052042'
    }
  ];

  circle = null;
  markerC = null;

  constructor() {}

  ionViewDidEnter() {
    this.getCurrentCoords();
  }

  getCurrentCoords() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    Geolocation.getCurrentPosition(options).then((res) => {
      this.latitude = res.coords.latitude;
      this.longitude = res.coords.longitude;
      console.log('current locations cords --->', this.latitude, this.longitude);
      this.showMap(this.latitude, this.longitude);
    }, error => {
      if (error.code == 1) {
        // Forzamos a colocar playa del carmen
        this.latitude = 20.6338054;
        this.longitude = -87.085475;

        //this.getAddressFromGeoCoords();

        this.showMap(this.latitude, this.longitude);
      }

    });
  }

  showMap(latitude, longitude) {
    const currentLocation = new google.maps.LatLng(latitude, longitude);
    const options = {
      center: currentLocation,
      zoom: 15,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    const markerCurrentPosition = new google.maps.Marker({
      position: new google.maps.LatLng(this.latitude, this.longitude),
      map: this.map,
      draggable: false,
      // icon: {
      //   url: 'https://app.econogruas.com/econogruas/assets/img/static/remolque-azul.svg',
      //   size: new google.maps.Size(36, 50),
      //   scaledSize: new google.maps.Size(36, 50),
      //   anchor: new google.maps.Point(0, 50)
      // },
      title: 'test',
    });

    this.addInfoWindowToMarker(markerCurrentPosition);

    //this.addMarkersToMap(this.markers);


    // setTimeout(() => {
    //   this.directionsDisplay.setMap(this.map);
    //   const _destination = new google.maps.LatLng(20.6328511, -87.0655493);
    //   this.calculateAndDisplayDistance(currentLocation, _destination);
    //
    // }, 400);

    this.addCircleRadius();
  }

  initDrawingTools() {
    // Circle
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingControlOptions: {
        drawingModes: ['marker', 'circle']
      }
    });
    drawingManager.setMap(this.map);
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
      if (event.type == 'circle') {
        console.log('circle --->', event);
        const center = event.overlay.getCenter();
        this.circle = {
          radius: event.overlay.getRadius(),
          center: {
            lat: center.lat(),
            lng: center.lng()
          },
          overlay: event.overlay
        };
      } else if (event.type == 'marker') {
        const position = event.overlay.position;
        this.markerC = {
          center: {
            lat: position.lat(),
            lng: position.lng()
          }
        };
        const isInRadious = google.maps.geometry.spherical.computeDistanceBetween(position, this.circle.overlay.getCenter()) <= this.circle.radius;
        console.log('isInRadious --->', isInRadious);
      } else {
        console.log('Something goes wrong');
      }
    });
  }

  addCircleRadius() {
    const _circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: {
        lat: this.latitude,
        lng: this.longitude
      },
      radius: 1000,
      //editable: true,
      //draggable: false
    });


    console.log('circle bounds --->', _circle.getRadius());
    let circleLimitMarker = google.maps.geometry.spherical.computeOffset(_circle.getCenter(), 1000, 90, 0 );
    console.log('circle coord --->', _circle.getCenter().lat());
    console.log('computeOffset --->', circleLimitMarker.lat());
    const markerCurrentPosition = new google.maps.Marker({
      position: circleLimitMarker,
      map: this.map,
      draggable: true,
    });

    let distance = google.maps.geometry.spherical.computeDistanceBetween(_circle.getCenter(), markerCurrentPosition.getPosition());
    console.log('distance between circle and marker --->', distance);

    markerCurrentPosition.addListener('drag', (event) => {
      let distance2 = google.maps.geometry.spherical.computeDistanceBetween(_circle.getCenter(), markerCurrentPosition.getPosition());
      _circle.setRadius(distance2);
    });
  }

  addMarkersToMap(markers) {
    for (const marker of markers) {
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      const mapMarker = new google.maps.Marker({
        position,
        title: marker.title,
        latitude: marker.latitude,
        longitude: marker.longitude
      });

      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }

  addInfoWindowToMarker(marker) {
    let _latitude;
    let _longitude;
    _latitude = marker.position?.lat() ? marker.position.lat() : marker.latitude;
    _longitude = marker.position?.lng() ? marker.position.lng() : marker.longitude;

    console.log('addInfoWindowToMarker --->', marker);
    const infoWindowContent =
      `<div id="content">
          <h2 id="firstHeading" class="firstHeading">${marker.title}</h2>
          <p>Latitude: ${_latitude}</p>
          <p>Longitude: ${_longitude}</p>
          <ion-button id="navigate">Navigate</ion-button>
      </div>`;

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById('navigate').addEventListener('click', () => {
          console.log('navigate button clicked');
          // code to navigate using google maps app or new tab in browser
          window.open('https://www.google.com/maps/dir/?api=1&destination=' + marker.latitude + ',' + marker.longitude);
        });
      });
    });
    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    for(const window of this.infoWindows) {
      window.close();
    }
  }

  calculateAndDisplayDistance(origin: LatLng, destination: LatLng) {
    this.directionsService.route({
      origin,
      destination,
      travelMode: TravelMode.DRIVING
    }, (response, status) => {
      console.log('calculateAndDisplayDistance --->', response);
      if (status === 'OK') {
        //this.directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to --->', status);
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
