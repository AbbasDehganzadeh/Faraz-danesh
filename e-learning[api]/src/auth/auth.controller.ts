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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'It creates & signup user.',
    example: { access_token: 'access_token', refresh_token: 'refresh_token' },
  })
  @ApiBadRequestResponse({
    description: "when user can't be created, or signed-up!",
  })
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
  @ApiCreatedResponse({
    description: 'it enables user to login',
    example: { access_token: 'access_token', refresh_token: 'refresh_token' },
  })
  @ApiBadRequestResponse({
    description: 'when username, or password is wrong!',
  })
  @Post('login')
  async logIn(@Body() body: LoginUserDto) {
    const tokens = await this.authService.logIn(body);
    if (!tokens) {
      throw new HttpException(
        'wrong username, or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return tokens;
  }
  @ApiCreatedResponse({
    description: 'It creates & signup teacher.',
    example: { access_token: 'access_token', refresh_token: 'refresh_token' },
  })
  @ApiBadRequestResponse({
    description: "when user can't be created, or signed-up!",
  })
  @ApiUnauthorizedResponse({ description: 'when sign-token is invalid!' })
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
  @ApiCreatedResponse({
    description: 'It creates & signup supervisor.',
    example: { access_token: 'access_token', refresh_token: 'refresh_token' },
  })
  @ApiBadRequestResponse({
    description: "when user can't be created, or signed-up!",
  })
  @ApiUnauthorizedResponse({ description: 'when sign-token is invalid!' })
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

  @ApiResponse({ description: 'a route for github/oath functionings' })
  @ApiTags('github')
  @UseGuards(GithubGuard)
  @Get('github/login')
  async login_gh() {}
  @ApiResponse({ description: 'a callback-route for github/oath functionings' })
  @ApiTags('github')
  @Get('github/cb')
  @UseGuards(GithubGuard)
  async callbk_gh(
    @GetUsername() username: string,
    @GetUser('emails') emails: string[],
  ) {
    const tokens = await this.authService.loginGithub(username, emails[0]);
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
