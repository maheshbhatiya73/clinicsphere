
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AdminService, AdminServiceDocument } from './admin-service.schema';
import { CreateServiceDto } from './create-service.dto';
import { AdminClinic, ClinicDocument } from './admin-clinic.schema';
@Injectable()
export class AdminServiceService {
    constructor(
        @InjectModel(AdminService.name)
        private readonly serviceModel: Model<AdminServiceDocument>,

        @InjectModel(AdminClinic.name)
        private readonly clinicModel: Model<ClinicDocument>
    ) { }


    async create(dto: CreateServiceDto): Promise<AdminService> {
        if (dto.clinicId) {
            if (!Types.ObjectId.isValid(dto.clinicId)) {
                throw new BadRequestException('Invalid clinicId format');
            }

            const clinicExists = await this.clinicModel.exists({ _id: new Types.ObjectId(dto.clinicId) });
            if (!clinicExists) {
                throw new NotFoundException('Clinic not found');
            }
        }

        return this.serviceModel.create(dto);
    }

    async findAll(clinicId?: string): Promise<AdminService[]> {
        if (clinicId) {
            return this.serviceModel.find({ clinicId }).exec();
        }
        return this.serviceModel.find().exec();
    }

    async findById(id: string): Promise<AdminService | null> {
        return this.serviceModel.findById(id).exec();
    }

    async update(id: string, dto: CreateServiceDto): Promise<AdminService | null> {
  if (dto.clinicId) {
    if (!Types.ObjectId.isValid(dto.clinicId)) {
      throw new BadRequestException('Invalid clinicId format');
    }

    const clinicExists = await this.clinicModel.exists({ _id: new Types.ObjectId(dto.clinicId) });
    if (!clinicExists) {
      throw new NotFoundException('Clinic not found');
    }
  }

  return this.serviceModel.findByIdAndUpdate(id, dto, { new: true }).exec();
}

    async delete(id: string): Promise<AdminService | null> {
        return this.serviceModel.findByIdAndDelete(id).exec();
    }
}
