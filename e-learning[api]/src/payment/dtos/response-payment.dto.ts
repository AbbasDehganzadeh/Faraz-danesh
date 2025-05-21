import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { paymentStatus } from '../../common/enum/payment-status.enum';
import { ResponseCartDto } from '../../cart/dtos/response.cart.dto';
import { ResponseUserDto } from '../../user/dtos/response.user.dto';

export class ResponsePaymentDto {
  id: number;
  @Expose({ name: 'payment_id' })
  @Transform(({ obj }) => obj['paymentId'])
  paymentId: string;
  @Expose({ name: 'refer-code' })
  @Transform(({ obj }) => obj['referCode'])
  referCode: string;

  status: paymentStatus;
  error: string;
  retry: number;

  @Exclude()
  price: number;
  @Exclude()
  finalPrice: number;

  @Expose({ name: 'created_at' })
  @Transform(({ obj }) => obj['createdAt'])
  createdAt: Date;
  transactionDate: Date;

  @Type(() => ResponseCartDto)
  cart: ResponseCartDto;

  @Type(() => ResponseUserDto)
  user: ResponseUserDto;
}
