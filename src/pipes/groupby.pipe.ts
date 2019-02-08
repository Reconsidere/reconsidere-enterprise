import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

@Pipe({
  name: 'groupby'
})
export class GroupbyPipe implements PipeTransform {
  transform(value: any, list: any[], nameField: any, index: any): any {
    return null;
  }
}
