import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Pagination {
  searchItem: 'id' | 'name' | 'price' | 'info' | 'is_active' | 'quantity';
  search: string;
  orderBy: 'ASC' | 'DESC';
  page: number;
  limit: number;
  size: number;
  offset: number;
}

export const PaginationParams = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string);
    const size = parseInt(req.query.size as string);
    const searchItem = req.query.searchItem as
      | 'id'
      | 'name'
      | 'price'
      | 'info'
      | 'is_active'
      | 'quantity';
    const search = req.query.search as string;
    const orderBy = req.query.orderBy as 'ASC' | 'DESC';

    // check if page and size are valid
    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
      throw new BadRequestException('Invalid pagination params');
    }
    // do not allow to fetch large slices of the dataset
    if (size > 100) {
      throw new BadRequestException(
        'Invalid pagination params: Max size is 100',
      );
    }

    // calculate pagination parameters
    const limit = size;
    const offset = page * limit;
    return { searchItem, search, orderBy, page, limit, size, offset };
  },
);
