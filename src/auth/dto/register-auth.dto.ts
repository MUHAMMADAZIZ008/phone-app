import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  fullname: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  refresh_token: string;
}
