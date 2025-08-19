import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingHours } from '../entities/working-hours.entity';
import { User } from '../entities/user.entity';
import { WorkingHoursService } from './working-hours.service';
import { WorkingHoursController } from './working-hours.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkingHours, User])],
  controllers: [WorkingHoursController],
  providers: [WorkingHoursService],
  exports: [WorkingHoursService],
})
export class WorkingHoursModule {}
