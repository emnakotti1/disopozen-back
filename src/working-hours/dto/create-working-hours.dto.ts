import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  IsBoolean,
} from 'class-validator';
import { DayOfWeek } from '../../entities/working-hours.entity';

export class CreateWorkingHoursDto {
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:MM)',
  })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:MM)',
  })
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}
