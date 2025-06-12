import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './create-appointment.dto';
import { UpdateAppointmentDto } from './update-appointment.dto';
import { JwtAuthGuard } from '../auth/wt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.schema';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(@Req() req: any, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(req.user, createAppointmentDto);
  }

  @Get()
  async getAllAppointments(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('role') role?: UserRole,
  ) {
    return this.appointmentsService.getAllAppointments(req.user, page, limit, role);
  }

  @Get(':id')
  async getAppointmentById(@Req() req: any, @Param('id') id: string) {
    return this.appointmentsService.getAppointmentById(req.user, id);
  }

  @Put(':id')
  async updateAppointment(@Req() req: any, @Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.updateAppointment(req.user, id, updateAppointmentDto);
  }

  @Delete(':id')
  async deleteAppointment(@Req() req: any, @Param('id') id: string) {
    return this.appointmentsService.deleteAppointment(req.user, id);
  }
}