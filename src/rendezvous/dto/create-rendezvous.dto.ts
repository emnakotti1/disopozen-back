import { IsUUID, IsDateString, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  providerId: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  date: string;

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:MM)',
  })
  startTime: string;
}
