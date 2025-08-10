import { CreateWorkingHoursDto } from './create-working-hours.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWorkingHoursDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkingHoursDto)
  workingHours: CreateWorkingHoursDto[];
}
