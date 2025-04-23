import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CourseDocument } from './schema/course.schema';
import { TutorialDocument } from './schema/tutorial.schema';
import { TextSection } from './schema/section.schema';
import { ICourse } from './intefaces/course.interface';
import { ITutorial } from './intefaces/tutorial.interface';
import { IFileSection, ITextSection } from './intefaces/section.interface';
import { createSlug, createVersion } from 'src/common/utils/content';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel('courses') private courseModel: Model<CourseDocument>,
  ) {}
  findCourses() {
    return this.courseModel.find();
  }
  async getCourse(slug: string) {
    return await this.courseModel.findOne({ slug: slug });
  }
  async createCourse(data: ICourse) {
    const slug = createSlug(data.name);
    const version = createVersion();
    data.version = version;
    const entity = await this.getCourse(slug);
    if (entity?.slug === slug) {
      console.log('updated', slug);
      return this.updateCourse(slug, data);
    }
    console.log('created', slug);
    const course = new this.courseModel({
      slug,
      name: data.name,
      version: data.version,
      versions: [data.version],
      intro: data.intro,
      description: data.description,
      teachers: data.teachers,
      price: data.price,
      tags: data.tags,
    });
    return course.save();
  }
  async addTutorial(courseSlug: string, tutorialId: Types.ObjectId) {
    const course = this.courseModel.updateOne(
      { slug: courseSlug },
      { intro: 'ok', $push: { tutorialsId: tutorialId } },
    );
    return course;
  }
  // update the course by specified version
  updateCourse(slug: string, data: ICourse) {
    const course = this.courseModel.findOneAndUpdate(
      { slug },
      {
        name: data.name,
        version: data.version,
        intro: data.intro,
        description: data.description,
        teachers: data.teachers,
        price: data.price,
        tags: data.tags,
        $addToSet: { versions: data.version },
      },
    );
    return course;
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
  async getTutorial(slug: string) {
    return await this.TutorialModel.findOne({ slug: slug });
  }
  async createTutorial(data: ITutorial) {
    const slug = createSlug(data.name);
    const version = createVersion();
    data.version = version;
    const entity = await this.getTutorial(slug);
    if (entity?.slug == slug) {
      console.debug('updated', slug);
      return this.updateTutorial(slug, data);
    }
    console.debug('created', slug);
    const tutorial = new this.TutorialModel({
      slug,
      name: data.name,
      version: data.version,
      versions: [data.version],
      description: data.description,
      teachers: data.teachers,
      price: data.price,
      tags: data.tags,
    });
    return tutorial.save();
  }
  // update the tutorial by specified version
  updateTutorial(slug: string, data: ITutorial) {
    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug },
      {
        name: data.name,
        version: data.version,
        description: data.description,
        teachers: data.teachers,
        price: data.price,
        tags: data.tags,
        $addToSet: { versions: data.version },
      },
    );
    return tutorial;
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
      { sections: data },
    );

    return tutorial.sort('section.priority', { override: false });
  }
  AddTextSection(slug: string, data: ITextSection) {
    // const section = new this.texttSection(data);
    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { $push: { sections: data } },
    );
    return tutorial;
  }
  AddFileSection(slug: string, data: IFileSection, file: Express.Multer.File) {
    // doing some stuff with data
    const path = `${file.path}`;
    const size = file.size;

    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { $push: { sections: { ...data, path, size } } },
    );
    return tutorial;
  }
  getFile(path: string) {
    return path;
  }
}
