import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { LoginUserDto, SignupUserDto } from './dtos/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async getUserById(id: number) {
    const user = await this.users.findOneBy({ id });
    return user;
  }
  async getUser(username: string) {
    const user = await this.users.findOne({ where: { uname: username } });
    return user;
  }
  signup(data: SignupUserDto) {
    const hashedpass = this.createPassword(data.password);
    const user = this.users.create({
      fname: data.firstname,
      lname: data.lastname,
      uname: data.username,
      email: data.email,
      password: hashedpass,
    });
    this.users.save(user);

    const token = this.createJwt(user.uname);
    return { token };
  }
  async logIn(data: LoginUserDto) {
    const { username, password } = data;
    const user = await this.validateUser(username, password);

    if (user) {
      const token = this.createJwt(username);
      return { token };
    }
  }
  refreshToken() {
    return 'tokens are created';
  }
  logOut() {
    return 'user logged out';
  }
  async validateUser(username: string, password: string) {
    const user = await this.getUser(username);
    if (user) {
      if (this.matchPassword(password, user.password)) {
        return user;
      }
    }
    return new HttpException(
      'wrong username, or password',
      HttpStatus.BAD_REQUEST,
    );
  }
  createJwt(username:string) {
    return this.jwtService.sign({username},{secret: 'super secret'})
  }
  createPassword(password: string) {
    const salt = randomBytes(16).toString();
    return this.encreptPassword(password, salt);
  }
  encreptPassword(password: string, salt: string) {
    const hashed = scryptSync(password, salt, 64);
    return `${salt}:${hashed}`;
  }
  matchPassword(password: string, expectpassword: string) {
    const [salt, _] = expectpassword.split(':');
    const encpass = this.encreptPassword(password, salt);
    const hashedpass = Buffer.from(encpass);
    const expectedpass = Buffer.from(expectpassword);
    return timingSafeEqual(hashedpass, expectedpass);
  }
}
