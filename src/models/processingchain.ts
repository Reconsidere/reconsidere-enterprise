import { FixedCost } from "./fixedcost";

export class ProcessingChain {
  _id: string;
  name: string;
  date: Date;
  description: string;
  fixedCost: [];
  hierarchy: [];
  active: boolean;
  collectionCost: [];
  expanses: [];
}
