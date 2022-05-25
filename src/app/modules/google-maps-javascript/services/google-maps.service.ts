import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LatLng} from '@capacitor/google-maps/dist/typings/definitions';
import {OpenStreetGeoCodeI} from '../interfaces/open-street-map/open-street-geocode';
import {BehaviorSubject} from 'rxjs';

declare let google;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  //region ATTRIBUTES
  limitRadius$ = new BehaviorSubject<{distance: number; infoLabel: string}>(null);
  currentMarkerLocation$ = new BehaviorSubject<{position: {lat: number; long: number}; geodata: OpenStreetGeoCodeI}>(null);

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  //endregion
  constructor(
    public httpClient: HttpClient,
  ) { }

  //region PUBLIC METHODS
  public async getReverseCoordsData(lat, long) {
    let data = {
      format: 'jsonv2',
      lat,
      lon: long
    };
    try {
      const res: OpenStreetGeoCodeI = await this.httpClient.get<any>(`https://nominatim.openstreetmap.org/reverse`, {params: data}).toPromise();
      if (res) {
        res.flatAddress = res.address.road
          + ', ' + res.address.city
          + ', ' + res.address.country
          + ', ' + res.address.state
          + ', ' + res.address.postcode
          + ', ' + res.address.country;
        return {ok: true, data: res};
      } else {
        return {ok: false, errors: ['Algo salio mal']};
      }
    } catch (e) {
      return {ok: false, errors: e};
    }
  }

  public geometrySphericalCalc(type: 'computeOffset' | 'computeDistanceBetween', origin: LatLng, destination?: LatLng, distance?: number, heading?: number, radius?: number) {
    switch (type) {
      case 'computeOffset':
        return google.maps.geometry.spherical.computeOffset(origin, distance, heading, radius );
        break;
      case 'computeDistanceBetween':
        return google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
        break;
      default:
        return false;
    }
  }
  //endregion

}
