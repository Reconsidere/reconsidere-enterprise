import { Turn } from './turn';
import { Vehicle } from './vehicle';

export class Schedule {
  _id: string;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
  archived: boolean;
  status: string;
  vehicle: Vehicle;
  constructor() {}
}

export namespace Schedule {
  export enum Situation {
    NoConflict = 'Sem conflitos',
    OverlappingRoute = 'Rota sobreposta',
    Conflict = 'Conflito'
  }
}

export namespace Schedule {
  export enum Status {
    Draft = 'Rascunho',
    InOperation = 'Em operação',
    Inactive = 'Inativo'
  }
}
