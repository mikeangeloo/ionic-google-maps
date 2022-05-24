import {MapsIconI} from './maps-icon.interface';

export interface MarkerI
{
  position: any;
  icon?: MapsIconI;
  map: any;
  zIndex?: number;
}
