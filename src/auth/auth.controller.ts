import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication') // Tag for grouping in Swagger UI
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterAuthDto }) // Describe the body type
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginAuthDto }) // Describe the body type
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  @ApiResponse({ status: 400, description: 'Invalid credentials.' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
}
