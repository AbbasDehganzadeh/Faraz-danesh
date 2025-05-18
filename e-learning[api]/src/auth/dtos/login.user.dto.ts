import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    title: 'username',
    description: 'username must be unique!',
    type: 'string',
    example: 'ali',
    required: true,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty({
    title: 'password',
    description: 'username must be strong!',
    type: 'string',
    example: '********',
    required: true,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
