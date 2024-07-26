import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TutorialDocument = HydratedDocument<Tutorial>;

@Schema()
class Tutorial {
  @Prop()
  slug: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  teachers: number[];
}

export const TutorialSchema = SchemaFactory.createForClass(Tutorial);
