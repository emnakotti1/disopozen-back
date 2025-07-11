import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from '../entities/utilisateur.entity';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur])],
  providers: [UtilisateurService],
  controllers: [UtilisateurController],
  exports: [TypeOrmModule],
})
export class UtilisateurModule {}
