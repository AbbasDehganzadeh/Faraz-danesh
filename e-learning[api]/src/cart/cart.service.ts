import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  getCart(id: number) {
    return `Cart ${id}`;
  }
  createCart() {
    return 'Cart Creation!';
  }
  discountCart(id: number) {
    return `Cart ${id} Off!!!`;
  }
  destroyCart(id: number) {
    return `Cart ${id}`;
  }
}
