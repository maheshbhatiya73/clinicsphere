import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { DoctorPatientsController } from './doctor-patient.controller';
import { DoctorPublicController } from './doctor.controller';

@Module({
  imports: [UsersModule],
  controllers: [DoctorPatientsController, DoctorPublicController],
})
export class DoctorModule {}
