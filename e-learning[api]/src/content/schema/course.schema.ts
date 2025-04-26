import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Comment } from './comments.schema';
import { Tutorial } from './tutorial.schema';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
class Course {
  @Prop({ unique: true })
  slug: string;

  @Prop({ required: true, match: /\d{2}-\d{4}/ })
  version: string;

  @Prop()
  versions: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'tutorials' }] })
  tutorials: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true })
  name: string;

  @Prop()
  intro: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  draft: boolean;

  @Prop()
  teachers: number[];

  @Prop()
  price: number;

  @Prop()
  tags: string[];

  @Prop({ type: Types.Decimal128 })
  rate: number;

  @Prop()
  comments: Comment[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
