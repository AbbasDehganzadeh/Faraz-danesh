import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { roles } from '../../common/enum/roles.enum';
import { Cart } from '../../cart/entities/cart.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true })
  fname: string;

  @Column({ length: 20 })
  lname: string;

  @Column({ length: 20, nullable: false, unique: true })
  uname: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: false })
  password: string;

  @Column({ enum: roles, default: roles.STUDENT })
  role: roles;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
