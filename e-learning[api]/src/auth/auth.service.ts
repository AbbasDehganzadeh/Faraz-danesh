import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  createHmac,
  scryptSync,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import { Buffer } from 'node:buffer';
import {
  LoginUserDto,
  ResponseUserDto,
  SignupUserDto,
  SignupStaffDto,
} from './dtos/user.dto';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { roles } from './roles.enum';
import { RedisService } from 'src/redisdb/redis.service';

const KEY_SECRET = 'KEY_SECRET';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}
  async getUserById(id: number) {
    const user = await this.users.findOneBy({ id });
    return user;
  }
  async getUser(username: string) {
    const user = await this.users.findOne({ where: { uname: username } });
    return user;
  }
  async getMe(data: { username: string }) {
    const user = await this.getUser(data.username);
    const result = plainToClass(ResponseUserDto, user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { password, ...result } = user;
    return result;
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

    const token = this.createJwt(user.uname, user.role);
    return { token };
  }
  async logIn(data: LoginUserDto) {
    const { username, password } = data;
    const validuser = await this.validateUser(username, password);

    if (validuser) {
      const token = this.createJwt(username, validuser.role);
      return { token };
    }
  }
  async signUpStaff(data: SignupStaffDto) {
    const { supervisorName, supervisorKey, ...user } = data;
    const key = `$SUStaff:${supervisorName}:${user.username}`;
    // fetch from redis
    const message = await this.redisService.get(key);
    console.log({ key: supervisorKey, message });
    if (!message) {
      return null;
    }
    if (this.matchKeys(message, supervisorKey)) {
      return user;
    }
    return null;
  }
  async setApiKey(supervisor: string, tutor: string) {
    const key = `$SUStaff:${supervisor}:${tutor}`;
    const message = `${supervisor}:${tutor}_${Date()}`;
    const token = this.encryptMessage(message);
    // save to Redis
    await this.redisService.set(key, message);
    return token;
  }
  getApiKey() {
    return 'api-key get';
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
    throw new HttpException(
      'wrong username, or password',
      HttpStatus.BAD_REQUEST,
    );
  }

  encryptMessage(message: string) {
    const cipher = createHmac('sha512', KEY_SECRET);
    cipher.update(message);
    return cipher.digest('base64');
  }
  matchKeys(payload: string, token: string) {
    const key = this.encryptMessage(payload);
    if (
      key.length === token.length &&
      timingSafeEqual(Buffer.from(key), Buffer.from(token))
    ) {
      return true;
    }
    return false;
  }
  createJwt(username: string, role: roles) {
    return this.jwtService.sign({ username, role }, { secret: 'super secret' });
  }
  createPassword(password: string) {
    const salt = randomBytes(16).toString();
    return this.encryptPassword(password, salt);
  }
  encryptPassword(password: string, salt: string) {
    const hashed = scryptSync(password, salt, 64);
    return `${salt}:${hashed}`;
  }
  matchPassword(password: string, expectpassword: string) {
    const [salt, key] = expectpassword.split(':');
    const encpass = this.encryptPassword(password, salt);
    const hashedpass = Buffer.from(encpass.split(':')[1]);
    const expectedpass = Buffer.from(key);
    if (
      hashedpass.length === expectedpass.length &&
      timingSafeEqual(hashedpass, expectedpass)
    )
      return true;
  }
}
