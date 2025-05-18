import { roles } from '../../common/enum/roles.enum';

export class CreateUserDto {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  role: roles;
}
