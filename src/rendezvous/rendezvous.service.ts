import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RendezVous, RdvStatut } from '../entities/rendezvous.entity';
import { CreateRendezVousDto } from './dto/create-rendezvous.dto';
import { Utilisateur } from '../entities/utilisateur.entity';
import { Service } from '../entities/service.entity';
import { Calendrier, CalendrierType } from '../entities/Calendrier.entity';

@Injectable()
export class RendezVousService {
  constructor(
    @InjectRepository(RendezVous)
    private readonly rdvRepo: Repository<RendezVous>,

    @InjectRepository(Utilisateur)
    private readonly userRepo: Repository<Utilisateur>,

    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Calendrier)
    private readonly calendrierRepo: Repository<Calendrier>,
  ) {}

  async prendreRendezVous(dto: any, clientId: string) {
    console.log('tessst', dto);
    const client = await this.userRepo.findOne({ where: { id: clientId } });
    console.log('client', client);
    const prestataire = await this.userRepo.findOne({
      where: { id: dto.prestataireId },
    });
    console.log('perstataire');
    const service = await this.serviceRepo.findOne({
      where: { id: dto.serviceId },
    });

    if (!client || !prestataire || !service) {
      throw new NotFoundException('Client, prestataire ou service non trouvé.');
    }

    // Calcul de l'heure de fin
    const start = new Date(`1970-01-01T${dto.heureDebut}:00`);
    console.log('start', start);
    console.log('heureservice', service.duree);
    const end = new Date(start.getTime() + service.duree * 60000);
    const heureFin = end.toTimeString().slice(0, 5);
    console.log('heurefintest', heureFin);
    // Vérification des conflits
    const conflits = await this.calendrierRepo
      .createQueryBuilder('calendrier')
      .leftJoin('calendrier.prestataire', 'prestataire')
      .where('prestataire.id = :prestataireId', {
        prestataireId: dto.prestataireId,
      })
      .andWhere('calendrier.date = :date', { date: dto.date })
      .andWhere(
        '(calendrier.heureDebut < :heureFin AND calendrier.heureFin > :heureDebut)',
        {
          heureDebut: dto.heureDebut,
          heureFin: heureFin,
        },
      )
      .getOne();

    if (conflits) {
      throw new ConflictException(
        'Ce créneau est déjà réservé ou indisponible.',
      );
    }

    const calendrier = this.calendrierRepo.create({
      date: dto.date,
      heureDebut: dto.heureDebut,
      heureFin,
      type: CalendrierType.RDV_CLIENT,
      prestataire,
      service,
    });
    await this.calendrierRepo.save(calendrier);
    console.log('calendrier', calendrier);
    const rdv = this.rdvRepo.create({
      client,
      prestataire,
      service,
      calendrier,
    });

    return this.rdvRepo.save(rdv);
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
      where: { prestataire: { id: prestataireId } },
      relations: ['client', 'service'],
      order: { createdAt: 'DESC' },
    });
  }

  async modifierRendezVous(id: string, dto: CreateRendezVousDto) {
    const rdv = await this.rdvRepo.findOne({
      where: { id },
      relations: ['client', 'prestataire', 'service', 'calendrier'],
    });

    if (!rdv) {
      throw new NotFoundException('Rendez-vous non trouvé');
    }

    if (!rdv.calendrier) {
      throw new NotFoundException('Calendrier du rendez-vous non trouvé');
    }

    const prestataire = await this.userRepo.findOne({
      where: { id: dto.prestataireId },
    });
    const service = await this.serviceRepo.findOne({
      where: { id: dto.serviceId },
    });

    if (!prestataire || !service) {
      throw new NotFoundException('Prestataire ou service non trouvé.');
    }

    // Recalcul de l'heure de fin
    const start = new Date(`1970-01-01T${dto.heureDebut}:00`);
    const end = new Date(start.getTime() + service.duree * 60000);
    const heureFin = end.toTimeString().slice(0, 5);

    // Vérification des conflits
    const conflit = await this.calendrierRepo
      .createQueryBuilder('calendrier')
      .leftJoin('calendrier.prestataire', 'prestataire')
      .where('prestataire.id = :prestataireId', {
        prestataireId: dto.prestataireId,
      })
      .andWhere('calendrier.date = :date', { date: dto.date })
      .andWhere(
        '(calendrier.heureDebut < :heureFin AND calendrier.heureFin > :heureDebut)',
        { heureDebut: dto.heureDebut, heureFin },
      )
      .andWhere('calendrier.id != :id', { id: rdv.calendrier.id }) // ok car calendrier n'est pas null
      .getOne();

    if (conflit) {
      throw new ConflictException('Nouveau créneau en conflit.');
    }

    // Mise à jour du calendrier
    rdv.calendrier.date = dto.date;
    rdv.calendrier.heureDebut = dto.heureDebut;
    rdv.calendrier.heureFin = heureFin;
    rdv.calendrier.service = service;
    rdv.calendrier.prestataire = prestataire;

    // Mise à jour du rendez-vous
    rdv.prestataire = prestataire;
    rdv.service = service;

    await this.calendrierRepo.save(rdv.calendrier);
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
    const estPrestataire = rdv.prestataire?.id === userId;
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

    if (rdv.calendrier) {
      await this.calendrierRepo.delete(rdv.calendrier.id);
      rdv.calendrier = null;
    } else {
    }

    rdv.statut = RdvStatut.ANNULE;
    await this.rdvRepo.save(rdv);

    return 'Rendez-vous annulé avec succès.';
  }

  async confirmerRendezVous(
    rdvId: string,
    prestataireId: string,
  ): Promise<string> {
    const rdv = await this.rdvRepo.findOne({
      where: { id: rdvId },
      relations: ['prestataire'],
    });

    console.log('RDV récupéré:', rdv);

    if (!rdv) {
      throw new NotFoundException('Rendez-vous introuvable.');
    }

    if (!rdv.prestataire) {
      console.warn('Relation prestataire non chargée ou absente.');
      throw new BadRequestException(
        'Le rendez-vous n’a pas de prestataire associé.',
      );
    }

    if (rdv.prestataire.id !== prestataireId) {
      console.log('ID prestataire attendu:', prestataireId);
      console.log('ID prestataire du RDV:', rdv.prestataire.id);
      throw new BadRequestException(
        'Seul le prestataire peut confirmer ce rendez-vous.',
      );
    }

    if (rdv.statut !== RdvStatut.EN_ATTENTE) {
      throw new BadRequestException(
        'Le rendez-vous ne peut pas être confirmé.',
      );
    }

    rdv.statut = RdvStatut.CONFIRME;
    await this.rdvRepo.save(rdv);

    console.log('Rendez-vous confirmé:', rdv);
    return 'Rendez-vous confirmé.';
  }
}
