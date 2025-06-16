// create-user.dto.ts
import { IsString, IsEmail, IsEnum, IsOptional, IsNumber, MinLength } from 'class-validator';
import { UserRole } from './user.schema';


export class UpdateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password?: string;

  @IsEnum(UserRole)
  role: UserRole;

  // Doctor-specific optional fields
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @IsOptional()
  @IsNumber()
  appointmentFee?: number;

  @IsOptional()
  @IsNumber()
  consultationDuration?: number;

  @IsOptional()
  profilePicUrl?: string;
  
  @IsOptional()
  clinicAddress?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  bio?: string;
}
