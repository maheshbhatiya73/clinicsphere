// src/admin-clinic/dto/create-clinic.dto.ts
import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsObject()
  contact: {
    phone: string;
    email: string;
    website?: string;
  };

  @IsObject()
  address: any;

  @IsObject()
  working_hours: any;

  @IsObject()
  settings: any;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;
}
