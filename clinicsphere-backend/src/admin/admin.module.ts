// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config'; // if using ConfigService
import { UsersModule } from '../users/users.module'; // 👈 add this

import { AdminUsersController } from './admin-users.controller';
import { AdminDoctorController } from './admin-doctor.controller';
import { AdminClinicController } from './admin-clinic.controller';
import { AdminClinicService } from './admin-clinic.service';
import { AdminClinic, AdminClinicSchema } from './admin-clinic.schema';

@Module({
  imports: [
    UsersModule, 
    ConfigModule, 
    MongooseModule.forFeature([
      { name: AdminClinic.name, schema: AdminClinicSchema }
    ])
  ],
  controllers: [
    AdminUsersController,
    AdminDoctorController,
    AdminClinicController
  ],
  providers: [AdminClinicService]
})
export class AdminModule {}
