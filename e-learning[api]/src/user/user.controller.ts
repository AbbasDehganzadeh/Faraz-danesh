import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GetUsername } from '../common/decorators/get-username.decorator';
import { UserService } from './user.service';
import { ResponseUserDto } from '../auth/dtos/user.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getUser(@GetUsername() username: string): Promise<ResponseUserDto> {
    return this.userService.getMe(username);
  }
}
