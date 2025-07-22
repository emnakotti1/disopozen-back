import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-Appointment.dto';
import { User } from '../entities/user.entity';
import { Service } from '../entities/service.entity';
import { Calendar, CalendarType } from '../entities/Calendar.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly aptRepo: Repository<Appointment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Calendar)
    private readonly calendarRepo: Repository<Calendar>,
  ) {}

  async getAppointment(dto: any, clientId: string) {
  console.log('dto', dto);

  const client = await this.userRepo.findOne({ where: { id: clientId } });
  const provider = await this.userRepo.findOne({
    where: { id: dto.providerId },
  });
  const service = await this.serviceRepo.findOne({
    where: { id: dto.serviceId },
  });

  if (!client || !provider || !service) {
    throw new NotFoundException('Client, provider or service not found.');
  }

  // Calculate end time based on service duration
  const start = new Date(`1970-01-01T${dto.startTime}:00`);
  const end = new Date(start.getTime() + service.duration * 60000);
  const endTime = end.toTimeString().slice(0, 5); // 'HH:MM' format

  // Check for conflicting calendar entries
  const conflict = await this.calendarRepo
    .createQueryBuilder('calendar')
    .leftJoin('calendar.provider', 'provider')
    .where('provider.id = :providerId', { providerId: dto.providerId })
    .andWhere('calendar.date = :date', { date: dto.date })
    .andWhere(
      '(calendar.startTime < :endTime AND calendar.endTime > :startTime)',
      {
        startTime: dto.startTime,
        endTime: endTime,
      },
    )
    .getOne();

  if (conflict) {
    throw new ConflictException(
      'This time slot is already booked or unavailable.',
    );
  }

  // Create calendar entry
  const calendar = this.calendarRepo.create({
    date: dto.date,
    startTime: dto.startTime,
    endTime,
    type: CalendarType.CLIENT_APPOINTMENT,
    provider,
    service,
  });
  await this.calendarRepo.save(calendar);

  // Create appointment
  const appointment = this.aptRepo.create({
    client,
    provider,
    service,
    calendar,
  });

  return this.aptRepo.save(appointment);
}


  async getAptClient(clientId: string) {
    return this.aptRepo.find({
      where: { client: { id: clientId } },
      relations: ['provider', 'service'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAptprovider(providerId: string) {
    return this.aptRepo.find({
      where: { provider: { id: providerId } },
      relations: ['client', 'service'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateAppointment(id: string, dto: CreateAppointmentDto) {
    const apt = await this.aptRepo.findOne({
      where: { id },
      relations: ['client', 'provider', 'service', 'calendar'],
    });

    if (!apt) {
      throw new NotFoundException('Appointment not found');
    }

    if (!apt.calendar) {
      throw new NotFoundException('Calendar of appointment not found');
    }

    const provider = await this.userRepo.findOne({
      where: { id: dto.providerId },
    });
    const service = await this.serviceRepo.findOne({
      where: { id: dto.serviceId },
    });

    if (!provider || !service) {
      throw new NotFoundException('Provider or service not found');
    }

    // Recalcul de l'heure de fin
    const start = new Date(`1970-01-01T${dto.startTime}:00`);
    const end = new Date(start.getTime() + service.duration * 60000);
    const heureFin = end.toTimeString().slice(0, 5);

    // Vérification des conflits
    const conflit = await this.calendarRepo
      .createQueryBuilder('calendar')
      .leftJoin('calendar.provider', 'provider')
      .where('provider.id = :providerId', {
        providerId: dto.providerId,
      })
      .andWhere('calendar.date = :date', { date: dto.date })
      .andWhere(
        '(calendar.heureDebut < :heureFin AND calendar.heureFin > :heureDebut)',
        { heureDebut: dto.startTime, heureFin },
      )
      .andWhere('calendar.id != :id', { id: apt.calendar.id }) // ok car calendar n'est pas null
      .getOne();

    if (conflit) {
      throw new ConflictException('This slot is already occupied.');
    }

    // Mise à jour du calendar
    apt.calendar.date = dto.date;
    apt.calendar.startTime = dto.startTime;
    apt.calendar.endTime = heureFin;
    apt.calendar.service = service;
    apt.calendar.provider = provider;

    // Mise à jour du rendez-vous
    apt.provider = provider;
    apt.service = service;

    await this.calendarRepo.save(apt.calendar);
    return this.aptRepo.save(apt);
  }

  async cancelAppointment(aptId: string, userId: string): Promise<string> {
    console.log(
      `[annulerAppointment] Début annulation apt id=${aptId} par userId=${userId}`,
    );

    const apt = await this.aptRepo.findOne({
      where: { id: aptId },
      relations: ['client', 'provider', 'calendar'],
    });
    console.log('[annulerAppointment] apt récupéré:', apt);

    if (!apt) {
      throw new NotFoundException('Rendez-vous introuvable.');
    }

    const isClient = apt.client?.id === userId;
    const isProvider = apt.provider?.id === userId;
   

    if (!isClient && !isProvider) {
     
      throw new BadRequestException(
        "Vous n'avez pas les droits pour annuler ce rendez-vous.",
      );
    }

    if (apt.calendar) {
      await this.calendarRepo.delete(apt.calendar.id);
      apt.calendar = null;
    } else {
    }

    apt.status = AppointmentStatus.CANCELLED;
    await this.aptRepo.save(apt);

    return 'appointment canceled ';
  }

  async confirmAppointment(
    aptId: string,
    providerId: string,
  ): Promise<string> {
    const apt = await this.aptRepo.findOne({
      where: { id: aptId },
      relations: ['provider'],
    });

    

    if (!apt) {
      throw new NotFoundException('Appointment not found');
    }

    if (!apt.provider) {
     
      throw new BadRequestException(
        'The appointment has no associated provider.',
      );
    }

    if (apt.provider.id !== providerId) {
      
      throw new BadRequestException(
        'Only the provider can confirm this appointment.',
      );
    }

    if (apt.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException(
        'The appointment cannot be confirmed',
      );
    }

    apt.status = AppointmentStatus.CONFIRMED;
    await this.aptRepo.save(apt);

   
    return 'The appointment cannot be confirmed';
  }
}
