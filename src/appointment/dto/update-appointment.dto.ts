import {
  IsUUID,
  IsDateString,
  Matches,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsUUID()
  providerId?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  // Accept HH:MM or HH:MM:SS
  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'Invalid time format (HH:MM or HH:MM:SS)',
  })
  startTime?: string;

  // Optional end time if caller wants to pass it, but service duration will prevail
  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'Invalid time format (HH:MM or HH:MM:SS)',
  })
  endTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Notes cannot exceed 500 characters' })
  notes?: string;
}
