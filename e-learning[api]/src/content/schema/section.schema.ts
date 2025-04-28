import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SectionType = TextSection | ImageSection | VideoSection;

enum sectionType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
}

enum ImageType {
  jpeg = 'Image/jpeg',
  png = 'Image/png',
  webp = 'Image/webp',
}

enum VideoType {
  mp4 = 'Video/mp4',
}

@Schema({ discriminatorKey: 'kind' })
export class BaseSection {
  @Prop({ enum: sectionType })
  kind: sectionType;

  @Prop({ match: /\d{2}-\d{4}/ })
  version: string;

  @Prop()
  priority: number;
}

@Schema()
export class TextSection extends BaseSection {
  @Prop()
  text: string;
}

@Schema()
export class ImageSection extends BaseSection {
  @Prop()
  type: string;

  @Prop()
  alt: string;

  @Prop()
  path: string;

  @Prop()
  size: string;

  @Prop()
  frame: string;

  @Prop()
  aspect: string;
}

@Schema()
export class VideoSection extends BaseSection {
  @Prop()
  type: string;

  @Prop()
  alt: string;

  @Prop()
  path: string;

  @Prop()
  size: string;

  @Prop()
  frame: string;
}

export const SectionSchema = SchemaFactory.createForClass(BaseSection);
export const TextSectionSchema = SchemaFactory.createForClass(TextSection);
export const ImageSectionSchema = SchemaFactory.createForClass(ImageSection);
export const VideoSectionSchema = SchemaFactory.createForClass(VideoSection);
