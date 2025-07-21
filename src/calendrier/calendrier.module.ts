import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from '../entities/Calendar.entity';
import { User } from '../entities/user.entity';
import { CalendrierService } from './calendrier.service';
import { CalendrierController } from './calendrier.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar, User])],
  controllers: [CalendrierController],
  providers: [CalendrierService],
  exports: [CalendrierService],
})
export class CalendrierModule {}
