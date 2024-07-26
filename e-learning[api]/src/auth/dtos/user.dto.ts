import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @IsAlphanumeric()
  @MinLength(8)
  password: string;
}

export class LoginUserDto {
  @IsString()
  username: string;
  password: string;
}
