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
    return this.courseModel.find();
  }
  getCourse(slug: string) {
    return this.courseModel.findOne({ slug: slug });
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
    return this.TutorialModel.find();
  }
  getTutorial(slug: string) {
    return this.TutorialModel.findOne({ slug: slug });
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
