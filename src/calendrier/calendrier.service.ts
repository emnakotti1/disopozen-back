import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar, CalendarType } from '../entities/Calendar.entity';
import { CreateUnavailabilityDto } from './dto/create-indisponibilite.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class CalendrierService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendrierRepo: Repository<Calendar>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async ajouterIndisponibilite(
    dto: CreateUnavailabilityDto,
    prestataireId: string,
  ) {
    const provider = await this.userRepo.findOne({
      where: { id: prestataireId },
    });
    if (!provider) {
      throw new NotFoundException('Prestataire non trouvé');
    }

    const conflit = await this.calendrierRepo.findOne({
      where: {
        date: dto.date,
        provider: { id: prestataireId },
        startTime: dto.startTime,
      },
    });

    if (conflit) {
      throw new ConflictException('Ce créneau est déjà occupé.');
    }

    const indispo = this.calendrierRepo.create({
      ...dto,
      provider,
      type: CalendarType.UNAVAILABILITY,
    });

    return this.calendrierRepo.save(indispo);
  }

  async getIndisponibilites(prestataireId: string) {
    return this.calendrierRepo.find({
      where: {
        provider: { id: prestataireId },
        type: CalendarType.UNAVAILABILITY,
      },
      order: { date: 'ASC' },
    });
  }
}
