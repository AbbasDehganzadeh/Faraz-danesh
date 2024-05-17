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
}
