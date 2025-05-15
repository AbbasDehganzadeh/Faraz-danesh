import { IsNotEmpty, IsUUID } from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { Cart } from '../entities/cart.entity';

export class InsertCartDto {
  // @Expose({ name: 'pid' })
  @IsNotEmpty()
  // @IsUUID()
  pid: string;
}

export class CartItemDto {
  id: number;
  pid: string;
  price: number;
  @Exclude()
  cart: Cart;
}
