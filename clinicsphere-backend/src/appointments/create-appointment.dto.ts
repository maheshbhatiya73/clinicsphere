import { IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { AppointmentStatus } from './appointment.schema';

export class CreateAppointmentDto {
  @IsMongoId()
  doctorId: string;

  @IsMongoId()
  patientId: string;

  @IsDateString()
  appointmentDate: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}