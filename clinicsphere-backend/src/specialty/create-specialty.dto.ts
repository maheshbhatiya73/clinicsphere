import { IsString, IsOptional, IsArray, IsMongoId, IsNumber } from 'class-validator';

export class CreateSpecialtyDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  reviews?: number;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  doctors?: string[];
}
