import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorClinicService } from './doctor-clinic.service';
import { DoctorClinicController } from './doctor-clinic.controller';
import { DoctorAssignment, DoctorAssignmentSchema } from 'src/admin/doctor-assignment.schema';
import { AdminClinic, AdminClinicSchema } from 'src/admin/admin-clinic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorAssignment.name, schema: DoctorAssignmentSchema },
      { name: AdminClinic.name, schema: AdminClinicSchema },
    ]),
  ],
  controllers: [DoctorClinicController],
  providers: [DoctorClinicService],
})
export class DoctorClinicModule {}
