import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment, AppointmentSchema } from './appointment.schema';
import { UsersModule } from '../users/users.module';
import { AdminAppointmentsController } from 'src/admin/admin-appointments.controller';
import { DoctorAppointmentsController } from 'src/doctor/doctor-appointments.controller';
import { PatientAppointmentsController } from 'src/users/patient-appointments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]),
    UsersModule, // Import UsersModule for accessing UsersService
  ],
  providers: [AppointmentsService],
  controllers: [
    AppointmentsController,
    AdminAppointmentsController,
    DoctorAppointmentsController,
    PatientAppointmentsController,
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}