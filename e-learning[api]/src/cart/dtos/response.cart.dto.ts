import { IsEnum } from 'class-validator';
import { Transform, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from '../../user/dtos/response.user.dto';
import { CartItemDto } from './cart-item.dto';
import { CartStatus } from 'src/common/enum/cart-status.enum';

export class ResponseCartDto {
  @ApiProperty({ title: 'id', description: 'ID of cart', example: 1 })
  id: number;

  @ApiProperty({
    title: 'status',
    description: 'status of cart',
    example: CartStatus.Open,
    enum: CartStatus,
  })
  @IsEnum(CartStatus)
  @Transform(({ value }) => {
    switch (value) {
      case CartStatus.Open:
        return 'Open';
      case CartStatus.Pending:
        return 'Pending';
      default:
        return 'Close';
    }
  })
  status: CartStatus;
  @ApiProperty({
    title: 'discount',
    description: 'discount in percentage `n%`',
    example: 25,
  })
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
