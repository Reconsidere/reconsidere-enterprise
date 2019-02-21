import { Hierarchy } from './material';
import { Location } from './location';
import { User } from './user';
import { Vehicle } from './vehicle';
import { GeoRoute } from './georoute';
import { Units } from './unit';
import { Supports } from './supports';

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
  suports: [Supports];
  units: [Units];
  users: [User];
  email: string;
  classification: string;
  vehicles: [Vehicle];
  georoutes: [GeoRoute];
  hierarchy: Hierarchy;
}

export namespace Organization {
  export enum Classification {
    Cooperativa = 'Cooperativa',
    Privada = 'Empresa Privada',
    Municipio = 'Município'
  }
}
