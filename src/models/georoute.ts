import { Schedule } from './schedule';

export class GeoRoute {
  _id: string;
  name: string;
  schedules: [Schedule];
  expand: boolean;
}
