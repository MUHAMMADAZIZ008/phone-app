import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from '../interface/payload';

@Injectable()
export class GenerateJwtTokens {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async craeteAccessAndRefresh(payload: PayloadInterface) {
    const asseccToken = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshToken = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
    return {
      asseccToken,
      refreshToken,
    };
  }

  async verifyAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      return payload;
    } catch {
      return false;
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      return payload;
    } catch {
      return false;
    }
  }
}
