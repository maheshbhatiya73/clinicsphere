import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateScheduleDto } from './doctor-schedule.dto';
import { DoctorAssignment, DoctorAssignmentDocument } from 'src/admin/doctor-assignment.schema';

@Injectable()
export class DoctorScheduleService {
  constructor(
    @InjectModel(DoctorAssignment.name)
    private readonly assignmentModel: Model<DoctorAssignmentDocument>
  ) {}

  async getDoctorSchedule(doctorId: string) {
    return this.assignmentModel
      .find({ doctorId: new Types.ObjectId(doctorId) })
      .populate('clinicId', 'name location')
      .select('clinicId availability status');
  }

  async updateDoctorAvailability(doctorId: string, dto: UpdateScheduleDto) {
    const { clinicId, availability } = dto;

    const updated = await this.assignmentModel.findOneAndUpdate(
      {
        doctorId: new Types.ObjectId(doctorId),
        clinicId: new Types.ObjectId(clinicId),
      },
      { availability },
      { new: true }
    );

    if (!updated) {
      throw new NotFoundException('Doctor is not assigned to the clinic');
    }

    return updated;
  }
}
