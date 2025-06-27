import { IsMongoId, IsEnum, IsOptional, IsObject } from 'class-validator';

export class CreateAssignmentDto {
  @IsMongoId()
  doctorId: string;

  @IsMongoId()
  clinicId: string;

  @IsObject()
  availability: Record<string, { start: string; end: string }[]>;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
