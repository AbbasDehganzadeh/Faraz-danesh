import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Comment } from './comments.schema';
import { Section } from './section.schema';

export type TutorialDocument = HydratedDocument<Tutorial>;

@Schema()
class Tutorial {
  @Prop()
  slug: string;

  @Prop({ required: true })
  version?: string;

  @Prop()
  versions: string[];

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  section: unknown[];

  @Prop()
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
