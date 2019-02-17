import { Turn } from './turn';
import { Vehicle } from './vehicle';

export class Schedule {
  _id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  archived: boolean;
  situation: string;
  vehicle: Vehicle;
  readonly: boolean;
  constructor() {}
}

export namespace Schedule {
  export enum Situation {
    NoConflict = 'Sem conflitos',
    OverlappingRoute = 'Rota sobreposta',
    Conflict = 'Conflito'
  }
}


