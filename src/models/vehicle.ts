import { GeoRoute } from "./georoute";

export class Vehicle {

  id: number;
  carPlate: string;
  emptyVehicleWeight: number;
  weightCapacity: number;
  active: boolean;
  fuel: number;
  availabilityForOperation: boolean;
  geoRoute: [GeoRoute];
}
