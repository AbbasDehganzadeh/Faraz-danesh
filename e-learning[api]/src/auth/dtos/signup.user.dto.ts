import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { roles } from '../roles.enum';

export class SignupUserDto {
  @IsString()
  @MaxLength(20)
  @IsOptional()
  @IsNotEmpty()
  firstname: string;
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  lastname: string;
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  username: string;
  @IsString()
  @Length(10, 14)
  phone: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;

  readonly role: roles;
}

export class SignupStaffDto extends SignupUserDto {
  @IsString()
  @IsNotEmpty()
  supervisorName: string;
  @IsString()
  @IsNotEmpty()
  supervisorKey: string;
}
