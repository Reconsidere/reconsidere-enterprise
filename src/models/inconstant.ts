export class Inconstant {
  _id: string;
  name: string;
  type: string;
  description: string;
  date: Date;
  quantity: number;
  weight: number;
  cost: number;
  amount: number;
}


export namespace Inconstant {
  export enum Type {
    Others = 'Outros',
    Material = 'Material',
  }
}
