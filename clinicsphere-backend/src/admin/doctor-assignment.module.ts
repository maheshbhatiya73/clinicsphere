import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorAssignment, DoctorAssignmentSchema } from './doctor-assignment.schema';
import { DoctorAssignmentService } from './doctor-assignment.service';
import { DoctorAssignmentController } from './doctor-assignment.controller';
import { User, UserSchema } from '../users/user.schema';
import { AdminClinic, AdminClinicSchema } from './admin-clinic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorAssignment.name, schema: DoctorAssignmentSchema },
      { name: AdminClinic.name, schema: AdminClinicSchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  controllers: [DoctorAssignmentController],
  providers: [DoctorAssignmentService]
})
export class DoctorAssignmentModule {}
