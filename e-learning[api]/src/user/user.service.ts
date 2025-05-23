import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/user.dto';
import { ResponseUserDto } from './dtos/response.user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private users: Repository<User>) {}
  async getUserById(id: number) {
    const user = await this.users.findOneBy({ id });
    return user;
  }
  async getUser(username: string) {
    const user = await this.users.findOne({ where: { uname: username } });
    return user;
  }
  async getUserByEmail(email: string) {
    const user = await this.users.findOne({ where: { email: email } });
    return user;
  }
  async getMe(username: string) {
    const user = await this.getUser(username);
    const result = plainToClass(ResponseUserDto, user);
    return result;
  }
  async createUser(data: CreateUserDto) {
    const user = this.users.create({
      fname: data.firstname,
      lname: data.lastname,
      uname: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    try {
      await this.users.save(user);
    } catch (err) {
      if (err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new HttpException(
          'username, email, or phone must be unique!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return user;
  }
}
