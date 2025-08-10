import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Service } from './service.entity';
import { Calendar } from './Calendar.entity';
import { Appointment } from './appointment.entity';
import { WorkingHours } from './working-hours.entity';

export enum Role {
  CLIENT = 'client',
  PROVIDER = 'provider',
  SUPERADMIN = 'superadmin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  city?: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registrationDate: Date;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  // Services offered by the provider
  @OneToMany(() => Service, (service) => service.provider)
  services: Service[];

  // Provider: calendar/availability entries
  @OneToMany(() => Calendar, (calendar) => calendar.provider)
  calendars: Calendar[];

  // Client: appointments made
  @OneToMany(() => Appointment, (appointment) => appointment.client)
  clientAppointments: Appointment[];

  // Provider: appointments received
  @OneToMany(() => Appointment, (appointment) => appointment.provider)
  providerAppointments: Appointment[];

  // Provider: working hours
  @OneToMany(() => WorkingHours, (workingHours) => workingHours.provider)
  workingHours: WorkingHours[];
}
