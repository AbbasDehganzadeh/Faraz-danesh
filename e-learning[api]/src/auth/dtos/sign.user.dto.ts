import { IsNotEmpty, IsString } from 'class-validator';

export class SignUserDto {
  @IsString()
  @IsNotEmpty()
  tutor: string;
}
