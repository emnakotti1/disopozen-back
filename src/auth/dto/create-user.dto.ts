import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '../../entities/utilisateur.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  motDePasse: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  provider?: string;
}
