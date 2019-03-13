import { FixedCost } from "./fixedcost";

export class ProcessingChain {
  _id: string;
  name: string;
  description: string;
  fixedCost: [FixedCost];
  hierarchy: [];
}
