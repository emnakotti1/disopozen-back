import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsNumber()
  duree: number;

  @IsString()
  description: string;

  @IsNumber()
  prix: number;
}
