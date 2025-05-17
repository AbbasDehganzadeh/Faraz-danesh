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
import {
  LoginUserDto,
  ResponseUserDto,
  SignupStaffDto,
  SignupUserDto,
} from './dtos/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './decorators/roles.guard';
import { Roles } from './decorators/roles.docorator';
import { roles } from './roles.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { GetUsername } from '../common/decorators/get-username.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getUser(@GetUsername() username: string): Promise<ResponseUserDto> {
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
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Post('key')
  setApiKey(@Req() req: any, @Body() body: { tutor: string }) {
    const { user } = req;
    return this.authService.setApiKey(user.username, body.tutor);
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
  refresh(
    @GetUsername() name: string,
    @GetUser('id') id: number,
    @GetUser('roke') role: number,
  ) {
    return this.authService.refreshToken(id, name, role);
  }
  @Delete('logout')
  @UseGuards(AuthGuard('jwt'))
  logOut(@GetUsername() name: string) {
    return this.authService.logOut();
  }
}
