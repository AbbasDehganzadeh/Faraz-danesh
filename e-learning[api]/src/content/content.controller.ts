import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ContentService, ICourse, ITutorial } from './content.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('/api')
export class ContentController {
  constructor(private contentService: ContentService) {}
  @Get('course')
  getCourses() {
    return this.contentService.findCourses();
  }
  @Get('course/:slug')
  getCourse(@Param('slug') slug: string) {
    return this.contentService.getCourse(slug);
  }
  @Post('course')
  newCourse(@Body() body: ICourse) {
    console.debug({ body });
    return this.contentService.createCourse(body);
  }
  // update the course by specified version
  @Put('course/:slug')
  updateCourse() {
    return this.contentService.updateCourse();
  }
  @Put('course/:slug/publish')
  publishCourse() {
    return this.contentService.updateCourse();
  }
  @Delete('course/:slug/archive')
  archiveCourse() {
    return this.contentService.archiveCourse();
  }

  @Get('tutorial')
  getTutorials() {
    return this.contentService.findTutorials();
  }
  @Get('tutorial/:slug')
  getTutorial(@Param('slug') slug: string) {
    return this.contentService.getTutorial(slug);
  }
  @Post('tutorial')
  newTutorial(@Body() body: ITutorial) {
    return this.contentService.createTutorial(body);
  }
  @Post('tutorial/:slug/section')
  updateSection(@Param('slug') slug: string, @Body() body: any) {
    console.debug({ body });
    return this.contentService.AddTextSection(slug, body);
  }
  @UseInterceptors(FileInterceptor('images', { dest: __dirname + 'Images' }))
  @Post('tutorial/:slug/image')
  updateImageSection(
    @Param('slug') slug: string,
    @Body() body: any,
    @UploadedFiles() files: any,
  ) {
    console.debug({ slug, body, files });
    return this.contentService.AddFileSection();
  }
  @UseInterceptors(FileInterceptor('videos'))
  @Post('tutorial/:slug/video')
  updateVideoSection(
    @Param('slug') slug: string,
    @Body() body: any,
    @UploadedFiles() files: any,
  ) {
    console.debug({ slug, body, files });
    return this.contentService.AddFileSection();
  }
  // update the tutorial by specified version
  @Put('tutorial/:slug')
  updateTutorial() {
    return this.contentService.updateTutorial();
  }
  @Put('tutorial/:slug/publish')
  publishTutorial() {
    return this.contentService.publishTutorial();
  }
  @Delete('tutorial/:slug/archive')
  archiveTutorial() {
    return this.contentService.archiveTutorial();
  }
}
