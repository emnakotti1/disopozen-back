import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Utilisateur } from './utilisateur.entity'; // pas 'prestataire'

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  nom: string;

  @Column()
  duree: number;

  @Column()
  description: string;

  @Column('float')
  prix: number;

  // Lien vers un utilisateur de rôle PRESTATAIRE
  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.services)
  prestataire: Utilisateur;
}
