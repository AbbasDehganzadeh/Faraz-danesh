import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUsername } from '../common/decorators/get-username.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserService } from './user.service';
import { ResponseUserDto } from './dtos/response.user.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponseUserDto })
  @Get('me')
  getUser(@GetUsername() username: string) {
    return this.userService.getMe(username);
  }
}
