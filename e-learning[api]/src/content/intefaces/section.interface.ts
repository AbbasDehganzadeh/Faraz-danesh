interface IBaseSection {
  kind: 'text' | 'image' | 'video';
  version: string;
  priority: number;
}

export interface ITextSection extends IBaseSection {
  text: string;
}

export interface IFileSection extends IBaseSection {
  alt: string;
  path: string;
  size: number;
  type: string;
}
