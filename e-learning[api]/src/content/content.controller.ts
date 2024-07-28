import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ContentService, ICourse, ITutorial } from './content.service';

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
    return this.contentService.AddSection(slug, body);
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
