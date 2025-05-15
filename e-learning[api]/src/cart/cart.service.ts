import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto, discountCartDto } from './dtos/cart.dto';
import { InsertCartDto } from './dtos/cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    private userService: UserService,
    @InjectRepository(Cart) private carts: Repository<Cart>,
    @InjectRepository(CartItem) private cartitems: Repository<CartItem>,
  ) {}

  getCart(id: number) {
    return this.carts.findOneBy({ id: id });
  }
  async createCart(data: CreateCartDto) {
    const user = await this.userService.getUserById(data.userId);
    const cart = this.carts.create({
      user: user ?? {},
      totalPrice: 1000, //! dummy data
    });
    return this.carts.save(cart);
  }
  discountCart(id: number, code: discountCartDto) {
    console.info({ code });
    return `Cart ${id} Off!!!`;
  }
  async destroyCart(id: number) {
    const cart = await this.carts.findBy({ id: id });
    return this.carts.remove(cart);
  }

  async insertCart(id: number, data: InsertCartDto) {
    const cart = await this.carts.findOneBy({ id: id });
    if (cart) {
      const cItem = this.cartitems.create({
        pid: data.pid,
        price: 1000, //! dummy data
        cart: cart,
      });
      return this.cartitems.save(cItem);
    }
    return null;
  }
  async removeCart(id: number, pid: number) {
    const citem = await this.cartitems.findBy({ id: pid });
    return this.cartitems.remove(citem);
  }
}
