import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'termFilter'
})
export class TermFilterPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(items: any[], field: any, value: any): any[] {
    if (!items) {
      return [];
    }

    if (!field || !value) {
      return items;
    }

    if (field === 'carPlate') {
      return items.filter(singleItem =>
        singleItem.vehicle[field].toLowerCase().includes(value.toLowerCase())
      );
    }

    if (field === 'startDate' || field === 'endDate') {
      return items.filter(singleItem =>
        this.datePipe
          .transform(singleItem[field], 'dd/MM/yyyy')
          .includes(this.datePipe.transform(value, 'dd/MM/yyyy'))
      );
    }

    if (field === 'startTime' || field === 'endTime') {
      return items.filter(singleItem =>
        this.datePipe
          .transform(singleItem[field], 'HH:mm')
          .includes(this.datePipe.transform(value, 'HH:mm'))
      );
    }

    if (field === 'name') {
      const val = items.filter(singleItem =>
        singleItem[field].toLowerCase().includes(value.toLowerCase())
      );
      if (val === undefined || val.length <= 0) {
        return items;
      }
    }

    return items.filter(singleItem =>
      singleItem[field].toLowerCase().includes(value.toLowerCase())
    );
  }
}
