import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { UpdateOrderProductDto } from './dto/update-order-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { OrderService } from 'src/order/order.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProduct: Repository<OrderProduct>,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}
  async create(createOrderProductDto: CreateOrderProductDto, user: User) {
    //product section
    const currentProduct = await this.productService.findOne(
      createOrderProductDto.product_id,
    );

    if (!currentProduct) {
      throw new NotFoundException('product id not found');
    }
    await this.productService.update(currentProduct.id, {
      quantity:
        currentProduct.quantity - createOrderProductDto.product_quantity,
    });
    //order section
    const currentOrder = await this.orderService.findOneByUserId(user.id);
    if (!currentOrder) {
      throw new NotFoundException('order id not found');
    }
    await this.orderService.update(currentOrder.id, {
      total_price: currentOrder.total_price + currentProduct.price,
    });
    const newOrderPro = await this.orderProduct.save({
      ...createOrderProductDto,
      order_id: currentOrder.id,
    });
    return newOrderPro;
  }

  async findAll() {
    const allOrderPro = await this.orderProduct.find();
    return allOrderPro;
  }

  async findOne(id: number) {
    const orderProduct = await this.orderProduct.findOne({ where: { id } });
    return orderProduct;
  }

  async update(id: number, updateOrderProductDto: UpdateOrderProductDto) {
    const updatedOrderPro = await this.orderProduct.update(
      id,
      updateOrderProductDto,
    );
    return updatedOrderPro;
  }

  remove(id: number) {
    return this.orderProduct.delete(id);
  }
}
