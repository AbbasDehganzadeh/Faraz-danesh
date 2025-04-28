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
  ) { }
  findCourses() {
    return this.courseModel.find();
  }
  async getCourse(slug: string) {
    return await this.courseModel
      .findOne({ slug: slug })
      .populate<{ tutorials: Tutorial }>('tutorials')
  }
  async createCourse(data: ICourse, username: string) {
    const slug = createSlug(data.name);
    const version = createVersion();
    data.version = version;
    const entity = await this.getCourse(slug);
    if (entity?.slug === slug) {
      return null;
    }
    console.log('created', slug);
    const course = new this.courseModel({
      slug,
      name: data.name,
      version: data.version,
      versions: [data.version],
      intro: data.intro,
      description: data.description,
      teachers: [username],
      price: data.price,
      tags: data.tags,
    });
    return course.save();
  }
  async addTutorial(courseSlug: string, tid: Types.ObjectId, versions: string[], teachers: string[]) {
    const course = this.courseModel.updateOne(
      { slug: courseSlug },
      {
        $push: { tutorials: tid },
        $addToSet: { versions: versions, teachers: teachers },
      },
    );
    return course;
  }
  // update the course by specified version
  async updateCourse(slug: string, data: Partial<ICourse>, username: string) {
    const course = await this.courseModel.findOne({ slug });
    if (course) {
      course.name = data.name ?? course.name
      course.description = data.description ?? course.description
      course.price = data.price ?? course.price
      course.tags = data.tags ?? course.tags
      course.teachers = [...course.teachers, username]
      course.versions = [...course.versions, data.version!]
      course.save()
    }
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
