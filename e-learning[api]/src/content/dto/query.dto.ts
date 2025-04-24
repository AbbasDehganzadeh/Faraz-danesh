import { IsOptional } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class TutorialQueryDto {
  @Type(() => Boolean)
  @IsOptional()
  all: boolean;
  @Type(() => Boolean)
  @Expose({ name: 'textonly' })
  @IsOptional()
  textOnly: boolean;
  @Type(() => Boolean)
  @Expose({ name: 'mediaonly' })
  @IsOptional()
  mediaOnly: boolean;
  @Type(() => Boolean)
  @Expose({ name: 'imageonly' })
  @IsOptional()
  imageOnly: boolean;
  @Type(() => Boolean)
  @Expose({ name: 'videoonly' })
  @IsOptional()
  videoOnly: boolean;
}
