import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CourseService,
  SectionService,
  TutorialService,
} from './content.service';
import { ICourse } from './intefaces/course.interface';
import { ITutorial } from './intefaces/tutorial.interface';

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
  @Post('course')
  newCourse(@Body() body: ICourse) {
    console.debug({ body });
    return this.courseService.createCourse(body);
  }
  // update the course by specified version
  @Put('course/:slug')
  updateCourse() {
    return this.courseService.updateCourse();
  }
  @Put('course/:slug/publish')
  publishCourse() {
    return this.courseService.updateCourse();
  }
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
  @Post('tutorial')
  newTutorial(@Body() body: ITutorial) {
    return this.tutorialService.createTutorial(body);
  }
  @Post('tutorial/:slug/section')
  updateSection(@Param('slug') slug: string, @Body() body: any) {
    console.debug({ body });
    return this.sectionService.AddTextSection(slug, body);
  }
  @UseInterceptors(FileInterceptor('image', { dest: 'Images' }))
  @Post('tutorial/:slug/image')
  updateImageSection(
    @Param('slug') slug: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.debug({ slug, body, file });
    return this.sectionService.AddFileSection(slug, body, file);
  }
  @UseInterceptors(FileInterceptor('video', { dest: 'Videos' }))
  @Post('tutorial/:slug/video')
  updateVideoSection(
    @Param('slug') slug: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.debug({ slug, body, file });
    return this.sectionService.AddFileSection(slug, body, file);
  }
  // update the tutorial by specified version
  @Put('tutorial/:slug')
  updateTutorial() {
    return this.tutorialService.updateTutorial();
  }
  @Put('tutorial/:slug/publish')
  publishTutorial() {
    return this.tutorialService.publishTutorial();
  }
  @Delete('tutorial/:slug/archive')
  archiveTutorial() {
    return this.tutorialService.archiveTutorial();
  }
}
