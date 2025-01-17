import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRedis() private readonly redis: Redis,
    private readonly orderService: OrderService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userEmail) {
      throw new BadRequestException('Email already exists!');
    }

    const userPhone = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    });
    if (userPhone) {
      throw new BadRequestException('Phone already exists!');
    }

    const newUser = await this.userRepository.save(createUserDto);

    await this.orderService.create({
      user_id: newUser.id,
      total_price: 0,
    });

    await this.redis.set(`user:${String(newUser.id)}`, JSON.stringify(newUser));
    return newUser;
  }

  async findAll() {
    const redisKeys = await this.redis.keys('user:*');
    if (redisKeys.length > 0) {
      const users = await this.redis.mget(redisKeys);
      return users.map((user) => JSON.parse(user));
    } else {
      const allUsers = await this.userRepository.find();
      for (const user of allUsers) {
        await this.redis.set(`user:${String(user.id)}`, JSON.stringify(user));
      }
      return allUsers;
    }
  }

  async findOne(id: number) {
    const userKey = `user:${String(id)}`;
    const cachedUser = await this.redis.get(userKey);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    await this.redis.set(userKey, JSON.stringify(user));
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const updatedUser = { ...user, ...updateUserDto };
    await this.redis.set(`user:${String(id)}`, JSON.stringify(updatedUser));
    await this.userRepository.update({ id }, updateUserDto);

    return updatedUser;
  }

  async remove(id: number) {
    const userKey = `user:${String(id)}`;
    const cachedUser = await this.redis.get(userKey);

    if (cachedUser) {
      await this.redis.del(userKey);
    }

    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('User not found!');
    }

    return 'User deleted successfully';
  }
}
