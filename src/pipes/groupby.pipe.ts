import { Pipe, PipeTransform } from '@angular/core';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Schedule } from 'src/models/schedule';

@Pipe({
  name: 'groupby'
})
export class GroupbyPipe implements PipeTransform {
  result: any[];
  transform(value: Array<any>, field: any) {
    if (field === '_id') {
      const groupedObj = value.reduce((prev, cur) => {
        if (!prev[cur.vehicle[field]]) {
          prev[cur.vehicle[field]] = [cur.vehicle];
        } else {
          prev[cur.vehicle[field]].push(cur.vehicle);
        }
        return prev;
      }, {});
      return this.size(groupedObj)[0].value;
    } else {
      const groupedObj = value.reduce((prev, cur) => {
        if (!prev[cur[field]]) {
          prev[cur[field]] = [cur];
        } else {
          prev[cur[field]].push(cur);
        }
        return prev;
      }, {});
      return this.size(groupedObj)[0].value;
    }
  }

  private size(groupedObj: any) {
    return Object.keys(groupedObj).map(key => ({
      value: groupedObj[key]
    }));
  }
}
