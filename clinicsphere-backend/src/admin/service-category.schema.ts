import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceCategoryDocument = ServiceCategory & Document;

@Schema({ timestamps: true })
export class ServiceCategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: 'active' })
  status: 'active' | 'inactive';
}

export const ServiceCategorySchema = SchemaFactory.createForClass(ServiceCategory);
