import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import {
  CourseService,
  SectionService,
  TutorialService,
} from './content.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './schma/course.schma';
import { TutorialSchema } from './schma/tutorial.schma';
import {
  ImageSection,
  ImageSectionSchema,
  TextSection,
  TextSectionSchema,
  VideoSection,
  VideoSectionSchema,
} from './schma/section.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'courses', schema: CourseSchema } /*name:Course.name*/,
      {
        name: 'tutorials',
        schema: TutorialSchema,
        discriminators: [
          { name: 'text', schema: TextSectionSchema },
          { name: 'image', schema: ImageSectionSchema },
          { name: 'video', schema: VideoSectionSchema },
        ],
      } /*name:tutorial.name*/,
    ]),
  ],
  controllers: [ContentController],
  providers: [CourseService, SectionService, TutorialService],
})
export class ContentModule {}
