export class Fixed {
  _id: string;
  name: string;
  typeExpense: string;
  description: string;
  date: Date;
  cost: number;
  active: boolean;
}


export namespace Fixed {
  export enum Type {
    Water = 'Água',
    Light = 'Luz',
    Telphone = 'Telefone',
    Net = 'Internet',
    Rent = 'Aluguel',
    Salary = 'Salário',
    Cleaning = 'Material de limpeza',
    OfficeSupplies = 'Material de escritório',
    BankCharges = 'Taxa bancária',
  }
}
