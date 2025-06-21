// src/admin-service/schemas/admin-service.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdminServiceDocument = AdminService & Document;

@Schema({ timestamps: true })
export class AdminService {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration_minutes: number;

  @Prop()
  department?: string;

  @Prop({ type: Types.ObjectId, ref: 'AdminClinic' })
  clinicId?: Types.ObjectId;

  @Prop({ default: 'active' })
  status: 'active' | 'inactive';
}

export const AdminServiceSchema = SchemaFactory.createForClass(AdminService);
