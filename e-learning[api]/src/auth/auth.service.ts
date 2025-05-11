import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createHmac,
  scryptSync,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import { Buffer } from 'node:buffer';
import { LoginUserDto, SignupUserDto, SignupStaffDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { roles } from '../common/enum/roles.enum';
import { RedisService } from '../redisdb/redis.service';
import { UserService } from '../user/user.service';

const KEY_SECRET = 'KEY_SECRET';
@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}
  async signup(data: SignupUserDto) {
    const hashedpass = this.createPassword(data.password);
    const user = await this.userService.createUser({
      ...data,
      password: hashedpass,
    });
    const tokens = this.createJwt(user.uname, user.role);
    return tokens;
  }
  async logIn(data: LoginUserDto) {
    const { username, password } = data;
    const validuser = await this.validateUser(username, password);

    if (validuser) {
      const tokens = this.createJwt(username, validuser.role);
      return tokens;
    }
  }
  async signUpStaff(data: SignupStaffDto) {
    const { supervisorName, supervisorKey, ...user } = data;
    const indexKey = `$SUStaff:${supervisorName}:index`;
    const key = `$SUStaff:${supervisorName}:${user.username}`;
    // fetch from redis
    const message = await this.redisService.getdel(key);
    if (!message) {
      return null;
    }
    await this.redisService.srem(indexKey, [key]);
    if (this.matchKeys(message, supervisorKey)) {
      return user;
    }
    return null;
  }
  async setApiKey(supervisor: string, tutor: string) {
    const indexKey = `$SUStaff:${supervisor}:index`;
    const key = `$SUStaff:${supervisor}:${tutor}`;
    const message = `${supervisor}:${tutor}_${Date()}`;
    const token = this.encryptMessage(message);
    // save to Redis
    await this.redisService.set(key, message);
    await this.redisService.sadd(indexKey, [key]);
    return token;
  }
  async getApiKey(supervisor: string) {
    const indexKey = `$SUStaff:${supervisor}:index`;
    const keys = await this.redisService.smembers(indexKey);
    const tokens = [];
    for (const key of keys) {
      tokens.push(await this.redisService.get(key));
    }
    return tokens;
  }
  async loginGithub(username: string) {
    const validuser = await this.userService.getUser(username);
    if (validuser) {
      const tokens = this.createJwt(username, validuser.role);
      return tokens;
    }
  }
  refreshToken(username: string, role: number) {
    return this.createJwt(username, role);
  }
  logOut() {
    return 'user logged out';
  }
  async validateUser(username: string, password: string) {
    const user = await this.userService.getUser(username);
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
  async createJwt(username: string, role: roles) {
    const payload: JwtPayload = {
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
