import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GenerateJwtModule } from 'src/common/tokens/token.module';
import { OrderModule } from 'src/order/order.module';
import { GruardModule } from 'src/common/guards/guard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    GenerateJwtModule,
    OrderModule,
    GruardModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
