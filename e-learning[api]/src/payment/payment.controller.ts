import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PaymentService } from './payment.service';
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

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ResponsePaymentDto })
  getPayment(@Param('id') id: number) {
    return this.paymentService.getPayment(id);
  }

  @Post(':id/purchase')
  purchasePayment(@Param('id') id: number) {
    return this.paymentService.purchasePayment(id);
  }

  @Post(':id/discount')
  discountPayment(@Param('id') id: number) {
    return this.paymentService.discountPayment(id);
  }

  @Get(':id/recieve')
  recievePayment(@Param('id') id: number) {
    return this.paymentService.recievePayment(id);
  }
}
