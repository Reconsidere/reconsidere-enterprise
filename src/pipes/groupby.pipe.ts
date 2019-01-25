import { Pipe, PipeTransform } from '@angular/core';
import { ValueTransformer } from '@angular/compiler/src/util';
import { Schedule } from 'src/models/schedule';

@Pipe({
  name: 'groupby'
})
export class GroupbyPipe implements PipeTransform {
  result: any[];
  transform(value: Array<any>, fields: Array<any>): Array<any> {
    let values = [];
    fields.forEach(field => {
      const groupedObj = value.reduce((prev, cur) => {
        if (!prev[cur[field]]) {
          prev[cur[field]] = [cur];
        } else {
          prev[cur[field]].push(cur);
        }
        return prev;
      }, {});
      values = Object.keys(groupedObj).map(key => ({
        key,
        value: groupedObj[key]
      }));
    });
    return values;
  }
}
