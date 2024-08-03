import { TextSection } from './schma/section.schema';
import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
export class CourseService {
  constructor(
    @InjectModel('courses') private courseModel: Model<CourseDocument>,
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
  // update the course by specified version
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
}
@Injectable()
export class TutorialService {
  constructor(
    @InjectModel('tutorials') private TutorialModel: Model<TutorialDocument>,
  ) {}
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
  // update the tutorial by specified version
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

@Injectable()
export class SectionService {
  constructor(
    @InjectModel('tutorials') private TutorialModel: Model<TutorialDocument>,
    @InjectModel('text') private texttSection: Model<TextSection>,
  ) {}

  AddSection(slug: string, data: any) {
    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { section: data },
    );

    return tutorial.sort('section.priority', { override: false });
  }
  AddTextSection(slug: string, data: any) {
    const section = new this.texttSection(data);
    console.debug({ section });
    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { $push: { section: section } },
    );
    return tutorial;
  }
  AddFileSection(slug: string, data: any, file: any) {
    // doing some stuff with data
    data.path = file.filename;

    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { $push: { section: { data } } },
    );
    return tutorial;
  }
}
