import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
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
}
