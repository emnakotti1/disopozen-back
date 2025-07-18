import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RendezVous } from '../entities/rendezvous.entity';
import { Utilisateur } from '../entities/utilisateur.entity';
import { Service } from '../entities/service.entity';
import { Calendrier } from '../entities/Calendrier.entity';
import { RendezVousController } from './rendezvous.controller';
import { RendezVousService } from './rendezvous.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RendezVous,
      Utilisateur,
      Service,
      Calendrier,
    ]),
  ],
  controllers: [RendezVousController],
  providers: [RendezVousService],
})
export class RendezvousModule {}
