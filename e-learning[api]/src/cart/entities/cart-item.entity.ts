import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pid' })
  productId: string;

  @Column()
  price: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;
}
