import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { Utilisateur } from './utilisateur.entity';
import { RendezVous } from './rendezvous.entity';
import { Service } from './service.entity';

export enum CalendrierType {
  RDV_CLIENT = 'rdv_client',
  INDISPONIBILITE = 'indisponibilite',
}

@Entity()
export class Calendrier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  heureDebut: string;

  @Column({ type: 'time' })
  heureFin: string;

  @Column({ type: 'enum', enum: CalendrierType })
  type: CalendrierType;

  @Column({ nullable: true })
  motif?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Utilisateur, (user) => user.calendrier, { onDelete: 'CASCADE' })
  prestataire: Utilisateur;

  @ManyToOne(() => Service, { nullable: true })
  service?: Service; // 🧠 Utile pour connaître la durée

  @OneToOne(() => RendezVous, (rdv) => rdv.calendrier, { nullable: true })
  rendezVous?: RendezVous;
}
