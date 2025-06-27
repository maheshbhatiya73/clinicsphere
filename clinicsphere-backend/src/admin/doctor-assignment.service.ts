import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DoctorAssignment, DoctorAssignmentDocument } from './doctor-assignment.schema';
import { User, UserDocument } from '../users/user.schema';
import { AdminClinic, ClinicDocument } from './admin-clinic.schema';
import { CreateAssignmentDto } from './create-assignment.dto';

@Injectable()
export class DoctorAssignmentService {
  constructor(
    @InjectModel(DoctorAssignment.name) private readonly assignmentModel: Model<DoctorAssignmentDocument>,
    @InjectModel(AdminClinic.name) private readonly clinicModel: Model<ClinicDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateAssignmentDto): Promise<DoctorAssignment> {
    // Validate clinic and doctor exist
    if (!Types.ObjectId.isValid(dto.clinicId) || !Types.ObjectId.isValid(dto.doctorId)) {
      throw new BadRequestException('Invalid clinicId or doctorId');
    }

    const clinic = await this.clinicModel.exists({ _id: dto.clinicId });
    if (!clinic) throw new NotFoundException('Clinic not found');

    const doctor = await this.userModel.exists({ _id: dto.doctorId, role: 'doctor' });
    if (!doctor) throw new NotFoundException('Doctor not found');

    return this.assignmentModel.create(dto);
  }

  async findAll(): Promise<DoctorAssignment[]> {
    return this.assignmentModel.find().populate('clinicId doctorId').exec();
  }

  async findByClinic(clinicId: string): Promise<DoctorAssignment[]> {
    return this.assignmentModel.find({ clinicId }).populate('doctorId').exec();
  }

  async remove(id: string): Promise<void> {
    await this.assignmentModel.findByIdAndDelete(id).exec();
  }
}
