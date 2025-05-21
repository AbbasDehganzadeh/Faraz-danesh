import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { CartStatus } from '../common/enum/cart-status.enum';
import { Payment } from './entities/payment.entity';
import { paymentStatus } from 'src/common/enum/payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private payments: Repository<Payment>,
    private configService: ConfigService,
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
    this.httpService
      .post('https://sandbox.zarinpal.com/pg/v4/payment/request.json', {
        merchant_id: this.configService.getOrThrow('MERCHENT_ID'),
        callback_url: `http://localhost:3024/api/payment/${payment?.id}/recieve`,
        description: 'A transaction for e-learnign test-app',
        amount: payment?.price,
        metadata: {
          id: payment?.id,
          //TODO email & mobile of user.
        },
      })
      .subscribe((resp) => {
        const { data } = resp.data;
        const { authority, message } = data;
        if (message !== 'Success') {
          throw new HttpException(
            `Payment can't be proccessed, due to unsufficient data!`,
            HttpStatus.BAD_REQUEST,
          );
        }
        this.httpService.get(
          `https://sandbox.zarinpal.com/pg/StartPay/${authority}`,
        );
        //TODO: change payment.status to 'Proccessing'
      });
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

  async recievePayment(id: number, authority: string, status: string) {
    if (status !== 'OK') {
      // payment failed due to some errors
      //TODO: implement failure scenario
      return { status, authority };
    }
    const payment = await this.getPayment(id);
    this.httpService
      .post('https://sandbox.zarinpal.com/pg/v4/payment/verify.json', {
        merchant_id: this.configService.getOrThrow('MERCHENT_ID'),
        amount: payment?.price,
        authority: authority,
      })
      .subscribe(
        // checking for payment status!
        //TODO check it & save it to database!
        (resp) => console.info(resp.data),
      );
  }

  private isPaymentAvailable(payment: Payment) {
    return [paymentStatus.P, paymentStatus.C, paymentStatus.F].includes(
      payment.status,
    );
  }

  private changePaymentStatus(payment: Payment, status: paymentStatus) {
    return this.payments.update(payment, { status: status });
  }
}
