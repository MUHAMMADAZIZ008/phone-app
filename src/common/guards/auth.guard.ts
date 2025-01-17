import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { GenerateJwtTokens } from '../tokens/token.provider';
import { IS_PUBLIC_KEY } from '../decorators/auth.decorator';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenManage: GenerateJwtTokens,
    private readonly reflecotr: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflecotr.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = await this.tokenManage.verifyAccessToken(token);

      request['user'] = payload;
    } catch {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    return token;
  }
}
