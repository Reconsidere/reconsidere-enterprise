import { Vehicle } from "./vehicle";

export class CollectionCost {
    _id: string;
    name: string;
    date: Date;
    distance: Number;
    priceFuel: Number;
    vehicle: Vehicle;
    averageConsumption: Number;
}