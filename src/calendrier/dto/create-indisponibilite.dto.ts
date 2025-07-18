import { IsDateString, IsString, IsOptional, Matches } from 'class-validator';

export class CreateIndisponibiliteDto {
  @IsDateString()
  date: string;

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, { message: 'Heure invalide (HH:MM)' })
  heureDebut: string;

  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, { message: 'Heure invalide (HH:MM)' })
  heureFin: string;

  @IsOptional()
  @IsString()
  motif?: string;
}
