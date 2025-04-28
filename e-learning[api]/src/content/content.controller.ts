import { Reflector } from '@nestjs/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/decorators/roles.guard';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles.docorator';
import { roles } from 'src/common/enum/roles.enum';
import { CourseService } from './course.service';
import { TutorialService, SectionService } from './tuturial.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CreateTutorialDto, UpdateTutorialDto } from './dto/tutorial.dto';
import { TutorialQueryDto } from './dto/query.dto';
import { IFileSection, ITextSection } from './intefaces/section.interface';

@Controller('/api')
export class ContentController {
  constructor(
    private courseService: CourseService,
    private tutorialService: TutorialService,
    private sectionService: SectionService,
  ) { }
  @Get('course')
  getCourses() {
    return this.courseService.findCourses();
  }
  @Get('course/:slug')
  getCourse(@Param('slug') slug: string) {
    return this.courseService.getCourse(slug);
  }
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Post('course')
  async newCourse(@Req() req: any, @Body() body: CreateCourseDto) {
    const { user } = req;
    const course = await this.courseService.createCourse(body, user.username);
    if (course) {
      return course
    }
    throw new HttpException(
      'Course with this name exists',
      HttpStatus.BAD_REQUEST,
    );
  }
  @Post('course/:slug/content')
  addTutorial(@Param('slug') slug: string, @Body() body: { slug: string }) {
    this.tutorialService.getTutorial(body.slug).then((tutorial) => {
      if (tutorial) {
        const { _id, versions, teachers } = tutorial
        return this.courseService.addTutorial(slug, _id, versions, teachers);
      }
      throw new HttpException(
        'tutorial with correspnding slug not found',
        HttpStatus.NOT_FOUND,
      );
    });
  }
  // update the course by specified version
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Put('course/:slug')
  updateCourse(@Req() req: any, @Param('slug') slug: string, @Body() body: UpdateCourseDto) {
    const { user } = req;
    this.courseService.getCourse(slug).then((course) => {
      if (course?.teachers.includes(user.username)) {
        return this.courseService.updateCourse(slug, body, user.username);
      }
      throw new HttpException(
        'user is not in teachers',
        HttpStatus.FORBIDDEN,
      );
    });
  }
  @Roles(roles.SUPERVISOR)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Put('course/:slug/publish')
  publishCourse(@Param('slug') slug: string) {
    return this.courseService.publishCourse(slug);
  }
  @Roles(roles.SUPERVISOR)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Put('course/:slug/draft')
  draftCourse(@Param('slug') slug: string) {
    return this.courseService.draftCourse(slug);
  }
  @Roles(roles.SUPERVISOR)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Delete('course/:slug/archive')
  archiveCourse() {
    return this.courseService.archiveCourse();
  }

  @Get('tutorial')
  getTutorials(@Query() q: TutorialQueryDto) {
    console.debug({ q });
    return this.tutorialService.findTutorials();
  }
  @Get('tutorial/:slug')
  getTutorial(@Query() q: TutorialQueryDto, @Param('slug') slug: string) {
    console.debug({ q });
    return this.tutorialService.getTutorial(slug);
  }
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Post('tutorial')
  async newTutorial(@Req() req: any, @Body() body: CreateTutorialDto) {
    const { user } = req;
    const tutorial = await this.tutorialService.createTutorial(body, user.username);
    if (tutorial) {
      return tutorial
    }
    throw new HttpException(
      'Tutorial with this name exists',
      HttpStatus.BAD_REQUEST,
    );
  }
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Post('tutorial/:slug/section')
  updateSection(@Param('slug') slug: string, @Body() body: ITextSection) {
    return this.sectionService.addTextSection(slug, body);
  }
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @UseInterceptors(FileInterceptor('image', { dest: 'Images' }))
  @Post('tutorial/:slug/image')
  updateImageSection(
    @Param('slug') slug: string,
    @Body() body: IFileSection,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /image\/(jpeg|png)/,
        })
        .addMaxSizeValidator({
          maxSize: 100 * 1024, // kb
        })
        .build()
    ) file: Express.Multer.File,
  ) {
    return this.sectionService.addFileSection(slug, body, file);
  }
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @UseInterceptors(FileInterceptor('video', { dest: 'Videos' }))
  @Post('tutorial/:slug/video')
  updateVideoSection(
    @Param('slug') slug: string,
    @Body() body: IFileSection,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /video\/(mp4)/,
        })
        .addMaxSizeValidator({
          maxSize: 100 * 1024 * 1024, // mb
        })
        .build()
    ) file: Express.Multer.File,
  ) {
    return this.sectionService.addFileSection(slug, body, file);
  }
  @Get('content/asset/')
  getAsset(@Query('path') path: string, @Res() res: Response) {
    res.sendFile(process.cwd() + '/' + path);
  }
  // update the tutorial by specified version
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Put('tutorial/:slug')
  updateTutorial(@Req() req: any, @Param('slug') slug: string, @Body() body: UpdateTutorialDto) {
    const { user } = req;
    this.tutorialService.getTutorial(slug).then((tutorial) => {
      if (tutorial?.teachers.includes(user.username)) {
        return this.tutorialService.updateTutorial(slug, body, user.username);
      }
      throw new HttpException(
        'user is not in teachers',
        HttpStatus.FORBIDDEN,
      );
    });
  }
  @Roles(roles.SUPERVISOR)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Put('tutorial/:slug/publish')
  publishTutorial(@Param('slug') slug: string) {
    return this.tutorialService.publishTutorial(slug);
  }
  @Roles(roles.SUPERVISOR)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Put('tutorial/:slug/draft')
  draftTutorial(@Param('slug') slug: string) {
    return this.tutorialService.draftTutorial(slug);
  }
  @Roles(roles.SUPERVISOR)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Delete('tutorial/:slug/archive')
  archiveTutorial() {
    return this.tutorialService.archiveTutorial();
  }
}
