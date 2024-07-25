import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CourseDocument } from './schma/course.schma';
import { Model } from 'mongoose';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel('courses') private courseModel: Model<CourseDocument>,
    @InjectModel('tutorials') private TutorialModel: Model<TutorialDocument>,
  ) {}
}
