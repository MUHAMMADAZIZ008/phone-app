import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Pagination } from 'src/common/decorators/pagination.dcorator';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.productRepository.save(createProductDto);
    await this.redis.set(
      `product:${String(newProduct.id)}`,
      JSON.stringify(newProduct),
    );
    return newProduct;
  }

  async findAll(paginationValue: Pagination) {
    const { orderBy, offset, limit } = paginationValue;

    const redisKeys = await this.redis.keys('product:*');

    if (redisKeys.length > 0) {
      const paginatedKeys = redisKeys.slice(offset, offset + limit);

      const products = await this.redis.mget(paginatedKeys);

      return {
        products: products.map((product) => JSON.parse(product)),
        total: redisKeys.length,
      };
    } else {
      const [products, total] = await this.productRepository.findAndCount({
        skip: paginationValue.offset,
        take: paginationValue.limit,
        order: { id: orderBy },
      });

      // Redisga saqlash
      const allProducts = await this.productRepository.find();
      for (const product of allProducts) {
        await this.redis.set(
          `product:${String(product.id)}`,
          JSON.stringify(product),
        );
      }

      return { products, total };
    }
  }

  async findOne(id: number) {
    const productKey = `product:${String(id)}`;
    const product = await this.redis.get(productKey);
    if (!product) {
      const productInPostgres = await this.productRepository.findOne({
        where: { id },
      });
      if (!productInPostgres) {
        throw new NotFoundException('product not found');
      }
      await this.redis.set(productKey, JSON.stringify(productInPostgres));
      return productInPostgres;
    }
    return JSON.parse(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productInPostgres = await this.productRepository.findOne({
      where: { id },
    });
    if (!productInPostgres) {
      throw new NotFoundException('product not found');
    }

    // Redisni yangilash
    const updatedProduct = { ...productInPostgres, ...updateProductDto };
    await this.redis.set(
      `product:${String(productInPostgres.id)}`,
      JSON.stringify(updatedProduct),
    );

    await this.productRepository.update({ id }, updateProductDto);
    return updatedProduct;
  }

  async remove(id: number) {
    const productKey = `product:${String(id)}`;
    const product = await this.redis.get(productKey);
    if (product) await this.redis.del(productKey);
    return this.productRepository.delete({ id });
  }
}
