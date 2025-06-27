// src/admin-service/admin-service.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminServiceController } from './admin-service.controller';
import { AdminServiceService } from './admin-service.service';
import { AdminService, AdminServiceSchema } from './admin-service.schema';
import { AdminClinic, AdminClinicSchema } from './admin-clinic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminService.name, schema: AdminServiceSchema },
        { name: AdminClinic.name, schema: AdminClinicSchema },
    ])
  ],
  controllers: [AdminServiceController],
  providers: [AdminServiceService]
})
export class AdminServiceModule {}
