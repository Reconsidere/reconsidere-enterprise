import { Material } from "./material";
import {Location} from "./location";
import { User } from "./user";
import { Vehicle } from "./vehicle";
import { GeoRoute } from "./georoute";

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
  location: Location;
  users: [User];
  email: string;
  password: string;
  classification: string;
  vehicles: [Vehicle];
  georoutes: [GeoRoute];
}
