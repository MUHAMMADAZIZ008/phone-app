import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/pagination.dcorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Product') // Swagger bo'lim nomi
@ApiBearerAuth('access-token') // Bearer token autentifikatsiyasi
@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' }) // Tavsif
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' }) // Tavsif
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    example: 10,
  })
  findAll(@PaginationParams() pagination: Pagination) {
    const paginationValue = pagination;
    return this.productService.findAll(paginationValue);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' }) // Tavsif
  @ApiParam({
    name: 'id',
    description: 'ID of the product to retrieve',
    example: 1,
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' }) // Tavsif
  @ApiParam({
    name: 'id',
    description: 'ID of the product to update',
    example: 1,
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' }) // Tavsif
  @ApiParam({
    name: 'id',
    description: 'ID of the product to delete',
    example: 1,
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
