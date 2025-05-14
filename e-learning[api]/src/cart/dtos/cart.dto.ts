import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { InsertCartDto } from './cart-item.dto';

export class CreateCartDto {
  @Expose({ name: 'userid' })
  @IsNumber()
  userId: number;

  @Type(() => InsertCartDto)
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  items: InsertCartDto[];
}

export class discountCartDto {
  @Expose({ name: 'discount-code' })
  @IsNumberString()
  discountCode: string;
}
