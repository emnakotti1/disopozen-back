import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UtilisateurService],
  controllers: [UtilisateurController],
  exports: [TypeOrmModule],
})
export class UtilisateurModule {}
