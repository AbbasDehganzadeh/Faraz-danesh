import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PaymentService } from './payment.service';
import { PaymentOwnerGuard } from './guards/paymentOwner.guard';
import { PaymentOwnerOrStaffGuard } from './guards/paymentOwnerOrStaff.guard';
import { ResponsePaymentDto } from './dtos/response-payment.dto';

@ApiBearerAuth()
@Controller('payment')
@UseGuards(JwtGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponsePaymentDto })
  makePayment(@GetUser('id') userId: number) {
    return this.paymentService.makePayment(userId);
  }

  @ApiOkResponse({
    description: 'a route for getting payment detail',
    type: ResponsePaymentDto,
  })
  @Get(':id')
  @UseGuards(PaymentOwnerOrStaffGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponsePaymentDto })
  getPayment(@Param('id') id: number) {
    return this.paymentService.getPayment(id);
  }

  @Get(':id/purchase')
  @UseGuards(PaymentOwnerGuard)
  purchasePayment(@Param('id') id: number) {
    return this.paymentService.purchasePayment(id);
  }

  @Get(':id/discount')
  @UseGuards(PaymentOwnerGuard)
  discountPayment(@Param('id') id: number, @Query('code') code: string) {
    return this.paymentService.getDiscountPayment(id, code);
  }

  @Get('recieve')
  recievePayment(
    @Query('authority') authority: string,
    @Query('status') status: string,
  ) {
    return this.paymentService.recievePayment(authority, status);
  }
}
