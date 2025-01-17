import { UserRoleEnum } from 'src/common/enum/user.enum';
import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: Boolean,
    default: true,
  })
  is_active: boolean;

  @Column({
    nullable: true,
  })
  refresh_token: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;

  @OneToOne(() => Order, (order) => order.user, { eager: true })
  order: Order;
}
