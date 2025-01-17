import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Total price of the order',
    example: 150.75,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  total_price: number;

  @ApiProperty({
    description: 'ID of the user placing the order',
    example: 42,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  user_id: number;
}
