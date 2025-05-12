import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  discount: number;

  @Column()
  discountCode: string;

  @OneToMany(() => CartItem, (citems) => citems.cart)
  cartItems: CartItem[];
}
