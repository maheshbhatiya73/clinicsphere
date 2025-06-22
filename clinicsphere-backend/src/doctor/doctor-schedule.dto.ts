import { IsObject, IsString } from 'class-validator';

export class UpdateScheduleDto {
  @IsString()
  clinicId: string;

  @IsObject()
  availability: {
    [key: string]: { start: string; end: string }[];
  };
}
