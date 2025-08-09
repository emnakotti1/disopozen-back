import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Service } from './service.entity';
import { Calendar } from './Calendar.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @ManyToOne(() => User, (user) => user.clientAppointments, {
    onDelete: 'CASCADE',
  })
  client: User;

  @ManyToOne(() => User, (user) => user.providerAppointments, {
    onDelete: 'CASCADE',
  })
  provider: User;

  @ManyToOne(() => Service, {
    eager: true,
    onDelete: 'SET NULL',
  })
  service: Service;

  @OneToOne(() => Calendar, (calendar) => calendar.appointment, {
    cascade: true,
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  calendar: Calendar | null;

  @Column({ default: false })
  isValidated: boolean;

  @Column({ default: false })
  isCancelled: boolean;

  @Column({ nullable: true, length: 500 })
  notes?: string;
}
