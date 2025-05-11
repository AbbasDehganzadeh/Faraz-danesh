import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto, SignupStaffDto, SignupUserDto } from './dtos/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './decorators/roles.guard';
import { Roles } from './decorators/roles.docorator';
import { roles } from '../common/enum/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { GetUsername } from '../common/decorators/get-username.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupUserDto) {
    const tokens = await this.authService.signup(body);
    if (!tokens) {
      throw new HttpException(
        'username, email, or phone must be unique!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return tokens;
  }
  @Post('login')
  logIn(@Body() body: LoginUserDto) {
    return this.authService.logIn(body);
  }
  @Post('signup/tutor')
  async tutorSignup(@Body() body: SignupStaffDto) {
    const user = await this.authService.signUpStaff(body);
    if (!user) {
      throw new HttpException('token is invalid', HttpStatus.UNAUTHORIZED);
    }
    user.role = roles.TEACHER;
    const tokens = await this.authService.signup(body);
    if (!tokens) {
      throw new HttpException(
        'username, email, or phone must be unique!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return tokens;
  }
  @Post('signup/visor')
  async visorSignup(@Body() body: SignupStaffDto) {
    const user = await this.authService.signUpStaff(body);
    if (!user) {
      throw new HttpException('token is invalid', HttpStatus.UNAUTHORIZED);
    }
    user.role = roles.SUPERVISOR;
    const tokens = await this.authService.signup(body);
    if (!tokens) {
      throw new HttpException(
        'username, email, or phone must be unique!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return tokens;
  }
  @Roles(roles.SUPERVISOR)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Post('key')
  setApiKey(@Req() req: any, @Body() body: { tutor: string }) {
    const { user } = req;
    if (!body.tutor) {
      throw new HttpException('tutor is required', HttpStatus.BAD_REQUEST);
    }
    return this.authService.setApiKey(user.username, body.tutor);
  }
  @Roles(roles.SUPERVISOR)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Get('key')
  getApiKey(@Req() req: any) {
    const { user } = req;
    return this.authService.getApiKey(user.username);
  }

  @UseGuards(AuthGuard('github'))
  @Get('github/login')
  async login_gh() {}
  @Get('github/cb')
  @UseGuards(AuthGuard('github'))
  async callbk_gh(@GetUsername() username: string) {
    const tokens = await this.authService.loginGithub(username);
    if (tokens) {
      return tokens;
    }
    throw new HttpException(
      'You are not signed in yet!',
      HttpStatus.UNAUTHORIZED,
    );
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  refresh(@GetUsername() name: string, @GetUser('roke') role: number) {
    return this.authService.refreshToken(name, role);
  }
  @Delete('logout')
  @UseGuards(AuthGuard('jwt'))
  logOut(@GetUsername() name: string) {
    return this.authService.logOut();
  }
}
