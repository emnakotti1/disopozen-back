import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service as ServiceEntity } from '../entities/service.entity';

import { CreateServiceDto } from './dto/create-service.dto';
import { Utilisateur } from '../entities/utilisateur.entity';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private serviceRepo: Repository<ServiceEntity>,

    @InjectRepository(Utilisateur)
    private userRepo: Repository<Utilisateur>,
  ) {}

  async create(dto: CreateServiceDto, prestataireId: string) {
    const prestataire = await this.userRepo.findOne({
      where: { id: prestataireId },
    });
    if (!prestataire) {
      throw new NotFoundException(`Prestataire with id ${prestataireId} not found`);
    }

    const service = this.serviceRepo.create({
      ...dto,
      prestataire,
    });

    return this.serviceRepo.save(service);
  }

  async findAll() {
    return this.serviceRepo.find({ relations: ['prestataire'] });
  }

  async findByPrestataire(prestataireId: string) {
    return this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.prestataire', 'prestataire')
      .where('prestataire.id = :id', { id: prestataireId })
      .getMany();
  }

  async update(id: string, dto: UpdateServiceDto) {
    const service = await this.serviceRepo.findOne({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service non trouvé');
    }

    Object.assign(service, dto);
    return this.serviceRepo.save(service);
  }

  async remove(id: string) {
    const service = await this.serviceRepo.findOne({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service non trouvé');
    }

    return this.serviceRepo.remove(service);
  }
  async findOne(id: string) {
  const service = await this.serviceRepo.findOne({
    where: { id },
    relations: ['prestataire'],
  });
  if (!service) throw new NotFoundException('Service non trouvé');
  return service;
}

}
