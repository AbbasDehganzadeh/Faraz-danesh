import {
  createHmac,
  scryptSync,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';
import { Buffer } from 'node:buffer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { RedisService } from '../redisdb/redis.service';
import { roles } from '../common/enum/roles.enum';
import { LoginUserDto } from './dtos/login.user.dto';
import { SignupStaffDto, SignupUserDto } from './dtos/signup.user.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}
  private AUTH_SIGN_USER =
    this.configService.getOrThrow<string>('AUTH_SIGN_USER');
  async signup(data: SignupUserDto) {
    const hashedpass = this.createPassword(data.password);
    const user = await this.userService.createUser({
      ...data,
      password: hashedpass,
    });
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
    const indexKey = `$SUStaff:${supervisorName}:index`;
    const key = `$SUStaff:${supervisorName}:${user.username}`;
    // fetch from redis
    const message = await this.redisService.getdel(key);
    if (!message) return null;
    await this.redisService.srem(indexKey, [key]);
    if (this.matchKeys(message, supervisorKey)) return user;
    return null;
  }
  async setApiKey(supervisor: string, tutor: string) {
    const indexKey = `$SUStaff:${supervisor}:index`;
    const key = `$SUStaff:${supervisor}:${tutor}`;
    const message = `${supervisor}:${tutor}_${Date()}`;
    const token = this.encryptMessage(message);
    // save redis
    await this.redisService.set(key, message);
    await this.redisService.sadd(indexKey, [key]);
    return { token };
  }
  async getApiKeys(supervisor: string) {
    const indexKey = `$SUStaff:${supervisor}:index`;
    const keys = await this.redisService.smembers(indexKey);
    const getval = async (item: string) => {
      return await this.redisService.get(item);
    };
    const tokens = await Promise.all(keys.map(getval));
    return { tokens };
  }
  async loginGithub(username: string, email: string) {
    const [validusername, validuseremail] = await Promise.all([
      this.userService.getUser(username),
      this.userService.getUserByEmail(email),
    ]);
    if (!validusername && !validuseremail) {
      return null;
    }
    const validuser = validusername ?? validuseremail;
    const tokens = this.createJwt(validuser!.id, username, validuser!.role);
    return tokens;
  }
  refreshToken(id: number, username: string, role: number) {
    return this.createJwt(id, username, role);
  }
  logOut() {
    return 'user logged out';
  }
  async validateUser(username: string, password: string) {
    const user = await this.userService.getUser(username);
    if (user && this.matchPassword(password, user.password)) return user;
  }

  private encryptMessage(message: string) {
    const cipher = createHmac('sha512', this.AUTH_SIGN_USER);
    return cipher.update(message).digest('base64');
  }
  private matchKeys(payload: string, token: string) {
    const key = this.encryptMessage(payload);
    return (
      key.length === token.length &&
      timingSafeEqual(Buffer.from(key), Buffer.from(token))
    );
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
    return (
      hashedpass.length === expectedpass.length &&
      timingSafeEqual(hashedpass, expectedpass)
    );
  }
}
