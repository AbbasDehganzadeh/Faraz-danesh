import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { CartStatus } from '../common/enum/cart-status.enum';
import { Payment } from './entities/payment.entity';
import { paymentStatus } from 'src/common/enum/payment-status.enum';
import { HttpService } from '@nestjs/axios';
import { tap } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private payments: Repository<Payment>,
    private httpService: HttpService,
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

  async purchasePayment(id: number) {
    const payment = await this.getPayment(id);
    if (!this.isPaymentAvailable(payment!)) {
      throw new HttpException(
        `Payment isn't available for proccessing:\
        \tMaybe it is in the stage of 'Proccessing', or 'refund'!`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async discountPayment(id: number) {
    const payment = await this.getPayment(id);
    if (!this.isPaymentAvailable(payment!)) {
      throw new HttpException(
        `Payment isn't available for proccessing:\
        \tMaybe it is in the stage of 'Proccessing', or 'refund'!`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  recievePayment(id: number) {
    return `Payment ${id} recieved!`;
  }

  private isPaymentAvailable(payment: Payment) {
    return [paymentStatus.P, paymentStatus.C, paymentStatus.F].includes(
      payment.status,
    );
  }
}
