import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ContentService } from './content.service';

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
  newCourse() {
    return this.contentService.createCourse();
  }
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
  newTutorial() {
    return this.contentService.createTutorial();
  }
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
