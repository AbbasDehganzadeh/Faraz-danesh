import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CourseDocument } from './schma/course.schma';
import { TutorialDocument } from './schma/tutorial.schma';
import { Model } from 'mongoose';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel('courses') private courseModel: Model<CourseDocument>,
    @InjectModel('tutorials') private TutorialModel: Model<TutorialDocument>,
  ) {}
  findCourses() {
    return 'find courses';
  }
  getCourse() {
    return 'get course';
  }
  createCourse() {
    return 'create course';
  }
  updateCourse() {
    return 'update course';
  }
  //TODO makePublish [generic function]
  publishCourse() {
    return 'publish course';
  }
  //TODO makeArchive [generic function]
  archiveCourse() {
    return 'archive course';
  }

  findTutorials() {
    return 'find tutorials';
  }
  getTutorial() {
    return 'get tutorial';
  }
  createTutorial() {
    return 'create tutorial';
  }
  updateTutorial() {
    return 'update tutorial';
  }
  //TODO makePublish [generic function]
  publishTutorial() {
    return 'publish tutorial';
  }
  //TODO makeArchive [generic function]
  archiveTutorial() {
    return 'archive tutorial';
  }
}
