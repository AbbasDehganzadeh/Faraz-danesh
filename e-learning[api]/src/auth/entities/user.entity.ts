import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { roles } from 'src/common/enum/roles.enum';

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
}
