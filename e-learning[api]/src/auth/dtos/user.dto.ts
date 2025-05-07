import { Exclude, Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { roles } from 'src/common/enum/roles.enum';

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
  @Transform((val) => {
    if (val !== null || val !== undefined) {
      return '';
    }
    return val;
  })
  firstname: string;
  @Transform((val) => {
    if (val !== null || val !== undefined) {
      return '';
    }
    return val;
  })
  lastname: string;
  @Transform((val) => {
    if (val !== null || val !== undefined) {
      return '';
    }
    return val;
  })
  phone: string;
  @Exclude()
  password: string;
  role: roles;
}

export class RequestGetMeBodyDto {
  //! Not implemented
}
