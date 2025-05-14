import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller()
export class CartController {
  constructor(private cartService: CartService) {}
}
