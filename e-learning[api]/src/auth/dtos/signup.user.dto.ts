import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { roles } from '../../common/enum/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty({
    title: 'firstname',
    type: 'string',
    example: 'alii',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  @IsNotEmpty()
  firstname: string;
  @ApiProperty({
    title: 'lastname',
    type: 'string',
    example: 'alavi',
    required: true,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  lastname: string;
  @ApiProperty({
    title: 'username',
    description: 'username must be unique!',
    type: 'string',
    example: 'ali',
    required: true,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  username: string;
  @ApiProperty({
    title: 'phone',
    description: 'phone must be unique!',
    type: 'string',
    example: '098123456789',
    required: true,
    minLength: 10,
    maxLength: 14,
  })
  @IsString()
  @Length(10, 14)
  phone: string;
  @ApiProperty({
    title: 'email',
    description: 'email must be unique!',
    type: 'string',
    example: 'ali@alavi.co',
    required: true,
    nullable: false,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    title: 'password',
    description: 'password must be strong!',
    type: 'string',
    example: '********',
    required: true,
    minLength: 8,
    nullable: false,
  })
  @IsString()
  @MinLength(8)
  password: string;

  readonly role: roles;
}

export class SignupStaffDto extends SignupUserDto {
  @ApiProperty({
    title: 'username',
    description: 'name of supervisor approved',
    type: 'string',
    example: 'ali',
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  supervisorName: string;
  @ApiProperty({
    title: 'username',
    description: 'token from supervisor you recieved',
    type: 'string',
    example: 'ali',
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  supervisorKey: string;
}
