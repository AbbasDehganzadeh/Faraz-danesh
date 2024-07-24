import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getUser() {
    return 'Me';
  }
  register() {
    return 'User registered';
  }
  logIn() {
    return 'user logged in';
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
