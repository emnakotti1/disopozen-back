import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../entities/appointment.entity';
import { User } from '../entities/user.entity';
import { Service } from '../entities/service.entity';
import { Calendar } from '../entities/Calendar.entity';
import { RendezVousController } from './rendezvous.controller';
import { RendezVousService } from './rendezvous.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User, Service, Calendar]),
  ],
  controllers: [RendezVousController],
  providers: [RendezVousService],
})
export class RendezvousModule {}
