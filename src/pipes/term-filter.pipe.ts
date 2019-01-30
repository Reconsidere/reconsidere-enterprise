import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'termFilter'
})
export class TermFilterPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(items: any[], value: any, element: any): any[] {
    if (!items) {
      return [];
    }

    if (!element) {
      return items;
    }
    const field = element.name;

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

    return items.filter(singleItem =>
      singleItem[field].toLowerCase().includes(value.toLowerCase())
    );
  }
}
