import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  CreateCartDto,
  discountCartDto,
  ResponseCartDto,
} from './dtos/cart.dto';
import { InsertCartDto } from './dtos/cart-item.dto';

@Controller('api/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponseCartDto })
  recieveCart(@Param('id') id: number) {
    return this.cartService.getCart(id);
  }
  @Post('')
  createCart(@Body() cart: CreateCartDto) {
    return this.cartService.createCart(cart);
  }
  @Post(':id/discount')
  discountCart(@Param('id') id: number, @Body() Code: discountCartDto) {
    return this.cartService.discountCart(id, Code);
  }
  @Delete(':id')
  destroyCart(@Param('id') id: number) {
    return this.cartService.destroyCart(id);
  }

  @Post(':id')
  insertCart(@Param('id') id: number, @Body() item: InsertCartDto) {
    return this.cartService.insertCart(id, item);
  }
  @Delete(':id/:pid')
  removeCart(@Param('id') id: number, @Param('pid') pid: number) {
    return this.cartService.removeCart(id, pid);
  }
}
