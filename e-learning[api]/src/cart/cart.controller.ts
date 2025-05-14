import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get(':id')
  recieveCart(@Param('id') id: number) {
    return this.cartService.getCart(id);
  }
  @Post('')
  createCart() {
    return this.cartService.createCart();
  }
  @Post(':id/discount')
  discountCart(@Param('id') id: number) {
    return this.cartService.discountCart(id);
  }
  @Delete('id')
  destroyCart(@Param('id') id: number) {
    return this.cartService.destroyCart(id);
  }
}
