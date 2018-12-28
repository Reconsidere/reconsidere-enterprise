export class Appointment {
  text: string;
  ownerId: number;
  priority: number;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;

  constructor(
    ownerId: number,
    text: string,
    priority: number,
    startDate: Date,
    endDate: Date,
    startTime: Date,
    endTime: Date
  ) {
    this.ownerId = ownerId;
    this.text = text;
    this.priority = priority;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
