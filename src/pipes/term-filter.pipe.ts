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

    if (field === 'startDate' || field === 'endDate') {
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
    this.orderbyFieldVehicle('carPlate', items);
    this.grouByFieldVehicle(items);
    this.orderbyFieldDate('startDate', items);
    this.grouByFieldStartDate(items);
    this.orderbyFieldDate('endDate', items);
    this.grouByFieldEndDate(items);
    return items;
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
  grouByFieldStartDate(schedules: any) {
    if (schedules === undefined || schedules.length <= 0) {
      return;
    }
    let alreadyExist = false;
    let prim = true;
    let compareValue: any;
    schedules.forEach(schedule => {
      if (prim) {
        compareValue = this.datePipe.transform(
          schedule.startDate,
          'dd/MM/yyyy'
        );
        prim = false;
      }
      if (
        compareValue ===
        this.datePipe.transform(schedule.startDate, 'dd/MM/yyyy')
      ) {
        if (!alreadyExist) {
          const count = schedules.filter(
            item =>
              this.datePipe.transform(item.startDate, 'dd/MM/yyyy') ===
              this.datePipe.transform(schedule.startDate, 'dd/MM/yyyy')
          ).length;
          schedule.rowsStartDate = count;
          schedule.showStartDate = true;
          alreadyExist = true;
        } else {
          schedule.rowsStartDate = 0;
          schedule.showStartDate = false;
        }
      } else {
        alreadyExist = false;
        if (!alreadyExist) {
          const count = schedules.filter(
            item =>
              this.datePipe.transform(item.startDate, 'dd/MM/yyyy') ===
              this.datePipe.transform(schedule.startDate, 'dd/MM/yyyy')
          ).length;
          schedule.rowsStartDate = count;
          schedule.showStartDate = true;
          compareValue = this.datePipe.transform(
            schedule.startDate,
            'dd/MM/yyyy'
          );
          alreadyExist = true;
        } else {
          schedule.rowsStartDate = 0;
          schedule.showStartDate = false;
        }
      }
    });
  }

  grouByFieldEndDate(schedules: any) {
    if (schedules === undefined || schedules.length <= 0) {
      return;
    }
    let alreadyExist = false;
    let prim = true;
    let compareValue: any;
    schedules.forEach(schedule => {
      if (prim) {
        compareValue = this.datePipe.transform(schedule.endDate, 'dd/MM/yyyy');
        prim = false;
      }
      if (
        compareValue === this.datePipe.transform(schedule.endDate, 'dd/MM/yyyy')
      ) {
        if (!alreadyExist) {
          const count = schedules.filter(
            item =>
              this.datePipe.transform(item.endDate, 'dd/MM/yyyy') ===
              this.datePipe.transform(schedule.endDate, 'dd/MM/yyyy')
          ).length;
          schedule.rowsEndDate = count;
          schedule.showEndDate = true;
          alreadyExist = true;
        } else {
          schedule.rowsEndDate = 0;
          schedule.showEndDate = false;
        }
      } else {
        alreadyExist = false;
        if (!alreadyExist) {
          const count = schedules.filter(
            item =>
              this.datePipe.transform(item.endDate, 'dd/MM/yyyy') ===
              this.datePipe.transform(schedule.endDate, 'dd/MM/yyyy')
          ).length;
          schedule.rowsEndDate = count;
          schedule.showEndDate = true;
          compareValue = this.datePipe.transform(
            schedule.endDate,
            'dd/MM/yyyy'
          );
          alreadyExist = true;
        } else {
          schedule.rowsEndDate = 0;
          schedule.showEndDate = false;
        }
      }
    });
  }
}
