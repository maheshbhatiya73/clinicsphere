import {
  Controller, Post, Get, Put, Delete,
  Param, Body, UseGuards
} from '@nestjs/common';
import { ServiceCategoryService } from './service-category.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';
import { UserRole } from 'src/users/user.schema';
import { CreateServiceCategoryDto } from './create-service-category.dto';

@Controller('admin/service-category')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ServiceCategoryController {
  constructor(private readonly categoryService: ServiceCategoryService) {}

  @Post()
  create(@Body() dto: CreateServiceCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateServiceCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
