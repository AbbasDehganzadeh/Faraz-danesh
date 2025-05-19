import { Transform, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from '../../user/dtos/response.user.dto';
import { CartItemDto } from './cart-item.dto';

export class ResponseCartDto {
  @ApiProperty({ title: 'id', description: 'ID of cart', example: 1 })
  id: number;

  @ApiProperty({
    title: 'discount',
    description: 'discount in percentage `n%`',
    example: 25,
  })
  @Transform(({ value }) => value / 100)
  discount: number;
  @ApiProperty({
    name: 'discount-code',
    title: 'discount code',
    description: 'discount code to get discount@',
    example: 'a1-1a',
    format: 'wd-wd',
  })
  @Expose({ name: 'discount-code' })
  @Transform(({ obj }) => obj['discountCode'])
  discountCode: string;

  @ApiProperty({
    name: 'total_price',
    title: 'total price',
    description: 'total price of cart items',
    example: 25000,
  })
  @Expose({ name: 'total_price' })
  @Transform(({ obj }) => obj['totalPrice'])
  totalPrice: number;
  @ApiProperty({
    name: 'final_price',
    title: 'final price',
    description: 'total price of cart items after discount',
    example: 16000,
    type: Number,
  })
  @Expose({ name: 'final_price' })
  get finalPrice() {
    return this.totalPrice - (this.totalPrice / 100) * this.discount;
  }

  @ApiProperty({
    name: 'created_at',
    title: 'created-at',
    description: 'creation cart date!',
    example: new Date(),
    type: Date,
  })
  @Expose({ name: 'created_at' })
  @Transform(({ obj }) => obj['createdAt'])
  createdAt: Date;
  @ApiProperty({
    name: 'updated_at',
    title: 'updated-at',
    description: 'update cart date!',
    example: new Date(),
    type: Date,
  })
  @Expose({ name: 'updated_at' })
  @Transform(({ obj }) => obj['updatedAt'])
  updatedAt: Date;

  @ApiProperty({
    title: 'user of cart',
    description: 'user owns cart!',
    type: () => ResponseUserDto,
  })
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;

  @ApiProperty({
    title: 'cart items',
    description: 'items in cart',
    type: () => [CartItemDto],
  })
  @Expose({ name: 'cart_items' })
  @Transform(({ obj }) => obj['cartItems'])
  @Type(() => CartItemDto)
  cartItems: CartItemDto;
}
