class IBaseSection {
  kind: 'text' | 'image' | 'video';
  version: string;
  priority: number;
}

export class ITextSection extends IBaseSection {
  text: string;
}

export class IFileSection extends IBaseSection {
  alt: string;
}
