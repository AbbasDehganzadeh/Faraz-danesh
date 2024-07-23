import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
enum Role {
  STUDENT,
  TEACHER,
  SUPERVISOR,
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true })
  fname: string;

  @Column({ length: 20 })
  lname: string;

  @Column({ length: 20, nullable: false })
  uname: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @Column({ nullable: false })
  password: string;

  @Column({ enum: Role })
  role: Role;
}
