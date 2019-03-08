import { FixedCost } from "./fixedcost";

export class ProcessingChain {
  name: string;
  description: string;
  fixedCost: [FixedCost];
  hierarchy: [];
}
