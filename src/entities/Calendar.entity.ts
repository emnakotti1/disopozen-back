import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Appointment } from './appointment.entity';
import { Service } from './service.entity';

export enum CalendarType {
  CLIENT_APPOINTMENT = 'client_appointment',
  UNAVAILABILITY = 'unavailability',
}

@Entity('calendars')
export class Calendar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'enum', enum: CalendarType })
  type: CalendarType;

  @Column({ nullable: true })
  reason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.calendars, {
    onDelete: 'CASCADE',
  })
  provider: User;

  @ManyToOne(() => Service, { nullable: true })
  service?: Service;

  @OneToOne(() => Appointment, (appointment) => appointment.calendar, {
    nullable: true,
  })
  appointment?: Appointment;
}
