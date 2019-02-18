import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Schedule } from 'src/models/schedule';

@Pipe({
  name: 'termFilter'
})
export class TermFilterPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(items: any[], field: any, value: any): any[] {
    if (!items) {
      return [];
    }

    if (items && !value) {
      const values = items.map(x => x.schedules);
      if (values[0] === undefined) {
        return this.orderby(items);
      }
    }

    if (!field || !value) {
      return items;
    }

    if (field === 'carPlate') {
      return this.orderby(
        items.filter(singleItem =>
          singleItem.vehicle[field].toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if (field === 'date') {
      return this.orderby(
        items.filter(singleItem =>
          this.datePipe
            .transform(singleItem[field], 'dd/MM/yyyy')
            .includes(this.datePipe.transform(value, 'dd/MM/yyyy'))
        )
      );
    }

    if (field === 'startTime' || field === 'endTime') {
      return this.orderby(
        items.filter(singleItem =>
          this.datePipe
            .transform(singleItem[field], 'HH:mm')
            .includes(this.datePipe.transform(value, 'HH:mm'))
        )
      );
    }

    if (field === 'name') {
      const val = items.filter(singleItem =>
        singleItem[field].toLowerCase().includes(value.toLowerCase())
      );
      if (val === undefined || val.length <= 0) {
        return this.orderby(val);
      }
    }

    return this.orderby(
      items.filter(singleItem =>
        singleItem[field].toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  orderby(items) {
    this.orderbyFieldVehicle('carPlate', items.filter(x => !x.archived));
    this.grouByFieldVehicle(items.filter(x => !x.archived));
    this.orderbyFieldDate('date', items.filter(x => !x.archived));
    this.grouByFieldDate(items.filter(x => !x.archived));
    this.orderbyNew('readonly', items.filter(x => !x.archived));
    return items;
  }

  orderbyNew(field: string, schedule: any) {
    schedule.sort(function(a, b) {
      return b[field] - a[field];
    });
  }

  orderbyFieldVehicle(field: string, schedule: Schedule[]) {
    schedule.sort((a: any, b: any) => {
      if (a.vehicle[field] < b.vehicle[field]) {
        return -1;
      } else if (a.vehicle[field] > b.vehicle[field]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  orderbyFieldDate(field: string, schedule: Schedule[]) {
    schedule.sort((a: any, b: any) => {
      if (
        this.datePipe.transform(a[field], 'dd/MM/yyyy') <
        this.datePipe.transform(b[field], 'dd/MM/yyyy')
      ) {
        return -1;
      } else if (
        this.datePipe.transform(a[field], 'dd/MM/yyyy') >
        this.datePipe.transform(b[field], 'dd/MM/yyyy')
      ) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  grouByFieldVehicle(schedules: any) {
    if (schedules === undefined || schedules.length <= 0) {
      return;
    }
    let alreadyExist = false;
    let prim = true;
    let compareValue: any;
    schedules.forEach(schedule => {
      if (schedule.isNew) {
        schedule.rowsDate = 1;
        schedule.showDate = true;
        return;
      }
      if (prim) {
        compareValue = schedule.vehicle.carPlate;
        prim = false;
      }
      if (compareValue === schedule.vehicle.carPlate) {
        if (!alreadyExist) {
          const count = schedules.filter(
            item => item.vehicle.carPlate === schedule.vehicle.carPlate
          ).length;
          schedule.rowsVehicle = count;
          schedule.showVehicle = true;
          alreadyExist = true;
        } else {
          schedule.rowsVehicle = 0;
          schedule.showVehicle = false;
        }
      } else {
        alreadyExist = false;
        if (!alreadyExist) {
          const count = schedules.filter(
            item => item.vehicle.carPlate === schedule.vehicle.carPlate
          ).length;
          schedule.rowsVehicle = count;
          schedule.showVehicle = true;
          compareValue = schedule.vehicle.carPlate;
          alreadyExist = true;
        } else {
          schedule.rowsVehicle = 0;
          schedule.showVehicle = false;
        }
      }
    });
  }
  grouByFieldDate(schedules: any) {
    if (schedules === undefined || schedules.length <= 0) {
      return;
    }
    let alreadyExist = false;
    let prim = true;
    let compareValue: any;
    schedules.forEach(schedule => {
      if (schedule.isNew) {
        schedule.rowsDate = 1;
        schedule.showDate = true;
        return;
      }
      if (prim) {
        compareValue = this.datePipe.transform(schedule.date, 'dd/MM/yyyy');
        prim = false;
      }
      if (
        compareValue === this.datePipe.transform(schedule.date, 'dd/MM/yyyy')
      ) {
        if (!alreadyExist) {
          const count = schedules.filter(
            item =>
              this.datePipe.transform(item.date, 'dd/MM/yyyy') ===
              this.datePipe.transform(schedule.date, 'dd/MM/yyyy')
          ).length;
          schedule.rowsDate = count;
          schedule.showDate = true;
          alreadyExist = true;
        } else {
          schedule.rowsDate = 0;
          schedule.showDate = false;
        }
      } else {
        alreadyExist = false;
        if (!alreadyExist) {
          const count = schedules.filter(
            item =>
              this.datePipe.transform(item.date, 'dd/MM/yyyy') ===
              this.datePipe.transform(schedule.date, 'dd/MM/yyyy')
          ).length;
          schedule.rowsDate = count;
          schedule.showDate = true;
          compareValue = this.datePipe.transform(schedule.date, 'dd/MM/yyyy');
          alreadyExist = true;
        } else {
          schedule.rowsDate = 0;
          schedule.showDate = false;
        }
      }
    });
  }
}
