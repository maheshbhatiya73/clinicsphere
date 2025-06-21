// src/admin-service/admin-service.controller.ts
import {
  Controller, Post, Body, Get, Query,
  Param, Put, Delete, UseGuards
} from '@nestjs/common';
import { AdminServiceService } from './admin-service.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/users/user.schema';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';
import { CreateServiceDto } from './create-service.dto';

@Controller('admin/admin-service')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminServiceController {
  constructor(private readonly serviceService: AdminServiceService) {}

  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.serviceService.create(dto);
  }

  @Get()
  findAll(@Query('clinicId') clinicId?: string) {
    return this.serviceService.findAll(clinicId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateServiceDto) {
    return this.serviceService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.serviceService.delete(id);
  }
}
