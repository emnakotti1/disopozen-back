import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendrier, CalendrierType } from '../entities/Calendrier.entity';
import { CreateIndisponibiliteDto } from './dto/create-indisponibilite.dto';
import { Utilisateur } from '../entities/utilisateur.entity';

@Injectable()
export class CalendrierService {
  constructor(
    @InjectRepository(Calendrier)
    private readonly calendrierRepo: Repository<Calendrier>,

    @InjectRepository(Utilisateur)
    private readonly userRepo: Repository<Utilisateur>,
  ) {}

  async ajouterIndisponibilite(
    dto: CreateIndisponibiliteDto,
    prestataireId: string,
  ) {
    const prestataire = await this.userRepo.findOne({
      where: { id: prestataireId },
    });
    if (!prestataire) {
      throw new NotFoundException('Prestataire non trouvé');
    }

    const conflit = await this.calendrierRepo.findOne({
      where: {
        date: dto.date,
        prestataire: { id: prestataireId },
        heureDebut: dto.heureDebut,
      },
    });

    if (conflit) {
      throw new ConflictException('Ce créneau est déjà occupé.');
    }

    const indispo = this.calendrierRepo.create({
      ...dto,
      prestataire,
      type: CalendrierType.INDISPONIBILITE,
    });

    return this.calendrierRepo.save(indispo);
  }

  async getIndisponibilites(prestataireId: string) {
    return this.calendrierRepo.find({
      where: {
        prestataire: { id: prestataireId },
        type: CalendrierType.INDISPONIBILITE,
      },
      order: { date: 'ASC' },
    });
  }
}
