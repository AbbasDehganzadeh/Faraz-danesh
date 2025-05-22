import { Exclude, Expose, Transform } from 'class-transformer';
import { roles } from '../../common/enum/roles.enum';
import { CreateUserDto } from './user.dto';

export class ResponseUserDto extends CreateUserDto {
  id: number;

  @Expose({ name: 'firstname' })
  @Transform(({ obj }) => {
    return obj['fname'] ? obj['fname'] : '';
  })
  fname: string;
  @Expose({ name: 'lastname' })
  @Transform(({ obj }) => {
    return obj['lname'] ? obj['lname'] : '';
  })
  lname: string;

  @Expose({ name: 'username' })
  @Transform(({ obj }) => {
    return obj['uname'] ? obj['uname'] : '';
  })
  uname: string;

  @Transform(({ value }) => {
    return value ? value : '';
  })
  email: string;

  @Transform(({ value }) => {
    return value ? value : '';
  })
  phone: string;

  @Exclude()
  password: string;

  @Transform(({ value }) => {
    switch (value) {
      case 1:
        return 'Teacher';
      case 2:
        return 'Supervisor';
      default:
        return 'Student';
    }
  })
  role: roles;
}
