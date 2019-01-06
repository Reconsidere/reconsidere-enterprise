import { GeoRoute } from "./georoute";

export class Vehicle {
  _id: string;
  carPlate: string;
  emptyVehicleWeight: number;
  weightCapacity: number;
  active: boolean;
  fuel: number;
  typeFuel: Vehicle.Fuel;
}

export namespace Vehicle {
  export enum Fuel {
    Comum = 'Gasolina Comum',
    Aditivada = 'Gasolina Aditivada',
    Premium = 'Gasolina Premium',
    Etanol = 'Etanol',
    Diesel = 'Diesel',
    Gas = 'Gás',
    Novo = 'Novo'    
  }
}
