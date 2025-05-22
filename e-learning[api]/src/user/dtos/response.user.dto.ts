import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { roles } from '../../common/enum/roles.enum';
import { CreateUserDto } from './user.dto';

export class ResponseUserDto extends CreateUserDto {
  @ApiProperty({ title: 'ID', description: 'user ID', example: 1 })
  id: number;

  @ApiProperty({
    name: 'firstname',
    title: 'first name',
    example: 'ali',
    nullable: true,
  })
  @Expose({ name: 'firstname' })
  @Transform(({ obj }) => {
    return obj['fname'] ? obj['fname'] : '';
  })
  fname: string;
  @ApiProperty({
    name: 'lastname',
    title: 'last name',
    example: 'alavi',
    nullable: true,
  })
  @Expose({ name: 'lastname' })
  @Transform(({ obj }) => {
    return obj['lname'] ? obj['lname'] : '';
  })
  lname: string;

  @ApiProperty({
    name: 'username',
    title: 'user name',
    description: 'username is unique',
    example: 'ali1',
  })
  @Expose({ name: 'username' })
  @Transform(({ obj }) => {
    return obj['uname'] ? obj['uname'] : '';
  })
  uname: string;

  @ApiProperty({
    title: 'Email',
    description: 'Email of user is unique',
    example: 'a123@comp.co',
  })
  @Transform(({ value }) => {
    return value ? value : '';
  })
  email: string;

  @ApiProperty({
    title: 'phone number',
    description: 'phone number is unique',
    example: '0981234567',
    nullable: true,
  })
  @Transform(({ value }) => {
    return value ? value : '';
  })
  phone: string;

  @Exclude()
  password: string;

  @ApiProperty({
    title: 'Role',
    description: 'user role',
    example: roles.STUDENT,
    default: roles.STUDENT,
    enum: roles,
  })
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
