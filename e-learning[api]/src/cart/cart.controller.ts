import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CartOwnerGuard } from '../payment/guards/cartOwner.guard';
import { CartService } from './cart.service';
import {
  CreateCartDto,
  discountCartDto,
  ResponseCartDto,
} from './dtos/cart.dto';
import { InsertCartDto } from './dtos/cart-item.dto';

@Controller('cart')
@UseGuards(JwtGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'a route for recieving cart info',
    type: ResponseCartDto,
  })
  @Get(':id')
  @UseGuards(CartOwnerGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponseCartDto })
  recieveCart(@Param('id') id: number) {
    return this.cartService.getCart(id);
  }

  @ApiBearerAuth()
  @Post('')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponseCartDto })
  createCart(@Body() cart: CreateCartDto) {
    return this.cartService.createCart(cart);
  }

  @ApiBearerAuth()
  @Post(':id/discount')
  @UseGuards(CartOwnerGuard)
  discountCart(@Param('id') id: number, @Body() Code: discountCartDto) {
    return this.cartService.discountCart(id, Code);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(CartOwnerGuard)
  destroyCart(@Param('id') id: number) {
    return this.cartService.destroyCart(id);
  }

  @ApiBearerAuth()
  @Post(':id')
  @UseGuards(CartOwnerGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponseCartDto })
  insertCart(@Param('id') id: number, @Body() item: InsertCartDto) {
    return this.cartService.insertCart(id, item);
  }

  @ApiBearerAuth()
  @Delete(':id/:pid')
  @UseGuards(CartOwnerGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponseCartDto })
  removeCart(@Param('id') id: number, @Param('pid') pid: number) {
    return this.cartService.removeCart(id, pid);
  }
}
