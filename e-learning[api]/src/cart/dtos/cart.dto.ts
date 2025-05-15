import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { ResponseUserDto } from '../../user/dtos/user.dto';
import { CartItemDto, InsertCartDto } from './cart-item.dto';

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

export class ResponseCartDto {
  id: number;

  @Transform(({ value }) => value / 100)
  discount: number;
  @Expose({ name: 'discount-code' })
  @Transform(({ obj }) => obj['discountCode'])
  discountCode: string;

  @Expose({ name: 'total_price' })
  @Transform(({ obj }) => obj['totalPrice'])
  totalPrice: number;
  @Expose({ name: 'final_price' })
  get finalPrice() {
    return this.totalPrice - (this.totalPrice / 100) * this.discount;
  }

  @Expose({ name: 'created_at' })
  @Transform(({ obj }) => obj['createdAt'])
  createdAt: Date;
  @Expose({ name: 'updated_at' })
  @Transform(({ obj }) => obj['updatedAt'])
  updatedAt: Date;

  @Type(() => ResponseUserDto)
  user: ResponseUserDto;

  @Expose({ name: 'cart_items' })
  @Transform(({ obj }) => obj['cartItems'])
  @Type(() => CartItemDto)
  cartItems: CartItemDto;
}
