import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { paymentStatus } from '../../common/enum/payment-status.enum';
import { Cart } from '../../cart/entities/cart.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pid', unique: true, nullable: true })
  paymentId: string;

  @Column({ name: 'refcode', nullable: true })
  referCode: string;

  @Column({ name: 'stat', enum: paymentStatus, default: paymentStatus.P })
  status: paymentStatus;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ default: 0 })
  retry: number;

  @Column()
  price: number;

  @Column({ name: 'fprice' })
  finalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  transactionDate: Date;

  @OneToOne(() => Cart, (cart) => cart.payment)
  cart: Cart;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;
}
