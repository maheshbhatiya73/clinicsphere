import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document & { _id: Types.ObjectId };

export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  
   @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  doctorId?: Types.ObjectId;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  @Prop([{ action: String, timestamp: Date }])
  activityLog?: { action: string; timestamp: Date }[];
  
  @Prop()
  specialization?: string;

  @Prop()
  licenseNumber?: string;

  @Prop()
  experienceYears?: number;

  @Prop()
  appointmentFee?: number;

  @Prop()
  consultationDuration?: number;

  @Prop()
  clinicAddress?: string;

  @Prop()
  phoneNumber?: string;


  @Prop()
  bio?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);