import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../entities/service.entity';
import { Utilisateur } from '../entities/utilisateur.entity';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Utilisateur])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
