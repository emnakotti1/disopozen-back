import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-rendezvous.dto';
import { User } from '../entities/user.entity';
import { Service } from '../entities/service.entity';
import { Calendar, CalendarType } from '../entities/Calendar.entity';

@Injectable()
export class RendezVousService {
  constructor(
    @InjectRepository(Appointment)
    private readonly rdvRepo: Repository<Appointment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Calendar)
    private readonly calendrierRepo: Repository<Calendar>,
  ) {}

  async prendreRendezVous(dto: any, clientId: string) {
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
  const conflict = await this.calendrierRepo
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
  const calendar = this.calendrierRepo.create({
    date: dto.date,
    startTime: dto.startTime,
    endTime,
    type: CalendarType.CLIENT_APPOINTMENT,
    provider,
    service,
  });
  await this.calendrierRepo.save(calendar);

  // Create appointment
  const appointment = this.rdvRepo.create({
    client,
    provider,
    service,
    calendar,
  });

  return this.rdvRepo.save(appointment);
}


  async getRdvClient(clientId: string) {
    return this.rdvRepo.find({
      where: { client: { id: clientId } },
      relations: ['prestataire', 'service'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRdvPrestataire(prestataireId: string) {
    return this.rdvRepo.find({
      where: { provider: { id: prestataireId } },
      relations: ['client', 'service'],
      order: { createdAt: 'DESC' },
    });
  }

  async modifierRendezVous(id: string, dto: CreateAppointmentDto) {
    const rdv = await this.rdvRepo.findOne({
      where: { id },
      relations: ['client', 'prestataire', 'service', 'calendrier'],
    });

    if (!rdv) {
      throw new NotFoundException('Rendez-vous non trouvé');
    }

    if (!rdv.calendar) {
      throw new NotFoundException('Calendrier du rendez-vous non trouvé');
    }

    const prestataire = await this.userRepo.findOne({
      where: { id: dto.providerId },
    });
    const service = await this.serviceRepo.findOne({
      where: { id: dto.serviceId },
    });

    if (!prestataire || !service) {
      throw new NotFoundException('Prestataire ou service non trouvé.');
    }

    // Recalcul de l'heure de fin
    const start = new Date(`1970-01-01T${dto.startTime}:00`);
    const end = new Date(start.getTime() + service.duration * 60000);
    const heureFin = end.toTimeString().slice(0, 5);

    // Vérification des conflits
    const conflit = await this.calendrierRepo
      .createQueryBuilder('calendrier')
      .leftJoin('calendrier.prestataire', 'prestataire')
      .where('prestataire.id = :prestataireId', {
        prestataireId: dto.providerId,
      })
      .andWhere('calendrier.date = :date', { date: dto.date })
      .andWhere(
        '(calendrier.heureDebut < :heureFin AND calendrier.heureFin > :heureDebut)',
        { heureDebut: dto.startTime, heureFin },
      )
      .andWhere('calendrier.id != :id', { id: rdv.calendar.id }) // ok car calendrier n'est pas null
      .getOne();

    if (conflit) {
      throw new ConflictException('Nouveau créneau en conflit.');
    }

    // Mise à jour du calendrier
    rdv.calendar.date = dto.date;
    rdv.calendar.startTime = dto.startTime;
    rdv.calendar.endTime = heureFin;
    rdv.calendar.service = service;
    rdv.calendar.provider = prestataire;

    // Mise à jour du rendez-vous
    rdv.provider = prestataire;
    rdv.service = service;

    await this.calendrierRepo.save(rdv.calendar);
    return this.rdvRepo.save(rdv);
  }

  async annulerRendezVous(rdvId: string, userId: string): Promise<string> {
    console.log(
      `[annulerRendezVous] Début annulation RDV id=${rdvId} par userId=${userId}`,
    );

    const rdv = await this.rdvRepo.findOne({
      where: { id: rdvId },
      relations: ['client', 'prestataire', 'calendrier'],
    });
    console.log('[annulerRendezVous] RDV récupéré:', rdv);

    if (!rdv) {
      console.error('[annulerRendezVous] RDV non trouvé');
      throw new NotFoundException('Rendez-vous introuvable.');
    }

    const estClient = rdv.client?.id === userId;
    const estPrestataire = rdv.provider?.id === userId;
    console.log(
      `[annulerRendezVous] estClient=${estClient}, estPrestataire=${estPrestataire}`,
    );

    if (!estClient && !estPrestataire) {
      console.error(
        '[annulerRendezVous] Droits insuffisants pour annuler ce RDV',
      );
      throw new BadRequestException(
        "Vous n'avez pas les droits pour annuler ce rendez-vous.",
      );
    }

    if (rdv.calendar) {
      await this.calendrierRepo.delete(rdv.calendar.id);
      rdv.calendar = null;
    } else {
    }

    rdv.status = AppointmentStatus.CANCELLED;
    await this.rdvRepo.save(rdv);

    return 'Rendez-vous annulé avec succès.';
  }

  async confirmerRendezVous(
    rdvId: string,
    prestataireId: string,
  ): Promise<string> {
    const rdv = await this.rdvRepo.findOne({
      where: { id: rdvId },
      relations: ['provider'],
    });

    console.log('RDV récupéré:', rdv);

    if (!rdv) {
      throw new NotFoundException('Rendez-vous introuvable.');
    }

    if (!rdv.provider) {
      console.warn('Relation prestataire non chargée ou absente.');
      throw new BadRequestException(
        'Le rendez-vous n’a pas de prestataire associé.',
      );
    }

    if (rdv.provider.id !== prestataireId) {
      console.log('ID prestataire attendu:', prestataireId);
      console.log('ID prestataire du RDV:', rdv.provider.id);
      throw new BadRequestException(
        'Seul le prestataire peut confirmer ce rendez-vous.',
      );
    }

    if (rdv.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException(
        'Le rendez-vous ne peut pas être confirmé.',
      );
    }

    rdv.status = AppointmentStatus.CONFIRMED;
    await this.rdvRepo.save(rdv);

    console.log('Rendez-vous confirmé:', rdv);
    return 'Rendez-vous confirmé.';
  }
}
