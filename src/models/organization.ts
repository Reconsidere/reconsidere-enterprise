import { Hierarchy } from './material';
import { Location } from './location';
import { User } from './user';
import { Vehicle } from './vehicle';
import { GeoRoute } from './georoute';
import { Units } from './unit';
import { Supports } from './supports';
import { Expenses } from './expenses';

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
  expenses:Expenses;
}

export namespace Organization {
  export enum Classification {
    Comercio = 'Comércio Comum',
    Cooperativa = 'Cooperativa',
    Coletora = 'Empresa Coletora',
    Beneficiadora = 'Empresa Beneficiadora',
    Municipio = 'Município',
    Privada = 'Empresa Privada'
  }
}
