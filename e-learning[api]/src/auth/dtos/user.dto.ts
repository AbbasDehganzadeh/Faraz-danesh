import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { roles } from '../roles.enum';

export class SignupUserDto {
  @IsString()
  @MaxLength(20)
  @IsOptional()
  firstname: string;
  @IsString()
  @MaxLength(20)
  lastname: string;
  @IsString()
  @MaxLength(20)
  username: string;
  @IsString()
  @MinLength(10)
  @MaxLength(14)
  phone: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;

  readonly role: roles;
}

export class LoginUserDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}

export class SignupStaffDto extends SignupUserDto {
  @IsString()
  @IsNotEmpty()
  supervisorName: string;
  @IsString()
  @IsNotEmpty()
  supervisorKey: string;
}

export class ResponseUserDto extends SignupUserDto {
  @Expose({name:'firstname'})
  @Transform(({value}) => {
    if (value !== null || value !== undefined) {
      return '';
    }
    return value;
  })
  fname: string;
  @Expose({name:'lastname'})
  @Transform(({value}) => {
    if (value !== null || value !== undefined) {
      return '';
    }
    return value;
  })
  lname: string;
  @Expose({name:'username'})
  uname: string;
  @Transform(({value}) => {
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

export class RequestGetMeBodyDto {
  //! Not implemented
}
