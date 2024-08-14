import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Comment } from './comments.schema';
import { SectionType } from './section.schema';

export type TutorialDocument = HydratedDocument<Tutorial>;

@Schema()
class Tutorial {
  @Prop()
  slug: string;

  @Prop({ required: true, match: /\d{2}-\d{4}/ })
  version: string;

  @Prop()
  versions: string[];

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  //TODO make the Type specific!!
  @Prop()
  section: SectionType[];

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

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);
