import { Inconstant } from "./inconstant";
import { Fixed } from "./fixed";

export class Expenses {
  _id: string;
  date: Date;
  inconstant: [Inconstant];
  fixed: [Fixed];
  uncertain: [];
}
