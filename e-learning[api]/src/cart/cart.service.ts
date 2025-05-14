import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto, discountCartDto } from './dtos/cart.dto';
import { InsertCartDto } from './dtos/cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private carts: Repository<Cart>,
    @InjectRepository(CartItem) private cartitems: Repository<CartItem>,
  ) {}

  getCart(id: number) {
    return `Cart ${id}`;
  }
  createCart(data: CreateCartDto) {
    console.info({ data }, data.items);
    return 'Cart Creation!';
  }
  discountCart(id: number, code: discountCartDto) {
    console.info({ code });
    return `Cart ${id} Off!!!`;
  }
  destroyCart(id: number) {
    return `Cart ${id}`;
  }

  insertCart(id: number, data: InsertCartDto) {
    console.info({ data });
    return `Cart ${id}: `;
  }
  removeCart(id: number, pid: number) {
    return `Cart ${id}: Item ${pid}`;
  }
}
