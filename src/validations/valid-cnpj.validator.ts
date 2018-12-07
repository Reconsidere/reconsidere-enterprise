import {AbstractControl} from '@angular/forms';
export class CNPJValidator {
  static MatchCNPJ(control: AbstractControl) {
    let cnpj = control.get('cnpj').value.replace(/[^\d]+/g,'');

    if(cnpj ==''){
      control.get('cnpj').setErrors( {ConfirmCNPJ: true} );
    }
    if(cnpj.length != 14){
      control.get('cnpj').setErrors( {ConfirmCNPJ: true} );
    }
    if (cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999")
    control.get('cnpj').setErrors( {CNPJ: true} );

    // Valida DVs
  let range = cnpj.length - 2
  let numbers = cnpj.substring(0,range);
  let digits = cnpj.substring(range);
  let sum = 0;
  let pos = range - 7;
  let i;
  for (i = range; i >= 1; i--) {
    sum += numbers.charAt(range - i) * pos--;
    if (pos < 2){
      pos = 9;
    }
  }
  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result != digits.charAt(0)){
      control.get('cnpj').setErrors( {ConfirmCNPJ: true} );
  }

  range = range + 1;
  numbers = cnpj.substring(0,range);
  sum = 0;
  pos = range - 7;
  for (i = range; i >= 1; i--) {
    sum += numbers.charAt(range - i) * pos--;
    if (pos < 2){
      pos = 9;
    }
  }
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result != digits.charAt(1)){
    control.get('cnpj').setErrors( {ConfirmCNPJ: true} );
  }

  return null
  }
}
