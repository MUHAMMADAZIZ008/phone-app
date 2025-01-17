import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { OrderProductModule } from './order-product/order-product.module';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProductModule,
    OrderModule,
    OrderProductModule,
  ],
})
export class AppModule {}
