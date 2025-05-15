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
    MongooseModule.forFeatureAsync([
      {
        name: 'courses',
        useFactory() {
          const schema = CourseSchema;
          schema.pre('save', function () {
            let obj = this; // for clarity!
            const len = obj.comments.length;
            const ratings = obj.comments
              .map((c) => c.rate)
              .reduce((a, b) => a + b);
            const rate = ratings / len;
            obj.rate = rate;
          });
          return schema;
        },
      } /*name:Course.name*/,
      {
        name: 'tutorials',
        useFactory() {
          const schema = CourseSchema;
          schema.pre('save', function () {
            let obj = this; // for clarity!
            const len = obj.comments.length;
            const ratings = obj.comments
              .map((c) => c.rate)
              .reduce((a, b) => a + b);
            const rate = ratings / len;
            obj.rate = rate;
          });
          return schema;
        },
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
  exports: [CourseService, TutorialService],
})
export class ContentModule {}
