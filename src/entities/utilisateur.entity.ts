import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Service } from '../entities/service.entity'; // 👈 Assure-toi que le chemin est correct
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
}
