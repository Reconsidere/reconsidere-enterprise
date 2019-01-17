import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateconvert'
})
export class DateconvertPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value === undefined || value === '') {
      return;
    }
    return new Date(value);
  }
}
