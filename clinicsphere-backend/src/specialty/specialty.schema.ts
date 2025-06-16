import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Specialty extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviews: number;

  @Prop({ default: '30 min' })
  duration: string;

  @Prop({ default: '$100' })
  price: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  doctors: Types.ObjectId[];
}

export const SpecialtySchema = SchemaFactory.createForClass(Specialty);
