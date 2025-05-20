import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  makePayment() {
    return 'Payment created!';
  }

  getPayment(id: number) {
    return `Payment ${id}!`;
  }

  purchasePayment(id: number) {
    return `Payment ${id} purchased!`;
  }

  discountPayment(id: number) {
    return `Payment ${id} Off!!`;
  }

  recievePayment(id: number) {
    return `Payment ${id} recieved!`;
  }
}
