// src/admin-clinic/schemas/admin-clinic.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClinicDocument = AdminClinic & Document;

@Schema({ timestamps: true })
export class AdminClinic {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  logoUrl: string;

  @Prop({ type: Object })
  contact: {
    phone: string;
    email: string;
    website?: string;
  };

  @Prop({ type: Object })
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    location: {
      lat: number;
      lng: number;
    };
  };

  @Prop({ type: Object })
  working_hours: Record<string, { open: string; close: string }>;

  @Prop({ type: Object })
  settings: {
    time_zone: string;
    currency: string;
    language: string;
    telemedicine_enabled: boolean;
    theme_color?: string;
  };

  @Prop({ default: 'active' })
  status: 'active' | 'inactive';
}

export const AdminClinicSchema = SchemaFactory.createForClass(AdminClinic);
