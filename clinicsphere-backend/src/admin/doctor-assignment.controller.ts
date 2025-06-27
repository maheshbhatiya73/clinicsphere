import { Controller, Post, Get, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DoctorAssignmentService } from './doctor-assignment.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/users/user.schema';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';
import { CreateAssignmentDto } from './create-assignment.dto';

@Controller('admin/assign-doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DoctorAssignmentController {
  constructor(private readonly assignmentService: DoctorAssignmentService) {}

  @Post()
  create(@Body() dto: CreateAssignmentDto) {
    return this.assignmentService.create(dto);
  }

  @Get()
  findAll(@Query('clinicId') clinicId?: string) {
    if (clinicId) {
      return this.assignmentService.findByClinic(clinicId);
    }
    return this.assignmentService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.assignmentService.remove(id);
  }
}
