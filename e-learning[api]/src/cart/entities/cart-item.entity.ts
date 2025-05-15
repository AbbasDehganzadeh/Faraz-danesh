import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pid: string;

  @Column()
  price: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;
}
