import { UserRoleEnum } from '../enum/user.enum';

export interface PayloadInterface {
  id: number;
  email: string;
  role: UserRoleEnum;
}
