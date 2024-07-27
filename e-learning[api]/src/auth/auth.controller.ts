import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto, ResponseUserDto, SignupUserDto } from './dtos/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getUser(@Req() req: any): Promise<ResponseUserDto> {
    const { user } = req;
    console.info({ user });
    return this.authService.getMe(user); //TODO: dynamic ID base on jwt token
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
