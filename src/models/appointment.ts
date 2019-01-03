export class Appointment {
  title: string;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;

  constructor(
    title: string,
    startDate: Date,
    endDate: Date,
    startTime: Date,
    endTime: Date
  ) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
