import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User fullname', example: 'John Doe' })
  @IsString()
  fullname: string;

  @ApiProperty({ description: 'User phone number', example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (must be strong)',
    example: 'P@ssw0rd123',
  })
  @IsStrongPassword()
  password: string;

  @ApiPropertyOptional({
    description: 'Refresh token for authentication',
    example: 'some-refresh-token',
  })
  @IsOptional()
  refresh_token: string;
}
