import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './schma/course.schma';
import { TutorialSchema } from './schma/tutorial.schma';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'courses', schema: CourseSchema } /*name:Course.name*/,
      { name: 'tutorials', schema: TutorialSchema } /*name:tutorial.name*/,
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
