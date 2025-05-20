import { Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  makePayment() {
    return this.paymentService.makePayment();
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
