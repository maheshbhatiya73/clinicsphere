import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorScheduleController } from './doctor-schedule.controller';
import { DoctorScheduleService } from './doctor-schedule.service';
import { DoctorAssignment, DoctorAssignmentSchema } from 'src/admin/doctor-assignment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorAssignment.name, schema: DoctorAssignmentSchema },
    ]),
  ],
  controllers: [DoctorScheduleController],
  providers: [DoctorScheduleService],
})
export class DoctorScheduleModule {}
