import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CourseDocument } from './schema/course.schema';
import { ICourse } from './intefaces/course.interface';
import { createSlug, createVersion } from 'src/common/utils/content';
import { Tutorial } from './schema/tutorial.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel('courses') private courseModel: Model<CourseDocument>,
  ) {}
  findCourses() {
    return this.courseModel.find();
  }
  async getCourse(slug: string) {
    return await this.courseModel
      .findOne({ slug: slug })
      .populate<{ tutorials: Tutorial }>('tutorials')
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
      //TODO assign teacher based on reuest
      price: data.price,
      tags: data.tags,
    });
    return course.save();
  }
  async addTutorial(courseSlug: string, tutorialId: Types.ObjectId) {
    const course = this.courseModel.updateOne(
      { slug: courseSlug },
      { $push: { tutorials: tutorialId } },
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
        //TODO assign teacher based on reuest
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
