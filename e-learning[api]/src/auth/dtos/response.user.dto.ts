import { Exclude, Expose, Transform } from 'class-transformer';
import { roles } from '../roles.enum';
import { SignupUserDto } from './signup.user.dto';

export class ResponseUserDto extends SignupUserDto {
  @Expose({ name: 'firstname' })
  @Transform(({ value }) => {
    if (value !== null || value !== undefined) {
      return '';
    }
    return value;
  })
  fname: string;
  @Expose({ name: 'lastname' })
  @Transform(({ value }) => {
    if (value !== null || value !== undefined) {
      return '';
    }
    return value;
  })
  lname: string;
  @Expose({ name: 'username' })
  uname: string;
  @Transform(({ value }) => {
    if (value !== null || value !== undefined) {
      return '';
    }
    return value;
  })
  phone: string;
  @Exclude()
  password: string;
  role: roles;
}
