import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service as ServiceEntity } from '../entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { User } from '../entities/user.entity';
import { UpdateServiceDto } from './dto/update-service.dto';
import { start } from 'repl';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private serviceRepo: Repository<ServiceEntity>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateServiceDto, prestataireId: string) {
    const provider = await this.userRepo.findOne({
      where: { id: prestataireId },
    });
    if (!provider) {
      throw new NotFoundException(
        `Prestataire with id ${prestataireId} not found`,
      );
    }
    console.log('testconsole', provider);
    const service = this.serviceRepo.create({
      ...dto,
      provider,
    });

    return this.serviceRepo.save(service);
  }

  async findAll() {
    return this.serviceRepo.find({ relations: ['provider'] });
  }

  async findByProvider(prestataireId: string) {
    return this.serviceRepo
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.provider', 'provider')
      .where('provider.id = :id', { id: prestataireId })
      .getMany();
  }

  async update(id: string, dto: UpdateServiceDto) {
    const service = await this.serviceRepo.findOne({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    Object.assign(service, dto);
    return this.serviceRepo.save(service);
  }

  async remove(id: string) {
    const service = await this.serviceRepo.findOne({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.serviceRepo.remove(service);
  }
  async findOne(id: string) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['provider'],
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }
}
