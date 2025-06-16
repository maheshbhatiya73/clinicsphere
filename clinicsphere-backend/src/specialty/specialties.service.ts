import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Specialty } from './specialty.schema';
import { CreateSpecialtyDto } from './create-specialty.dto';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectModel(Specialty.name)
    private readonly specialtyModel: Model<Specialty>,
  ) {}

  async create(dto: CreateSpecialtyDto) {
    const specialty = new this.specialtyModel(dto);
    return specialty.save();
  }

  async findAll() {
    return this.specialtyModel.find().exec();
  }

  async findById(id: string) {
    return this.specialtyModel.findById(id).exec();
  }

  async update(id: string, dto: Partial<CreateSpecialtyDto>) {
    return this.specialtyModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string) {
    return this.specialtyModel.findByIdAndDelete(id).exec();
  }
}
