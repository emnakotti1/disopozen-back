import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendrier } from '../entities/Calendrier.entity';
import { Utilisateur } from '../entities/utilisateur.entity';
import { CalendrierService } from './calendrier.service';
import { CalendrierController } from './calendrier.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Calendrier, Utilisateur])],
  controllers: [CalendrierController],
  providers: [CalendrierService],
  exports: [CalendrierService],
})
export class CalendrierModule {}
