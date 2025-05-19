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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GetUsername } from '../common/decorators/get-username.decorator';
import { CartOwnerGuard } from '../payment/guards/cartOwner.guard';
import { CartService } from './cart.service';
import { CreateCartDto, discountCartDto } from './dtos/cart.dto';
import { InsertCartDto } from './dtos/cart-item.dto';
import { ResponseCartDto } from './dtos/response.cart.dto';

@ApiUnauthorizedResponse({
  description: 'user must be logged-in with specified privallages!',
})
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
  @ApiCreatedResponse({
    description: 'a route for creating a new cart',
    type: ResponseCartDto,
  })
  @ApiBadRequestResponse({
    description: 'item with specified _id already exists!',
  })
  @ApiNotFoundResponse({
    description: 'content with specified _id not found!',
  })
  @ApiConflictResponse({
    description: 'user has one open cart',
  })
  @Post('')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponseCartDto })
  createCart(@GetUsername() username: string, @Body() cart: CreateCartDto) {
    return this.cartService.createCart(username, cart);
  }

  @ApiBearerAuth()
  @Post(':id/discount')
  @UseGuards(CartOwnerGuard)
  discountCart(@Param('id') id: number, @Body() Code: discountCartDto) {
    return this.cartService.discountCart(id, Code);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'a route for delieting a cart',
  })
  @ApiNotFoundResponse({
    description: 'inappropriate cart functioning!',
  })
  @Delete(':id')
  @UseGuards(CartOwnerGuard)
  destroyCart(@Param('id') id: number) {
    return this.cartService.destroyCart(id);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'a route for inserting a new item to cart',
    type: ResponseCartDto,
  })
  @ApiBadRequestResponse({
    description: 'item with specified _id already exists!',
  })
  @ApiNotFoundResponse({
    description: 'content with specified _id not found!',
  })
  @ApiNotFoundResponse({
    description: 'inappropriate cart functioning!',
  })
  @Post(':id')
  @UseGuards(CartOwnerGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponseCartDto })
  insertCart(@Param('id') id: number, @Body() item: InsertCartDto) {
    return this.cartService.insertCart(id, item);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: 'a route for removing an item from cart',
  })
  @ApiNotFoundResponse({
    description: 'inappropriate cart functioning!',
  })
  @Delete(':id/:pid')
  @UseGuards(CartOwnerGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponseCartDto })
  removeCart(@Param('id') id: number, @Param('pid') pid: number) {
    return this.cartService.removeCart(id, pid);
  }
}
