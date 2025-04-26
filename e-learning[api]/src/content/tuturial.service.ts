import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TutorialDocument } from './schema/tutorial.schema';
import { TextSection } from './schema/section.schema';
import { ITutorial } from './intefaces/tutorial.interface';
import { IFileSection, ITextSection } from './intefaces/section.interface';
import { createSlug, createVersion } from 'src/common/utils/content';

@Injectable()
export class TutorialService {
  constructor(
    @InjectModel('tutorials') private TutorialModel: Model<TutorialDocument>,
  ) { }
  findTutorials() {
    return this.TutorialModel.find();
  }
  async getTutorial(slug: string) {
    return await this.TutorialModel.findOne({ slug: slug });
  }
  async createTutorial(data: ITutorial, username: string) {
    const slug = createSlug(data.name);
    const version = createVersion();
    data.version = version;
    const entity = await this.getTutorial(slug);
    if (entity?.slug == slug) {
      console.debug('updated', slug);
      return this.updateTutorial(slug, data, username);
    }
    console.debug('created', slug);
    const tutorial = new this.TutorialModel({
      slug,
      name: data.name,
      version: data.version,
      versions: [data.version],
      description: data.description,
      teachers: [username],
      price: data.price,
      tags: data.tags,
    });
    return tutorial.save();
  }
  // update the tutorial by specified version
  updateTutorial(slug: string, data: Partial<ITutorial>, username: string) {
    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug },
      {
        name: data.name,
        version: data.version,
        description: data.description,
        price: data.price,
        tags: data.tags,
        $addToSet: { versions: data.version, teachers: username },
      },
    );
    return tutorial;
  }
  //TODO makePublish [generic function]
  publishTutorial(slug: string) {
    return this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { draft: false },
    );
  }
  //TODO makeDraft [generic function]
  draftTutorial(slug: string) {
    return this.TutorialModel.findOneAndUpdate({ slug: slug }, { draft: true });
  }
  //TODO makeArchive [generic function]
  archiveTutorial() {
    return 'archive tutorial';
  }
}

@Injectable()
export class SectionService {
  constructor(
    @InjectModel('tutorials') private TutorialModel: Model<TutorialDocument>,
    @InjectModel('text') private texttSection: Model<TextSection>,
  ) { }

  AddSection(slug: string, data: any) {
    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { sections: data },
    );

    return tutorial.sort('section.priority', { override: false });
  }
  AddTextSection(slug: string, data: ITextSection) {
    // const section = new this.texttSection(data);
    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { $push: { sections: data } },
    );
    return tutorial;
  }
  AddFileSection(slug: string, data: IFileSection, file: Express.Multer.File) {
    // doing some stuff with data
    const path = `${file.path}`;
    const size = file.size;

    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { $push: { sections: { ...data, path, size } } },
    );
    return tutorial;
  }
  getFile(path: string) {
    return path;
  }
}
