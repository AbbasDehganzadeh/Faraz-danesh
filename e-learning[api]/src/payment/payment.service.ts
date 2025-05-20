import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { MakeePaymentDto } from './dtos/create-payment.dto';
import { CartStatus } from '../common/enum/cart-status.enum';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
    constructor(@InjectRepository(Payment)private payments: Repository<Payment>,
        private cartService: CartService,private userService: UserService) {}
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
