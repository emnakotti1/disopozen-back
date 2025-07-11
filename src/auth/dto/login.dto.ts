// src/auth/dto/login.dto.ts
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  motDePasse: string;
}
