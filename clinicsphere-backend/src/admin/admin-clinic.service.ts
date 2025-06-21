// src/admin-clinic/admin-clinic.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminClinic, ClinicDocument } from './admin-clinic.schema';
import { CreateClinicDto } from './create-clinic.dto';
@Injectable()
export class AdminClinicService {
  constructor(
    @InjectModel(AdminClinic.name) private clinicModel: Model<ClinicDocument>,
  ) {}

  async create(dto: CreateClinicDto): Promise<AdminClinic> {
    const createdClinic = new this.clinicModel(dto);
    return createdClinic.save();
  }

  async findAll(): Promise<AdminClinic[]> {
    return this.clinicModel.find().exec();
  }

  async findById(id: string): Promise<AdminClinic | null> {
    return this.clinicModel.findById(id).exec();
  }

  async update(id: string, dto: CreateClinicDto): Promise<AdminClinic | null> {
    return this.clinicModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string): Promise<AdminClinic | null> {
    return this.clinicModel.findByIdAndDelete(id).exec();
  }
}
