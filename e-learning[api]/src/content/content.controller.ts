import { Reflector } from '@nestjs/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import {
  CourseService,
  SectionService,
  TutorialService,
} from './content.service';
import { ICourse } from './intefaces/course.interface';
import { ITutorial } from './intefaces/tutorial.interface';
import { IFileSection, ITextSection } from './intefaces/section.interface';
import { RolesGuard } from 'src/auth/decorators/roles.guard';
import { Roles } from 'src/auth/decorators/roles.docorator';
import { roles } from 'src/common/enum/roles.enum';
import { Response } from 'express';

@Controller('/api')
export class ContentController {
  constructor(
    private courseService: CourseService,
    private tutorialService: TutorialService,
    private sectionService: SectionService,
  ) {}
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
  newCourse(@Body() body: ICourse) {
    console.debug({ body });
    return this.courseService.createCourse(body);
  }
  // update the course by specified version
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Put('course/:slug')
  updateCourse(@Param('slug')slug:string, @Body()body: ICourse) {
    return this.courseService.updateCourse(slug,body);
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
  getTutorials() {
    return this.tutorialService.findTutorials();
  }
  @Get('tutorial/:slug')
  getTutorial(@Param('slug') slug: string) {
    return this.tutorialService.getTutorial(slug);
  }
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Post('tutorial')
  newTutorial(@Body() body: ITutorial) {
    return this.tutorialService.createTutorial(body);
  }
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Post('tutorial/:slug/section')
  updateSection(@Param('slug') slug: string, @Body() body: ITextSection) {
    console.debug({ body });
    return this.sectionService.AddTextSection(slug, body);
  }
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @UseInterceptors(FileInterceptor('image', { dest: 'Images' }))
  @Post('tutorial/:slug/image')
  updateImageSection(
    @Param('slug') slug: string,
    @Body() body: IFileSection,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.debug({ slug, body, file });
    return this.sectionService.AddFileSection(slug, body, file);
  }
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @UseInterceptors(FileInterceptor('video', { dest: 'Videos' }))
  @Post('tutorial/:slug/video')
  updateVideoSection(
    @Param('slug') slug: string,
    @Body() body: IFileSection,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.debug({ slug, body, file });
    return this.sectionService.AddFileSection(slug, body, file);
  }
  @Get('content/asset/')
  getAsset(@Query('path') path: string, @Res() res: Response) {
    res.sendFile(process.cwd() + '/' + path);
  }
  // update the tutorial by specified version
  @Roles(roles.TEACHER)
  @UseGuards(AuthGuard('jwt'), new RolesGuard(new Reflector()))
  @Put('tutorial/:slug')
  updateTutorial(@Param('slug')slug:string, @Body()body: ICourse) {
    return this.tutorialService.updateTutorial(slug,body);
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
