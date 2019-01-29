import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

@Pipe({
  name: 'groupby'
})
export class GroupbyPipe implements PipeTransform {
  transform(value: any, list: any[], nameField: any, index: any): any {
    let sum = 0;
    let show = true;
    //this.orderBy(nameField, list);
    list.forEach(element => {
      if (nameField === '_id') {
        if (element.vehicle[nameField] === value) {
          sum++;
          if (show) {
            list[index].show = false;
            show = false;
          } else {
            list[index].show = true;
          }
        }
      } else if (element[nameField] === value) {
        sum++;
        if (show) {
          list[index].show = false;
          show = false;
        } else {
          list[index].show = true;
        }
      }
    });
    list[index].rows = sum;
    return value;
  }

  // private orderByVehicleId(field: string, list: any[]) {
  //   list.sort((a: any, b: any) => {
  //     if (a[field].vehicle._id < b[field].vehicle._id) {
  //       return -1;
  //     } else if (a[field].vehicle._id > b[field].vehicle._id) {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   });
  // }

  // private orderByDate(field: string, list: any[]) {
  //   list.sort((a: any, b: any) => {
  //     if (a[field].toDateString() < b[field].toDateString()) {
  //       return -1;
  //     } else if (a[field].toDateString() > b[field].toDateString()) {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   });
  // }
}
