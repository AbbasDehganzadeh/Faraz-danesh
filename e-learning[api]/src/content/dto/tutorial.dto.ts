import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateTutorialDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 250)
  name: string;

  @IsString()
  @Matches(/\d{2}-\d{4}/)
  @IsOptional()
  version: string;

  @IsNotEmpty()
  @MinLength(10)
  @IsOptional()
  description: string;

  @ValidateIf((v) => v % 1000 === 0)
  @IsPositive()
  @IsInt()
  @IsOptional()
  price: number;

  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Length(3, 25, { each: true })
  @IsOptional()
  tags: string[];
}

export class UpdateTutorialDto extends PartialType(CreateTutorialDto) {}
