import { Material } from "./material";
import {Location} from "./location";
import { User } from "./user";

export class Organization {

  id: number;
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
}
