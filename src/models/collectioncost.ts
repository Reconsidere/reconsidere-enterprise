import { Vehicle } from "./vehicle";
import { NumberValueAccessor } from "@angular/forms/src/directives";

export class CollectionCost {
    _id: string;
    name: string;
    date: Date;
    distance: Number;
    priceFuel: Number;
    vehicle: Vehicle;
    averageConsumption: Number;
    active: boolean;
    price: Number;
    consumption: Number;
}