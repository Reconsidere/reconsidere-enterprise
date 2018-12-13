import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'weight'
})
export class WeightPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let intNumber: Number = 0;
    let caracter: String = '';

    value = value + '';
    intNumber = value.split(',')[0];

    value = value.replace(/\D/g, '');
    value = value.replace(/^[0]+/, '');

    if (value.length <= 4 || !intNumber) {
      caracter = this.zeroFill(4 - value.length);
      value = '0,' + caracter + value;
    } else {
      value = value.replace(/^(\d{1,})(\d{4})$/, '$1,$2');
    }

    return value;
  }

  zeroFill(amount) {
    let fill = '';
    while (amount--) {
      fill += '0';
    }
    return fill;
  }
}
