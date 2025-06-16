// create-user.dto.ts
import { IsString, IsEmail, IsEnum, IsOptional, IsNumber, MinLength, IsMongoId } from 'class-validator';
import { UserRole } from './user.schema';
import { Types } from 'mongoose';


export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

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
  @IsString()
  doctorId?: string;

  @IsOptional()
  @IsNumber()
  consultationDuration?: number;

  @IsOptional()
  clinicAddress?: string;

  @IsOptional()
  profilePicUrl?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  bio?: string;
}
