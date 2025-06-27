import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../users/user.schema';
import { CreateSpecialtyDto } from './create-specialty.dto';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('/admin/specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Post()
  async create(@Body() dto: CreateSpecialtyDto) {
    return this.specialtiesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.specialtiesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.specialtiesService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateSpecialtyDto>) {
    return this.specialtiesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.specialtiesService.delete(id);
  }
}
