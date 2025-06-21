import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DoctorAssignmentDocument = DoctorAssignment & Document;

@Schema({ timestamps: true })
export class DoctorAssignment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AdminClinic', required: true })
  clinicId: Types.ObjectId;

  @Prop({ type: Object }) // or use a specific interface
  availability: Record<
    string,
    { start: string; end: string }[]
  >; // e.g., { monday: [{ start: "09:00", end: "13:00" }] }

  @Prop({ default: 'active' })
  status: 'active' | 'inactive';
}

export const DoctorAssignmentSchema = SchemaFactory.createForClass(DoctorAssignment);
