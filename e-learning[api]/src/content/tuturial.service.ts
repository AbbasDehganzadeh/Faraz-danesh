import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TutorialDocument } from './schema/tutorial.schema';
import { ImageSection, SectionType, TextSection, VideoSection } from './schema/section.schema';
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
    return await this.TutorialModel
      .findOne({ slug: slug })
      .populate<{ sections: SectionType }>('sections')
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
    @InjectModel('texts') private textSection: Model<TextSection>,
    @InjectModel('images') private imageSection: Model<ImageSection>,
    @InjectModel('videos') private videoSection: Model<VideoSection>,
  ) { }

  addSection(slug: string, Id: Types.ObjectId) {
    const tutorial = this.TutorialModel.findOneAndUpdate(
      { slug: slug },
      { $push: { sections: Id } },
    );

    return tutorial.sort('section.priority', { override: false });
  }
  addTextSection(slug: string, data: ITextSection) {
    const section = new this.textSection({
      kind: 'text',
      priority: data.priority,
      version: data.version,
      text: data.text,
    })
    section.save()
    const objId = section._id
    return this.addSection(slug, objId);
  }
  addFileSection(slug: string, data: IFileSection, file: Express.Multer.File) {
    let objId = new Types.ObjectId()
    const path = file.path;
    const size = file.size;
    const type = file.mimetype;

    if (file.fieldname == "video") {
      const section = new this.videoSection({
        kind: 'video',
        proority: data.priority,
        version: data.version,
        alt: data.alt,
        type,
        path,
        size,
      })
      section.save()
      objId = section._id
    } else {
      const section = new this.imageSection({
        kind: 'image',
        proority: data.priority,
        version: data.version,
        alt: data.alt,
        type,
        path,
        size,
      })
      section.save()
      objId = section._id
    }
    return this.addSection(slug, objId);
  }

  getFile(path: string) {
    return path;
  }

}
