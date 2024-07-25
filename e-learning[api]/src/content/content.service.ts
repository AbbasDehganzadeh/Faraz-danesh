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
import { ICourse } from './intefaces/course.interface';
import { ITutorial } from './intefaces/tutorial.interface';
import { IFileSection, ITextSection } from './intefaces/section.interface';

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
      version: data.version,
      intro: data.intro,
      description: data.description,
      teachers: data.teachers,
      price: data.price,
      tags: data.tags,
    });
    return course.save();
  }
  // update the course by specified version
  updateCourse() {
    return 'update course';
  }
  //TODO makePublish [generic function]
  publishCourse(slug: string) {
    return this.courseModel.findOneAndUpdate({ slug: slug }, { draft: false });
  }
  //TODO makeDraft [generic function]
  draftCourse(slug: string) {
    return this.courseModel.findOneAndUpdate({ slug: slug }, { draft: true });
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
      version: data.version,
      description: data.description,
      teachers: data.teachers,
      price: data.price,
      tags: data.tags,
    });
    return tutorial.save();
  }
  // update the tutorial by specified version
  updateTutorial() {
    return 'update tutorial';
  }
  //TODO makePublish [generic function]
  publishTutorial(slug: string) {
    return this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { draft: false },
    );
  }
  //TODO makeDraft [generic function]
  draftTutorial(slug: string) {
    return this.TutorialModel.findOneAndUpdate({ slug: slug }, { draft: true });
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
  AddTextSection(slug: string, data: ITextSection) {
    // const section = new this.texttSection(data);
    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { $push: { section: data } },
    );
    return tutorial;
  }
  AddFileSection(slug: string, data: IFileSection, file: Express.Multer.File) {
    // doing some stuff with data
    const path = file.filename;
    const size = file.size;

    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { $push: { section: { ...data, path, size } } },
    );
    return tutorial;
  }
