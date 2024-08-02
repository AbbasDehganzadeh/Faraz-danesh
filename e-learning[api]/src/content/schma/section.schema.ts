import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum SectionType {
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
export class Section {
  @Prop({ enum: SectionType })
  kind: SectionType;

  @Prop()
  version: string;

  @Prop()
  priority: number;
}

@Schema({ _id: false })
export class TextSection {
  kind: SectionType;
  version: string;
  priority: number;

  @Prop()
  text: string;
}

@Schema({ _id: false })
export class ImageSection {
  kind: SectionType;
  version: string;
  priority: number;

  @Prop({ enum: ImageType })
  type: ImageType;

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

@Schema({ _id: false })
export class VideoSection {
  kind: SectionType;
  version: string;
  priority: number;

  @Prop({ enum: VideoType })
  type: VideoType;

  @Prop()
  alt: string;

  @Prop()
  path: string;

  @Prop()
  size: string;

  @Prop()
  frame: string;
}

export const TextSectionSchema = SchemaFactory.createForClass(TextSection);
export const ImageSectionSchema = SchemaFactory.createForClass(ImageSection);
export const VideoSectionSchema = SchemaFactory.createForClass(VideoSection);
