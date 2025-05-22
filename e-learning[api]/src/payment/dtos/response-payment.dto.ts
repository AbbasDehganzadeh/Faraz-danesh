import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { paymentStatus } from '../../common/enum/payment-status.enum';
import { ResponseCartDto } from '../../cart/dtos/response.cart.dto';
import { ResponseUserDto } from '../../user/dtos/response.user.dto';

export class ResponsePaymentDto {
  @ApiProperty({ title: 'id', description: 'ID of payment', example: 1 })
  id: number;

  @ApiProperty({
    title: 'payment id',
    description: 'paymentId for proccessing request',
    example: 1,
    nullable: true,
  })
  @Expose({ name: 'payment_id' })
  @Transform(({ obj }) => obj['paymentId'])
  paymentId: string;
  @ApiProperty({
    name: 'refer-code',
    title: 'refer code',
    description: 'paymentId for referring request',
    example: 101,
    nullable: true,
  })
  @Expose({ name: 'refer-code' })
  @Transform(({ obj }) => obj['referCode'])
  referCode: string;

  @ApiProperty({
    title: 'status',
    description: 'status of cart',
    example: paymentStatus.P,
    enum: paymentStatus,
  })
  status: paymentStatus;
  @ApiProperty({
    title: 'error',
    description: 'error of unsucced payment; not-Implemented!',
    example: null,
    nullable: true,
  })
  error: string;
  @ApiProperty({
    title: 'retry',
    description: 'retry of payment request action; not-Implemented!',
    example: 0,
  })
  retry: number;

  @Exclude()
  price: number;
  @Exclude()
  finalPrice: number;

  @ApiProperty({
    name: 'created_at',
    title: 'created-at',
    description: 'creation date of payment!',
    example: new Date(),
    type: Date,
  })
  @Expose({ name: 'created_at' })
  @Transform(({ obj }) => obj['createdAt'])
  createdAt: Date;
  @ApiProperty({
    title: 'transactionDate',
    description: 'Date when payment completed!',
    nullable: true,
    example: null,
    type: Date,
  })
  transactionDate: Date;

  @ApiProperty({
    title: 'cart of payment',
    description: 'cart part of payment',
    type: () => ResponseCartDto,
  })
  @Type(() => ResponseCartDto)
  cart: ResponseCartDto;

  @ApiProperty({
    title: 'user of payment',
    description: 'user owns payment!',
    type: () => ResponseUserDto,
  })
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;
}
