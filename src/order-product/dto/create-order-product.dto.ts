import { IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderProductDto {
  @ApiProperty({
    description: 'ID of the product being ordered',
    example: 1,
    minimum: 1,
  })
  @IsPositive()
  product_id: number;

  @ApiProperty({
    description: 'Quantity of the product being ordered',
    example: 5,
    minimum: 1,
  })
  @IsPositive()
  product_quantity: number;
}
