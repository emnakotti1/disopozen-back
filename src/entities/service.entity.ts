import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column()
  description: string;

  @Column('float')
  price: number;

  @ManyToOne(() => User, (user) => user.services)
  provider: User;

  @Column({
    type: 'enum',
    enum: ServiceStatus,
    default: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;
}
