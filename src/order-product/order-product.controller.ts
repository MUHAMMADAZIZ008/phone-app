import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { CreateOrderProductDto } from './dto/create-order-product.dto';
import { UpdateOrderProductDto } from './dto/update-order-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRoleEnum } from 'src/common/enum/user.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER, UserRoleEnum.SELLER)
@ApiTags('Order Product') // Tag for grouping in Swagger UI
@Controller('order-product')
export class OrderProductController {
  constructor(private readonly orderProductService: OrderProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order product' })
  @ApiResponse({
    status: 201,
    description: 'The order product has been created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(
    @Body() createOrderProductDto: CreateOrderProductDto,
    @Request() req: any,
  ) {
    const user = req.user;
    return this.orderProductService.create(createOrderProductDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order products' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all order products.',
  })
  findAll() {
    return this.orderProductService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single order product by ID' })
  @ApiParam({ name: 'id', description: 'Order product ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the order product.',
  })
  @ApiResponse({ status: 404, description: 'Order product not found.' })
  findOne(@Param('id') id: string) {
    return this.orderProductService.findOne(+id);
  }

  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.SELLER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing order product' })
  @ApiParam({ name: 'id', description: 'Order product ID' })
  @ApiResponse({
    status: 200,
    description: 'The order product has been updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Order product not found.' })
  update(
    @Param('id') id: string,
    @Body() updateOrderProductDto: UpdateOrderProductDto,
  ) {
    return this.orderProductService.update(+id, updateOrderProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an order product' })
  @ApiParam({ name: 'id', description: 'Order product ID' })
  @ApiResponse({
    status: 200,
    description: 'The order product has been deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order product not found.' })
  remove(@Param('id') id: string) {
    return this.orderProductService.remove(+id);
  }
}
