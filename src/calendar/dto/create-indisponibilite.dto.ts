import { IsDateString, IsString, IsOptional, Matches } from 'class-validator';

export class CreateUnavailabilityDto {
  @IsDateString()
  date: string;

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:MM)',
  })
  startTime: string;

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:MM)',
  })
  endTime: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
