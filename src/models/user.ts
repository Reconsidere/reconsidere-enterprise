import { Profile } from './profile';
export class User {
  name: string;
  email: string;
  profiles: [Profile];
  password: string;
  active: boolean;
  token?: string;
}
