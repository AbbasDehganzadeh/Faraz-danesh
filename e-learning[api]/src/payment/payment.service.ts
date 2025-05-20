import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { CartStatus } from '../common/enum/cart-status.enum';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private payments: Repository<Payment>,
    private cartService: CartService,
    private userService: UserService,
  ) {}
  async makePayment(userid: number) {
    const cart = await this.cartService.getOpenCart(userid);
    if (!cart) {
      throw new HttpException(
        `Cannot make payment:\
            Maybe user does'nt have any open cart!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.cartService.changeStatus(cart, CartStatus.Pending);
    const payment = this.payments.create({
      price: cart.totalPrice,
      finalPrice: cart.finalPrice,
      user: cart.user,
      cart: cart,
    });
    console.info({ payment });
    return this.payments.save(payment);
  }

  async getPayment(id: number) {
    try {
      const payment = await this.payments.findOneOrFail({
        where: { id: id },
        relations: { user: true, cart: true },
      });
      return payment;
    } catch (err) {
      console.info({ err });
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          `Payment with id ${id} doesn't exist`,
          HttpStatus.NOT_FOUND,
        );
      }
    }
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
