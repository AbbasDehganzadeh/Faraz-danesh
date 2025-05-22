import { IsNotEmpty, IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Cart } from '../entities/cart.entity';
import { ApiProperty } from '@nestjs/swagger';

export class InsertCartDto {
  @ApiProperty({
    title: 'product id',
    description: '_id of content(course/tutorial)',
  })
  // @Expose({ name: 'pid' })
  @IsNotEmpty()
  @IsUUID()
  pid: string;
}

export class CartItemDto {
  @ApiProperty({ title: 'id', description: 'ID of item cart', example: 1 })
  id: number;
  @ApiProperty({
    title: 'product id',
    description: '_id of content(course/tutorial)',
  })
  pid: string;
  @ApiProperty({
    title: 'price',
    description: 'price of item',
    example: 5000,
  })
  price: number;
  @Exclude()
  cart: Cart;
}
