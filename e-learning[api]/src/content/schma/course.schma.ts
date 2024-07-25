import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
class Course {
  @Prop()
  slug: string;

  @Prop()
  name: string;

  @Prop()
  intro: string;

  @Prop()
  description: string;

  @Prop()
  teachers: number[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
