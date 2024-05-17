import { AuthService } from './auth.service';
import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('api/auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  @Get('me')
  getUser() {
    return this.authservice.getUser();
  }
  @Post('register')
  register() {
    return this.authservice.register();
  }
  @Post('login')
  logIn() {
    return this.authservice.logIn();
  }
  @Post('refresh')
  refresh() {
    return this.authservice.refreshToken();
  }
  @Delete('logout')
  logOut() {
    return this.authservice.logOut();
  }
}
