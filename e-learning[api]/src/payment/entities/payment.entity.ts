import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { paymentStatus } from '../../common/enum/payment-status.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pid', unique: true })
  paymentId: string;

  @Column({ name: 'refcode' })
  referCode: string;

  @Column({ name: 'stat', enum: paymentStatus, default: paymentStatus.P })
  status: paymentStatus;

  @Column({ type: 'text' })
  error: string;

  @Column()
  retry: number;

  @Column()
  price: number;

  @Column({ name: 'fprice' })
  finalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  transactionDate: Date;
}
