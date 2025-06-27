// src/admin-clinic/admin-clinic.controller.ts
import { Controller, Post, Get, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AdminClinicService } from './admin-clinic.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/users/user.schema';
import { CreateClinicDto } from './create-clinic.dto';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';

@Controller('admin/admin-clinic')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminClinicController {
  constructor(private readonly clinicService: AdminClinicService) {}

  @Post()
  create(@Body() dto: CreateClinicDto) {
    return this.clinicService.create(dto);
  }

  @Get()
  findAll() {
    return this.clinicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateClinicDto) {
    return this.clinicService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.clinicService.delete(id);
  }
}
