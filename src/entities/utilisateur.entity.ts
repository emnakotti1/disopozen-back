import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Service } from '../entities/service.entity'; 
import { Calendrier } from './Calendrier.entity';
import { RendezVous } from './rendezvous.entity';
export enum Role {
  CLIENT = 'client',
  PRESTATAIRE = 'prestataire',
  SUPERADMIN = 'superadmin',
}

@Entity()
export class Utilisateur {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  motDePasse: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateInscription: Date;

  @Column({ default: 'local' }) // ou 'google'
  provider: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @OneToMany(() => Service, (service) => service.prestataire)
  services: Service[];

  // Prestataire : indisponibilités + rdv liés
  @OneToMany(() => Calendrier, (calendrier) => calendrier.prestataire)
  calendrier: Calendrier[];

  // Client : rdvs pris
  @OneToMany(() => RendezVous, (rdv) => rdv.client)
  rendezVousClient: RendezVous[];

  // Prestataire : rdvs reçus
  @OneToMany(() => RendezVous, (rdv) => rdv.prestataire)
  rendezVousPrestataire: RendezVous[];
}
