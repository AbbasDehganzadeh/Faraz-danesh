import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TutorialDocument } from './schema/tutorial.schema';
import { ITutorial } from './intefaces/tutorial.interface';
import { IFileSection, ITextSection } from './intefaces/section.interface';
import { createSlug, createVersion } from '../common/utils/content';

@Injectable()
export class TutorialService {
  constructor(
    @InjectModel('tutorials') private TutorialModel: Model<TutorialDocument>,
  ) {}
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
      return null;
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
  async updateTutorial(
    slug: string,
    data: Partial<ITutorial>,
    username: string,
  ) {
    const tutorial = await this.TutorialModel.findOne({ slug });
    if (tutorial) {
      tutorial.name = data.name ?? tutorial.name;
      tutorial.description = data.description ?? tutorial.description;
      tutorial.price = data.price ?? tutorial.price;
      tutorial.tags = data.tags ?? tutorial.tags;
      tutorial.teachers = [...tutorial.teachers, username];
      tutorial.versions = [...tutorial.versions, data.version!];
      tutorial.save();
    }
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
  ) {}

  async addSection(slug: string, data: ITextSection | IFileSection) {
    const tutorial = await this.TutorialModel.findOne({ slug });
    if (!tutorial?.versions.includes(data.version)) {
      return null;
    }
    const res = await this.TutorialModel.updateOne(
      { slug },
      { $push: { sections: data } },
    );
    return res.modifiedCount ? tutorial : null;
  }

  async addTextSection(slug: string, data: ITextSection) {
    data.kind = 'text';
    const tutorial = await this.addSection(slug, data);
    return tutorial;
  }
  async addFileSection(
    slug: string,
    data: IFileSection,
    file: Express.Multer.File,
  ) {
    data.path = file.path;
    data.size = file.size;

    if (file.fieldname == 'video') {
      data.kind = 'video';
    } else {
      data.kind = 'image';
    }
    const tutorial = await this.addSection(slug, data);
    return tutorial;
  }

  getFile(path: string) {
    return path;
  }
}
