import { Reflector } from '@nestjs/core';
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
import { RolesGuard } from './decorators/roles.guard';
import { Roles } from './decorators/roles.docorator';
import { roles } from './roles.enum';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Roles(roles.STUDENT, roles.TEACHER, roles.SUPERVISOR)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
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
