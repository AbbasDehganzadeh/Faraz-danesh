import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comments.controller';
import { ContentController } from './content.controller';
import { CommentService } from './comments.service';
import { CourseService } from './course.service';
import { TutorialService, SectionService } from './tuturial.service';
import { CourseSchema } from './schema/course.schema';
import { TutorialSchema } from './schema/tutorial.schema';
import {
  ImageSectionSchema,
  TextSectionSchema,
  VideoSectionSchema,
} from './schema/section.schema';

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
  controllers: [ContentController, CommentController],
  providers: [CommentService, CourseService, SectionService, TutorialService],
})
export class ContentModule {}
