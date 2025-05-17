import {
  createHmac,
  scryptSync,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import { Buffer } from 'node:buffer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { plainToClass } from 'class-transformer';
import { RedisService } from '../redisdb/redis.service';
import { roles } from './roles.enum';
import {
  LoginUserDto,
  ResponseUserDto,
  SignupUserDto,
  SignupStaffDto,
} from './dtos/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}
  private AUTH_SIGN_USER =
    this.configService.getOrThrow<string>('AUTH_SIGN_USER');
  async getUserById(id: number) {
    const user = await this.users.findOneBy({ id });
    return user;
  }
  async getUser(username: string) {
    const user = await this.users.findOne({ where: { uname: username } });
    return user;
  }
  async getMe(username: string) {
    const user = await this.getUser(username);
    const result = plainToClass(ResponseUserDto, user);
    return result;
  }
  async signup(data: SignupUserDto) {
    const hashedpass = this.createPassword(data.password);
    const user = this.users.create({
      fname: data.firstname,
      lname: data.lastname,
      uname: data.username,
      email: data.email,
      password: hashedpass,
      role: data.role,
    });
    try {
      await this.users.save(user);
    } catch (err) {
      if (err.code == 'SQLITE_CONSTRAINT_UNIQUE') {
        console.info(err.message);
        throw new HttpException(
          'username, email, or phone must be unique!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const tokens = this.createJwt(user.id, user.uname, user.role);
    return tokens;
  }
  async logIn(data: LoginUserDto) {
    const { username, password } = data;
    const validuser = await this.validateUser(username, password);

    if (validuser) {
      const tokens = this.createJwt(validuser.id, username, validuser.role);
      return tokens;
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
  async loginGithub(username: string) {
    const validuser = await this.getUser(username);
    if (validuser) {
      const tokens = this.createJwt(validuser.id, username, validuser.role);
      return tokens;
    }
  }
  refreshToken(id: number, username: string, role: number) {
    return this.createJwt(id, username, role);
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

  private encryptMessage(message: string) {
    const cipher = createHmac('sha512', this.AUTH_SIGN_USER);
    cipher.update(message);
    return cipher.digest('base64');
  }
  private matchKeys(payload: string, token: string) {
    const key = this.encryptMessage(payload);
    if (
      key.length === token.length &&
      timingSafeEqual(Buffer.from(key), Buffer.from(token))
    ) {
      return true;
    }
    return false;
  }
  async createJwt(id: number, username: string, role: roles) {
    const payload: JwtPayload = {
      sub: String(id),
      username,
      role,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_AUTH_SECRET'),
        expiresIn: '10m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_AUTH_SECRET'),
        expiresIn: '1d',
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
  private createPassword(password: string) {
    const salt = randomBytes(16).toString();
    return this.encryptPassword(password, salt);
  }
  private encryptPassword(password: string, salt: string) {
    const hashed = scryptSync(password, salt, 64);
    return `${salt}:${hashed}`;
  }
  private matchPassword(password: string, expectpassword: string) {
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
