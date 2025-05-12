import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  VirtualColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pid' })
  productId: string;

  @Column({ default: 0 })
  discount: number;

  @Column()
  discountCode: string;

  @Column()
  price: number;

  get finalPrice() {
    return this.price - (this.price * this.discount) / 100;
  }

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;
}
