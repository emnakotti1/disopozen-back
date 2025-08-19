import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkingHours, DayOfWeek } from '../entities/working-hours.entity';
import { User, Role } from '../entities/user.entity';
import { CreateWorkingHoursDto } from './dto/create-working-hours.dto';
import { UpdateWorkingHoursDto } from './dto/update-working-hours.dto';

@Injectable()
export class WorkingHoursService {
  constructor(
    @InjectRepository(WorkingHours)
    private workingHoursRepository: Repository<WorkingHours>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createDefaultWorkingHours(providerId: string): Promise<WorkingHours[]> {
    const provider = await this.userRepository.findOne({
      where: { id: providerId, role: Role.PROVIDER },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Créer les horaires par défaut (9h-17h du lundi au vendredi, fermé le weekend)
    const defaultHours = [
      {
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: '09:00',
        endTime: '17:00',
        isClosed: false,
      },
      {
        dayOfWeek: DayOfWeek.TUESDAY,
        startTime: '09:00',
        endTime: '17:00',
        isClosed: false,
      },
      {
        dayOfWeek: DayOfWeek.WEDNESDAY,
        startTime: '09:00',
        endTime: '17:00',
        isClosed: false,
      },
      {
        dayOfWeek: DayOfWeek.THURSDAY,
        startTime: '09:00',
        endTime: '17:00',
        isClosed: false,
      },
      {
        dayOfWeek: DayOfWeek.FRIDAY,
        startTime: '09:00',
        endTime: '17:00',
        isClosed: false,
      },
      {
        dayOfWeek: DayOfWeek.SATURDAY,
        startTime: null,
        endTime: null,
        isClosed: true,
      },
      {
        dayOfWeek: DayOfWeek.SUNDAY,
        startTime: null,
        endTime: null,
        isClosed: true,
      },
    ];

    const workingHours = defaultHours.map((hour) =>
      this.workingHoursRepository.create({
        ...hour,
        provider,
      }),
    );

    return this.workingHoursRepository.save(workingHours);
  }

  async getProviderWorkingHours(providerId: string): Promise<WorkingHours[]> {
    const provider = await this.userRepository.findOne({
      where: { id: providerId, role: Role.PROVIDER },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    let workingHours = await this.workingHoursRepository.find({
      where: { provider: { id: providerId } },
      order: { dayOfWeek: 'ASC' },
    });

    // Si aucun horaire n'existe, créer les horaires par défaut
    if (workingHours.length === 0) {
      workingHours = await this.createDefaultWorkingHours(providerId);
    }

    return workingHours;
  }

  async updateProviderWorkingHours(
    providerId: string,
    updateWorkingHoursDto: UpdateWorkingHoursDto,
  ): Promise<WorkingHours[]> {
    const provider = await this.userRepository.findOne({
      where: { id: providerId, role: Role.PROVIDER },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Vérifier que workingHours existe et est un tableau
    if (
      !updateWorkingHoursDto.workingHours ||
      !Array.isArray(updateWorkingHoursDto.workingHours)
    ) {
      throw new BadRequestException(
        'workingHours must be provided as an array',
      );
    }

    // Valider que tous les jours de la semaine sont présents
    const daysOfWeek = Object.values(DayOfWeek);
    const providedDays = updateWorkingHoursDto.workingHours.map(
      (wh) => wh.dayOfWeek,
    );

    for (const day of daysOfWeek) {
      if (!providedDays.includes(day)) {
        throw new BadRequestException(`Missing working hours for ${day}`);
      }
    }

    // Supprimer les anciens horaires
    await this.workingHoursRepository.delete({ provider: { id: providerId } });

    // Créer les nouveaux horaires
    const newWorkingHours = updateWorkingHoursDto.workingHours.map((whDto) => {
      // Validation: si fermé, pas d'heures, sinon heures obligatoires
      if (whDto.isClosed) {
        return this.workingHoursRepository.create({
          dayOfWeek: whDto.dayOfWeek,
          startTime: null,
          endTime: null,
          isClosed: true,
          provider,
        });
      } else {
        if (!whDto.startTime || !whDto.endTime) {
          throw new BadRequestException(
            `Start and end times are required for ${whDto.dayOfWeek} when not closed`,
          );
        }
        return this.workingHoursRepository.create({
          dayOfWeek: whDto.dayOfWeek,
          startTime: whDto.startTime,
          endTime: whDto.endTime,
          isClosed: false,
          provider,
        });
      }
    });

    return this.workingHoursRepository.save(newWorkingHours);
  }

  // Méthode utilitaire pour vérifier si un provider est ouvert à un moment donné
  async isProviderAvailable(
    providerId: string,
    dayOfWeek: DayOfWeek,
    time: string,
  ): Promise<boolean> {
    const workingHours = await this.workingHoursRepository.findOne({
      where: {
        provider: { id: providerId },
        dayOfWeek: dayOfWeek,
      },
    });

    if (!workingHours || workingHours.isClosed) {
      return false;
    }

    if (!workingHours.startTime || !workingHours.endTime) {
      return false;
    }

    return time >= workingHours.startTime && time <= workingHours.endTime;
  }
}
