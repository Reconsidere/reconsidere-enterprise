import { Turn } from './turn';

export class Schedule {
  _id: string;
  startDate: Date;
  endDate: Date;
  turns: [Turn];
  constructor() {}
}
