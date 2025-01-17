import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { GenerateJwtTokens } from 'src/common/tokens/token.provider';
import { PayloadInterface } from 'src/common/interface/payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly generateToken: GenerateJwtTokens,
    private readonly userService: UsersService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const newUser = await this.userService.create(registerAuthDto);

    const payload: PayloadInterface = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const tokens = await this.generateToken.craeteAccessAndRefresh(payload);
    await this.userService.update(newUser.id, {
      refresh_token: tokens.refreshToken,
    });
    return tokens;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const currnetUser = await this.userService.findByEmail(loginAuthDto.email);
    if (!currnetUser) {
      throw new BadRequestException('email or passoword is wrong');
    }
    if (currnetUser.password !== loginAuthDto.password) {
      throw new BadRequestException('email or passoword is wrong');
    }
    const payload: PayloadInterface = {
      id: currnetUser.id,
      email: currnetUser.email,
      role: currnetUser.role,
    };
    const tokens = await this.generateToken.craeteAccessAndRefresh(payload);
    await this.userService.update(currnetUser.id, {
      refresh_token: tokens.refreshToken,
    });
    return tokens;
  }
}
