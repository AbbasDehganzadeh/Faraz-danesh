import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../common/decorators/get-user.decorator';
import { PaymentService } from './payment.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('payment')
@UseGuards(JwtGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  makePayment(@GetUser('id') userId: number) {
    return this.paymentService.makePayment(userId);
  }

  @Get(':id')
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
