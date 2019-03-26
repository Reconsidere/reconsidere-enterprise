import { Purchase } from "./purchase";
import { Sale } from "./sale";

export class Entries {
  purchase: [Purchase];
  sale: [Sale];


}


export namespace Entries {
  export enum Type {
    Input = 'Entrada',
    Output = 'Saída',
  }
}

export namespace Entries {
  export enum types {
    purchase = 'purchase',
    sale = 'sale'
  }
}
