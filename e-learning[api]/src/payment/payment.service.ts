import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { CartStatus } from '../common/enum/cart-status.enum';
import { paymentStatus } from '../common/enum/payment-status.enum';
import { Payment } from './entities/payment.entity';
import { IRequestPayment } from './interfaces/request-payment.interface';

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
    const data: IRequestPayment = {
      merchant_id: this.configService.getOrThrow('MERCHENT_ID'),
      callback_url: `http://localhost:3024/api/payment/recieve`,
      description: 'A transaction for e-learnign test-app',
      amount: payment?.price ?? 0,
      metadata: {
        id: payment?.id!,
        email: !payment?.user.email ? '' : payment?.user.email,
        mobile: !payment?.user.phone ? '' : payment?.user.phone,
      },
    };
    this.httpService
      .post('https://sandbox.zarinpal.com/pg/v4/payment/request.json', data)
      .subscribe(async (resp) => {
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
        await this.payments.update(payment!, {
          paymentId: authority,
          status: paymentStatus.Q,
        });
      });
  }

  async getDiscountPayment(id: number, code: string) {
    const payment = await this.getPayment(id);
    if (!this.isPaymentAvailable(payment!)) {
      throw new HttpException(
        `Payment isn't available for proccessing:\
        \tMaybe it is in the stage of 'Proccessing', or 'refund'!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newpayment = await this.discountPayment(payment!, code);
    return {
      id: payment?.id,
      discountCode: newpayment?.cart.discountCode,
      discount: newpayment?.cart.discount,
      price: newpayment?.price,
      finalPrice: newpayment?.finalPrice,
    };
  }

  async recievePayment(authority: string, status: string) {
    const payment = await this.getPaymentByAuthority(authority);
    if (status !== 'OK') {
      // payment failed due to some errors
      //TODO: implement failure scenario
      await this.changePaymentStatus(payment, paymentStatus.F);
    }
    this.httpService
      .post('https://sandbox.zarinpal.com/pg/v4/payment/verify.json', {
        merchant_id: this.configService.getOrThrow('MERCHENT_ID'),
        amount: payment.price,
        authority: authority,
      })
      .subscribe(
        // checking for payment status!
        async (resp) => {
          const { data } = resp;
          const { ref_id } = data;
          payment.referCode = String(ref_id);
          payment.transactionDate = new Date();
          await this.changePaymentStatus(payment, paymentStatus.S);
        },
      );
    return payment;
  }

  private async getPaymentByAuthority(authority: string) {
    const payment = await this.payments.findOneBy({ paymentId: authority });
    return payment!;
  }
  private isPaymentAvailable(payment: Payment) {
    return [paymentStatus.P, paymentStatus.C, paymentStatus.F].includes(
      payment.status,
    );
  }

  private async discountPayment(payment: Payment, code: string) {
    //! hard-code sample for testing
    if (code === '1a-a1') {
      await this.cartService.discountCart(payment?.cart.id, code, 50);
    }
    const newpayment = await this.getPayment(payment.id);
    if (newpayment?.finalPrice)
      newpayment.finalPrice = newpayment?.cart?.finalPrice;
    return this.payments.save(newpayment!);
  }

  private changePaymentStatus(payment: Payment, status: paymentStatus) {
    payment.status = status;
    return this.payments.save(payment);
  }
}
