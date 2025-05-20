import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from '../../payment/entities/payment.entity';
import { User } from '../../user/entities/user.entity';
import { CartStatus } from '../../common/enum/cart-status.enum';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ name: 'd-code', nullable: true })
  discountCode: string;

  @Column({ name: 'price' })
  totalPrice: number;

  get finalPrice() {
    return this.totalPrice - (this.totalPrice / 100) * this.discount;
  }

  @Column({ default: CartStatus.Open })
  status: CartStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.carts)
  user: User;

  @OneToMany(() => CartItem, (citems) => citems.cart, {
    cascade: true,
    eager: true,
  })
  cartItems: CartItem[];
}
