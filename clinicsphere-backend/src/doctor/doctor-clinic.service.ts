import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AdminClinic, ClinicDocument } from 'src/admin/admin-clinic.schema';
import { DoctorAssignment, DoctorAssignmentDocument } from 'src/admin/doctor-assignment.schema';

@Injectable()
export class DoctorClinicService {
  constructor(
    @InjectModel(DoctorAssignment.name)
    private readonly assignmentModel: Model<DoctorAssignmentDocument>,
    @InjectModel(AdminClinic.name)
    private readonly clinicModel: Model<ClinicDocument>
  ) {}

  async findClinicsByDoctor(doctorId: string) {
    const assignments = await this.assignmentModel.find({ doctorId: new Types.ObjectId(doctorId) }).exec();
    const clinicIds = assignments.map((a) => a.clinicId);
    return this.clinicModel.find({ _id: { $in: clinicIds } });
  }
}
