import {
  IsBoolean,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Mouse',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Product price',
    example: 25.99,
    minimum: 1,
  })
  @IsNumber({ allowInfinity: false })
  @Min(1)
  price: number;

  @ApiProperty({
    description: 'Product information or description',
    example: 'A high-quality wireless mouse with ergonomic design.',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  info: string;

  @ApiProperty({
    description: 'Product availability status',
    example: true,
  })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    description: 'Available quantity of the product',
    example: 100,
    minimum: 1,
  })
  @IsNumber({ allowInfinity: false })
  @Min(1)
  quantity: number;
}
