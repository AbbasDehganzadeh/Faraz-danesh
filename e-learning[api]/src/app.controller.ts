import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({ example: 'Hello World!' })
  @ApiTags("hello world")
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
