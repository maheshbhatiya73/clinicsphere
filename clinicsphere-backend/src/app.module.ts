import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SpecialtiesModule } from './specialty/specialties.module';
import { AdminServiceModule } from './admin/admin-service.module';
import { DoctorAssignmentModule } from './admin/doctor-assignment.module';
import { ServiceCategoryModule } from './admin/service-category.module';
import { DoctorClinicModule } from './doctor/doctor-clinic.module';

@Module({
  imports: [
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), 
      serveRoot: '/uploads',                      
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/clinicshere',
      }),
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    DoctorModule,
    AppointmentsModule,
    SpecialtiesModule,
    DoctorAssignmentModule,
    AdminServiceModule,
    ServiceCategoryModule,
    DoctorClinicModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}