import { Module } from '@nestjs/common';
import { GenerateJwtTokens } from './token.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [GenerateJwtTokens],
  exports: [GenerateJwtTokens],
})
export class GenerateJwtModule {}
