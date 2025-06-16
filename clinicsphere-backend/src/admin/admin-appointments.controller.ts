import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { CreateAppointmentDto } from '../appointments/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/update-appointment.dto';
import { JwtAuthGuard } from '../auth/wt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.schema';

@Controller('admin/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminAppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getAllAppointments(
    @Req() req: any, 
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('role') role?: UserRole,
  ) {
    const currentUser = req.user

    console.log("current user ", currentUser)
    return this.appointmentsService.getAllAppointments(currentUser, page, limit, role);
  }

  @Get(':id')
  async getAppointmentById(@Param('id') id: string) {
    const currentUser = { role: UserRole.ADMIN } as any;
    return this.appointmentsService.getAppointmentById(currentUser, id);
  }

  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    const currentUser = { role: UserRole.ADMIN } as any;
    return this.appointmentsService.createAppointment(currentUser, createAppointmentDto);
  }

  @Put(':id')
  async updateAppointment(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    const currentUser = { role: UserRole.ADMIN } as any;
    return this.appointmentsService.updateAppointment(currentUser, id, updateAppointmentDto);
  }

  @Delete(':id')
  async deleteAppointment(@Param('id') id: string) {
    const currentUser = { role: UserRole.ADMIN } as any;
    return this.appointmentsService.deleteAppointment(currentUser, id);
  }
}