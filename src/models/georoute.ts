import { Schedule } from './schedule';
import { Vehicle } from './vehicle';

export class GeoRoute {
  _id: string;
  name: string;
  schedules: [Schedule];
  expand: boolean;
  vehicle: Vehicle;
}
