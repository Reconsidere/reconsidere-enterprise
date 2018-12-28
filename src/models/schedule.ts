import { Turn } from './turn';

export class Schedule {
  startDate: Date;
  endDate: Date;
  turns: [Turn];
  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
