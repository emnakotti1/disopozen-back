import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  provider?: string;
}
