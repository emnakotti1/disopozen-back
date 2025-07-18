import { IsUUID, IsDateString, Matches } from 'class-validator';

export class CreateRendezVousDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  prestataireId: string;

  @IsUUID()
  serviceId: string;

  @IsDateString()
  date: string;

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, { message: 'Heure invalide (HH:MM)' })
  heureDebut: string;
}
