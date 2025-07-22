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
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepo: Repository<Calendar>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async addUnavailability(
    dto: CreateUnavailabilityDto,
    prestataireId: string,
  ) {
    const provider = await this.userRepo.findOne({
      where: { id: prestataireId },
    });
    if (!provider) {
      throw new NotFoundException('Provider not found.');
    }

    const conflit = await this.calendarRepo.findOne({
      where: {
        date: dto.date,
        provider: { id: prestataireId },
        startTime: dto.startTime,
      },
    });

    if (conflit) {
      throw new ConflictException('This slot is already occupied.');
    }

    const indispo = this.calendarRepo.create({
      ...dto,
      provider,
      type: CalendarType.UNAVAILABILITY,
    });

    return this.calendarRepo.save(indispo);
  }

  async getUnavailabilities(providerId: string) {
    return this.calendarRepo.find({
      where: {
        provider: { id: providerId },
        type: CalendarType.UNAVAILABILITY,
      },
      order: { date: 'ASC' },
    });
  }
}
