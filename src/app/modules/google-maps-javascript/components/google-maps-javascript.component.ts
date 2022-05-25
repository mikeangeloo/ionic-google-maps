import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MarkerI} from '../interfaces/marker.interface';
import {Geolocation} from '@capacitor/geolocation';
import {GoogleMapsService} from '../services/google-maps.service';
import {MapsIconI} from '../interfaces/maps-icon.interface';
import {DecimalPipe} from '@angular/common';
import {DirectionsResultI} from '../interfaces/directions-result.interface';

declare let google;
const TravelMode = google.maps.TravelMode;

@Component({
  selector: 'app-google-maps-javascript',
  templateUrl: './google-maps-javascript.component.html',
  styleUrls: ['./google-maps-javascript.component.scss'],
})
export class GoogleMapsJavascriptComponent implements OnInit, AfterViewInit {

  //region ATTRIBUTES
  @Input() markers: MarkerI[];
  @Input() showMarkers = false;

  @Input() infoWindows: any = [];
  @Input() showLimitCircle = false;
  @Input() currMarkerDraggable = false;
  @Input() currMarkerIcon: MapsIconI;

  @ViewChild('googleMapsJs', {read: ElementRef, static: false}) mapRef: ElementRef;
  googleMap: any;
  currentLat: number;
  currentLong: number;

  limitCircle = null;
  circleBundleMarker = null;
  limitLabelInfo = null;

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  //endregion

  constructor(
    private googleMapsServ: GoogleMapsService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initWithCurrentLocation();
  }

  //region PUBLIC METHODS
  public initWithCurrentLocation() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    Geolocation.getCurrentPosition(options).then((res) => {
      this.currentLat = res.coords.latitude;
      this.currentLong = res.coords.longitude;
      console.log('current locations cords --->', this.currentLat, this.currentLong);
      this.initMap(this.currentLat, this.currentLong);
    }, error => {
      if (error.code == 1) {
        // Forzamos a colocar playa del carmen
        this.currentLat = 20.6338054;
        this.currentLong = -87.085475;

        //this.getAddressFromGeoCoords();

        this.initMap(this.currentLat, this.currentLong);
      }
    });
  }

  public calculateDistance(origin: { lat: number; long: number }, destination: { lat: number; long: number }) {

    console.log('execute calculateDistance');
    this.directionsService.route({
      origin: new google.maps.LatLng(origin.lat, origin.long) ,
      destination: new google.maps.LatLng(destination.lat, destination.long),
      travelMode: TravelMode.DRIVING
    }, (response, status) => {
      console.log('calculateAndDisplayDistance --->', response);
      if (status === 'OK') {
        this.initDirections(response);
      } else {
        console.log('Directions request failed due to --->', status);
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  public initDirections(test: DirectionsResultI) {
    const currentLocation = new google.maps.LatLng(this.currentLat, this.currentLong);
    const options = {
      center: currentLocation,
      zoom: 15,
      disableDefaultUI: true
    };
    this.googleMap = new google.maps.Map(this.mapRef.nativeElement, options);
    this.directionsDisplay.setMap(this.googleMap);
    this.directionsDisplay.setDirections(test);
    //this.directionsDisplay.setMap(null);
  }

  public addMarkersToMap(markers: MarkerI[]) {
    for (const marker of markers) {
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      const mapMarker = new google.maps.Marker({
        position,
        icon: marker.icon
      });

      mapMarker.setMap(this.googleMap);
      //this.addInfoWindowToMarker(mapMarker);
    }
  }

  public addInfoWindowToMarker(marker) {
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
      infoWindow.open(this.googleMap, marker);

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

  public closeAllInfoWindows() {
    for(const window of this.infoWindows) {
      window.close();
    }
  }

  //endregion

  //region PRIVATE METHODS
  private async initMap(latitude, longitude) {
    const currentLocation = new google.maps.LatLng(latitude, longitude);
    const options = {
      center: currentLocation,
      zoom: 15,
      disableDefaultUI: true
    };
    this.googleMap = new google.maps.Map(this.mapRef.nativeElement, options);

    const markerCurrentPosition = new google.maps.Marker({
      position: currentLocation,
      map: this.googleMap,
      draggable: this.currMarkerDraggable,
      icon: this.currMarkerIcon
    });

    let _res = await this.googleMapsServ.getReverseCoordsData(currentLocation.lat(), currentLocation.lng());
    this.googleMapsServ.currentMarkerLocation$.next({
      position: {
        lat: currentLocation.lat(),
        long: currentLocation.lng()
      },
      geodata: (_res.ok && _res.data) ? _res.data : null
    });

    if (this.currMarkerDraggable) {
      markerCurrentPosition.addListener('dragend', async (event) => {
        let _res = await this.googleMapsServ.getReverseCoordsData(event.latLng.lat(), event.latLng.lng());
        this.googleMapsServ.currentMarkerLocation$.next({
          position: {
            lat: event.latLng.lat(),
            long: event.latLng.lng()
          },
          geodata: (_res.ok && _res.data) ? _res.data : null
        });
      });
    }

    if (this.showLimitCircle) {
      this.initCircleRadius(this.currentLat, this.currentLong, 1000);
    }
  }

  private initCircleRadius(centerLat: number, centerLong: number, radius: number) {
    this.limitCircle = new google.maps.Circle({
      strokeColor: '#233bd5',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#233bd5',
      fillOpacity: 0.35,
      map: this.googleMap,
      center: {
        lat: centerLat,
        lng: centerLong
      },
      radius,
      draggable: false
    });
    console.log('circle bounds --->', this.limitCircle.getRadius());

    if (radius < 999) {
      this.limitLabelInfo = `Radio ${this.decimalPipe.transform(radius)} metro(s)`;
    } else if (radius >= 1000) {
      this.limitLabelInfo = `Radio  ${this.decimalPipe.transform(radius)} Kilómetro(s)`;
    }
    this.googleMapsServ.limitRadius$.next({
      distance: radius,
      infoLabel: this.limitLabelInfo
    });

    const circleLimitMarker = this.googleMapsServ.geometrySphericalCalc('computeOffset', this.limitCircle.getCenter(), null, radius, 90, 0);

    this.circleBundleMarker = new google.maps.Marker({
      position: circleLimitMarker,
      map: this.googleMap,
      draggable: true,
    });

    this.circleBundleMarker.addListener('drag', (event) => {
      const distance2 = this.googleMapsServ.geometrySphericalCalc('computeDistanceBetween', this.limitCircle.getCenter(), this.circleBundleMarker.getPosition());
      if (distance2) {
        if (distance2 < 999) {
          this.limitLabelInfo = `Radio ${this.decimalPipe.transform(distance2)} metro(s)`;
        } else if (distance2 >= 1000) {
          this.limitLabelInfo = `Radio ${this.decimalPipe.transform(distance2)} Kilómetro(s)`;
        }
        this.limitCircle.setRadius(distance2);
      }
    });

    this.circleBundleMarker.addListener('dragend', (event) => {
      let _distance = this.limitCircle.getRadius();
      if (_distance) {
        this.googleMapsServ.limitRadius$.next({
          distance: _distance,
          infoLabel: this.limitLabelInfo
        });
      }
    });
  }

  //endregion

}
