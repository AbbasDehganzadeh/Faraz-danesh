import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pid', unique: true })
  paymentId: string;

  @Column({ name: 'refcode' })
  referCode: string;

  @Column({ name: 'stat' })
  status: string;

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
