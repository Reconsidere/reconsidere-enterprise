import { Profile } from './profile';
export class User {
  _id: string;
  name: string;
  email: string;
  profiles: [Profile];
  password: string;
  active: boolean;
  token?: string;
}

export namespace User {
  export enum Profiles {
    Administrator = 'Administrador',
    Coordinator = 'Coordenador',
    Manager = 'Gerente',
    Operational = 'Operacional'
  }
}
