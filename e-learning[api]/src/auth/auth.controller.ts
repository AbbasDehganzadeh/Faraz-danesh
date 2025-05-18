import { Reflector } from '@nestjs/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { roles } from '../common/enum/roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { GetUsername } from '../common/decorators/get-username.decorator';
import { AuthService } from './auth.service';
import { RolesGuard } from './decorators/roles.guard';
import { Roles } from './decorators/roles.docorator';
import { LoginUserDto } from './dtos/login.user.dto';
import { SignupStaffDto, SignupUserDto } from './dtos/signup.user.dto';
import { JwtGuard } from './guards/jwt.guard';
import { GithubGuard } from './guards/github.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

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
  @UseGuards(JwtGuard, new RolesGuard(new Reflector()))
  @Post('key')
  setApiKey(@GetUsername() username: string, @Body() body: { tutor: string }) {
    if (!body.tutor) {
      throw new HttpException('tutor is required', HttpStatus.BAD_REQUEST);
    }
    return this.authService.setApiKey(username, body.tutor);
  }
  @Roles(roles.SUPERVISOR)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Get('key')
  getApiKey(@GetUsername() username: string) {
    return this.authService.getApiKey(username);
  }

  @UseGuards(GithubGuard)
  @Get('github/login')
  async login_gh() {}
  @Get('github/cb')
  @UseGuards(GithubGuard)
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
  @UseGuards(JwtRefreshGuard)
  refresh(
    @GetUsername() name: string,
    @GetUser('id') id: number,
    @GetUser('role') role: number,
  ) {
    return this.authService.refreshToken(id, name, role);
  }
  @Delete('logout')
  @UseGuards(JwtGuard)
  logOut(@GetUsername() name: string) {
    return this.authService.logOut();
  }
}
