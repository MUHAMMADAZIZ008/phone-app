import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './role.guard';
import { GenerateJwtModule } from '../tokens/token.module';

@Module({
  imports: [GenerateJwtModule],
  providers: [AuthGuard, RolesGuard],
  exports: [AuthGuard, RolesGuard],
})
export class GruardModule {}
