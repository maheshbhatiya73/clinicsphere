import {
  Controller,
  Get,
  Put,
  Req,
  Body,
  UseGuards
} from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.schema';
import { UpdateScheduleDto } from './doctor-schedule.dto';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';

@Controller('doctor/schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR)
export class DoctorScheduleController {
  constructor(private readonly scheduleService: DoctorScheduleService) {}

  @Get()
  getMySchedule(@Req() req: any) {
    return this.scheduleService.getDoctorSchedule(req.user._id);
  }

  @Put()
  updateMySchedule(@Req() req: any, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.updateDoctorAvailability(req.user._id, dto);
  }
}
