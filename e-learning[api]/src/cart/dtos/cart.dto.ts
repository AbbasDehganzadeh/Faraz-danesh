import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { InsertCartDto } from './cart-item.dto';

export class CreateCartDto {
  @ApiProperty({
    title: 'cart items',
    description: 'items in cart',
    type: () => [InsertCartDto],
  })
  @Type(() => InsertCartDto)
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @IsOptional()
  items: InsertCartDto[];
}

export class discountCartDto {
  @Matches(/^[\w\d]+-[\w\d]+$/)
  discountCode: string;
}
