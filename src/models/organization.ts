import { Material } from './material';
import { Location } from './location';
import { User } from './user';
import { Vehicle } from './vehicle';
import { GeoRoute } from './georoute';
import { Units } from './unit';

export class Organization {
  _id: string;
  company: string;
  cnpj: string;
  tradingName: string;
  active: boolean;
  phone: number;
  cellPhone: number;
  class: string;
  creationDate: Date;
  activationDate: Date;
  verificationDate: Date;
  suports: [Material];
  units: [Units];
  users: [User];
  email: string;
  classification: string;
  vehicles: [Vehicle];
  georoutes: [GeoRoute];
}

export namespace Organization {
  export enum Classification {
    Cooperativa = 'Cooperativa',
    Privada = 'Empresa Privada',
    Municipio = 'Município'
  }
}
