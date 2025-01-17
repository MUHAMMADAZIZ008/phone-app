import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    try {
      const newOrder = await this.orderRepository.save(createOrderDto);
      return newOrder;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    const allOrder = await this.orderRepository.find();
    return allOrder;
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    return order;
  }

  async findOneByUserId(id: number) {
    const order = await this.orderRepository.findOne({
      where: { user_id: id },
    });
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const updatedOrder = await this.orderRepository.update(id, updateOrderDto);
    return updatedOrder;
  }

  remove(id: number) {
    return this.orderRepository.delete(id);
  }
}
