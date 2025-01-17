import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total_price: number;

  @Column({ nullable: true })
  user_id: number;

  @OneToOne(() => User, (user) => user.order, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => OrderProduct, (orderPorduct) => orderPorduct.orders, {
    eager: false,
  })
  orderPorduct: OrderProduct;
}
