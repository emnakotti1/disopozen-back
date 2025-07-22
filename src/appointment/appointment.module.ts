import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../entities/appointment.entity';
import { User } from '../entities/user.entity';
import { Service } from '../entities/service.entity';
import { Calendar } from '../entities/Calendar.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Service, Calendar])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
