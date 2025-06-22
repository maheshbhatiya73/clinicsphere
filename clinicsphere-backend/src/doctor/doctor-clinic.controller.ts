import {
  Controller,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/wt-auth.guard';
import { UserRole } from 'src/users/user.schema';
import { DoctorClinicService } from './doctor-clinic.service';

@Controller('doctor/clinics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR)
export class DoctorClinicController {
  constructor(private readonly clinicService: DoctorClinicService) {}

  @Get()
  async getMyClinics(@Req() req: Request) {
    const user = req.user as any;
    return this.clinicService.findClinicsByDoctor(user._id);
  }
}
