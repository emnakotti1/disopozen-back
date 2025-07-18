import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Utilisateur } from './utilisateur.entity';
import { Service } from './service.entity';
import { Calendrier } from './Calendrier.entity';
export enum RdvStatut {
  EN_ATTENTE = 'en_attente',
  CONFIRME = 'confirme',
  ANNULE = 'annule',
}
@Entity()
export class RendezVous {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
  @Column({ type: 'enum', enum: RdvStatut, default: RdvStatut.EN_ATTENTE })
  statut: RdvStatut;

  @ManyToOne(() => Utilisateur, (user) => user.rendezVousClient, {
    onDelete: 'CASCADE',
  })
  client: Utilisateur;

  @ManyToOne(() => Utilisateur, (user) => user.rendezVousPrestataire, {
    onDelete: 'CASCADE',
  })
  prestataire: Utilisateur;

  @ManyToOne(() => Service, { eager: true, onDelete: 'SET NULL' })
  service: Service;

  @OneToOne(() => Calendrier, (cal) => cal.rendezVous, {
    cascade: true,
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  calendrier: Calendrier | null;;

  @Column({ default: false })
  estValide: boolean;

  @Column({ default: false })
  estAnnule: boolean;

  @Column({ nullable: true })
  commentaire?: string;
}
