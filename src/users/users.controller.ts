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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRoleEnum } from 'src/common/enum/user.enum';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users') // Swagger'da bo'lim nomi
@ApiBearerAuth('access-token') // Bearer token autentifikatsiyasi
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRoleEnum.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new user' }) // Endpoint uchun qisqacha tavsif
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' }) // Endpoint uchun tavsif
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' }) // Endpoint uchun tavsif
  @ApiParam({
    name: 'id',
    description: 'ID of the user to retrieve',
    example: 1, // Misol uchun ID
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' }) // Endpoint uchun tavsif
  @ApiParam({
    name: 'id',
    description: 'ID of the user to update',
    example: 1, // Misol uchun ID
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' }) // Endpoint uchun tavsif
  @ApiParam({
    name: 'id',
    description: 'ID of the user to delete',
    example: 1, // Misol uchun ID
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
