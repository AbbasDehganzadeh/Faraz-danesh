import { Reflector } from '@nestjs/core';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { roles } from './roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { GetUsername } from '../common/decorators/get-username.decorator';
import { AuthService } from './auth.service';
import { RolesGuard } from './decorators/roles.guard';
import { Roles } from './decorators/roles.docorator';
import { LoginUserDto } from './dtos/login.user.dto';
import { SignupStaffDto, SignupUserDto } from './dtos/signup.user.dto';
import { ResponseUserDto } from './dtos/response.user.dto';
import { JwtGuard } from './guards/jwt.guard';
import { GithubGuard } from './guards/github.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponseUserDto })
  @Get('me')
  getUser(@GetUsername() username: string) {
    return this.authService.getMe(username);
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
  @Post('signup/tutor')
  async tutorSignup(@Body() body: SignupStaffDto) {
    const user = await this.authService.signUpStaff(body);
    if (!user) {
      throw new HttpException('token is invalid', HttpStatus.UNAUTHORIZED);
    }
    user.role = roles.TEACHER;
    return this.authService.signup(user);
  }
  @Post('signup/visor')
  async visorSignup(@Body() body: SignupStaffDto) {
    const user = await this.authService.signUpStaff(body);
    if (!user) {
      throw new HttpException('token is invalid', HttpStatus.UNAUTHORIZED);
    }
    user.role = roles.SUPERVISOR;
    return this.authService.signup(user);
  }
  @Roles(roles.SUPERVISOR)
  @UseGuards(JwtGuard, new RolesGuard(new Reflector()))
  @Post('key')
  setApiKey(@GetUsername() username: string, @Body() body: { tutor: string }) {
    return this.authService.setApiKey(username, body.tutor);
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
    @GetUser('roke') role: number,
  ) {
    return this.authService.refreshToken(id, name, role);
  }
  @Delete('logout')
  @UseGuards(JwtGuard)
  logOut(@GetUsername() name: string) {
    return this.authService.logOut();
  }
}
