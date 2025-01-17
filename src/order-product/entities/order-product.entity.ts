import { OrderStatus } from 'src/common/enum/order-status.enum';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  order_id: number;

  @OneToMany(() => Order, (order) => order.orderPorduct)
  @JoinColumn({ name: 'order_id' })
  orders: Order[];

  @Column({ nullable: true })
  product_id: number;

  @OneToMany(() => Product, (product) => product.orderPorduct)
  @JoinColumn({ name: 'product_id' })
  products: Product[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW,
  })
  status: OrderStatus;

  @Column()
  product_quantity: number;
}
