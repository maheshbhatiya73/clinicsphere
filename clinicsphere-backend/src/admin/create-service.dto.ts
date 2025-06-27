// src/admin-service/dto/create-service.dto.ts
import { IsString, IsOptional, IsNumber, IsMongoId, IsEnum } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  duration_minutes: number;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsMongoId()
  clinicId?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
