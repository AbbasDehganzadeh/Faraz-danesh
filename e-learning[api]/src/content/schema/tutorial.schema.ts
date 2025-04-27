import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Comment } from './comments.schema';
import { SectionType } from './section.schema';

export type TutorialDocument = HydratedDocument<Tutorial>;

@Schema()
export class Tutorial {
  @Prop({ unique: true })
  slug: string;

  @Prop({ required: true, match: /\d{2}-\d{4}/ })
  version: string;

  @Prop()
  versions: string[];

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'sections' }] })
  sections: MongooseSchema.Types.ObjectId[];

  @Prop({ default: true })
  draft: boolean;

  @Prop()
  teachers: string[];

  @Prop()
  price: number;

  @Prop()
  tags: string[];

  @Prop({ type: Types.Decimal128 })
  rate: number;

  @Prop()
  comments: Comment[];
}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);
