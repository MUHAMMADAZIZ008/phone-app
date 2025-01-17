import { Module } from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { OrderProductController } from './order-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { GruardModule } from 'src/common/guards/guard.module';
import { GenerateJwtModule } from 'src/common/tokens/token.module';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    ProductModule,
    OrderModule,
    TypeOrmModule.forFeature([OrderProduct]),
    GenerateJwtModule,
    GruardModule,
  ],
  controllers: [OrderProductController],
  providers: [OrderProductService],
})
export class OrderProductModule {}
