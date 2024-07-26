import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CourseDocument } from './schma/course.schma';
import { TutorialDocument } from './schma/tutorial.schma';
import { Model } from 'mongoose';

export interface ICourse {
  name: string;
  intro: string;
  description: string;
  teachers: number[];
}

export interface ITutorial {
  name: string;
  description: string;
  teachers: number[];
}

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
  createCourse(data: ICourse) {
    const slug = data.name; //? for simplicity,
    const course = new this.courseModel({
      slug,
      name: data.name,
      intro: data.intro,
      description: data.description,
      teachers: data.teachers,
    });
    return course.save();
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
  createTutorial(data: ITutorial) {
    const slug = data.name; //? for simplicity,
    const tutorial = new this.TutorialModel({
      slug,
      name: data.name,
      description: data.description,
      teachers: data.teachers,
    });
    return tutorial.save();
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
