import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { GenerateJwtModule } from 'src/common/tokens/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), GenerateJwtModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
