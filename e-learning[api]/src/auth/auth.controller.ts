import { AuthService } from './auth.service';
import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { LoginUserDto, SignupUserDto } from './dtos/user.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('me')
  getUser() {
    return this.authService.getUserById(1); //TODO: dynamic ID
  }
  @Post('signup')
  signup(@Body() body: SignupUserDto) {
    return this.authService.signup(body);
  }
  @Post('login')
  logIn(@Body() body: LoginUserDto) {
    // const [username, password] = body;
    return this.authService.logIn(body);
  }
  @Post('refresh')
  refresh() {
    return this.authService.refreshToken();
  }
  @Delete('logout')
  logOut() {
    return this.authService.logOut();
  }
}
