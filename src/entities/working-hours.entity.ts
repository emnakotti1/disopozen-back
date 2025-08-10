import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity('working_hours')
export class WorkingHours {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @Column({ type: 'time', nullable: true })
  startTime: string | null; // Format HH:MM

  @Column({ type: 'time', nullable: true })
  endTime: string | null; // Format HH:MM

  @Column({ default: false })
  isClosed: boolean; // True si fermé ce jour-là

  @ManyToOne(() => User, (user) => user.workingHours, {
    onDelete: 'CASCADE',
  })
  provider: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
