import { Schedule } from './schedule';
import { Vehicle } from './vehicle';

export class GeoRoute {
  _id: string;
  name: string;
  schedules: [Schedule];
  expand: boolean;
  status: string;
  archived: boolean;
}

export namespace GeoRoute {
  export enum Status {
    Draft = 'Rascunho',
    InOperation = 'Em operação',
    Inactive = 'Inativo'
  }
}
