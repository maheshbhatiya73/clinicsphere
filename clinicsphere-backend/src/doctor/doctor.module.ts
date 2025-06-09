import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { DoctorPatientsController } from './doctor-patient.controller';

@Module({
  imports: [UsersModule],
  controllers: [DoctorPatientsController],
})
export class DoctorModule {}
