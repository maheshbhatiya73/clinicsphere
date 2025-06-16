import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { CreateAppointmentDto } from '../appointments/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointments/update-appointment.dto';
import { JwtAuthGuard } from '../auth/wt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.schema';

@Controller('patient/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PATIENT)
export class PatientAppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  
  @Get()
  async getAllAppointments(@Req() req: any, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.appointmentsService.getAllAppointments(req.user, page, limit);
  }

  @Get(':id')
  async getAppointmentById(@Req() req: any, @Param('id') id: string) {
    return this.appointmentsService.getAppointmentById(req.user, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAppointment(@Req() req: any, @Body() createAppointmentDto: CreateAppointmentDto) {
    const currentUser = req.user;
    return this.appointmentsService.createAppointment(currentUser, {
      ...createAppointmentDto,
      patientId: currentUser.userId,
    });
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